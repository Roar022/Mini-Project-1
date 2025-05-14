import React from "react"

import { Metadata } from "next"

import { Toaster } from "sonner"

import { navItems } from "@/data/sample"

import Navbar from "@/components/navbar"
import { Provider } from "@/providers"
import { FloatingNav } from "@/ui/floating-navbar"

import "@/styles/globals.css"

export const metadata: Metadata = {
  title: {
    default: "Synapse",
    template: "Synapse | %s",
  },
  description: "",
  verification: {
    me: "",
    google: "",
    yahoo: "",
  },
}
const links: { label: string; href: string }[] = [
  {
    label: "Home",
    href: "/dashboard",
  },
  {
    label: "About Us",
    href: "/about",
  },
  {
    label: "IDE",
    href: "/ide",
  },
]

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="en">
      <body className="min-h-screen bg-secondary px-2.5 font-satoshi text-light-0 sm:px-5">
        <Provider>
          <Toaster
            position="top-center"
            invert
          />
          <FloatingNav navItems={navItems} />
          <Navbar
            links={links}
            logoText="Synapse"
            textColor="white"
          />
          <>{children}</>
        </Provider>
      </body>
    </html>
  )
}

export default RootLayout
