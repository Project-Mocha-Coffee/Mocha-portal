"use client"

import { Button } from "@/components/ui/button"
import { Coffee, ChevronRight, RefreshCw } from "lucide-react"

export default function QuickActions({ setIsPurchaseModalOpen, annualInterest }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">QUICK ACTIONS</div>
        <div className="bg-[#7A5540] dark:bg-amber-700 text-white text-xs px-2 py-1 rounded-full">1/1</div>
      </div>
      <h2 className="text-xl font-bold mb-4 dark:text-white">Manage Your Bonds</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Purchase new Mocha Asset-Backed Bonds to invest in Kenya’s coffee trees.
      </p>
      <div className="space-y-4 mb-6">
        <Button
          className="w-full bg-[#7A5540] hover:bg-[#6A4A36] text-white rounded-lg py-3 font-medium flex items-center justify-center"
          onClick={() => setIsPurchaseModalOpen(true)}
        >
          <Coffee className="mr-2 h-4 w-4" />
          Buy MABB Tokens
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Next Interest Payment</div>
            <div className="text-xl font-bold dark:text-white">June 15, 2026</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded-lg">
            <RefreshCw className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
        <div className="mt-2 pt-2 border-t dark:border-gray-600">
          <div className="text-sm text-gray-500 dark:text-gray-400">Estimated Interest</div>
          <div className="text-lg font-medium dark:text-white">${annualInterest.toFixed(2)}</div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <span className="text-sm font-medium mr-1 dark:text-gray-300">View Farm Reports</span>
        <ChevronRight className="w-4 h-4 dark:text-gray-400" />
      </div>
    </div>
  )
}