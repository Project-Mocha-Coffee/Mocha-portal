'use client'

import { StatRectangle } from "./stat-rectangle";
import { Button } from "@/components/ui/button"
import vault from "@/ABI/MochaTreeRightsABI.json"
import { Bell } from "lucide-react"
import { formatUnits } from "ethers";
import { useEffect, useState } from "react";
import { OpenfortButton } from "@openfort/openfort-kit";


const MOCHA_TREE_CONTRACT_ADDRESS = "0x4b02Bada976702E83Cf91Cd0B896852099099352" as const;
const MBT_TOKEN_ADDRESS = "0xb75083585DcB841b8B04ffAC89c78a16f2a5598B" as const;
const MOCHA_TREE_CONTRACT_ABI = vault.abi;

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



export default function Header() {


  return (
    <header className="flex items-center justify-between py-6 border-0">
        <div className="flex items-center gap-3 text-sm">
            <StatRectangle 
              label="MBT Balance" 
              value={`50000 MBT`} 
              valueColor="text-green-400" 
            />
            <StatRectangle 
              label="Total Trees Sold" 
              value="5000000"
              valueColor="text-green-400" 
            />
            <StatRectangle 
              label="Cumulative Yield" 
              value="50000 MBT"
              valueColor="text-[var(--foreground)]" 
            />
        </div>
        <div className="flex items-center gap-3">
            <span className="text-sm pr-2 text-[var(--foreground)]">
                Account: <span className="text-[var(--primary)]">&nbsp;Investor</span>
            </span>
            <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-[var(--muted-foreground)] mx-4 hover:text-[var(--foreground)] relative border-0 bg-white dark:bg-[#1c1c1c] rounded-md"
            >
                <Bell className="w-4 h-4" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--primary)] rounded-full text-xs flex items-center justify-center text-white">
                    2
                </div>
            </Button>
            <OpenfortButton />
        </div>
    </header>
  );
}