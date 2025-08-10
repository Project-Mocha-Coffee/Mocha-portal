import { useState, useEffect } from "react"
import {
  ChevronDown,
  Moon,
  Sun,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { AuthModal } from "crefy-connect"

// Example: Admin config for enabled/disabled links
const NAV_LINKS = [
  { label: "Dashboard", href: "/", enabled: true },
  { label: "Marketplace", href: "/marketplace", enabled: true },
  { label: "Staking", href: "/staking", enabled: true },
  { label: "Yield", href: "/yield", enabled: false }, // Disabled example
]

export default function Header() {
    const router = useRouter()
    const [darkMode, setDarkMode] = useState(false)
    const [authOpen, setAuthOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true) 
    }, [])

    useEffect(() => {
      if (!mounted) return
      const savedMode = localStorage.getItem("darkMode")
      if (savedMode !== null) {
        setDarkMode(savedMode === "true")
      }
    }, [mounted])
    
    useEffect(() => {
      if (!mounted) return
      if (darkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      localStorage.setItem("darkMode", darkMode.toString())
    }, [darkMode, mounted])

    const toggleDarkMode = () => {
      setDarkMode(!darkMode)
    }

    
    const activeTab = NAV_LINKS.find(link =>
      link.href === "/" ? router.pathname === "/" : router.pathname.startsWith(link.href)
    )?.label

    if (!mounted) return null 

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
        <div className="mx-auto flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-brown-800 dark:bg-amber-700 rounded-md flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="font-bold text-xl dark:text-white">Project Mocha</span>
          </div>

          <div className="flex items-center space-x-6">
            <nav className="border dark:border-gray-800 bg-white dark:bg-gray-800 bg-gray-300 rounded-full px-6 py-2">
              <div className="flex items-center space-x-2">
                {NAV_LINKS.map((tab) => (
                  <Link key={tab.label} href={tab.href} legacyBehavior>
                    <button
                      className={`px-4 py-1.5 rounded-full flex items-center transition-colors
                        ${activeTab === tab.label
                          ? "text-black dark:text-white font-semibold"
                          : "text-gray-400 hover:text-gray-200"}
                        ${!tab.enabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={e => {
                        if (!tab.enabled) {
                          e.preventDefault()
                        }
                      }}
                      disabled={!tab.enabled}
                    >
                      {tab.label}
                      {tab.label === "Dashboard" && (
                        <ChevronDown className="ml-1.5 w-4 h-4" />
                      )}
                    </button>
                  </Link>
                ))}
              </div>
            </nav>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full bg-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5 text-gray-700" />}
            </Button>

            {/* <Button
              className="rounded-full bg-amber-500 text-white px-5 py-2 font-semibold hover:bg-amber-600 transition-colors"
              onClick={() => setAuthOpen(true)}
            >
              Connect
            </Button> */}
            <AuthModal triggerText="Connect Wallet" />
          </div>
        </div>
      </div>
    )
}