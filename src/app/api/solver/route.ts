import { NextRequest, NextResponse } from "next/server"
import { SolverActionSchema } from "@/lib/types"

// Handle solver actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, solverAddress, amount } = SolverActionSchema.parse(body)

    // Simulate solver network interactions
    let result
    switch (action) {
      case "stake":
        result = {
          success: true,
          message: "Successfully staked as solver",
          transactionHash: "0x" + Math.random().toString(16).substr(2, 64),
        }
        break
      case "unstake":
        result = {
          success: true,
          message: "Successfully unstaked from solver network",
          transactionHash: "0x" + Math.random().toString(16).substr(2, 64),
        }
        break
      case "updateReputation":
        result = {
          success: true,
          message: `Reputation updated for solver ${solverAddress}`,
          transactionHash: "0x" + Math.random().toString(16).substr(2, 64),
        }
        break
      default:
        throw new Error("Invalid solver action")
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Solver action error:", error)
    return NextResponse.json(
      { error: "Failed to execute solver action" },
      { status: 500 }
    )
  }
}

// Get solver information
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const solverAddress = searchParams.get("solverAddress")

    if (!solverAddress) {
      return NextResponse.json(
        { error: "Solver address is required" },
        { status: 400 }
      )
    }

    // Simulate solver data
    const solverInfo = {
      address: solverAddress,
      stake: "1000000000000000000000", // 1000 tokens
      reputation: 95,
      active: true,
      totalSwaps: 1247,
      successRate: 98.5,
      avgExecutionTime: 45, // seconds
    }

    return NextResponse.json({ solver: solverInfo })
  } catch (error) {
    console.error("Get solver info error:", error)
    return NextResponse.json(
      { error: "Failed to fetch solver information" },
      { status: 500 }
    )
  }
}
