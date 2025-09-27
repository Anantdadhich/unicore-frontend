import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatAmount(amount: string | number, decimals: number = 18): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  return (num / Math.pow(10, decimals)).toFixed(6)
}

export function parseAmount(amount: string, decimals: number = 18): string {
  const num = parseFloat(amount)
  return (num * Math.pow(10, decimals)).toString()
}
