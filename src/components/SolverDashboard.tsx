"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Users, Shield, Clock, Zap } from "lucide-react"
import { formatAmount, formatAddress } from "@/lib/utils"

interface SolverDashboardProps {
  solverAddress?: string
}

export default function SolverDashboard({ solverAddress }: SolverDashboardProps) {
  const [solverInfo, setSolverInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [action, setAction] = useState<"stake" | "unstake">("stake")
  const [amount, setAmount] = useState("")

  useEffect(() => {
    if (solverAddress) {
      fetchSolverInfo()
    }
  }, [solverAddress])

  const fetchSolverInfo = async () => {
    if (!solverAddress) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/solver?solverAddress=${solverAddress}`)
      const data = await response.json()
      setSolverInfo(data.solver)
    } catch (error) {
      console.error("Failed to fetch solver info:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSolverAction = async () => {
    if (!solverAddress) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/solver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, solverAddress, amount }),
      })
      const data = await response.json()
      if (data.success) {
        await fetchSolverInfo()
        alert(data.message)
      } else {
        alert("Action failed: " + data.error)
      }
    } catch (error) {
      console.error("Solver action failed:", error)
      alert("Action failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!solverAddress) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-[#23262F] rounded-2xl shadow-lg p-6 border border-[#22262B] text-[#C3C3C3]">
        <div className="text-center">
          <Users className="w-16 h-16 text-[#7EA4F9] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Solver Network</h2>
          <p className="text-[#B3C1FF] mb-6">
            Connect your wallet to access the solver dashboard and participate in the network.
          </p>
          <div className="bg-[#2C303A] border border-[#444B5A] rounded-lg p-4 text-[#B3C1FF] text-sm text-left">
            <strong className="block mb-1 text-white">What are Solvers?</strong>
            Solvers are automated agents that execute cross-chain swaps by finding optimal routes and providing liquidity.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#23262F] rounded-2xl shadow-lg p-6 border border-[#22262B] text-[#C3C3C3]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Solver Dashboard</h2>
          <p className="text-[#B3C1FF]">Manage your solver operations</p>
        </div>
        <div className="text-right font-mono text-sm text-[#7EA4F9]">
          <p className="mb-1">Solver Address</p>
          <p>{formatAddress(solverAddress)}</p>
        </div>
      </div>

      {isLoading && !solverInfo ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3466F6]"></div>
        </div>
      ) : solverInfo ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Staked */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2C303A] p-6 rounded-xl border border-[#444B5A]"
          >
            <div className="flex items-center justify-between mb-2 text-[#7EA4F9]">
              <Shield className="w-8 h-8" />
              <span className="text-sm font-medium">Staked</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatAmount(solverInfo.stake)}</p>
            <p className="text-sm text-[#B3C1FF]">tokens</p>
          </motion.div>

          {/* Reputation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#2C303A] p-6 rounded-xl border border-[#444B5A]"
          >
            <div className="flex items-center justify-between mb-2 text-[#7EA4F9]">
              <TrendingUp className="w-8 h-8" />
              <span className="text-sm font-medium">Reputation</span>
            </div>
            <p className="text-2xl font-bold text-white">{solverInfo.reputation}</p>
            <p className="text-sm text-[#B3C1FF]">score</p>
          </motion.div>

          {/* Total Swaps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#2C303A] p-6 rounded-xl border border-[#444B5A]"
          >
            <div className="flex items-center justify-between mb-2 text-[#7EA4F9]">
              <Zap className="w-8 h-8" />
              <span className="text-sm font-medium">Swaps</span>
            </div>
            <p className="text-2xl font-bold text-white">{solverInfo.totalSwaps.toLocaleString()}</p>
            <p className="text-sm text-[#B3C1FF]">executed</p>
          </motion.div>

          {/* Success Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#2C303A] p-6 rounded-xl border border-[#444B5A]"
          >
            <div className="flex items-center justify-between mb-2 text-[#7EA4F9]">
              <Clock className="w-8 h-8" />
              <span className="text-sm font-medium">Success</span>
            </div>
            <p className="text-2xl font-bold text-white">{solverInfo.successRate}%</p>
            <p className="text-sm text-[#B3C1FF]">rate</p>
          </motion.div>
        </div>
      ) : null}

      {/* Action Panel */}
      <div className="bg-[#2C303A] rounded-xl p-6 border border-[#444B5A]">
        <h3 className="text-lg font-semibold text-white mb-4">Solver Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Action Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#B3C1FF] mb-2">Action</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setAction("stake")}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    action === "stake" ? "bg-[#3466F6] text-white" : "bg-[#3B4266] text-[#B3C1FF]"
                  }`}
                >
                  Stake
                </button>
                <button
                  onClick={() => setAction("unstake")}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    action === "unstake" ? "bg-[#3466F6] text-white" : "bg-[#3B4266] text-[#B3C1FF]"
                  }`}
                >
                  Unstake
                </button>
              </div>
            </div>

            {action === "stake" && (
              <div>
                <label className="block text-sm font-medium text-[#B3C1FF] mb-2">Amount to Stake</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000"
                  className="w-full px-3 py-2 bg-[#232830] border border-[#444B5A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3466F6] focus:border-transparent text-white"
                />
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex items-end">
            <button
              onClick={handleSolverAction}
              disabled={isLoading || (action === "stake" && !amount)}
              className="w-full py-3 bg-[#3466F6] text-white rounded-full font-semibold hover:bg-[#2753d4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Processing..." : `${action === "stake" ? "Stake" : "Unstake"} Tokens`}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-[#23262F] border border-[#444B5A] rounded-lg p-4 text-[#B3C1FF]">
          <h4 className="font-medium text-white mb-2">How Solver Network Works</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Stake tokens to become an active solver</li>
            <li>Earn rewards for successful swap executions</li>
            <li>Build reputation through consistent performance</li>
            <li>Higher reputation = better route selection priority</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
