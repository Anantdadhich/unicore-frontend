"use client"

import { useState, useEffect } from "react"
import { Shield, TrendingUp, Zap, Clock, Users } from "lucide-react"
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
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Solver Network</h2>
        <p className="text-gray-600 mb-6">
          Connect your wallet to access the solver dashboard and participate in the network.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left text-blue-800 text-sm">
          <strong className="block mb-1 font-semibold text-blue-900">What are Solvers?</strong>
          Solvers are automated agents that execute cross-chain swaps by finding optimal routes and providing liquidity.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 text-gray-900">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Solver Dashboard</h2>
          <p className="text-gray-600">Manage your solver operations</p>
        </div>
        <div className="text-right font-mono text-sm text-gray-600">
          <p className="mb-1">Solver Address</p>
          <p>{formatAddress(solverAddress)}</p>
        </div>
      </div>

      {isLoading && !solverInfo ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : solverInfo ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Staked */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2 text-blue-700">
              <Shield className="w-8 h-8" />
              <span className="text-sm font-medium">Staked</span>
            </div>
            <p className="text-2xl font-bold">{formatAmount(solverInfo.stake)}</p>
            <p className="text-sm text-gray-600">tokens</p>
          </div>

          {/* Reputation */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2 text-green-700">
              <TrendingUp className="w-8 h-8" />
              <span className="text-sm font-medium">Reputation</span>
            </div>
            <p className="text-2xl font-bold">{solverInfo.reputation}</p>
            <p className="text-sm text-gray-600">score</p>
          </div>

          {/* Total Swaps */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2 text-purple-700">
              <Zap className="w-8 h-8" />
              <span className="text-sm font-medium">Swaps</span>
            </div>
            <p className="text-2xl font-bold">{solverInfo.totalSwaps.toLocaleString()}</p>
            <p className="text-sm text-gray-600">executed</p>
          </div>

          {/* Success Rate */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2 text-yellow-700">
              <Clock className="w-8 h-8" />
              <span className="text-sm font-medium">Success</span>
            </div>
            <p className="text-2xl font-bold">{solverInfo.successRate}%</p>
            <p className="text-sm text-gray-600">rate</p>
          </div>
        </div>
      ) : null}

      {/* Action Panel */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Solver Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Action Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Action</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setAction("stake")}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    action === "stake" ? "bg-blue-700 text-white" : "bg-gray-300 text-gray-700"
                  }`}
                >
                  Stake
                </button>
                <button
                  onClick={() => setAction("unstake")}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    action === "unstake" ? "bg-blue-700 text-white" : "bg-gray-300 text-gray-700"
                  }`}
                >
                  Unstake
                </button>
              </div>
            </div>

            {action === "stake" && (
              <div>
                <label className="block text-sm font-medium mb-2">Amount to Stake</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex items-end">
            <button
              onClick={handleSolverAction}
              disabled={isLoading || (action === "stake" && !amount)}
              className="w-full py-3 bg-blue-700 text-white rounded-full font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Processing..." : `${action === "stake" ? "Stake" : "Unstake"} Tokens`}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200 text-gray-700">
          <h4 className="font-medium mb-2">How Solver Network Works</h4>
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
