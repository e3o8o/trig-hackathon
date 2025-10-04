import { useState, useEffect } from 'react'
import { useReadContract, usePublicClient } from 'wagmi'
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
  const publicClient = usePublicClient()

  // Get organization count
  const { data: orgCount } = useReadContract({
    ...CONTRACTS.oracle,
    functionName: 'getOrganizationCount',
  })

  useEffect(() => {
    async function fetchOrganizations() {
      if (!publicClient || !orgCount) return
      
      try {
        setIsLoading(true)
        const count = Number(orgCount)
        const orgs: Organization[] = []
        
        // Loop through all organizations
        for (let i = 0; i < count; i++) {
          try {
            // Get organization address from list
            const orgAddress = await publicClient.readContract({
              address: CONTRACTS.oracle.address as `0x${string}`,
              abi: CONTRACTS.oracle.abi,
              functionName: 'organizationList',
              args: [BigInt(i)],
            }) as `0x${string}`
            
            // Get full organization info
            const orgInfo = await publicClient.readContract({
              address: CONTRACTS.oracle.address as `0x${string}`,
              abi: CONTRACTS.oracle.abi,
              functionName: 'getOrganization',
              args: [orgAddress],
            }) as any[]
            
            // Parse organization data
            const org: Organization = {
              address: orgAddress,
              name: orgInfo[0] as string,
              description: orgInfo[1] as string,
              website: orgInfo[2] as string,
              verified: Number(orgInfo[4]) === 1, // status === VERIFIED
              stakeAmount: (Number(orgInfo[5]) / 1e18).toFixed(5),
            }
            
            // Only include verified organizations for tithe creation
            if (org.verified) {
              orgs.push(org)
            }
          } catch (err) {
            console.error(`Error loading organization ${i}:`, err)
          }
        }
        
        setOrganizations(orgs)
        setError(null)
      } catch (err) {
        console.error('Error fetching organizations:', err)
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrganizations()
  }, [publicClient, orgCount])

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

