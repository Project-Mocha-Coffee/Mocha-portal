"use client"

import { useState, useEffect } from "react"
import { Search, Filter, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Info, MoreHorizontal, RefreshCw, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useAccount, useReadContract, useReadContracts, useWriteContract, useBalance } from "wagmi"
import { parseEther, formatEther } from "viem"
import { scrollSepolia } from "viem/chains"
import Header from "@/components/@shared-components/header"
import { useRouter } from 'next/router'
import vault from "@/ABI/MochaTreeRightsABI.json"
import StatCard from "@/components/@shared-components/statCard"

// PurchaseDialog Component
export default function PurchaseDialog({ open, onOpenChange, farms, selectedFarmId, setSelectedFarmId, bondAmount, setBondAmount, handlePurchase, purchaseError, writeError, isPending, isSuccess }) {
  const BOND_PRICE_USD = 100; // $100 per bond

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold dark:text-white">Purchase Mocha Asset-Backed Bonds</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Select Farm</label>
            <Select value={selectedFarmId} onValueChange={setSelectedFarmId}>
              <SelectTrigger className="w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
                <SelectValue placeholder="Choose a farm" />
              </SelectTrigger>
              <SelectContent>
                {farms
                  .filter(({ config }) => config?.active)
                  .map(({ farmId, config }) => (
                    <SelectItem key={farmId.toString()} value={farmId.toString()}>
                      {config?.name} ({config?.shareTokenSymbol})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Number of Bonds (1–20)</label>
            <Input
              type="number"
              min="1"
              max="20"
              value={bondAmount}
              onChange={(e) => setBondAmount(e.target.value)}
              className="bg-white dark:bg-gray-800 border dark:border-gray-700"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Cost</label>
            <p className="text-lg font-medium dark:text-white">
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
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="dark:border-gray-600 dark:text-gray-300"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#7A5540] hover:bg-[#6A4A36] text-white"
            onClick={handlePurchase}
            disabled={isPending || !selectedFarmId || !bondAmount}
          >
            Purchase Bonds
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}