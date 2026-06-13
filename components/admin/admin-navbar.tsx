'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

interface AdminNavbarProps {
    children: React.ReactNode
    onMobileMenuToggle: (open: boolean) => void
    isMobileMenuOpen: boolean
}

export function AdminNavbar({ children, onMobileMenuToggle, isMobileMenuOpen }: AdminNavbarProps) {
    return (
        <div className="flex items-center justify-between border-b border-white/10 bg-black/70 px-6 py-4 shadow-sm backdrop-blur-xl lg:px-6">
            <div className="flex items-center gap-4 flex-wrap">
                {/* Mobile menu button */}
                <div className={`lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onMobileMenuToggle(!isMobileMenuOpen)}
                        className="bg-black/70 border border-white/10 text-white backdrop-blur-sm hover:bg-white/10"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
                {children}
            </div>
        </div>
    )
}
