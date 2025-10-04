// Contract configuration for Base Sepolia
// Deployed addresses from deployments/baseSepolia-84532.json

import TrigCoreABI from '@/abis/TrigImmutableCore.json'
import OracleABI from '@/abis/StewardOracleRegistry.json'
import TitheABI from '@/abis/AutomatedTithe.json'
import MissionABI from '@/abis/MissionProtection.json'

// Base Sepolia contract addresses (LOW STAKES VERSION for testing)
// Deployed: October 4, 2025
export const CONTRACTS = {
  trigCore: {
    address: '0x0932b427fce27cAf69b36BAd1C33325835740DE0' as `0x${string}`,
    abi: TrigCoreABI.abi,
  },
  oracle: {
    address: '0xcc206C0ac32649ba7197Cb93c268e1675eca7024' as `0x${string}`, // ✅ LOW STAKES (0.00001 ETH)
    abi: OracleABI.abi,
  },
  tithe: {
    address: '0xe4B1318bb19256D2055c194a703824a4B1BA0f27' as `0x${string}`, // ✅ NEW DEPLOYMENT
    abi: TitheABI.abi,
  },
  mission: {
    address: '0x31C31Bcfa4149132B64b3F00F11EdE1D2e39bE12' as `0x${string}`, // ✅ NEW DEPLOYMENT
    abi: MissionABI.abi,
  },
} as const

// Network configuration
export const CHAIN_ID = 84532 // Base Sepolia

// Contract parameters (from deployment)
// NOTE: Reduced for testing/demo - deployed contracts use 0.1/0.5 ETH
export const ORACLE_CONFIG = {
  minOrganizationStake: '0.00001', // ETH (reduced for testing)
  minVerifierStake: '0.00005', // ETH (reduced for testing)
  requiredVerifications: 3,
} as const

export const MISSION_CONFIG = {
  premiumRate: 2, // 2% premium rate
} as const

// Frequency enum mapping (must match contract)
export const FREQUENCY_ENUM = {
  WEEKLY: 0,
  BIWEEKLY: 1,
  MONTHLY: 2,
  QUARTERLY: 3,
  YEARLY: 4,
  ONETIME: 5,
} as const

// Reverse mapping for display
export const FREQUENCY_LABELS = {
  0: 'Weekly',
  1: 'Bi-weekly',
  2: 'Monthly',
  3: 'Quarterly',
  4: 'Yearly',
  5: 'One-time',
} as const

// Policy status enum (must match contract)
export const POLICY_STATUS = {
  ACTIVE: 0,
  CLAIMED: 1,
  EXPIRED: 2,
  CANCELLED: 3,
} as const

// Condition status enum (must match TrigCore contract)
export const CONDITION_STATUS = {
  ACTIVE: 0,
  EXECUTED: 1,
  EXPIRED: 2,
  CANCELLED: 3,
} as const

// Helper function to format addresses
export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Helper function to get Base Sepolia block explorer URL
export function getBlockExplorerUrl(hash: string, type: 'tx' | 'address' = 'tx'): string {
  const baseUrl = 'https://sepolia.basescan.org'
  return type === 'tx' ? `${baseUrl}/tx/${hash}` : `${baseUrl}/address/${hash}`
}

