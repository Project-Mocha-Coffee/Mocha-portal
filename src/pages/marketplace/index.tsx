"use client"

import { useState, useEffect } from "react"
import { Search, Filter, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useAccount, useReadContract, useReadContracts, useWriteContract, useBalance } from "wagmi"
import { parseEther, formatEther } from "viem"
import { scrollSepolia } from "viem/chains"
import Header from "@/components/@shared-components/header"
import vault from "@/ABI/MochaTreeRightsABI.json"

const MOCHA_TREE_CONTRACT_ADDRESS = "0x4b02Bada976702E83Cf91Cd0B896852099099352";
const MOCHA_TREE_CONTRACT_ABI = vault.abi;
const BOND_PRICE_USD = 100;
const MAX_BONDS_PER_INVESTOR = 20;

export default function Marketplace() {
  const { address: userAddress, isConnected } = useAccount()
  const [marketTab, setMarketTab] = useState("All")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [searchQuery, setSearchQuery] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [selectedFarmId, setSelectedFarmId] = useState("")
  const [selectedFarmName, setSelectedFarmName] = useState("")
  const [bondAmount, setBondAmount] = useState("1")
  const [purchaseError, setPurchaseError] = useState("")
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedFarmData, setSelectedFarmData] = useState(null)

  const { data: activeFarmIds, isLoading: isLoadingActiveFarmIds, error: activeFarmIdsError } = useReadContract({
    address: MOCHA_TREE_CONTRACT_ADDRESS,
    abi: MOCHA_TREE_CONTRACT_ABI,
    functionName: 'getActiveFarmIds',
    chainId: scrollSepolia.id,
  });

  const farmConfigContracts = activeFarmIds
    ? activeFarmIds.map((farmId) => ({
        address: MOCHA_TREE_CONTRACT_ADDRESS,
        abi: MOCHA_TREE_CONTRACT_ABI,
        functionName: 'getFarmConfig',
        args: [farmId],
        chainId: scrollSepolia.id,
      }))
    : [];

  const { data: farmConfigsData, isLoading: isLoadingFarmConfigs, error: farmConfigsError } = useReadContracts({
    contracts: farmConfigContracts,
  });

  const balanceContracts = farmConfigsData
    ? farmConfigsData.map((result, index) => ({
        address: result.status === 'success' ? result.result.shareTokenAddress : MOCHA_TREE_CONTRACT_ADDRESS,
        abi: MOCHA_TREE_CONTRACT_ABI,
        functionName: 'balanceOf',
        args: [userAddress],
        chainId: scrollSepolia.id,
      }))
    : [];

  const { data: balanceData, isLoading: isLoadingBalances, error: balanceError } = useReadContracts({
    contracts: balanceContracts,
    query: { enabled: isConnected },
  });

  const { data: ethBalance } = useBalance({
    address: userAddress,
    chainId: scrollSepolia.id,
    query: { enabled: isConnected },
  });

  const farms = farmConfigsData
    ? farmConfigsData.map((result, index) => ({
        farmId: activeFarmIds[index],
        data: result.status === 'success' ? result.result : null,
        balance: balanceData && balanceData[index]?.status === 'success' ? balanceData[index].result : BigInt(0),
        error: result.status === 'failure' ? result.error : null,
      }))
    : [];

  const totalBondsOwned = farms.reduce((sum, { balance }) => sum + Number(balance), 0);

  const filteredFarms = farms
    .filter(({ data }) => {
      if (!data) return false
      if (marketTab === "Active") return data.active
      return true
    })
    .filter(({ data }) => {
      if (!searchQuery || !data) return true
      return (
        data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        data.shareTokenSymbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
    .sort((a, b) => {
      if (!a.data || !b.data) return 0
      let comparison = 0
      switch (sortBy) {
        case "id":
          comparison = Number(a.farmId) - Number(b.farmId)
          break
        case "name":
          comparison = a.data.name.localeCompare(b.data.name)
          break
        case "bonds":
          comparison = Number(a.data.treeCount) - Number(b.data.treeCount)
          break
        case "interest":
          comparison = Number(a.data.targetAPY) - Number(b.data.targetAPY)
          break
        default:
          comparison = a.data.name.localeCompare(b.data.name)
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

  const { writeContract, isPending, isSuccess, error: writeError } = useWriteContract();

  const handlePurchase = async () => {
    if (!isConnected) {
      setPurchaseError("Please connect your wallet");
      return;
    }

    setPurchaseError("");
    const amount = parseInt(bondAmount);

    if (!selectedFarmId) {
      setPurchaseError("No farm selected");
      return;
    }
    if (isNaN(amount) || amount < 1) {
      setPurchaseError("Please enter at least 1 bond");
      return;
    }
    if (amount + totalBondsOwned > MAX_BONDS_PER_INVESTOR) {
      setPurchaseError(`Cannot exceed ${MAX_BONDS_PER_INVESTOR} bonds per investor`);
      return;
    }
    const totalCost = parseEther((amount * BOND_PRICE_USD / 1000).toString());
    if (ethBalance && BigInt(ethBalance.value) < totalCost) {
      setPurchaseError("Insufficient ETH balance");
      return;
    }

    try {
      await writeContract({
        address: MOCHA_TREE_CONTRACT_ADDRESS,
        abi: MOCHA_TREE_CONTRACT_ABI,
        functionName: 'purchaseBond',
        args: [BigInt(selectedFarmId), BigInt(amount)],
        value: totalCost,
      });
    } catch (err) {
      setPurchaseError("Transaction failed");
    }
  };

  const handleConnectWallet = () => {
    // Assuming Openfort SDK is globally available or imported
    if (typeof openfort !== 'undefined') {
      openfort.connect();
    } else {
      console.error("Openfort SDK not loaded");
      setPurchaseError("Wallet connection failed. Please try again.");
    }
  };

  const handleBuyBondsClick = (farmId: string, farmName: string) => {
    if (!isConnected) {
      handleConnectWallet();
    } else {
      setSelectedFarmId(farmId);
      setSelectedFarmName(farmName);
      setIsPurchaseModalOpen(true);
    }
  };

  const handleRowClick = (farm) => {
    setSelectedFarmData(farm);
    setIsDetailsModalOpen(true);
  };

  useEffect(() => {
    if (isSuccess) {
      setIsPurchaseModalOpen(false);
      setBondAmount("1");
      setSelectedFarmId("");
      setSelectedFarmName("");
    }
  }, [isSuccess]);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode !== null) {
      setDarkMode(savedMode === "true")
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setDarkMode(prefersDark)
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("darkMode", darkMode.toString())
  }, [darkMode])

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const truncateAddress = (address) => {
    if (!address) return "N/A"
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 text-gray-900 dark:text-white">
      <Header />
      <div className="pt-[72px]">
        <div className="py-8 px-4 md:px-8">
          <div className="mb-6">
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">MARKETPLACE</div>
            <h1 className="text-3xl font-bold dark:text-white">Mocha Asset-Backed Bonds Marketplace</h1>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={18}
              />
              <Input
                placeholder="Search farms..."
                className="pl-10 bg-white dark:bg-gray-800 border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-none">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="border-none bg-white dark:bg-gray-800">
                  <SelectItem value="id">Farm ID</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="bonds">Bond Count</SelectItem>
                  <SelectItem value="interest">Annual Interest</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSortOrder}
                className="bg-white dark:bg-gray-800 border-none"
              >
                {sortOrder === "asc" ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
              </Button>
              <Button variant="outline" className="bg-white dark:bg-gray-800 border-none">
                <Filter size={18} className="mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <Tabs defaultValue="All" className="mb-6" value={marketTab} onValueChange={setMarketTab}>
            <TabsList className="bg-gray-100 dark:bg-gray-800 border-none">
              <TabsTrigger value="All">All</TabsTrigger>
              <TabsTrigger value="Active">
                Active
                <span className="ml-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {farms.filter(({ data }) => data?.active).length}
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Farm
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Bond Count
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Annual Interest
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoadingActiveFarmIds || isLoadingFarmConfigs ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                      Loading farms...
                    </td>
                  </tr>
                ) : activeFarmIdsError || farmConfigsError ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-4 text-center text-red-600 dark:text-red-400">
                      Error loading farms
                    </td>
                  </tr>
                ) : filteredFarms.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                      No farms found
                    </td>
                  </tr>
                ) : (
                  filteredFarms.map(({ farmId, data, error }, index) => (
                    <tr
                      key={farmId.toString()}
                      className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                      onClick={() => handleRowClick({ farmId, data, error })}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {error ? (
                          <div className="text-red-600 dark:text-red-400">Error</div>
                        ) : (
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{data.name}</div>
                            {/* <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">({data.shareTokenSymbol})</div> */}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {error ? "N/A" : truncateAddress(data.farmOwner)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                        {error ? "N/A" : data.treeCount.toString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                        {error ? "N/A" : `$${Number(data.treeCount) * 10}`}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                        {error ? (
                          <span className="text-red-600 dark:text-red-400">Error</span>
                        ) : data.active ? (
                          <span className="text-green-600 dark:text-green-400">Active</span>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">Inactive</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        <Button
                          className="bg-[#7A5540] hover:bg-[#6A4A36] text-white border-none"
                          disabled={error || !data.active}
                          onClick={() => handleBuyBondsClick(farmId.toString(), data.name)}
                        >
                          {isConnected ? "Buy Bonds" : "Connect Wallet"}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Farm Details Popup */}
          <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
            <DialogContent className="bg-gray-50 dark:bg-gray-800 border-none max-w-[700px] p-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold dark:text-white">
                  {selectedFarmData?.data?.name || "Farm"} Details
                </DialogTitle>
              </DialogHeader>
              {selectedFarmData?.error || !selectedFarmData?.data ? (
                <div className="text-center text-red-600 dark:text-red-400 p-6">
                  Error loading farm details
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Map Placeholder */}
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center w-full h-[400px] flex items-center justify-center">
                    <div>
                      <h2 className="text-lg font-semibold dark:text-white mb-2">Farm Location</h2>
                      <p className="text-gray-500 dark:text-gray-400">Map Coming Soon</p>
                    </div>
                  </div>

                  {/* Farm Information */}
                  <div className="p-4 rounded-lg">
                    <h2 className="text-lg font-semibold dark:text-white mb-3">Farm Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Farm Name</p>
                        <p className="text-base dark:text-white">{selectedFarmData.data.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Owner</p>
                        <p className="text-base dark:text-white">{truncateAddress(selectedFarmData.data.farmOwner)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Bond Count</p>
                        <p className="text-base dark:text-white">{selectedFarmData.data.treeCount.toString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Annual Interest</p>
                        <p className="text-base dark:text-white">${Number(selectedFarmData.data.treeCount) * 10}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                        <p className="text-base dark:text-white">
                          {selectedFarmData.data.active ? (
                            <span className="text-green-600 dark:text-green-400">Active</span>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">Inactive</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Share Token Symbol</p>
                        <p className="text-base dark:text-white">{selectedFarmData.data.shareTokenSymbol}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button
                        className="bg-[#7A5540] hover:bg-[#6A4A36] text-white border-none"
                        disabled={!selectedFarmData.data.active}
                        onClick={() => {
                          setIsDetailsModalOpen(false);
                          handleBuyBondsClick(selectedFarmData.farmId.toString(), selectedFarmData.data.name);
                        }}
                      >
                        {isConnected ? "Buy Bonds" : "Connect Wallet"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 border-none"
                  onClick={() => setIsDetailsModalOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Purchase Bonds Popup */}
          <Dialog open={isPurchaseModalOpen} onOpenChange={setIsPurchaseModalOpen}>
            <DialogContent className="bg-gray-50 dark:bg-gray-800 border-none p-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold dark:text-white">
                  Purchase Bonds for {selectedFarmName || "Selected Farm"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {!isConnected ? (
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Please connect your wallet to purchase bonds.
                    </p>
                    <Button
                      className="bg-[#7A5540] hover:bg-[#6A4A36] text-white border-none"
                      onClick={handleConnectWallet}
                    >
                      Connect Wallet
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Number of Bonds (1–20)</label>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={bondAmount}
                        onChange={(e) => setBondAmount(e.target.value)}
                        className="bg-white dark:bg-gray-800 border-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Cost</label>
                      <p className="text-base font-medium dark:text-white">
                        ${parseInt(bondAmount || "0") * BOND_PRICE_USD}.00 (~{parseFloat(formatEther(parseEther((parseInt(bondAmount || "0") * BOND_PRICE_USD / 1000).toString()))).toFixed(4)} ETH)
                      </p>
                    </div>
                    {purchaseError && (
                      <p className="text-red-600 dark:text-red-400 text-sm">{purchaseError}</p>
                    )}
                    {writeError && (
                      <p className="text-red-600 dark:text-red-400 text-sm">Error: {writeError.message}</p>
                    )}
                    {isPending && (
                      <p className="text-yellow-600 dark:text-yellow-400 text-sm">Transaction pending...</p>
                    )}
                    {isSuccess && (
                      <p className="text-green-600 dark:text-green-400 text-sm">Purchase successful!</p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      By proceeding, you agree to complete KYC/AML verification and receive digital bond tokens upon payment.
                    </p>
                  </>
                )}
              </div>
              {isConnected && (
                <DialogFooter>
                  <Button
                    variant="outline"
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 border-none"
                    onClick={() => setIsPurchaseModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#7A5540] hover:bg-[#6A4A36] text-white border-none"
                    onClick={handlePurchase}
                    disabled={isPending || !selectedFarmId || !bondAmount}
                  >
                    Purchase Bonds
                  </Button>
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}