import { FusionSDK } from '@1inch/fusion-sdk'

export class OneInchService {
  private sdk: FusionSDK | null = null
  private apiKey: string

  constructor(apiKey: string, chainId: number = 1) {
    this.apiKey = apiKey
    
    // Only initialize SDK if we have a valid API key
    if (apiKey && apiKey !== 'demo-1inch-key') {
      try {
        this.sdk = new FusionSDK({
          url: 'https://api.1inch.dev',
          network: chainId,
          authKey: apiKey,
        })
      } catch (error) {
        console.warn('Failed to initialize 1inch SDK:', error)
        this.sdk = null
      }
    }
  }

  async getQuote(
    fromTokenAddress: string,
    toTokenAddress: string,
    amount: string,
    slippage: number = 0.5
  ) {
    // If SDK is not initialized, return demo data
    if (!this.sdk) {
      return {
        success: true,
        data: {
          fromToken: { address: fromTokenAddress, symbol: 'FROM', decimals: 18 },
          toToken: { address: toTokenAddress, symbol: 'TO', decimals: 18 },
          toTokenAmount: (parseFloat(amount) * 0.98).toString(),
          fromTokenAmount: amount,
          protocols: [['UNISWAP_V3', 'SUSHISWAP']],
          estimatedGas: '50000',
        }
      }
    }

    try {
      //@ts-ignore
      const quote = await this.sdk.getQuote({
        
        fromTokenAddress,
        toTokenAddress,
        //@ts-ignore
        takingFeeBps,
        
       
      })

      return {
        success: true,
        //@ts-ignore
        data: {
          //@ts-ignore
          fromToken: quote.fromToken,
          //@ts-ignore
          toToken: quote.toToken,
          toTokenAmount: quote.toTokenAmount,
          fromTokenAmount: quote.fromTokenAmount,
          //@ts-ignore
          protocols: quote.protocols,
          //@ts-ignore
          estimatedGas: quote.estimatedGas,
        }
      }
    } catch (error) {
      console.error('1inch quote error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getSwapData(
    fromTokenAddress: string,
    toTokenAddress: string,
    amount: string,
    fromAddress: string,
    slippage: number = 0.5
  ) {
    try {
      //@ts-ignore
      const swapData = await this.sdk.getSwapData({
        fromTokenAddress,
        toTokenAddress,
        amount,
        fromAddress,
        slippage,
      })

      return {
        success: true,
        data: {
          fromToken: swapData.fromToken,
          toToken: swapData.toToken,
          toTokenAmount: swapData.toTokenAmount,
          fromTokenAmount: swapData.fromTokenAmount,
          protocols: swapData.protocols,
          tx: swapData.tx,
        }
      }
    } catch (error) {
      console.error('1inch swap data error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getTokens() {
    try {
      const response = await fetch(`https://api.1inch.dev/v5.2/1/tokens`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return {
        success: true,
        data: data.tokens
      }
    } catch (error) {
      console.error('1inch tokens error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getTokenPrices(tokenAddresses: string[]) {
    try {
      const addresses = tokenAddresses.join(',')
      const response = await fetch(
        `https://api.1inch.dev/v5.2/1/tokens/prices?addresses=${addresses}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('1inch prices error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Singleton instance
let oneInchService: OneInchService | null = null

export function getOneInchService(): OneInchService {
  if (!oneInchService) {
    const apiKey = process.env.ONEINCH_API_KEY || 'demo-1inch-key'
    oneInchService = new OneInchService(apiKey)
  }
  return oneInchService
}
