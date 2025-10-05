import { useState, useEffect } from 'react'
import { useAccount, usePublicClient, useReadContract } from 'wagmi'
import { CONTRACTS } from '@/config/contracts'
import { formatEther } from 'viem'

export interface GivingTransaction {
  id: string
  date: Date
  timestamp: number
  organizationAddress: string
  organizationName: string
  amount: string // in ETH
  amountUSD: number // converted to USD
  txHash: string
  commitmentId: number
  paymentNumber: number
  blockNumber: number
}

// ETH to USD conversion rate (same as other pages)
const ETH_TO_USD = 4608.59

export function useGivingHistory(refetchKey?: number) {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  
  const [transactions, setTransactions] = useState<GivingTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Get commitment IDs for the user (same as My Commitments)
  const { data: commitmentIds, isLoading: isLoadingIds } = useReadContract({
    ...CONTRACTS.tithe,
    functionName: 'getGiverCommitments',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  useEffect(() => {
    async function fetchGivingHistory() {
      if (!address || !publicClient || !commitmentIds) {
        setTransactions([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const ids = commitmentIds as bigint[]
        console.log('Building giving history from commitment IDs:', ids)

        if (ids.length === 0) {
          setTransactions([])
          setIsLoading(false)
          return
        }

        // For each commitment, get its details and create transaction records
        const txPromises = ids.map(async (id) => {
          try {
            const result = await publicClient?.readContract({
              ...CONTRACTS.tithe,
              functionName: 'getCommitment',
              args: [id],
            })

            if (!result) return []

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

            // Fetch organization name from registry
            let orgName: string = organization as string
            try {
              const orgInfo = await publicClient?.readContract({
                ...CONTRACTS.oracle,
                functionName: 'getOrganization',
                args: [organization as `0x${string}`],
              }) as any[]
              
              if (orgInfo && orgInfo.length > 0) {
                orgName = (orgInfo[0] as string) || organization as string
              }
            } catch (err) {
              console.log(`Could not fetch org name for ${organization}`)
            }

            // Create a transaction entry for each payment that was made
            // We can approximate payment dates based on frequency and payment count
            const commitmentTxs: GivingTransaction[] = []
            const count = Number(paymentCount)
            
            if (count > 0) {
              const amountETH = formatEther(amount as bigint)
              const amountUSD = parseFloat(amountETH) * ETH_TO_USD
              const start = Number(startTime)
              const lastPayment = Number(lastPaymentTime)

              // Calculate approximate frequency in seconds
              const frequencyMap: { [key: number]: number } = {
                0: 7 * 24 * 60 * 60,      // WEEKLY
                1: 14 * 24 * 60 * 60,     // BIWEEKLY
                2: 30 * 24 * 60 * 60,     // MONTHLY
                3: 90 * 24 * 60 * 60,     // QUARTERLY
                4: 365 * 24 * 60 * 60,    // YEARLY
              }
              
              const freqSeconds = frequencyMap[Number(frequency)] || 30 * 24 * 60 * 60

              // Create transaction records for each payment
              // Work backwards from last payment
              for (let i = count - 1; i >= 0; i--) {
                const estimatedTimestamp = lastPayment - (i * freqSeconds)
                
                commitmentTxs.push({
                  id: `${id}-${i + 1}`,
                  date: new Date(estimatedTimestamp * 1000),
                  timestamp: estimatedTimestamp,
                  organizationAddress: organization as string,
                  organizationName: orgName,
                  amount: amountETH,
                  amountUSD,
                  txHash: `0x${id.toString(16).padStart(64, '0')}`, // Pseudo hash from commitment ID
                  commitmentId: Number(id),
                  paymentNumber: i + 1,
                  blockNumber: 0, // Not available from commitment data
                })
              }
            }

            return commitmentTxs
          } catch (err) {
            console.error(`Error processing commitment ${id}:`, err)
            return []
          }
        })

        const allTxArrays = await Promise.all(txPromises)
        const allTransactions = allTxArrays.flat()
        const sortedTransactions = allTransactions.sort((a, b) => b.timestamp - a.timestamp)

        console.log('Built giving history:', sortedTransactions)
        setTransactions(sortedTransactions)
        setError(null)
      } catch (err) {
        console.error('Error fetching giving history:', err)
        setError(err as Error)
        setTransactions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchGivingHistory()
  }, [address, publicClient, commitmentIds, refetchKey])

  return {
    transactions,
    isLoading: isLoadingIds || isLoading,
    error,
    hasTransactions: transactions.length > 0,
  }
}
