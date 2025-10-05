import { useState, useEffect } from 'react'
import { useReadContract, useAccount, usePublicClient } from 'wagmi'
import { CONTRACTS, FREQUENCY_LABELS } from '@/config/contracts'
import { formatEther } from 'viem'

interface OrganizationInfo {
  name: string
  description: string
  website: string
}

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

const STATUS_LABELS = ['active', 'paused', 'cancelled', 'completed']

export function useUserCommitments() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
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
      if (!commitmentIds || (Array.isArray(commitmentIds) && commitmentIds.length === 0)) {
        setCommitments([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        
        const ids = commitmentIds as bigint[]
        console.log('Fetching details for commitment IDs:', ids)
        
        if (ids.length === 0) {
          setCommitments([])
          setIsLoading(false)
          return
        }

        // Fetch details for each commitment
        const commitmentPromises = ids.map(async (id) => {
          try {
            const result = await publicClient?.readContract({
              ...CONTRACTS.tithe,
              functionName: 'getCommitment',
              args: [id],
            })

            if (!result) return null

            // Parse the tuple returned by getCommitment
            const [
              giver,
              organization,
              amount,
              token,
              frequency,
              startTime,
              endTime,
              lastPaymentTime,
              totalPaid,
              paymentCount,
              status
            ] = result as any[]

            // Fetch organization details from oracle registry
            let orgName = organization as string
            let orgDescription = ''
            
            try {
              const orgInfo = await publicClient?.readContract({
                ...CONTRACTS.oracle,
                functionName: 'getOrganization',
                args: [organization as `0x${string}`],
              }) as any[]
              
              if (orgInfo && orgInfo.length > 0) {
                orgName = orgInfo[0] as string || organization as string
                orgDescription = orgInfo[1] as string || ''
              }
            } catch (err) {
              console.log(`Could not fetch org details for ${organization}, using address`)
            }

            const commitmentData: Commitment = {
              id: Number(id),
              organizationAddress: organization as string,
              organizationName: orgName,
              amount: formatEther(amount as bigint),
              token: token as string,
              frequency: Number(frequency),
              frequencyLabel: FREQUENCY_LABELS[Number(frequency) as keyof typeof FREQUENCY_LABELS] || 'Unknown',
              status: Number(status),
              statusLabel: STATUS_LABELS[Number(status)] || 'unknown',
              createdAt: Number(startTime),
              lastPayment: Number(lastPaymentTime),
              nextPayment: 0, // TODO: Calculate based on frequency
              endTime: Number(endTime),
              totalPaid: formatEther(totalPaid as bigint),
              paymentsCount: Number(paymentCount),
            }

            return commitmentData
          } catch (err) {
            console.error(`Error fetching commitment ${id}:`, err)
            return null
          }
        })

        const fetchedCommitments = await Promise.all(commitmentPromises)
        const validCommitments = fetchedCommitments.filter((c): c is Commitment => c !== null)
        
        console.log('Fetched commitments:', validCommitments)
        setCommitments(validCommitments)
        setError(null)
      } catch (err) {
        console.error('Error fetching commitment details:', err)
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommitmentDetails()
  }, [commitmentIds, publicClient])

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

