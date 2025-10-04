import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { CONTRACTS } from '@/config/contracts'

export interface Organization {
  address: string
  name: string
  description: string
  website: string
  verified: boolean
  stakeAmount: string
}

export function useVerifiedOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // For demo purposes, we'll use the event indexer data
  // In production, you'd query the blockchain directly or use an API
  useEffect(() => {
    async function fetchOrganizations() {
      try {
        setIsLoading(true)
        
        // For now, check if any organizations exist by querying a known address
        // In a full implementation, you'd:
        // 1. Use the event indexer API to get all OrganizationRegistered events
        // 2. Query each organization's details
        // 3. Filter for verified organizations only
        
        // Temporary: Return demo organizations for testing
        // These should match any organizations you've registered on Base Sepolia
        const demoOrgs: Organization[] = [
          {
            address: '0xd591Ea697A2530a45133fFD949ffD8C9bE20706b', // Your deployer address
            name: 'Grace Community Church',
            description: 'Dallas, TX | Non-denominational',
            website: 'https://steward.network',
            verified: false, // Will be false until 3 verifiers approve
            stakeAmount: '0.1',
          },
        ]
        
        setOrganizations(demoOrgs)
        setError(null)
      } catch (err) {
        console.error('Error fetching organizations:', err)
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrganizations()
  }, [])

  return { organizations, isLoading, error }
}

// Helper hook to check if an organization is verified
export function useIsOrganizationVerified(organizationAddress?: string) {
  const { data: isVerified, isLoading } = useReadContract({
    ...CONTRACTS.oracle,
    functionName: 'isOrganizationVerified',
    args: organizationAddress ? [organizationAddress] : undefined,
    query: {
      enabled: !!organizationAddress,
    },
  })

  return { isVerified: !!isVerified, isLoading }
}

