"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { GoogleSignInButton } from "@/components/GoogleSignInButton"
import { createClient } from "@/lib/supabase/client"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // ── Email/password login (admin) ─────────────────────────────────────────
  async function handleEmailLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    // Redirect to dashboard on success
    router.push("/")
    router.refresh()
  }

  // ── 2FA view: only shown for admin role ──────────────────────────────────


  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleEmailLogin}
      {...props}
    >
      <FieldGroup className="relative">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
        </Field>
        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Login"}
          </Button>
        </Field>

        <>
          <FieldSeparator>Or continue with</FieldSeparator>
          <Field>
            <GoogleSignInButton
              redirectTo={`${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`}
            />
          </Field>
        </>
        <Field>
          <FieldDescription className="text-center mt-2">
            Forget Password ?{" "}
            <a href="#" className="underline underline-offset-4">
               Contact Support
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}

