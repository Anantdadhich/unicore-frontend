import { ethers } from "ethers"
import { CONTRACT_ADDRESSES } from "./config"

// Contract ABIs (simplified - in production, these would be imported from artifacts)
const UNICORE_SWAP_ABI = [
  "function createSwapIntent(address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut, uint16 dstChainId) external returns (uint256)",
  "function fulfillSwapIntent(uint256 intentId) external",
  "function swapIntents(uint256) view returns (address user, address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut, uint16 dstChainId, bool fulfilled)",
  "function intentCounter() view returns (uint256)",
  "event SwapIntentCreated(uint256 indexed intentId, address indexed user)",
  "event SwapIntentFulfilled(uint256 indexed intentId)"
]

const SOLVER_NETWORK_ABI = [
  "function stake() external",
  "function unstake() external",
  "function updateReputation(address solver, uint256 delta) external",
  "function solvers(address) view returns (uint256 stake, uint256 reputation, bool active)",
  "function stakingAmount() view returns (uint256)",
  "event SolverStaked(address indexed solver, uint256 amount)",
  "event SolverUnstaked(address indexed solver, uint256 amount)",
  "event ReputationUpdated(address indexed solver, uint256 newReputation)"
]

const ZK_VERIFIER_ABI = [
  "function verifyProof(bytes memory proof, uint256[1] memory pubSignals) public view returns (bool)"
]

export class ContractManager {
  private provider: ethers.Provider
  private signer: ethers.Signer | null = null
  private contracts: {
    uniCoreSwap: ethers.Contract | null
    solverNetwork: ethers.Contract | null
    zkVerifier: ethers.Contract | null
  } = {
    uniCoreSwap: null,
    solverNetwork: null,
    zkVerifier: null
  }

  constructor(provider: ethers.Provider, signer?: ethers.Signer) {
    this.provider = provider
    this.signer = signer || null
    this.initializeContracts()
  }

  private initializeContracts() {
    const chainId = this.getChainId()
    
    if (CONTRACT_ADDRESSES.UniCoreSwap[chainId as keyof typeof CONTRACT_ADDRESSES.UniCoreSwap]) {
      this.contracts.uniCoreSwap = new ethers.Contract(
        CONTRACT_ADDRESSES.UniCoreSwap[chainId as keyof typeof CONTRACT_ADDRESSES.UniCoreSwap],
        UNICORE_SWAP_ABI,
        this.signer || this.provider
      )
    }

    if (CONTRACT_ADDRESSES.SolverNetwork[chainId as keyof typeof CONTRACT_ADDRESSES.SolverNetwork]) {
      this.contracts.solverNetwork = new ethers.Contract(
        CONTRACT_ADDRESSES.SolverNetwork[chainId as keyof typeof CONTRACT_ADDRESSES.SolverNetwork],
        SOLVER_NETWORK_ABI,
        this.signer || this.provider
      )
    }

    if (CONTRACT_ADDRESSES.ZKVerifier[chainId as keyof typeof CONTRACT_ADDRESSES.ZKVerifier]) {
      this.contracts.zkVerifier = new ethers.Contract(
        CONTRACT_ADDRESSES.ZKVerifier[chainId as keyof typeof CONTRACT_ADDRESSES.ZKVerifier],
        ZK_VERIFIER_ABI,
        this.signer || this.provider
      )
    }
  }

  private getChainId(): number {
    // In a real implementation, this would get the actual chain ID
    // For now, return Ethereum mainnet
    return 1
  }

  // Swap Intent Methods
  async createSwapIntent(
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    minAmountOut: string,
    dstChainId: number
  ): Promise<{ txHash: string; intentId: number }> {
    if (!this.contracts.uniCoreSwap) {
      throw new Error("UniCoreSwap contract not initialized")
    }

    const tx = await this.contracts.uniCoreSwap.createSwapIntent(
      tokenIn,
      tokenOut,
      amountIn,
      minAmountOut,
      dstChainId
    )

    const receipt = await tx.wait()
    
    // Extract intent ID from event
    const event = receipt.logs.find((log: any) => {
      // Fix: Ensure we only parse logs from the correct contract and with the correct topic
      try {
        const contractAddress =
          typeof this.contracts.uniCoreSwap?.address === "string"
            ? this.contracts.uniCoreSwap.address
            : this.contracts.uniCoreSwap?.address?.toString?.()
        // The event topic for SwapIntentCreated
        const swapIntentCreatedTopic = this.contracts.uniCoreSwap!.interface.getAbiCoder()
        if (
          log.address &&
          contractAddress &&
          log.address.toLowerCase() === contractAddress.toLowerCase() &&
          log.topics &&
          log.topics.length > 0 &&
          log.topics[0] === swapIntentCreatedTopic
        ) {
          return true
        }
        return false
      } catch {
        return false
      }
    })

    if (!event) {
      throw new Error("Failed to extract intent ID from transaction")
    }

    const parsedEvent:any = this.contracts.uniCoreSwap!.interface.parseLog(event)
    const intentId = parsedEvent.args.intentId

    return {
      txHash: receipt.hash,
      intentId: Number(intentId)
    }
  }

  async getSwapIntent(intentId: number) {
    if (!this.contracts.uniCoreSwap) {
      throw new Error("UniCoreSwap contract not initialized")
    }

    return await this.contracts.uniCoreSwap.swapIntents(intentId)
  }

  async getIntentCounter(): Promise<number> {
    if (!this.contracts.uniCoreSwap) {
      throw new Error("UniCoreSwap contract not initialized")
    }

    const counter = await this.contracts.uniCoreSwap.intentCounter()
    return Number(counter)
  }

  // Solver Network Methods
  async stake(): Promise<string> {
    if (!this.contracts.solverNetwork) {
      throw new Error("SolverNetwork contract not initialized")
    }

    const tx = await this.contracts.solverNetwork.stake()
    const receipt = await tx.wait()
    return receipt.hash
  }

  async unstake(): Promise<string> {
    if (!this.contracts.solverNetwork) {
      throw new Error("SolverNetwork contract not initialized")
    }

    const tx = await this.contracts.solverNetwork.unstake()
    const receipt = await tx.wait()
    return receipt.hash
  }

  async getSolverInfo(solverAddress: string) {
    if (!this.contracts.solverNetwork) {
      throw new Error("SolverNetwork contract not initialized")
    }

    return await this.contracts.solverNetwork.solvers(solverAddress)
  }

  async getStakingAmount(): Promise<string> {
    if (!this.contracts.solverNetwork) {
      throw new Error("SolverNetwork contract not initialized")
    }

    return await this.contracts.solverNetwork.stakingAmount()
  }

  // ZK Verifier Methods
  async verifyProof(proof: string, pubSignals: number[]): Promise<boolean> {
    if (!this.contracts.zkVerifier) {
      throw new Error("ZKVerifier contract not initialized")
    }

    return await this.contracts.zkVerifier.verifyProof(proof, pubSignals)
  }

  // Utility Methods
  setSigner(signer: ethers.Signer) {
    this.signer = signer
    this.initializeContracts()
  }

  getContractAddresses() {
    return CONTRACT_ADDRESSES
  }
}

// Hook for using contracts in React components
export function useContracts(provider: ethers.Provider, signer?: ethers.Signer) {
  return new ContractManager(provider, signer)
}
