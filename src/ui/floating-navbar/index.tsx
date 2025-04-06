"use client"

import React, { useState } from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { ConnectKitButton } from "connectkit"
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion"

import { Chads } from "@/components"
import { cn } from "@/lib/utils"

export const FloatingNav = ({
  navItems,
  className,
  stagnant = false,
}: {
  navItems: {
    name: string
    link: string
    icon?: JSX.Element
  }[]
  stagnant?: boolean
  className?: string
}) => {
  const pathname = usePathname()
  const { scrollYProgress } = useScroll()

  const [visible, setVisible] = useState(true)
  const [width, setWidth] = useState("80%")

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (!stagnant) {
      if (typeof current === "number") {
        setWidth((prev) => {
          const crr = current < 0.005 ? "80%" : "max(min-content, 25%)"
          if (prev !== crr) {
            return crr
          }
          return prev
        })

        const direction = current! - scrollYProgress.getPrevious()!

        if (current < 0.005) {
          setVisible(true)
        } else {
          if (direction < 0) {
            setVisible(true)
          } else {
            setVisible(false)
          }
        }
      }
    }
  })

  // Disable in pages
  const disabledPaths = ["/dashboard"].some((path) => path === pathname)
  if (disabledPaths) {
    return <></>
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: stagnant ? 0 : -100,
          width: stagnant ? "100%" : "80%",
        }}
        animate={{
          y: stagnant ? 0 : visible ? 0 : -100,
          opacity: stagnant ? 1 : visible ? 1 : 0,
          width: stagnant ? "100%" : width,
        }}
        transition={{
          duration: 0.5,
        }}
        className={cn(
          "fixed inset-x-0 top-10 z-[500] mx-auto flex max-w-[80%] items-center justify-between space-x-4 rounded-full border border-transparent py-2 pl-8 pr-2 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] backdrop-blur-lg dark:border-white/[0.2]",
          className
        )}
      >
        <div className="center gap-2.5">
          {navItems.map((navItem, idx) => (
            <Link
              key={`link=${idx}`}
              href={navItem.link}
              className={cn(
                "relative flex items-center space-x-1 text-neutral-600 hover:text-neutral-500 dark:text-neutral-50 dark:hover:text-neutral-300"
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden text-sm sm:block">{navItem.name}</span>
            </Link>
          ))}
        </div>

        {/* Login */}
        <ConnectKitButton.Custom>
          {({ isConnected, show, address }) => {
            return !isConnected ? (
              <button
                onClick={show}
                className="relative rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-black transition-colors duration-200 hover:bg-neutral-100 dark:border-white/[0.2] dark:text-white dark:hover:bg-neutral-800"
              >
                <span>Login</span>
                <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              </button>
            ) : (
              <div
                onClick={show}
                className="center cursor-pointer gap-2.5"
              >
                {address ? (
                  <Chads
                    className="h-8 w-8 min-w-[32px] rounded-full"
                    seed={address}
                  />
                ) : (
                  <Chads seed={"guest"} />
                )}
              </div>
            )
          }}
        </ConnectKitButton.Custom>
      </motion.div>
    </AnimatePresence>
  )
}
