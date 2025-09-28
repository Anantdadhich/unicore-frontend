

import { ethers } from 'ethers'
import { zkProofService, SwapCommitment, ZKProofData } from './zk-proof'
import { getOneInchService } from './oneinch'
import { getAIOptimizer } from './ai-optimizer'
import { CHAIN_CONFIG } from './config'

export interface SwapParams {
  tokenIn: string
  tokenOut: string
  amountIn: string
  minAmountOut: string
  dstChainId: number
  userAddress: string
  includePrivacy: boolean
}

export interface SwapResult {
  success: boolean
  txHash?: string
  intentId?: number
  error?: string
  proof?: ZKProofData
  commitment?: SwapCommitment
}

export interface RouteInfo {
  id: string
  estimatedOutput: string
  priceImpact: number
  gasEstimate: string
  executionTime: number
  privacyLevel: 'low' | 'medium' | 'high'
  solverReputation: number
  source: string
  protocols: any[]
  confidence: number
  aiScore: number
}

export class SwapService {
  private static instance: SwapService
  private oneInchService = getOneInchService()
  private aiOptimizer = getAIOptimizer()

  static getInstance(): SwapService {
    if (!SwapService.instance) {
      SwapService.instance = new SwapService()
    }
    return SwapService.instance
  }
//@ts-ignore
  async getOptimizedRoutes(params: SwapParams): Promise<RouteInfo[]> {
    try {
      const routes = await this.aiOptimizer.optimizeRoutes(
        params.tokenIn,
        params.tokenOut,
        params.amountIn,
        params.dstChainId,
        params.includePrivacy
      )

      // Add 1inch route for comparison
      const oneInchQuote = await this.oneInchService.getQuote(
        params.tokenIn,
        params.tokenOut,
        params.amountIn,
        0.5
      )

      if (oneInchQuote.success) {
        const oneInchRoute: RouteInfo = {
          id: '1inch-direct',
          estimatedOutput: oneInchQuote.data?.toTokenAmount ?? '0',
          priceImpact: 0.1,
          gasEstimate: oneInchQuote.data?.estimatedGas ?? '50000',
          executionTime: 30,
          privacyLevel: 'low',
          solverReputation: 98,
          source: '1inch',
          protocols: oneInchQuote.data?.protocols ?? [],
          confidence: 0.95,
          aiScore: 0.9,
        
        }
       
        
         return [oneInchRoute]
        
       
       
      }

      // Ensure routes is an array of RouteInfo
      if (Array.isArray(routes)) {
        return routes as RouteInfo[]
      } else if (routes) {
        return [routes as RouteInfo]
      } else {
        return []
      }
    } catch (error) {
      console.error('Route optimization failed:', error)
      return []
    }
  }

  async executeSwap(params: SwapParams, selectedRoute?: RouteInfo): Promise<SwapResult> {
    try {
      console.log('🚀 Starting cross-chain swap execution...')

      let proof: ZKProofData | undefined
      let commitment: SwapCommitment | undefined

      if (params.includePrivacy) {
        console.log('🔐 Generating ZK proof for privacy...')
        const proofResult = await zkProofService.createPrivateSwapCommitment(
          params.tokenIn,
          params.tokenOut,
          params.amountIn,
          selectedRoute?.estimatedOutput ?? params.minAmountOut,
          params.userAddress
        )
        proof = proofResult.proof
        commitment = proofResult.commitment
        console.log('✅ ZK proof generated:', proof.hash)
      }

      console.log('💰 Getting final quote...')
      const swapData = await this.oneInchService.getSwapData(
        params.tokenIn,
        params.tokenOut,
        params.amountIn,
        params.userAddress,
        0.5
        // chainId param removed because your oneInchService.getSwapData doesn't take it in example
      )

      if (!swapData.success) {
        return {
          success: false,
          error: swapData.error ?? 'Failed to get swap data',
        }
      }

      console.log('⚡ Executing swap...')
      const result = await this.executeSwapTransaction(params, swapData.data, proof, commitment)

      if (result.success) {
        console.log('🎉 Swap executed successfully!')
        console.log('📄 Transaction hash:', result.txHash)
        console.log('🆔 Intent ID:', result.intentId)
      }

      return result
    } catch (error) {
      console.error('❌ Swap execution failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  private async executeSwapTransaction(
    params: SwapParams,
    swapData: any,
    proof?: ZKProofData,
    commitment?: SwapCommitment
  ): Promise<SwapResult> {
    try {
      // Simulate the transaction for demo
      // Replace this with actual wallet connection & contract interaction
      const mockTxHash = `0x${Math.random().toString(16).slice(2, 66)}`
      const mockIntentId = Math.floor(Math.random() * 1000000) + 1000
      await new Promise((resolve) => setTimeout(resolve, 2000))

      return {
        success: true,
        txHash: mockTxHash,
        intentId: mockIntentId,
        proof,
        commitment,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transaction failed',
      }
    }
  }

  async getSwapQuote(params: SwapParams): Promise<{
    success: boolean
    data?: {
      estimatedOutput: string
      priceImpact: number
      gasEstimate: string
      executionTime: number
      routes: RouteInfo[]
    }
    error?: string
  }> {
    try {
      const routes = await this.getOptimizedRoutes(params)
      const bestRoute = routes[0]

      if (!bestRoute) {
        return {
          success: false,
          error: 'No routes available',
        }
      }

      return {
        success: true,
        data: {
          estimatedOutput: bestRoute.estimatedOutput,
          priceImpact: bestRoute.priceImpact,
          gasEstimate: bestRoute.gasEstimate,
          executionTime: bestRoute.executionTime,
          routes,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get quote',
      }
    }
  }

  async verifySwapCompletion(
    intentId: number,
    srcChainId: number,
    dstChainId: number
  ): Promise<{
    success: boolean
    completed: boolean
    txHash?: string
    error?: string
  }> {
    try {
      // Demo: simulate verification delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return {
        success: true,
        completed: true,
        txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
      }
    } catch (error) {
      return {
        success: false,
        completed: false,
        error: error instanceof Error ? error.message : 'Verification failed',
      }
    }
  }

  getSupportedTokens(chainId: number): Array<{
    address: string
    symbol: string
    name: string
    decimals: number
    logoURI?: string
  }> {
    const chainConfig = Object.values(CHAIN_CONFIG).find((config) => config.chainId === chainId)

    if (!chainConfig) {
      return []
    }

    const commonTokens = [
      {
        address: '0x0000000000000000000000000000000000000000',
        symbol: chainConfig.nativeCurrency.symbol,
        name: chainConfig.nativeCurrency.name,
        decimals: chainConfig.nativeCurrency.decimals,
      },
    ]

    if (chainId === 1) {
      commonTokens.push(
        {
          address: '0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          symbol: 'USDC' as any,
          name: 'USD Coin' as any,
          decimals: 6 as any,
        },
        {
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          symbol: 'USDT' as any,
          name: 'Tether USD' as any,
          decimals: 6 as any,
        },
        {
          address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WETH' as any,
          name: 'Wrapped Ether' as any,
          decimals: 18,
        }
      )
    }

    return commonTokens
  }

  formatAmount(amount: string, decimals: number = 18): string {
    try {
      const formatted = ethers.formatUnits(amount, decimals)
      const num = parseFloat(formatted)
      return num.toFixed(6)
    } catch {
      return '0.000000'
    }
  }

  parseAmount(amount: string, decimals: number = 18): string {
    try {
      return ethers.parseUnits(amount, decimals).toString()
    } catch {
      return '0'
    }
  }
}

export const swapService = SwapService.getInstance()
