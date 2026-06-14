"use client"

import { useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "./language-switcher"
import { Link } from "@/i18n/routing"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations("Navbar")

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/#team", label: t("team") },
    { href: "/formations", label: t("formations") },
    { href: "/donate", label: t("donate") },
    { href: "/#about", label: t("about") },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A3761]/90 backdrop-blur-lg border-b border-[#C7C0B6]/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <Link href="/" className="relative w-72 h-20 me-2 overflow-hidden block">
              <Image
                src="/logo.png"
                alt="Agile B Darija Logo"
                fill
                className="object-contain scale-[2.5]"
                priority
              />
            </Link>

          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-2 py-1.5 text-[#EAE6DF] hover:bg-white/10 hover:text-white transition-all duration-200 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-md px-2 py-1.5 text-[#EAE6DF] hover:bg-white/10 hover:text-white transition-all duration-200 text-sm font-medium flex items-center outline-none">
                {t("others")} <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#F5F2EC] border-[#C7C0B6]/80 shadow-xl">
                <DropdownMenuItem asChild>
                  <Link href="/jobs" className="w-full cursor-pointer rounded-md px-2 py-1.5 text-[#173A64] hover:bg-[#1A3761]/10 hover:text-[#0F172A] focus:bg-[#1A3761]/10 focus:text-[#0F172A]">
                    {t("jobs")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/feedbacks" className="w-full cursor-pointer rounded-md px-2 py-1.5 text-[#173A64] hover:bg-[#1A3761]/10 hover:text-[#0F172A] focus:bg-[#1A3761]/10 focus:text-[#0F172A]">
                    {t("feedbacks")}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <LanguageSwitcher />

          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <LanguageSwitcher />
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-foreground" aria-label="Toggle menu">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-[#C7C0B6]/30">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-md px-2 py-1.5 text-[#EAE6DF] hover:bg-white/10 hover:text-white transition-all duration-200 text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}

              <div className="h-px bg-[#C7C0B6]/30 my-2" />
              <div className="text-xs font-semibold text-[#C7C0B6] uppercase tracking-wider">
                {t("others")}
              </div>
              <Link
                href="/jobs"
                onClick={() => setIsOpen(false)}
                className="rounded-md px-2 py-1.5 text-[#EAE6DF] hover:bg-white/10 hover:text-white transition-all duration-200 text-sm font-medium pl-2"
              >
                {t("jobs")}
              </Link>
              <Link
                href="/feedbacks"
                onClick={() => setIsOpen(false)}
                className="rounded-md px-2 py-1.5 text-[#EAE6DF] hover:bg-white/10 hover:text-white transition-all duration-200 text-sm font-medium pl-2"
              >
                {t("feedbacks")}
              </Link>

            </div>
          </div>
        )}
      </div>
    </nav>
  )
}


