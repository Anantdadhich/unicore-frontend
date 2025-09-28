"use client"

import { useAccount } from "wagmi"
import SolverDashboard from "@/components/SolverDashboard"

export default function SolverPage() {
  const { address, isConnected } = useAccount()

  return (
    <main className="min-h-screen bg-[#F8F9FA] py-12 px-6">
      {isConnected ? (
        <SolverDashboard solverAddress={address} />
      ) : (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-700">
          Please connect your wallet to access the Solver Dashboard.
        </div>
      )}
    </main>
  )
}
