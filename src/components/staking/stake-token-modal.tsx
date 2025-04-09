"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useWeb3 } from "@/components/providers/web3-provider"
import { Coffee, Calendar, Clock, Percent } from "lucide-react"
import Image from "next/image"

const stakingPlans = [
  {
    id: 1,
    name: "Flexible",
    duration: 30,
    apy: 5,
    description: "Stake your tokens for 30 days with a 5% APY. Withdraw anytime with a 2% fee.",
  },
  {
    id: 2,
    name: "Standard",
    duration: 60,
    apy: 8,
    description: "Stake your tokens for 60 days with an 8% APY. Early withdrawal subject to a 4% fee.",
  },
  {
    id: 3,
    name: "Premium",
    duration: 90,
    apy: 12,
    description: "Stake your tokens for 90 days with a 12% APY. Includes priority access to new farm tokens.",
  },
]

interface Token {
  name: string;
  image: string;
  farmer: string;
  trees: number;
}

interface StakeTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: Token | null;
}

export default function StakeTokenModal({ isOpen, onClose, token }: StakeTokenModalProps) {
//   const { toast } = useToast()
  const { sendTransaction } = useWeb3()
  const [selectedPlan, setSelectedPlan] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleStake = async () => {
    setIsLoading(true)

    // try {
    //   // In a real implementation, this would call the smart contract
    //     const txHash = await sendTransaction({
    //         to: "0x1234567890123456789012345678901234567890",
    //         data: "0x...", // Contract call data
    //     })
    //   const selectedPlanDetails = stakingPlans.find((p) => p.id === selectedPlan)

    //   onClose()
    // } catch (error) {
    //   toast({
    //     title: "Staking failed",
    //     description: error.message || "Failed to complete staking",
    //     variant: "destructive",
    //   })
    // } finally {
    //   setIsLoading(false)
    // }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Stake Coffee Tree Token</DialogTitle>
          <DialogDescription>You are about to stake tokens from {token?.name}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {token && (
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-md overflow-hidden">
                <Image
                  src={token.image || "/placeholder.svg?height=64&width=64"}
                  alt={token.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{token.name}</h3>
                <p className="text-sm text-gray-500">Farmer: {token.farmer}</p>
                <div className="flex items-center text-sm mt-1">
                  <Coffee className="h-4 w-4 mr-1 text-brown-600" />
                  {token.trees} Trees
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label>Select Staking Plan</Label>
            <RadioGroup
              value={selectedPlan.toString()}
              onValueChange={(value) => setSelectedPlan(Number.parseInt(value))}
            >
              {stakingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`flex items-start space-x-2 border p-4 rounded-md ${
                    selectedPlan === plan.id
                      ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <RadioGroupItem value={plan.id.toString()} id={`plan-${plan.id}`} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={`plan-${plan.id}`} className="font-medium">
                      {plan.name} Plan
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
                    <div className="flex justify-between mt-2 text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                        {plan.duration} Days
                      </div>
                      <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                        <Percent className="h-4 w-4 mr-1" />
                        {plan.apy}% APY
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              <span className="font-medium">Staking Summary</span>
            </div>
            {token && (
              <>
                <p className="text-sm">
                  Your tokens will be locked until{" "}
                  {new Date(
                    Date.now() + (stakingPlans.find((p) => p.id === selectedPlan)?.duration ?? 0) * 24 * 60 * 60 * 1000,
                  ).toLocaleDateString()}
                </p>
                <p className="text-sm mt-1">
                  Estimated yield:{" "}
                  {(
                    (() => {
                      const selectedPlanDetails = stakingPlans.find((p) => p.id === selectedPlan);
                      if (!selectedPlanDetails) return 0;
                      return (((token.trees * selectedPlanDetails.apy) / 100) * selectedPlanDetails.duration) / 30;
                    })()
                  ).toFixed(4)}{" "}
                  ETH
                </p>
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleStake} disabled={isLoading || !token}>
            {isLoading ? "Processing..." : "Confirm Staking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

