"use client"

import { LoginVisuals } from "@/components/login-visuals"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="relative grid min-h-screen w-full md:grid-cols-2">
      <div className="absolute right-6 top-6 z-10 md:right-8 md:top-8">
      </div>
      <div className="relative flex flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="absolute left-6 top-6 flex items-center gap-2 md:left-10 md:top-10">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md overflow-hidden">
              <img
                src="/aiautoflows.svg"
                alt="aiautoflows logo"
                className="dark:invert-0 invert w-full h-full object-contain"
              />
            </div>
          </a>
        </div>
        <div className="absolute top-6 left-1/2 -translate-x-1/2 md:top-10">
          <a href="#" className="flex items-center gap-2 font-medium">
            <span className="text-2xl font-bold">VibeHack'26</span>
          </a>
        </div>
        <div className="flex w-full max-w-sm flex-col gap-6">
          <LoginForm />
        </div>
      </div>
      <LoginVisuals />
    </div>
  )
}
