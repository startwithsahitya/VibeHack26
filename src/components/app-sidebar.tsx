"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { LayoutBottomIcon, AudioWave01Icon, CommandIcon, ComputerTerminalIcon, RoboticIcon, BookOpen02Icon, Settings05Icon, CropIcon, PieChartIcon, MapsIcon } from "@hugeicons/core-free-icons"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "InsightLoop",
      logo: (
        <HugeiconsIcon icon={LayoutBottomIcon} strokeWidth={2} />
      ),
      
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: (
        <HugeiconsIcon icon={ComputerTerminalIcon} strokeWidth={2} />
      ),
      isActive: true,

    },
    
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: (
        <HugeiconsIcon icon={CropIcon} strokeWidth={2} />
      ),
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: (
        <HugeiconsIcon icon={PieChartIcon} strokeWidth={2} />
      ),
    },
    {
      name: "Travel",
      url: "#",
      icon: (
        <HugeiconsIcon icon={MapsIcon} strokeWidth={2} />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = React.useState(data.user)

  React.useEffect(() => {
    const fetchUser = async () => {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserData({
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "User",
          email: user.email || "",
          avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || "/avatars/shadcn.jpg",
        })
      }
    }
    fetchUser()
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
