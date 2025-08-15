import { useState, useEffect } from "react";
import { useAccount, useReadContract, useReadContracts, useWriteContract, useBalance } from "wagmi";
import { parseEther, formatEther } from "viem";
import { scrollSepolia } from "viem/chains";
import vault from "@/ABI/MochaTreeRightsABI.json";

const MOCHA_TREE_CONTRACT_ADDRESS = "0x4b02Bada976702E83Cf91Cd0B896852099099352";
const MOCHA_TREE_CONTRACT_ABI = vault.abi;
const BOND_PRICE_USD = 100;
const MAX_BONDS_PER_INVESTOR = 20;

interface Farm {
  farmId: bigint;
  config: any;
  balance: bigint;
  error: any;
}

interface ContractData {
  farms: Farm[];
  totalBondsOwned: number;
  annualInterest: number;
  cumulativeReturn: number;
  ethBalance: bigint | undefined;
  isLoading: boolean;
  error: any;
  purchaseBond: (farmId: string, amount: string) => Promise<void>;
  isPending: boolean;
  isSuccess: boolean;
  purchaseError: string;
}

export const useMochaTreeContract = (): ContractData => {
  const { address: userAddress } = useAccount();
  const [purchaseError, setPurchaseError] = useState("");

  // Fetch active farm IDs
  const { data: activeFarmIds, isLoading: isLoadingActiveFarmIds, error: activeFarmIdsError } = useReadContract({
    address: MOCHA_TREE_CONTRACT_ADDRESS,
    abi: MOCHA_TREE_CONTRACT_ABI,
    functionName: 'getActiveFarmIds',
    chainId: scrollSepolia.id,
  });

  // Batch fetch farm configurations
  const farmConfigContracts = activeFarmIds
    ? activeFarmIds.map((farmId: any) => ({
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

  // Fetch user balances for each farm's share token
  const balanceContracts = farmConfigsData
    ? farmConfigsData.map((result: { status: string; result: { shareTokenAddress: any; }; }, index: any) => ({
        address: result.status === 'success' ? result.result.shareTokenAddress : MOCHA_TREE_CONTRACT_ADDRESS,
        abi: MOCHA_TREE_CONTRACT_ABI,
        functionName: 'balanceOf',
        args: [userAddress],
        chainId: scrollSepolia.id,
      }))
    : [];

  const { data: balanceData, isLoading: isLoadingBalances, error: balanceError } = useReadContracts({
    contracts: balanceContracts,
  });

  // Fetch user's ETH balance
  const { data: ethBalance } = useBalance({
    address: userAddress,
    chainId: scrollSepolia.id,
  });

  // Process farm and balance data
  const farms = farmConfigsData
    ? farmConfigsData.map((result, index) => ({
        farmId: activeFarmIds[index],
        config: result.status === 'success' ? result.result : null,
        balance: balanceData && balanceData[index]?.status === 'success' ? balanceData[index].result : BigInt(0),
        error: result.status === 'failure' ? result.error : null,
      }))
    : [];

  // Calculate totals
  const totalBondsOwned = farms.reduce((sum, { balance }) => sum + Number(balance), 0);
  const annualInterest = totalBondsOwned * 10;
  const cumulativeReturn = annualInterest * 5;

  // Purchase bond functionality
  const { writeContract, isPending, isSuccess, error: writeError } = useWriteContract();

  const purchaseBond = async (farmId: string, bondAmount: string) => {
    setPurchaseError("");
    const amount = parseInt(bondAmount);

    // Validate inputs
    if (!farmId) {
      setPurchaseError("Please select a farm");
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
    const totalCostEth = parseEther((amount * BOND_PRICE_USD / 1000).toString());
    if (ethBalance && BigInt(ethBalance.value) < totalCostEth) {
      setPurchaseError("Insufficient ETH balance");
      return;
    }

    try {
      await writeContract({
        address: MOCHA_TREE_CONTRACT_ADDRESS,
        abi: MOCHA_TREE_CONTRACT_ABI,
        functionName: 'purchaseBond',
        args: [BigInt(farmId), BigInt(amount)],
        value: totalCostEth,
      });
    } catch (err) {
      setPurchaseError("Transaction failed");
    }
  };

  return {
    farms,
    totalBondsOwned,
    annualInterest,
    cumulativeReturn,
    ethBalance: ethBalance?.value,
    isLoading: isLoadingActiveFarmIds || isLoadingFarmConfigs || isLoadingBalances,
    error: activeFarmIdsError || farmConfigsError || balanceError,
    purchaseBond,
    isPending,
    isSuccess,
    purchaseError,
  };
};