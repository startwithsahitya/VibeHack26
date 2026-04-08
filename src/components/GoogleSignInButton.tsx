"use client"

import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function GoogleSignInButton({ redirectTo }: { redirectTo: string }) {
  async function handleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: { access_type: 'offline', prompt: 'consent' }
      }
    })
    if (error) {
      alert(error.message)
    }
  }

  return (
    <Button variant="outline" type="button" onClick={handleSignIn} className="w-full">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20c11.045 0 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        />
        <path
          fill="#FF3D00"
          d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.234 0-13.436 3.926-16.711 9.753"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.213 0-9.645-3.328-11.291-7.965l-6.603 4.869C9.507 38.687 16.275 44 24 44"
        />
        <path
          fill="#1976D2"
          d="M43.611 20.083L43.595 20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l6.19 5.238C41.7 34.69 44 29.623 44 24c0-1.341-.138-2.65-.389-3.917z"
        />
      </svg>
      Login with Google
    </Button>
  )
}
