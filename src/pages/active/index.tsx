"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Info,
  MoreHorizontal,
  RefreshCw,
  Coffee,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWriteContract,
  useBalance,
} from "wagmi";

import { parseEther, formatEther } from "viem";
import { scrollSepolia } from "viem/chains";

import Header from "@/components/@shared-components/header";
import { useRouter } from "next/router";
import vault from "@/ABI/MochaTreeRightsABI.json";
import StatCard from "@/components/@shared-components/statCard";

const MOCHA_TREE_CONTRACT_ADDRESS =
  "0x4b02Bada976702E83Cf91Cd0B896852099099352";

export default function Dashboard() {
  const router = useRouter();

  // Wallet info
  const { address, isConnected } = useAccount();

  // Fetch ETH balance for connected address on scrollSepolia
  const {
    data: balanceData,
    isLoading: balanceLoading,
    isError: balanceError,
  } = useBalance({
    address,
    chainId: scrollSepolia.id,
  });

  // Read totalActiveBonds from the MochaTreeRightsToken contract
  const {
    data: totalActiveBonds,
    isLoading: bondsLoading,
    error: bondsError,
    refetch: refetchTotalActiveBonds,
  } = useReadContract({
    address: MOCHA_TREE_CONTRACT_ADDRESS,
    abi: vault.abi,
    functionName: "totalActiveBonds",
    chainId: scrollSepolia.id,
    watch: true, // auto updates each new block (optional)
  });

  // UI states for tabs, search, filters
  const [selectedTab, setSelectedTab] = useState("farms");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("active");

  // Handler for refreshing bond count manually
  const onRefreshBonds = () => {
    refetchTotalActiveBonds();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        {/* Wallet and balance info */}
        <section className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            {isConnected ? (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Connected wallet: <code>{address}</code>
                <br />
                Balance:{" "}
                {balanceLoading ? (
                  "Loading..."
                ) : balanceError ? (
                  "Error fetching balance"
                ) : (
                  <>
                    {balanceData ? formatEther(balanceData.value) : "0"} ETH
                  </>
                )}
              </p>
            ) : (
              <p>Please connect your wallet to see details.</p>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onRefreshBonds}
            disabled={bondsLoading}
            aria-label="Refresh bonds count"
          >
            <RefreshCw className="mr-2 h-4 w-4 animate-spin-slow motion-reduce:animate-spin-0" />
            Refresh Bonds
          </Button>
        </section>

        {/* Tabs for Farms, Bonds, Settings */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="farms">Farms</TabsTrigger>
            <TabsTrigger value="bonds">Bonds</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Farms tab content */}
          {selectedTab === "farms" && (
            <section className="mt-6">
              <div className="flex space-x-4 mb-6">
                <Input
                  placeholder="Search farms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md flex-grow"
                  size="sm"
                  icon={<Search />}
                />
                <Select
                  onValueChange={(value) => setSelectedFilter(value)}
                  value={selectedFilter}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter farms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active Farms</SelectItem>
                    <SelectItem value="inactive">Inactive Farms</SelectItem>
                    <SelectItem value="all">All Farms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <StatCard
                title="Total Active Bonds"
                value={
                  bondsLoading
                    ? "Loading..."
                    : bondsError
                    ? "Error"
                    : totalActiveBonds?.toString() ?? "0"
                }
                icon={<Coffee className="h-6 w-6 text-yellow-600" />}
              />

              {/* You can expand here to list farms, filtering by searchQuery & selectedFilter */}
            </section>
          )}

          {/* Bonds tab content */}
          {selectedTab === "bonds" && (
            <section className="mt-6">
              {!isConnected ? (
                <p>Please connect your wallet to view your bonds.</p>
              ) : (
                <p>
                  {/* Placeholder for bonds table or bonds interaction UI.
                       Use your Wagmi + Viem logic here to fetch and display user bonds. */}
                  Bonds information display and management coming soon...
                </p>
              )}
            </section>
          )}

          {/* Settings tab content */}
          {selectedTab === "settings" && (
            <section className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              {/* Add your settings UI components here */}

              <Button
                variant="secondary"
                onClick={() => router.push("/")}
                className="flex items-center space-x-1"
              >
                <span>Go Home</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </section>
          )}
        </Tabs>
      </main>
    </div>
  );
}
