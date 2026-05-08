"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAprimo } from "@/context/aprimo-context"
import { exchangeCodeForToken } from "@/lib/pkce"

const ENV_ENVIRONMENT = process.env.NEXT_PUBLIC_APRIMO_ENVIRONMENT ?? ""
const ENV_CLIENT_ID = process.env.NEXT_PUBLIC_APRIMO_CLIENT_ID ?? ""
const ENV_CLIENT_SECRET = process.env.NEXT_PUBLIC_APRIMO_CLIENT_SECRET ?? undefined

function OAuthCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setConnection } = useAprimo()

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code")
      const errorParam = searchParams.get("error")
      const returnUrl = sessionStorage.getItem("pkce_return_url") ?? "/"

      if (errorParam) {
        toast.error(`Authorization denied: ${errorParam}`)
        router.push(returnUrl)
        return
      }

      if (!code) {
        toast.error("No authorization code received")
        router.push(returnUrl)
        return
      }

      const codeVerifier = sessionStorage.getItem("pkce_code_verifier")

      if (!codeVerifier) {
        toast.error("Missing session data — please try again")
        router.push(returnUrl)
        return
      }

      try {
        const redirectUri = `${window.location.origin}/oauth/callback`
        const data = await exchangeCodeForToken(ENV_ENVIRONMENT, ENV_CLIENT_ID, code, codeVerifier, redirectUri, ENV_CLIENT_SECRET)

        setConnection({
          accessToken: data.access_token,
          tokenType: data.token_type,
          expiresAt: Date.now() + data.expires_in * 1000,
          environment: ENV_ENVIRONMENT,
        })

        sessionStorage.removeItem("pkce_code_verifier")
        sessionStorage.removeItem("pkce_return_url")

        toast.success("Connected!")
        router.push(returnUrl)
      } catch (err) {
        console.error("Token exchange error:", err)
        toast.error("Authentication failed — please check your credentials")
        router.push(returnUrl)
      }
    }

    handleCallback()
  }, [searchParams, setConnection, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}

export default function OAuthCallbackPage() {
  return (
    <Suspense>
      <OAuthCallbackContent />
    </Suspense>
  )
}
