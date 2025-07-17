"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { IconListDetails } from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main/nav-main-user"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"

type DecodedToken = {
  email: string
  role: "ADMIN" | "DONOR"
  donor?: {
    name: string
  }
}

const navItemsUser = [
  {
    title: "Agendamentos",
    url: "#agendamentos",
    icon: IconListDetails,
  },
]

export function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  const [userInfo, setUserInfo] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  })

  useEffect(() => {
    const token = Cookies.get("token")
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token)

        const name =
          decoded.role === "ADMIN"
            ? "Administrador"
            : decoded.donor?.name || "Usuário"

        setUserInfo({
          name,
          email: decoded.email,
        })
      } catch (error) {
        console.error("Erro ao decodificar token JWT:", error)
        setUserInfo({ name: "Usuário", email: "" })
      }
    }
  }, [])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#" onClick={(e) => e.preventDefault()}>
                <span className="text-base font-semibold">EBMS</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItemsUser} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: userInfo.name,
            email: userInfo.email,
            avatar: "/avatars/default.jpg",
            role: "DONOR"
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}