"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Archive, Inbox, Send, SquarePen, Star, Trash2 } from "lucide-react"

import { useCompose } from "@/components/mail/compose"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import type { Folder } from "@/lib/mail/queries"

const NAV: { folder: Folder; title: string; icon: typeof Inbox }[] = [
  { folder: "inbox", title: "Inbox", icon: Inbox },
  { folder: "starred", title: "Starred", icon: Star },
  { folder: "sent", title: "Sent", icon: Send },
  { folder: "archive", title: "Archive", icon: Archive },
  { folder: "trash", title: "Trash", icon: Trash2 },
]

export function AppSidebar({ email, unread }: { email: string; unread: number }) {
  const active = usePathname().split("/")[1]
  const { setOpenMobile } = useSidebar()
  const openCompose = useCompose()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Compose"
              onClick={() => {
                setOpenMobile(false)
                openCompose()
              }}
              className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
            >
              <SquarePen />
              <span>Compose</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => (
                <SidebarMenuItem key={item.folder}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={active === item.folder}
                  >
                    <Link
                      href={`/${item.folder}`}
                      onClick={() => setOpenMobile(false)}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.folder === "inbox" && unread > 0 && (
                    <SidebarMenuBadge>{unread}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser email={email} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
