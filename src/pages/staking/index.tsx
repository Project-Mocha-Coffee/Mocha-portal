"use client"

import { useState, useEffect, SetStateAction } from "react"
import { ChevronDown, Lock, Unlock, Clock, Percent, Calendar, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import StakeTokenModal from "@/components/staking/stake-token-modal"
import Header from "@/components/@shared-components/header"

// Sample staking plans
const stakingPlans = [
  {
    id: 1,
    name: "Flexible",
    duration: 30,
    apy: 5,
    description: "Stake your tokens for 30 days with a 5% APY. Withdraw anytime with a 2% fee.",
    popular: false,
  },
  {
    id: 2,
    name: "Standard",
    duration: 60,
    apy: 8,
    description: "Stake your tokens for 60 days with an 8% APY. Early withdrawal subject to a 4% fee.",
    popular: true,
  },
  {
    id: 3,
    name: "Premium",
    duration: 90,
    apy: 12,
    description: "Stake your tokens for 90 days with a 12% APY. Includes priority access to new farm tokens.",
    popular: false,
  },
]

// Sample owned tokens
const ownedTokens = [
  {
    id: 1,
    name: "Nyeri Highland Coffee Farm",
    farmer: "James Kamau",
    trees: 10,
    purchaseDate: "2023-12-15",
    isStaked: false,
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: 2,
    name: "Mount Kenya Coffee Collective",
    farmer: "Sarah Wanjiku",
    trees: 5,
    purchaseDate: "2024-01-20",
    isStaked: false,
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: 3,
    name: "Rift Valley Coffee Estate",
    farmer: "Daniel Kipchoge",
    trees: 3,
    purchaseDate: "2024-02-05",
    isStaked: false,
    image: "/placeholder.svg?height=64&width=64",
  },
]

// Sample staked tokens
const stakedTokens = [
  {
    id: 4,
    name: "Nairobi Highlands Farm",
    farmer: "Elizabeth Muthoni",
    trees: 8,
    stakeDate: "2024-01-10",
    unlockDate: "2024-04-10",
    plan: "Premium",
    apy: 12,
    progress: 65,
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: 5,
    name: "Meru Coffee Plantation",
    farmer: "John Mutua",
    trees: 12,
    stakeDate: "2024-02-15",
    unlockDate: "2024-04-15",
    plan: "Standard",
    apy: 8,
    progress: 40,
    image: "/placeholder.svg?height=64&width=64",
  },
]

export default function Staking() {
  const [activeTab, setActiveTab] = useState("Staking")
  const [stakingTab, setStakingTab] = useState("available")
  const [selectedPlan, setSelectedPlan] = useState<{ id: number; name: string; duration: number; apy: number; description: string; popular: boolean } | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false)
  const [selectedToken, setSelectedToken] = useState<{ id: number; name: string; farmer: string; trees: number; purchaseDate: string; isStaked: boolean; image: string } | null>(null)

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    // Check localStorage first
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode !== null) {
      setDarkMode(savedMode === "true")
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setDarkMode(prefersDark)
    }
  }, [])

  // Update body class and localStorage when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("darkMode", darkMode.toString())
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // Mock function to handle staking
  const handleStake = (token: { id: number; name: string; farmer: string; trees: number; purchaseDate: string; isStaked: boolean; image: string }) => {
    setSelectedToken(token)
    setIsStakeModalOpen(true)
  }

  // Mock function to handle unstaking
  const handleUnstake = (token: { id?: number; name: any; farmer?: string; trees: any; stakeDate?: string; unlockDate?: string; plan?: string; apy?: number; progress?: number; image?: string }) => {
    console.log(`Unstaking ${token.trees} trees from ${token.name}`)
    // In a real app, this would open a modal or initiate a transaction
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 text-gray-900 dark:text-gray-100">
      {/* Top Navigation */}
      <Header />

      {/* Main Content */}
      <div className="px-6 py-8">
        {/* Staking Header */}
        <div className="mb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">STAKING</div>
          <h1 className="text-3xl font-bold dark:text-white">Coffee Tree Staking</h1>
        </div>

        {/* Staking Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Staked</div>
                  <div className="text-2xl font-bold dark:text-white">20 Trees</div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">52.6% of your trees</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Percent className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Average APY</div>
                  <div className="text-2xl font-bold dark:text-white">9.6%</div>
                  <div className="text-sm text-green-600 dark:text-green-400">+1.2% from last month</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Next Unlock</div>
                  <div className="text-2xl font-bold dark:text-white">April 10, 2024</div>
                  <div className="text-sm text-amber-600 dark:text-amber-400">8 trees will be unlocked</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staking Plans */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Staking Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stakingPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`bg-white dark:bg-gray-800 border dark:border-gray-700 ${
                  selectedPlan?.id === plan.id ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="dark:text-white">{plan.name} Plan</CardTitle>
                    {plan.popular && (
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="dark:text-gray-400">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="dark:text-gray-300">{plan.duration} Days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{plan.apy}% APY</span>
                    </div>
                  </div>
                  <Button
                    className={`w-full ${
                      selectedPlan?.id === plan.id
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    {selectedPlan?.id === plan.id ? "Selected" : "Select Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Staking Tabs */}
        <Tabs defaultValue="available" value={stakingTab} onValueChange={setStakingTab}>
          <TabsList className="bg-gray-100 dark:bg-gray-800 mb-6">
            <TabsTrigger value="available">Available to Stake</TabsTrigger>
            <TabsTrigger value="staked">Currently Staked</TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <div className="space-y-4">
              {ownedTokens.length > 0 ? (
                ownedTokens.map((token) => (
                  <Card key={token.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-md overflow-hidden">
                            <Image
                              src={token.image || "/placeholder.svg"}
                              alt={token.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium dark:text-white">{token.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Farmer: {token.farmer}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <span className="mr-1">🌳</span> {token.trees} Trees
                              </div>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Calendar className="h-4 w-4 mr-1" />
                                Purchased: {token.purchaseDate}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleStake(token)}
                          disabled={!selectedPlan}
                        >
                          <Lock className="mr-2 h-4 w-4" />
                          Stake Token
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      You don't have any tokens available to stake.
                    </p>
                    <Link href="/marketplace">
                      <Button className="bg-green-600 hover:bg-green-700 text-white">Buy Tokens</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="staked">
            <div className="space-y-4">
              {stakedTokens.length > 0 ? (
                stakedTokens.map((token) => (
                  <Card key={token.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="relative w-16 h-16 rounded-md overflow-hidden">
                            <Image
                              src={token.image || "/placeholder.svg"}
                              alt={token.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-2">
                              <h3 className="font-medium dark:text-white">{token.name}</h3>
                              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                {token.plan}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Farmer: {token.farmer}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <span className="mr-1">🌳</span> {token.trees} Trees
                              </div>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Calendar className="h-4 w-4 mr-1" />
                                Staked: {token.stakeDate}
                              </div>
                            </div>

                            <div className="mt-4">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="flex items-center text-gray-500 dark:text-gray-400">
                                  <Lock className="h-3 w-3 mr-1" />
                                  Staking Progress
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">{token.progress}%</span>
                              </div>
                              <Progress value={token.progress} className="h-2" />
                              <div className="flex justify-between text-xs mt-1">
                                <span className="text-gray-500 dark:text-gray-400">{token.stakeDate}</span>
                                <span className="text-gray-500 dark:text-gray-400">{token.unlockDate}</span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                              <div className="flex items-center">
                                <Percent className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                                <span className="text-blue-600 dark:text-blue-400 font-medium">{token.apy}% APY</span>
                              </div>
                              <Button
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-gray-700"
                                onClick={() => handleUnstake(token)}
                              >
                                <Unlock className="mr-2 h-4 w-4" />
                                Unstake Early
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400">You don't have any staked tokens.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Staking Info */}
        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="dark:text-white">Staking Information</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Learn more about staking your coffee tree tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                Staking your coffee tree tokens allows you to earn additional rewards while supporting the farmers and
                their communities. The longer you stake, the higher your potential returns.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium dark:text-white">Benefits of Staking</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Earn competitive APY on your tokens</li>
                    <li>Support sustainable farming practices</li>
                    <li>Priority access to new farm tokens</li>
                    <li>Contribute to community development</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium dark:text-white">Early Withdrawal Fees</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Flexible Plan: 2% fee</li>
                    <li>Standard Plan: 4% fee</li>
                    <li>Premium Plan: 6% fee</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Stake Token Modal */}
      <StakeTokenModal isOpen={isStakeModalOpen} onClose={() => setIsStakeModalOpen(false)} token={selectedToken} />
    </div>
  )
}

