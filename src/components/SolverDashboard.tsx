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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          solverAddress,
          amount,
        }),
      })

      const data = await response.json()
      if (data.success) {
        // Refresh solver info
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
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 border border-zinc-200">
        <div className="text-center">
          <Users className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Solver Network</h2>
          <p className="text-zinc-600 mb-6">
            Connect your wallet to access the solver dashboard and participate in the network.
          </p>
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4">
            <p className="text-zinc-900 text-sm">
              <strong>What are Solvers?</strong>
              <br />
              Solvers are automated agents that execute cross-chain swaps by finding optimal routes and providing
              liquidity.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 border border-zinc-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Solver Dashboard</h2>
          <p className="text-zinc-600">Manage your solver operations</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-zinc-500">Solver Address</p>
          <p className="font-mono text-sm">{formatAddress(solverAddress)}</p>
        </div>
      </div>

      {isLoading && !solverInfo ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
        </div>
      ) : solverInfo ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stake Amount */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl border border-zinc-200"
          >
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 text-zinc-900" />
              <span className="text-sm text-zinc-700 font-medium">Staked</span>
            </div>
            <p className="text-2xl font-bold text-zinc-900">{formatAmount(solverInfo.stake)}</p>
            <p className="text-sm text-zinc-600">tokens</p>
          </motion.div>

          {/* Reputation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl border border-zinc-200"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-zinc-900" />
              <span className="text-sm text-zinc-700 font-medium">Reputation</span>
            </div>
            <p className="text-2xl font-bold text-zinc-900">{solverInfo.reputation}</p>
            <p className="text-sm text-zinc-600">score</p>
          </motion.div>

          {/* Total Swaps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl border border-zinc-200"
          >
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-8 h-8 text-zinc-900" />
              <span className="text-sm text-zinc-700 font-medium">Swaps</span>
            </div>
            <p className="text-2xl font-bold text-zinc-900">{solverInfo.totalSwaps.toLocaleString()}</p>
            <p className="text-sm text-zinc-600">executed</p>
          </motion.div>

          {/* Success Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl border border-zinc-200"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-zinc-900" />
              <span className="text-sm text-zinc-700 font-medium">Success</span>
            </div>
            <p className="text-2xl font-bold text-zinc-900">{solverInfo.successRate}%</p>
            <p className="text-sm text-zinc-600">rate</p>
          </motion.div>
        </div>
      ) : null}

      {/* Action Panel */}
      <div className="bg-zinc-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Solver Actions</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Action Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Action</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setAction("stake")}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    action === "stake" ? "bg-zinc-900 text-white" : "bg-white text-zinc-800 border border-zinc-300"
                  }`}
                >
                  Stake
                </button>
                <button
                  onClick={() => setAction("unstake")}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    action === "unstake" ? "bg-zinc-900 text-white" : "bg-white text-zinc-800 border border-zinc-300"
                  }`}
                >
                  Unstake
                </button>
              </div>
            </div>

            {action === "stake" && (
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Amount to Stake</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900/30 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex items-end">
            <button
              onClick={handleSolverAction}
              disabled={isLoading || (action === "stake" && !amount)}
              className="w-full py-3 bg-zinc-900 text-white rounded-full font-medium hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? "Processing..." : `${action === "stake" ? "Stake" : "Unstake"} Tokens`}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-zinc-50 border border-zinc-200 rounded-lg p-4">
          <h4 className="font-medium text-zinc-900 mb-2">How Solver Network Works</h4>
          <ul className="text-sm text-zinc-700 space-y-1">
            <li>• Stake tokens to become an active solver</li>
            <li>• Earn rewards for successful swap executions</li>
            <li>• Build reputation through consistent performance</li>
            <li>• Higher reputation = better route selection priority</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
