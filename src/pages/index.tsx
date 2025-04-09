"use client"

import { useState, useEffect } from "react"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info,
  MoreHorizontal,
  RefreshCw,
  ArrowUp,
  Coffee,
  Leaf,
  BarChart,
  Moon,
  Sun,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import Header from "@/components/@shared-components/header"
import { useRouter } from 'next/router'

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("Dashboard")
  const [overviewTab, setOverviewTab] = useState("Overview")
  const [darkMode, setDarkMode] = useState(false)

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const isActivePath = (path: string) => {
    if (path === '/') {
      return router.pathname === '/'
    }
    return router.pathname === `/${path.toLowerCase()}`
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 text-gray-900 dark:text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between p-4">
          {/* ...existing logo code... */}

          <div className="flex items-center space-x-6">
            <nav className="bg-black rounded-full px-6 py-2">
              <div className="flex items-center space-x-2">
                <Link href="/">
                  <button
                    className={`px-4 py-1.5 rounded-full flex items-center transition-colors
                      ${isActivePath('/') ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    Dashboard <ChevronDown className="ml-1.5 w-4 h-4" />
                  </button>
                </Link>
                {["Marketplace", "Staking", "Yield"].map((tab) => (
                  <Link key={tab} href={`/${tab.toLowerCase()}`}>
                    <button
                      className={`px-4 py-1.5 rounded-full transition-colors
                        ${isActivePath(tab) ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                      {tab}
                    </button>
                  </Link>
                ))}
              </div>
            </nav>

            {/* ...rest of existing code... */}
          </div>
        </div>
      </div>
      <Header />

      {/* Add padding to account for fixed header */}
      <div className="pt-[72px]">
        <div className="px-6 py-8">
          <div className="mb-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">OVERVIEW</div>
            <h1 className="text-3xl font-bold dark:text-white">Dashboard</h1>
          </div>

          <div className="flex items-center justify-between border-b dark:border-gray-800">
            <div className="flex items-center">
              <button
                className={`px-4 py-3 ${overviewTab === "Overview" ? "border-b-2 border-brown-800 dark:border-amber-600 font-medium dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
                onClick={() => setOverviewTab("Overview")}
              >
                Overview
              </button>
              <button
                className={`px-4 py-3 ${overviewTab === "Tokens" ? "border-b-2 border-brown-800 dark:border-amber-600 font-medium dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
                onClick={() => setOverviewTab("Tokens")}
              >
                Tokens
              </button>
              <button
                className={`px-4 py-3 ${overviewTab === "History" ? "border-b-2 border-brown-800 dark:border-amber-600 font-medium dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
                onClick={() => setOverviewTab("History")}
              >
                History
              </button>
            </div>

            <div className="flex items-center">
              <ChevronLeft className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <div className="flex items-center mx-4">
                <span className="text-sm mr-1 dark:text-gray-300">Harvest Season: June 2024</span>
                <Info className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="flex items-center mx-4 border-l border-r border-gray-200 dark:border-gray-700 px-4">
                <span className="text-sm mr-1 dark:text-gray-300">Staking APY 12%</span>
                <Info className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="flex items-center mx-4">
                <span className="text-sm mr-1 dark:text-gray-300">Farmer Share 70%</span>
                <Info className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          {/* Main Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
            {/* Left and Middle Columns */}
            <div className="lg:col-span-2 grid gap-6">
              {/* Top Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-800">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-brown-800 dark:bg-amber-700 flex items-center justify-center mr-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Total Trees Owned</div>
                      <div className="font-medium dark:text-white">38 Trees</div>
                    </div>
                  </div>
                </div>
                <div className="border dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-800">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border dark:border-gray-600 flex items-center justify-center mr-2">
                      <div className="w-5 h-5 rotate-45 bg-green-600 flex items-center justify-center">
                        <div className="w-3 h-3 rotate-45 bg-white dark:bg-gray-700"></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Trees Staked</div>
                      <div className="font-medium dark:text-white">20 Trees (52.6%)</div>
                    </div>
                  </div>
                </div>
                <div className="border dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-800">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border dark:border-gray-600 flex items-center justify-center mr-2">
                      <div className="w-5 h-5 rounded-full border-2 border-amber-600 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Available Yield</div>
                      <div className="font-medium dark:text-white">0.32 ETH</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border dark:border-gray-800 rounded-lg p-6 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-3xl font-bold dark:text-white">$1,402.59</div>
                      <div className="flex items-center mt-1">
                        <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-500 font-medium mr-1">12.5%</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">since purchase</span>
                      </div>
                    </div>
                    <MoreHorizontal className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Current Token Value</div>
                </div>
                <div className="border dark:border-gray-800 rounded-lg p-6 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-3xl font-bold dark:text-white">12.8%</div>
                      <div className="flex items-center mt-1">
                        <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-500 font-medium mr-1">2.8%</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">above base APY</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full mr-2">Premium</div>
                      <MoreHorizontal className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Staking Performance</div>
                </div>
              </div>

              {/* Bottom Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border dark:border-gray-800 rounded-lg p-6 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-3xl font-bold dark:text-white">$36.86</div>
                      <div className="flex items-center mt-1">
                        <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-green-500 font-medium mr-1">$32.15</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">- Next Harvest</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400 text-xs px-2 py-1 rounded-full mr-2">
                        +14.6%
                      </div>
                      <MoreHorizontal className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Per Tree Yield</div>
                </div>
                <div className="border dark:border-gray-800 rounded-lg p-6 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-3xl font-bold dark:text-white">$1,229.35</div>
                      <div className="flex items-center mt-1">
                        <div className="w-4 h-4 rounded-full bg-brown-800 dark:bg-amber-700 flex items-center justify-center mr-1">
                          <div className="w-2 h-2 rounded-full bg-white dark:bg-gray-300"></div>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Total Farmer Impact</span>
                      </div>
                    </div>
                    <MoreHorizontal className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Community Support</div>
                </div>
              </div>
            </div>

            {/* Right Column - Action Panel */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">QUICK ACTIONS</div>
                <div className="bg-brown-800 dark:bg-amber-700 text-white text-xs px-2 py-1 rounded-full">3/3</div>
              </div>

              <h2 className="text-xl font-bold mb-4 dark:text-white">Manage Your Trees</h2>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Purchase new coffee tree tokens, stake your existing tokens, or claim your harvest yields.
              </p>

              <div className="space-y-4 mb-6">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 font-medium flex items-center justify-center">
                  <Coffee className="mr-2 h-4 w-4" />
                  Buy Coffee Tree Tokens
                </Button>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-medium flex items-center justify-center">
                  <Leaf className="mr-2 h-4 w-4" />
                  Stake Your Tokens
                </Button>

                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3 font-medium flex items-center justify-center">
                  <BarChart className="mr-2 h-4 w-4" />
                  Claim Harvest Yield
                </Button>
              </div>

              <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Next Harvest Date</div>
                    <div className="text-xl font-bold dark:text-white">June 15, 2024</div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded-lg">
                    <RefreshCw className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t dark:border-gray-600">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Estimated Yield</div>
                  <div className="text-lg font-medium dark:text-white">0.18 ETH ($360.00)</div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <span className="text-sm font-medium mr-1 dark:text-gray-300">View Farmer Profiles</span>
                <ChevronRight className="w-4 h-4 dark:text-gray-400" />
              </div>
            </div>
          </div>

          {overviewTab === "Tokens" && (
            <div className="py-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold dark:text-white">Your Coffee Tree Tokens</h2>
                <p className="text-gray-500 dark:text-gray-400">Manage your owned and staked tokens</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
                  <h3 className="text-lg font-medium mb-4 dark:text-white">Available Tokens</h3>
                  <div className="space-y-4">
                    {/* Token 1 */}
                    <div className="border dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                          <Image
                            src="/placeholder.svg?height=64&width=64"
                            alt="Nyeri Highland Coffee"
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium dark:text-white">Nyeri Highland Coffee Farm</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Farmer: James Kamau</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500 dark:text-gray-400">Purchased: Dec 15, 2023</p>
                              <p className="font-medium dark:text-white">10 Trees</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Current Value:</span>
                              <span className="font-medium dark:text-white">0.12 ETH</span>
                              <span className="text-green-500 text-sm ml-2">+20%</span>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                Stake
                              </Button>
                              <Button size="sm" variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                                Transfer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Token 2 */}
                    <div className="border dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                          <Image
                            src="/placeholder.svg?height=64&width=64"
                            alt="Mount Kenya Coffee"
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium dark:text-white">Mount Kenya Coffee Collective</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Farmer: Sarah Wanjiku</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500 dark:text-gray-400">Purchased: Jan 20, 2024</p>
                              <p className="font-medium dark:text-white">5 Trees</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Current Value:</span>
                              <span className="font-medium dark:text-white">0.055 ETH</span>
                              <span className="text-green-500 text-sm ml-2">+10%</span>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                Stake
                              </Button>
                              <Button size="sm" variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                                Transfer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
                  <h3 className="text-lg font-medium mb-4 dark:text-white">Staked Tokens</h3>
                  <div className="space-y-4">
                    {/* Staked Token 1 */}
                    <div className="border dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                          <Image
                            src="/placeholder.svg?height=64&width=64"
                            alt="Nairobi Highlands"
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-medium dark:text-white">Nairobi Highlands Farm</h4>
                                <span className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
                                  Premium
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Farmer: Elizabeth Muthoni</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500 dark:text-gray-400">Staked: Jan 10, 2024</p>
                              <p className="font-medium dark:text-white">8 Trees</p>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500 dark:text-gray-400">Staking Progress (65%)</span>
                              <span className="text-gray-500 dark:text-gray-400">Unlocks: Apr 10, 2024</span>
                            </div>
                            <Progress value={65} className="h-2" />
                          </div>

                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">APY:</span>
                              <span className="font-medium text-blue-600 dark:text-blue-400">12%</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-gray-700"
                            >
                              Unstake Early
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Staked Token 2 */}
                    <div className="border dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                          <Image
                            src="/placeholder.svg?height=64&width=64"
                            alt="Meru Coffee"
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-medium dark:text-white">Meru Coffee Plantation</h4>
                                <span className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
                                  Standard
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Farmer: John Mutua</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500 dark:text-gray-400">Staked: Feb 15, 2024</p>
                              <p className="font-medium dark:text-white">12 Trees</p>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500 dark:text-gray-400">Staking Progress (40%)</span>
                              <span className="text-gray-500 dark:text-gray-400">Unlocks: Apr 15, 2024</span>
                            </div>
                            <Progress value={40} className="h-2" />
                          </div>

                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">APY:</span>
                              <span className="font-medium text-blue-600 dark:text-blue-400">8%</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-gray-700"
                            >
                              Unstake Early
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {overviewTab === "History" && (
            <div className="py-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold dark:text-white">Transaction History</h2>
                <p className="text-gray-500 dark:text-gray-400">Record of all your transactions</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b dark:border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Farm
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Trees
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Transaction Hash
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Transaction 1 */}
                      <tr className="border-b dark:border-gray-700">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Purchase
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm dark:text-white">
                          Nyeri Highland Coffee Farm
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm dark:text-white">10</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm dark:text-white">0.1 ETH</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm dark:text-white">Dec 15, 2023</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Completed
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-mono text-xs">
                            0x1a2b3c4d...
                          </a>
                        </td>
                      </tr>

                      {/* Transaction 2 */}
                      <tr className="border-b dark:border-gray-700">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Purchase
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm dark:text-white">
                          Mount Kenya Coffee Collective
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm dark:text-white">5</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm dark:text-white">0.05 ETH</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm dark:text-white">Jan 20, 2024</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Completed
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-mono text-xs">
                            0x2b3c4d5e...
                          </a>
                        </td>
                      </tr>

                      {/* Transaction 3 */}
                      <tr className="border-b dark:border-gray-700">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            Stake
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm dark:text-white">Nairobi Highlands Farm</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm dark:text-white">8</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm dark:text-white">-</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm dark:text-white">Jan 10, 2024</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Completed
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-mono text-xs">
                            0x3c4d5e6f...
                          </a>
                        </td>
                      </tr>

                      {/* Transaction 4 */}
                      <tr className="border-b dark:border-gray-700">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                            Yield Claim
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm dark:text-white">Rift Valley Coffee Estate</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm dark:text-white">15</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm dark:text-white">0.15 ETH</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm dark:text-white">Mar 01, 2024</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Completed
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-mono text-xs">
                            0x4d5e6f7g...
                          </a>
                        </td>
                      </tr>

                      {/* Transaction 5 */}
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            Stake
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm dark:text-white">Meru Coffee Plantation</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm dark:text-white">12</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm dark:text-white">-</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm dark:text-white">Feb 15, 2024</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Completed
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-mono text-xs">
                            0x5e6f7g8h...
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

