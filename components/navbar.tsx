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
    { href: "/about", label: t("about") },
    { href: "/formations", label: t("formations") },
    { href: "/blogs", label: t("blog") },
    { href: "/#team", label: t("team") },
  ]

  const moreLinks = [
    { href: "/activities", label: t("activities") },
    { href: "/jobs", label: t("jobs") },
    { href: "/feedbacks", label: t("feedbacks") },
    { href: "/faq", label: t("faq") },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A3761]/90 backdrop-blur-lg border-b border-[#C7C0B6]/40 shadow-lg">
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
          <div className="hidden md:flex items-center gap-6">
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
                {t("more")} <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#1A3761]/95 backdrop-blur-lg border-[#C7C0B6]/40 shadow-xl">
                {moreLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild className="focus:bg-white/10">
                    <Link href={link.href} className="w-full cursor-pointer rounded-md px-2 py-1.5 text-[#EAE6DF] hover:bg-white/10 hover:text-white transition-all duration-200">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/donate"
              className="rounded-md px-5 py-2 text-sm font-semibold bg-[#C7C0B6] text-[#1A3761] hover:bg-white hover:text-[#1A3761] transition-all duration-200 shadow-md"
            >
              {t("donate")}
            </Link>

            <LanguageSwitcher />

          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <Link
              href="/donate"
              className="rounded-md px-4 py-1.5 text-xs font-semibold bg-[#C7C0B6] text-[#1A3761] hover:bg-white transition-all duration-200"
            >
              {t("donate")}
            </Link>
            <LanguageSwitcher />
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-foreground" aria-label="Toggle menu">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-[#C7C0B6]/40">
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

              <div className="h-px bg-[#C7C0B6]/40 my-2" />
              <div className="text-xs font-semibold text-[#C7C0B6] uppercase tracking-wider">
                {t("more")}
              </div>
              {moreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-md px-2 py-1.5 text-[#EAE6DF] hover:bg-white/10 hover:text-white transition-all duration-200 text-sm font-medium pl-2"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
