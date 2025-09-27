import { z } from "zod"

export const SwapIntentSchema = z.object({
  tokenIn: z.string().min(1, "Token in address is required"),
  tokenOut: z.string().min(1, "Token out address is required"),
  amountIn: z.string().min(1, "Amount in is required"),
  minAmountOut: z.string().min(1, "Minimum amount out is required"),
  dstChainId: z.number().min(1, "Destination chain ID is required"),
})

export const RouteOptimizationSchema = z.object({
  tokenIn: z.string(),
  tokenOut: z.string(),
  amountIn: z.string(),
  dstChainId: z.number(),
  includePrivacy: z.boolean().optional().default(false),
})

export const SolverActionSchema = z.object({
  action: z.enum(["stake", "unstake", "updateReputation"]),
  solverAddress: z.string().optional(),
  amount: z.string().optional(),
})

export type SwapIntent = z.infer<typeof SwapIntentSchema>
export type RouteOptimization = z.infer<typeof RouteOptimizationSchema>
export type SolverAction = z.infer<typeof SolverActionSchema>

export interface SwapRoute {
  id: string
  path: string[]
  estimatedOutput: string
  priceImpact: number
  gasEstimate: string
  executionTime: number
  privacyLevel: "low" | "medium" | "high"
  solverReputation: number
  source?: string
  protocols?: any[]
  confidence?: number
  aiScore?: number
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  swapIntent?: SwapIntent
}
