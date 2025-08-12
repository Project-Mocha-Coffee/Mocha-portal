"use client"

import { useState, useEffect } from "react"
import { Search, Filter, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useAccount, useReadContract, useReadContracts, useWriteContract } from "wagmi"
import { parseUnits, formatUnits } from "viem"
import { scrollSepolia } from "viem/chains"
import Header from "@/components/@shared-components/header"
import vault from "@/ABI/MochaTreeRightsABI.json"

// Types
interface FarmConfig {
  name: string;
  shareTokenSymbol: string;
  shareTokenAddress: `0x${string}`;
  farmOwner: `0x${string}`;
  treeCount: bigint;
  targetAPY: bigint;
  active: boolean;
}

interface Farm {
  farmId: bigint;
  data: FarmConfig | null;
  balance: bigint;
  error: Error | null;
}

interface SelectedFarmData {
  farmId: bigint;
  data: FarmConfig;
  error: Error | null;
}

// Contract addresses and constants
const MOCHA_TREE_CONTRACT_ADDRESS = "0x4b02Bada976702E83Cf91Cd0B896852099099352" as const;
const MBT_TOKEN_ADDRESS = "0xb75083585DcB841b8B04ffAC89c78a16f2a5598B" as const;
import type { Abi } from "viem";
const MOCHA_TREE_CONTRACT_ABI = vault.abi as Abi;

// MBT Token ABI
const MBT_TOKEN_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "success", type: "bool" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "success", type: "bool" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ name: "remaining", type: "uint256" }],
    type: "function",
  },
] as const;

const BOND_PRICE_USD = 100;
const MBT_DECIMALS = 18;
const MAX_BONDS_PER_INVESTOR = 20;

export default function Marketplace() {
  const { address: userAddress, isConnected } = useAccount();
  
  // State variables with proper typing
  const [marketTab, setMarketTab] = useState<"All" | "Active">("All");
  const [sortBy, setSortBy] = useState<"id" | "name" | "bonds" | "interest">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState<boolean>(false);
  const [selectedFarmId, setSelectedFarmId] = useState<string>("");
  const [selectedFarmName, setSelectedFarmName] = useState<string>("");
  const [bondAmount, setBondAmount] = useState<string>("1");
  const [purchaseError, setPurchaseError] = useState<string>("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [selectedFarmData, setSelectedFarmData] = useState<SelectedFarmData | null>(null);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [approvalTxHash, setApprovalTxHash] = useState<string>("");

  // Contract reads
  const { data: activeFarmIds, isLoading: isLoadingActiveFarmIds, error: activeFarmIdsError } = useReadContract({
    address: MOCHA_TREE_CONTRACT_ADDRESS,
    abi: MOCHA_TREE_CONTRACT_ABI,
    functionName: 'getActiveFarmIds',
    chainId: scrollSepolia.id,
  });

  const farmConfigContracts = activeFarmIds
    ? (activeFarmIds as bigint[]).map((farmId) => ({
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

  const balanceContracts = farmConfigsData && isConnected
    ? farmConfigsData.map((result, index) => ({
        address: result.status === 'success' && activeFarmIds 
          ? (result.result as FarmConfig).shareTokenAddress 
          : MOCHA_TREE_CONTRACT_ADDRESS,
        abi: MOCHA_TREE_CONTRACT_ABI as Abi,
        functionName: 'balanceOf',
        args: [userAddress],
        chainId: scrollSepolia.id,
      }))
    : [];

  const { data: balanceData, isLoading: isLoadingBalances } = useReadContracts({
    contracts: balanceContracts,
    query: { enabled: isConnected && balanceContracts.length > 0 },
  });

  // MBT Token balance and allowance
  const { data: mbtBalance, refetch: refetchMbtBalance } = useReadContract({
    address: MBT_TOKEN_ADDRESS,
    abi: MBT_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [userAddress],
    chainId: scrollSepolia.id,
    query: { enabled: isConnected },
  });

  const { data: mbtAllowance, refetch: refetchAllowance } = useReadContract({
    address: MBT_TOKEN_ADDRESS,
    abi: MBT_TOKEN_ABI,
    functionName: 'allowance',
    args: [userAddress, MOCHA_TREE_CONTRACT_ADDRESS],
    chainId: scrollSepolia.id,
    query: { enabled: isConnected },
  });

  // Process farms data
  const farms: Farm[] = farmConfigsData && activeFarmIds
    ? farmConfigsData.map((result, index) => ({
        farmId: (activeFarmIds as bigint[])[index],
        data: result.status === 'success' ? (result.result as FarmConfig) : null,
        balance: balanceData && balanceData[index]?.status === 'success' 
          ? (balanceData[index].result as bigint) 
          : BigInt(0),
        error: result.status === 'failure' ? (result.error as Error) : null,
      }))
    : [];

  const totalBondsOwned = farms.reduce((sum, { balance }) => sum + Number(balance), 0);

  // Filter and sort farms
  const filteredFarms = farms
    .filter(({ data }) => {
      if (!data) return false;
      if (marketTab === "Active") return data.active;
      return true;
    })
    .filter(({ data }) => {
      if (!searchQuery || !data) return true;
      return (
        data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        data.shareTokenSymbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (!a.data || !b.data) return 0;
      let comparison = 0;
      switch (sortBy) {
        case "id":
          comparison = Number(a.farmId) - Number(b.farmId);
          break;
        case "name":
          comparison = a.data.name.localeCompare(b.data.name);
          break;
        case "bonds":
          comparison = Number(a.data.treeCount) - Number(b.data.treeCount);
          break;
        case "interest":
          comparison = Number(a.data.targetAPY) - Number(b.data.targetAPY);
          break;
        default:
          comparison = a.data.name.localeCompare(b.data.name);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Write contract hooks
  const { writeContract: writeApprove, isPending: isApprovePending, isSuccess: isApproveSuccess } = useWriteContract();
  const { writeContract: writePurchase, isPending: isPurchasePending, isSuccess: isPurchaseSuccess } = useWriteContract();

  // Handle MBT token approval
  const handleApproval = async (amount: bigint) => {
    if (!isConnected) {
      setPurchaseError("Please connect your wallet");
      return false;
    }

    try {
      setIsApproving(true);
      setPurchaseError("");

      await writeApprove({
        address: MBT_TOKEN_ADDRESS,
        abi: MBT_TOKEN_ABI,
        functionName: 'approve',
        args: [MOCHA_TREE_CONTRACT_ADDRESS, amount],
      });

      setApprovalTxHash(""); // Optionally clear or set to a static value if needed
      return true;
    } catch (err: any) {
      setPurchaseError(`Approval failed: ${err.message || err.toString()}`);
      return false;
    } finally {
      setIsApproving(false);
    }
  };

  // Handle bond purchase
  const handlePurchase = async () => {
    if (!isConnected) {
      setPurchaseError("Please connect your wallet");
      return;
    }

    setPurchaseError("");
    const amount = parseInt(bondAmount);

    // Validation
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

    const totalCost = parseUnits(amount.toString(), MBT_DECIMALS);
    
    // Check MBT balance
    if (!mbtBalance || BigInt(mbtBalance as bigint) < totalCost) {
      setPurchaseError(`Insufficient MBT balance. You need ${formatUnits(totalCost, MBT_DECIMALS)} MBT`);
      return;
    }

    // Check allowance
    const currentAllowance = mbtAllowance ? BigInt(mbtAllowance as bigint) : BigInt(0);
    
    try {
      // Approve MBT tokens if needed
      if (currentAllowance < totalCost) {
        const approvalSuccess = await handleApproval(totalCost);
        if (!approvalSuccess) return;
        
        // Wait for approval to be confirmed
        await new Promise(resolve => setTimeout(resolve, 2000));
        await refetchAllowance();
      }

      // Purchase bonds
      await writePurchase({
        address: MOCHA_TREE_CONTRACT_ADDRESS,
        abi: MOCHA_TREE_CONTRACT_ABI,
        functionName: 'purchaseBond',
        args: [BigInt(selectedFarmId), totalCost],
      });

    } catch (err: any) {
      setPurchaseError(`Transaction failed: ${err.message || err.toString()}`);
    }
  };

  // Handle wallet connection
  const handleConnectWallet = () => {
    if (typeof (window as any).openfort !== 'undefined') {
      (window as any).openfort.connect();
    } else {
      console.error("Openfort SDK not loaded");
      setPurchaseError("Wallet connection failed. Please try again.");
    }
  };

  // Handle buy bonds button click
  const handleBuyBondsClick = (farmId: string, farmName: string) => {
    if (!isConnected) {
      handleConnectWallet();
    } else {
      setSelectedFarmId(farmId);
      setSelectedFarmName(farmName);
      setIsPurchaseModalOpen(true);
    }
  };

  // Handle row click
  const handleRowClick = (farm: Farm) => {
    if (farm.data) {
      setSelectedFarmData({
        farmId: farm.farmId,
        data: farm.data,
        error: farm.error
      });
      setIsDetailsModalOpen(true);
    }
  };

  // Effects
  useEffect(() => {
    if (isPurchaseSuccess) {
      setIsPurchaseModalOpen(false);
      setBondAmount("1");
      setSelectedFarmId("");
      setSelectedFarmName("");
      // Refetch balances
      refetchMbtBalance();
      refetchAllowance();
    }
  }, [isPurchaseSuccess, refetchMbtBalance, refetchAllowance]);

  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance();
    }
  }, [isApproveSuccess, refetchAllowance]);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      setDarkMode(savedMode === "true");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // Utility functions
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const truncateAddress = (address: string | undefined): string => {
    if (!address) return "N/A";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatMbtBalance = (): string => {
    if (!mbtBalance) return "0";
    return formatUnits(mbtBalance as bigint, MBT_DECIMALS);
  };

  const getCurrentAllowance = (): string => {
    if (!mbtAllowance) return "0";
    return formatUnits(mbtAllowance as bigint, MBT_DECIMALS);
  };

  const isApprovalNeeded = (amount: string): boolean => {
    const requiredAmount = parseUnits(amount, MBT_DECIMALS);
    const currentAllowance = mbtAllowance ? BigInt(mbtAllowance as bigint) : BigInt(0);
    return currentAllowance < requiredAmount;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 text-gray-900 dark:text-white">
      <Header />
      <div className="pt-[72px]">
        <div className="py-8 px-4 md:px-8">
          <div className="mb-6">
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">MARKETPLACE</div>
            <h1 className="text-3xl font-bold dark:text-white">Mocha Asset-Backed Bonds Marketplace</h1>
            {isConnected && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                MBT Balance: {formatMbtBalance()} MBT
              </div>
            )}
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
              <Select value={sortBy} onValueChange={(value: "id" | "name" | "bonds" | "interest") => setSortBy(value)}>
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

          <Tabs defaultValue="All" className="mb-6" value={marketTab} onValueChange={(value: "All" | "Active") => setMarketTab(value)}>
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
                      onClick={() => handleRowClick({ farmId, data, error, balance: BigInt(0) })}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {error ? (
                          <div className="text-red-600 dark:text-red-400">Error</div>
                        ) : data ? (
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{data.name}</div>
                          </div>
                        ) : null}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {error ? "N/A" : data ? truncateAddress(data.farmOwner) : "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                        {error ? "N/A" : data ? data.treeCount.toString() : "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                        {error ? "N/A" : data ? `$${Number(data.treeCount) * 10}` : "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                        {error ? (
                          <span className="text-red-600 dark:text-red-400">Error</span>
                        ) : data ? (
                          data.active ? (
                            <span className="text-green-600 dark:text-green-400">Active</span>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">Inactive</span>
                          )
                        ) : null}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        <Button
                          className="bg-[#7A5540] hover:bg-[#6A4A36] text-white border-none"
                          disabled={error || !data?.active}
                          onClick={() => data && handleBuyBondsClick(farmId.toString(), data.name)}
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

          {/* Farm Details Modal */}
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
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center w-full h-[400px] flex items-center justify-center">
                    <div>
                      <h2 className="text-lg font-semibold dark:text-white mb-2">Farm Location</h2>
                      <p className="text-gray-500 dark:text-gray-400">Map Coming Soon</p>
                    </div>
                  </div>
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

          {/* Purchase Bonds Modal */}
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
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Your MBT Balance:</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{formatMbtBalance()} MBT</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Allowance:</span>
                        <span className="text-sm text-gray-700 dark:text-gray-200">{getCurrentAllowance()} MBT</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Number of Bonds (1–{MAX_BONDS_PER_INVESTOR - totalBondsOwned})</label>
                      <Input
                        type="number"
                        min="1"
                        max={MAX_BONDS_PER_INVESTOR - totalBondsOwned}
                        value={bondAmount}
                        onChange={(e) => setBondAmount(e.target.value)}
                        className="bg-white dark:bg-gray-800 border-none"
                        placeholder="Enter number of bonds"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        You currently own {totalBondsOwned} bonds
                      </p>
                    </div>
                    
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Bond Cost:</span>
                        <span className="text-sm text-gray-700 dark:text-gray-200">1 MBT each</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total MBT Cost:</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {bondAmount ? parseInt(bondAmount) : 0} MBT
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">USD Equivalent:</span>
                        <span className="text-sm text-gray-700 dark:text-gray-200">
                          ${(parseInt(bondAmount || "0") * BOND_PRICE_USD).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {isApprovalNeeded(bondAmount) && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center">
                          <div className="text-yellow-800 dark:text-yellow-200">
                            <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Approval required: You need to approve {bondAmount || "0"} MBT for spending
                          </div>
                        </div>
                      </div>
                    )}

                    {purchaseError && (
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="text-red-600 dark:text-red-400 text-sm">{purchaseError}</p>
                      </div>
                    )}

                    {isApproving && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-blue-600 dark:text-blue-400 text-sm">Approving MBT tokens...</p>
                      </div>
                    )}

                    {isApprovePending && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-yellow-600 dark:text-yellow-400 text-sm">Approval transaction pending...</p>
                      </div>
                    )}

                    {isPurchasePending && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-yellow-600 dark:text-yellow-400 text-sm">Purchase transaction pending...</p>
                      </div>
                    )}

                    {isApproveSuccess && !isPurchaseSuccess && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-green-600 dark:text-green-400 text-sm">Approval successful! You can now purchase bonds.</p>
                      </div>
                    )}

                    {isPurchaseSuccess && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-green-600 dark:text-green-400 text-sm">Purchase successful! Bonds have been added to your portfolio.</p>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="mb-1">
                        <strong>Important:</strong> By proceeding, you agree to:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Complete KYC/AML verification if required</li>
                        <li>Receive digital bond tokens upon successful payment</li>
                        <li>Terms and conditions of the bond purchase agreement</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
              
              {isConnected && (
                <DialogFooter>
                  <Button
                    variant="outline"
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 border-none"
                    onClick={() => {
                      setIsPurchaseModalOpen(false);
                      setPurchaseError("");
                    }}
                    disabled={isApprovePending || isPurchasePending}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#7A5540] hover:bg-[#6A4A36] text-white border-none"
                    onClick={handlePurchase}
                    disabled={
                      isApprovePending || 
                      isPurchasePending || 
                      isApproving ||
                      !selectedFarmId || 
                      !bondAmount || 
                      parseInt(bondAmount) < 1 ||
                      parseInt(bondAmount) + totalBondsOwned > MAX_BONDS_PER_INVESTOR
                    }
                  >
                    {isApprovePending || isPurchasePending || isApproving 
                      ? "Processing..." 
                      : isApprovalNeeded(bondAmount) 
                        ? `Approve & Purchase ${bondAmount || "0"} Bonds`
                        : `Purchase ${bondAmount || "0"} Bonds`
                    }
                  </Button>
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}