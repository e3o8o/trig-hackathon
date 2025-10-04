import { useState, useEffect } from 'react'
import { useReadContract, useAccount } from 'wagmi'
import { CONTRACTS, FREQUENCY_LABELS } from '@/config/contracts'

export interface Commitment {
  id: number
  organizationAddress: string
  organizationName: string
  amount: string // in ETH
  token: string
  frequency: number
  frequencyLabel: string
  status: number // 0=ACTIVE, 1=PAUSED, 2=CANCELLED
  statusLabel: string
  createdAt: number
  lastPayment: number
  nextPayment: number
  endTime: number
  totalPaid: string
  paymentsCount: number
}

export function useUserCommitments() {
  const { address } = useAccount()
  const [commitments, setCommitments] = useState<Commitment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Get commitment IDs for the user
  const { data: commitmentIds, isLoading: isLoadingIds } = useReadContract({
    ...CONTRACTS.tithe,
    functionName: 'getGiverCommitments',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Fetch details for each commitment
  useEffect(() => {
    async function fetchCommitmentDetails() {
      if (!commitmentIds || commitmentIds.length === 0) {
        setCommitments([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        
        // For demo purposes, if no commitments exist yet, return mock data
        // In production, this would only query real commitments
        if (commitmentIds.length === 0) {
          // Return empty for now - user can create their first commitment!
          setCommitments([])
        } else {
          // TODO: Batch query all commitments
          // For now, returning empty until user creates real commitments
          setCommitments([])
        }
        
        setError(null)
      } catch (err) {
        console.error('Error fetching commitment details:', err)
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommitmentDetails()
  }, [commitmentIds])

  return { 
    commitments, 
    isLoading: isLoadingIds || isLoading, 
    error,
    hasCommitments: commitments.length > 0,
  }
}

// Helper hook to get a single commitment's details
export function useCommitmentDetails(commitmentId?: number) {
  const { data, isLoading } = useReadContract({
    ...CONTRACTS.tithe,
    functionName: 'getCommitment',
    args: commitmentId !== undefined ? [BigInt(commitmentId)] : undefined,
    query: {
      enabled: commitmentId !== undefined,
    },
  })

  if (!data) return { commitment: null, isLoading }

  // Parse the commitment data structure
  // This will depend on your exact contract return structure
  const commitment = {
    id: commitmentId!,
    // organizationAddress: data[0],
    // amount: data[1].toString(),
    // ... map other fields
  }

  return { commitment, isLoading }
}

