"use client"

import { useEffect, useRef } from "react"
import { useAprimo } from "@/context/aprimo-context"
import { generatePKCE, buildAuthorizationUrl } from "@/lib/pkce"

const ENV_ENVIRONMENT = process.env.NEXT_PUBLIC_APRIMO_ENVIRONMENT ?? ""
const ENV_CLIENT_ID = process.env.NEXT_PUBLIC_APRIMO_CLIENT_ID ?? ""

export function AprimoAuthInit() {
  const { isConnected } = useAprimo()
  const hasAttempted = useRef(false)

  useEffect(() => {
    if (isConnected) return
    if (window.location.pathname.startsWith("/oauth")) return
    if (hasAttempted.current) return
    hasAttempted.current = true

    generatePKCE().then(({ codeVerifier, codeChallenge }) => {
      const redirectUri = `${window.location.origin}/oauth/callback`
      sessionStorage.setItem("pkce_code_verifier", codeVerifier)
      sessionStorage.setItem("pkce_return_url", window.location.href)
      window.location.href = buildAuthorizationUrl(ENV_ENVIRONMENT, ENV_CLIENT_ID, codeChallenge, redirectUri)
    })
  }, [isConnected])

  return null
}
