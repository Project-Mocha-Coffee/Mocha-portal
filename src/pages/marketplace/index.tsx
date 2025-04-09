"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Search, Filter, Star, ArrowUp, ArrowDown, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/@shared-components/header"

// Sample token data
const tokens = [
  {
    id: 1,
    name: "Nyeri Highland Coffee",
    symbol: "NHC",
    price: 0.1,
    change: 5.2,
    volume: 12500,
    marketCap: 250000,
    image: "/placeholder.svg?height=40&width=40",
    verified: true,
    hot: true,
  },
  {
    id: 2,
    name: "Mount Kenya Collective",
    symbol: "MKC",
    price: 0.05,
    change: -2.1,
    volume: 8300,
    marketCap: 120000,
    image: "/placeholder.svg?height=40&width=40",
    verified: true,
    hot: false,
  },
  {
    id: 3,
    name: "Rift Valley Estate",
    symbol: "RVE",
    price: 0.15,
    change: 8.7,
    volume: 15600,
    marketCap: 300000,
    image: "/placeholder.svg?height=40&width=40",
    verified: true,
    hot: true,
  },
  {
    id: 4,
    name: "Nairobi Highlands",
    symbol: "NBH",
    price: 0.08,
    change: 1.3,
    volume: 5200,
    marketCap: 160000,
    image: "/placeholder.svg?height=40&width=40",
    verified: false,
    hot: false,
  },
  {
    id: 5,
    name: "Meru Plantation",
    symbol: "MPL",
    price: 0.12,
    change: -0.8,
    volume: 9100,
    marketCap: 240000,
    image: "/placeholder.svg?height=40&width=40",
    verified: true,
    hot: false,
  },
  {
    id: 6,
    name: "Machakos Sustainable",
    symbol: "MSF",
    price: 0.07,
    change: 3.5,
    volume: 6800,
    marketCap: 140000,
    image: "/placeholder.svg?height=40&width=40",
    verified: false,
    hot: false,
  },
  {
    id: 7,
    name: "Kiambu Organic",
    symbol: "KOF",
    price: 0.09,
    change: 6.2,
    volume: 7500,
    marketCap: 180000,
    image: "/placeholder.svg?height=40&width=40",
    verified: true,
    hot: true,
  },
  {
    id: 8,
    name: "Kisii Highlands",
    symbol: "KHL",
    price: 0.06,
    change: -1.5,
    volume: 4200,
    marketCap: 120000,
    image: "/placeholder.svg?height=40&width=40",
    verified: false,
    hot: false,
  },
]

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState("Marketplace")
  const [marketTab, setMarketTab] = useState("All")
  const [sortBy, setSortBy] = useState("volume")
  const [sortOrder, setSortOrder] = useState("desc")
  const [searchQuery, setSearchQuery] = useState("")
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

  // Filter and sort tokens
  const filteredTokens = tokens
    .filter((token) => {
      if (marketTab === "Hot") return token.hot
      if (marketTab === "Verified") return token.verified
      return true // "All" tab
    })
    .filter((token) => {
      if (!searchQuery) return true
      return (
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
    .sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "price":
          comparison = a.price - b.price
          break
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "change":
          comparison = a.change - b.change
          break
        case "volume":
          comparison = a.volume - b.volume
          break
        case "marketCap":
          comparison = a.marketCap - b.marketCap
          break
        default:
          comparison = a.volume - b.volume
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 text-gray-900 dark:text-white">
      {/* Top Navigation */}
      <Header />

      {/* Main Content */}
      <div className="py-8 px-4 md:px-8">
        {/* Marketplace Header */}
        <div className="mb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">MARKETPLACE</div>
          <h1 className="text-3xl font-bold dark:text-white">Coffee Tree Tokens</h1>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={18}
            />
            <Input
              placeholder="Search tokens..."
              className="pl-10 bg-white dark:bg-gray-800 border dark:border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border dark:border-gray-700">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="change">24h Change</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="marketCap">Market Cap</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleSortOrder}
              className="bg-white dark:bg-gray-800 border dark:border-gray-700"
            >
              {sortOrder === "asc" ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
            </Button>

            <Button variant="outline" className="bg-white dark:bg-gray-800 border dark:border-gray-700">
              <Filter size={18} className="mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Market Tabs */}
        <Tabs defaultValue="All" className="mb-6" value={marketTab} onValueChange={setMarketTab}>
          <TabsList className="bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Hot">
              Hot
              <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
            </TabsTrigger>
            <TabsTrigger value="Verified">Verified</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Market Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-800">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Token
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  24h Change
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  24h Volume
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Market Cap
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens.map((token, index) => (
                <tr
                  key={token.id}
                  className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        <Image src={token.image || "/placeholder.svg"} alt={token.name} fill className="rounded-full" />
                        {token.verified && (
                          <div className="absolute -right-1 -bottom-1 bg-blue-500 rounded-full p-0.5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{token.name}</div>
                          {token.hot && (
                            <Badge className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                              <Star className="h-3 w-3 mr-1" /> Hot
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{token.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium dark:text-white">
                    ${token.price.toFixed(2)}
                  </td>
                  <td
                    className={`px-4 py-4 whitespace-nowrap text-right text-sm font-medium ${token.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {token.change >= 0 ? "+" : ""}
                    {token.change.toFixed(2)}%
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                    ${token.volume.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                    ${token.marketCap.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">Buy</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="border dark:border-gray-800 rounded-lg p-6 bg-white dark:bg-gray-800">
            <h3 className="text-lg font-medium mb-4 dark:text-white">Market Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Total Tokens</span>
                <span className="font-medium dark:text-white">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Total Volume (24h)</span>
                <span className="font-medium dark:text-white">$69,200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Total Market Cap</span>
                <span className="font-medium dark:text-white">$1,510,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Verified Tokens</span>
                <span className="font-medium dark:text-white">5</span>
              </div>
            </div>
          </div>

          <div className="border dark:border-gray-800 rounded-lg p-6 bg-white dark:bg-gray-800">
            <h3 className="text-lg font-medium mb-4 dark:text-white">Top Performers (24h)</h3>
            <div className="space-y-3">
              {tokens
                .sort((a, b) => b.change - a.change)
                .slice(0, 3)
                .map((token) => (
                  <div key={token.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative h-8 w-8 mr-2">
                        <Image src={token.image || "/placeholder.svg"} alt={token.name} fill className="rounded-full" />
                      </div>
                      <span className="font-medium dark:text-white">{token.symbol}</span>
                    </div>
                    <span className="text-green-600 dark:text-green-400">+{token.change.toFixed(2)}%</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="border dark:border-gray-800 rounded-lg p-6 bg-white dark:bg-gray-800">
            <h3 className="text-lg font-medium mb-4 dark:text-white">Recently Added</h3>
            <div className="space-y-3">
              {tokens.slice(-3).map((token) => (
                <div key={token.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative h-8 w-8 mr-2">
                      <Image src={token.image || "/placeholder.svg"} alt={token.name} fill className="rounded-full" />
                    </div>
                    <div>
                      <div className="font-medium dark:text-white">{token.symbol}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Added 2 days ago</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="dark:border-gray-700 dark:text-gray-300">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

