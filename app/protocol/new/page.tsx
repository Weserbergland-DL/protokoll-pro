'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// This standalone protocol creation flow is replaced by the tenancy-based flow.
// Protocols are now created from the tenancy page (tenancy/[id]).
export default function NewProtocolRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard')
  }, [])
  return null
}
