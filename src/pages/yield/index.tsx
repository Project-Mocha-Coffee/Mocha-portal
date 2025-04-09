"use client"

import { useState, useEffect } from "react"
import { ChevronDown, BarChart, Calendar, Clock, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import Link from "next/link"

// Sample yield data
const yieldData = [
  {
    id: 1,
    farm: "Nyeri Highland Coffee Farm",
    farmer: "James Kamau",
    trees: 10,
    harvestDate: "2024-03-15",
    yield: 0.12,
    status: "Available",
  },
  {
    id: 2,
    farm: "Mount Kenya Coffee Collective",
    farmer: "Sarah Wanjiku",
    trees: 5,
    harvestDate: "2024-03-10",
    yield: 0.05,
    status: "Available",
  },
  {
    id: 3,
    farm: "Rift Valley Coffee Estate",
    farmer: "Daniel Kipchoge",
    trees: 15,
    harvestDate: "2024-02-28",
    yield: 0.15,
    status: "Claimed",
    claimDate: "2024-03-01",
  },
  {
    id: 4,
    farm: "Nairobi Highlands Farm",
    farmer: "Elizabeth Muthoni",
    trees: 8,
    harvestDate: "2024-02-15",
    yield: 0.08,
    status: "Claimed",
    claimDate: "2024-02-20",
  },
  {
    id: 5,
    farm: "Meru Coffee Plantation",
    farmer: "John Mutua",
    trees: 12,
    harvestDate: "2024-01-30",
    yield: 0.12,
    status: "Claimed",
    claimDate: "2024-02-05",
  },
]

// Sample monthly yields
const monthlyYields = [
  { month: "Jan", yield: 0.12 },
  { month: "Feb", yield: 0.2 },
  { month: "Mar", yield: 0.17 },
  { month: "Apr", yield: 0.0 },
  { month: "May", yield: 0.0 },
  { month: "Jun", yield: 0.0 },
  { month: "Jul", yield: 0.0 },
  { month: "Aug", yield: 0.0 },
  { month: "Sep", yield: 0.0 },
  { month: "Oct", yield: 0.0 },
  { month: "Nov", yield: 0.0 },
  { month: "Dec", yield: 0.0 },
]

// Sample harvest schedule
const harvestSchedule = [
  { id: 1, farm: "Nyeri Highland Coffee Farm", trees: 10, date: "June 15, 2024", estimatedYield: 0.14 },
  { id: 2, farm: "Mount Kenya Coffee Collective", trees: 5, date: "July 10, 2024", estimatedYield: 0.06 },
  { id: 3, farm: "Rift Valley Coffee Estate", trees: 15, date: "August 5, 2024", estimatedYield: 0.18 },
]

export default function Yield() {
  const [activeTab, setActiveTab] = useState("Yield")
  const [yieldTab, setYieldTab] = useState("available")
  const [isLoading, setIsLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

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

  const availableYields = yieldData.filter((item) => item.status === "Available")
  const claimedYields = yieldData.filter((item) => item.status === "Claimed")
  const totalAvailableYield = availableYields.reduce((sum, item) => sum + item.yield, 0)
  const totalClaimedYield = claimedYields.reduce((sum, item) => sum + item.yield, 0)

  // Mock function to handle claiming yield
  const handleClaimYield = (yieldItem: { id: number; farm: string; farmer: string; trees: number; harvestDate: string; yield: number; status: string; claimDate?: undefined } | { id: number; farm: string; farmer: string; trees: number; harvestDate: string; yield: number; status: string; claimDate: string }) => {
    setIsLoading(true)
    console.log(`Claiming ${yieldItem.yield} ETH from ${yieldItem.farm}`)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // In a real app, this would update the state or refetch data
    }, 1500)
  }

  // Mock function to handle claiming all yields
  const handleClaimAll = () => {
    setIsLoading(true)
    console.log(`Claiming all yields: ${totalAvailableYield} ETH`)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // In a real app, this would update the state or refetch data
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 text-gray-900 dark:text-white">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-brown-800 dark:bg-amber-700 rounded-sm flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>
          <span className="font-semibold text-lg dark:text-white">Project Mocha</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-black rounded-full px-4 py-2 flex items-center mr-4">
            <Link href="/dashboard">
              <button
                className={`px-4 py-1 rounded-full flex items-center ${activeTab === "Dashboard" ? "text-white" : "text-gray-400"}`}
                onClick={() => setActiveTab("Dashboard")}
              >
                Dashboard <ChevronDown className="ml-1 w-4 h-4" />
              </button>
            </Link>
            <Link href="/marketplace">
              <button
                className={`px-4 py-1 rounded-full ${activeTab === "Marketplace" ? "text-white" : "text-gray-400"}`}
                onClick={() => setActiveTab("Marketplace")}
              >
                Marketplace
              </button>
            </Link>
            <Link href="/staking">
              <button
                className={`px-4 py-1 rounded-full ${activeTab === "Staking" ? "text-white" : "text-gray-400"}`}
                onClick={() => setActiveTab("Staking")}
              >
                Staking
              </button>
            </Link>
            <Link href="/yield">
              <button
                className={`px-4 py-1 rounded-full ${activeTab === "Yield" ? "text-white" : "text-gray-400"}`}
                onClick={() => setActiveTab("Yield")}
              >
                Yield
              </button>
            </Link>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full dark:border-gray-700 dark:text-gray-300"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <div className="flex items-center bg-white dark:bg-gray-800 rounded-full border dark:border-gray-700 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-700 overflow-hidden mr-2">
              <Image src="/placeholder.svg?height=32&width=32" alt="Profile" width={32} height={32} />
            </div>
            <span className="text-sm mr-1 dark:text-white">0xb500...f1209</span>
            <ChevronDown className="w-4 h-4 dark:text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-4">
        {/* Yield Header */}
        <div className="mb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">YIELD</div>
          <h1 className="text-3xl font-bold dark:text-white">Coffee Harvest Yields</h1>
        </div>

        {/* Yield Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <BarChart className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Available Yield</div>
                  <div className="text-2xl font-bold dark:text-white">{totalAvailableYield.toFixed(2)} ETH</div>
                  <Button
                    className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
                    size="sm"
                    onClick={handleClaimAll}
                    disabled={isLoading || totalAvailableYield === 0}
                  >
                    {isLoading ? "Processing..." : "Claim All"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Next Harvest</div>
                  <div className="text-2xl font-bold dark:text-white">June 15, 2024</div>
                  <div className="text-sm text-green-600 dark:text-green-400">Est. yield: 0.14 ETH</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Claimed (2024)</div>
                  <div className="text-2xl font-bold dark:text-white">{totalClaimedYield.toFixed(2)} ETH</div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">From {claimedYields.length} harvests</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Yield Chart */}
        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="dark:text-white">Yield Performance</CardTitle>
            <CardDescription className="dark:text-gray-400">Monthly yield distribution for 2024</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <div className="h-full w-full flex items-center justify-center">
              <div className="w-full h-full flex flex-col">
                <div className="flex justify-between mb-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">ETH</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Month</div>
                </div>
                <div className="flex-1 flex items-end">
                  {monthlyYields.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-4/5 bg-amber-500 dark:bg-amber-600 rounded-t-sm"
                        style={{ height: `${(item.yield / 0.2) * 100}%` }}
                      ></div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.month}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Yield Tabs */}
        <Tabs defaultValue="available" value={yieldTab} onValueChange={setYieldTab}>
          <TabsList className="bg-gray-100 dark:bg-gray-800 mb-6">
            <TabsTrigger value="available">Available Yields</TabsTrigger>
            <TabsTrigger value="history">Claim History</TabsTrigger>
            <TabsTrigger value="schedule">Harvest Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Available Yields</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Yields from recent harvests that are available to claim
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b dark:border-gray-700">
                      <TableHead className="text-gray-500 dark:text-gray-400">Farm</TableHead>
                      <TableHead className="text-gray-500 dark:text-gray-400">Farmer</TableHead>
                      <TableHead className="text-gray-500 dark:text-gray-400">Trees</TableHead>
                      <TableHead className="text-gray-500 dark:text-gray-400">Harvest Date</TableHead>
                      <TableHead className="text-gray-500 dark:text-gray-400">Yield (ETH)</TableHead>
                      <TableHead className="text-right text-gray-500 dark:text-gray-400">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availableYields.length > 0 ? (
                      availableYields.map((item) => (
                        <TableRow key={item.id} className="border-b dark:border-gray-700">
                          <TableCell className="font-medium dark:text-white">{item.farm}</TableCell>
                          <TableCell className="dark:text-gray-300">{item.farmer}</TableCell>
                          <TableCell className="dark:text-gray-300">{item.trees}</TableCell>
                          <TableCell className="dark:text-gray-300">{item.harvestDate}</TableCell>
                          <TableCell className="dark:text-gray-300">{item.yield} ETH</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              className="bg-amber-600 hover:bg-amber-700 text-white"
                              onClick={() => handleClaimYield(item)}
                              disabled={isLoading}
                            >
                              {isLoading ? "Processing..." : "Claim"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-400">
                          No available yields to claim
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Claim History</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Record of your previously claimed yields
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b dark:border-gray-700">
                      <TableHead className="text-gray-500 dark:text-gray-400">Farm</TableHead>
                      <TableHead className="text-gray-500 dark:text-gray-400">Farmer</TableHead>
                      <TableHead className="text-gray-500 dark:text-gray-400">Trees</TableHead>
                      <TableHead className="text-gray-500 dark:text-gray-400">Harvest Date</TableHead>
                      <TableHead className="text-gray-500 dark:text-gray-400">Claim Date</TableHead>
                      <TableHead className="text-gray-500 dark:text-gray-400">Yield (ETH)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {claimedYields.length > 0 ? (
                      claimedYields.map((item) => (
                        <TableRow key={item.id} className="border-b dark:border-gray-700">
                          <TableCell className="font-medium dark:text-white">{item.farm}</TableCell>
                          <TableCell className="dark:text-gray-300">{item.farmer}</TableCell>
                          <TableCell className="dark:text-gray-300">{item.trees}</TableCell>
                          <TableCell className="dark:text-gray-300">{item.harvestDate}</TableCell>
                          <TableCell className="dark:text-gray-300">{item.claimDate}</TableCell>
                          <TableCell className="dark:text-gray-300">{item.yield} ETH</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-400">
                          No claim history available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Upcoming Harvests</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Schedule of upcoming coffee harvests and estimated yields
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {harvestSchedule.map((item) => (
                    <div key={item.id} className="border-b dark:border-gray-700 pb-6 last:border-0">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-medium dark:text-white">{item.farm}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <span className="mr-1">🌳</span> {item.trees} Trees
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
                            <span className="font-medium dark:text-white">{item.date}</span>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Estimated yield: {item.estimatedYield} ETH
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500 dark:text-gray-400">Harvest Progress</span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {Math.floor(Math.random() * 30)}% Complete
                          </span>
                        </div>
                        <Progress value={Math.floor(Math.random() * 30)} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t dark:border-gray-700 pt-4">
                <div className="w-full flex justify-between items-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total Estimated Upcoming Yield: 0.38 ETH
                  </div>
                  <Button variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                    View Full Calendar
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Yield Info */}
        <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="dark:text-white">About Coffee Harvest Yields</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Learn more about how coffee harvest yields work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                Coffee tree tokens generate yields based on actual coffee harvests from the farms in Kenya. When farmers
                harvest their coffee, a portion of the revenue is distributed to token holders.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium dark:text-white">Yield Distribution</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Yields are distributed after each harvest</li>
                    <li>Typically 2-3 harvests per year</li>
                    <li>Yield amount depends on harvest quality and market prices</li>
                    <li>Staked tokens earn additional yield</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium dark:text-white">Claiming Process</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Yields can be claimed individually or all at once</li>
                    <li>No time limit for claiming available yields</li>
                    <li>Yields are paid in ETH directly to your wallet</li>
                    <li>No gas fees for claiming (covered by platform)</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

