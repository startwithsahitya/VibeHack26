"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AfterLogin() {
    const router = useRouter()

    async function handleSignOut() {
        await fetch("/auth/signout", { method: "POST" })
        router.push("/login")
        router.refresh()
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-3xl font-bold">After Login Dashboard</h1>
            <Button onClick={handleSignOut} variant="destructive">
                Sign Out
            </Button>
        </div>
    )
}