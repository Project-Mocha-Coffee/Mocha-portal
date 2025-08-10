import { useEffect, useState } from "react"
import {
  ChevronDown,
  Moon,
  Sun,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation" // <-- Add this import

const NAV_LINKS = [
  { label: "Dashboard", href: "/", enabled: true },
  { label: "Marketplace", href: "/marketplace", enabled: true },
  { label: "Staking", href: "/staking", enabled: false },
  { label: "Yield", href: "/yield", enabled: false }, // Disabled example
]

export default function Header() {
    const [darkMode, setDarkMode] = useState(false)
    const pathname = usePathname() // <-- Get current path

    useEffect(() => {
      const savedMode = localStorage.getItem("darkMode")
      if (savedMode !== null) {
          setDarkMode(savedMode === "true")
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
                {NAV_LINKS.filter(link => link.enabled).map((link) => (
                  <Link key={link.label} href={link.href}>
                    <button
                      className={`px-4 py-1.5 rounded-full flex items-center transition-colors
                        ${pathname === link.href ? "text-black dark:text-white font-semibold" : "text-gray-400 hover:text-gray-200"}`}
                    >
                      {link.label}
                      {link.label === "Dashboard" && <ChevronDown className="ml-1.5 w-4 h-4" />}
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

            <div className="flex items-center bg-white dark:bg-gray-800 rounded-full border dark:border-gray-700 px-3 py-1.5 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-700 overflow-hidden mr-3">
                <Image 
                  src="/placeholder.svg?height=32&width=32" 
                  alt="Profile" 
                  width={32} 
                  height={32}
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium mr-2 dark:text-white">0xb500...f1209</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    )
}