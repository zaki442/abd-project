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
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-6 py-4 lg:px-6">
            <div className="flex items-center gap-4 flex-wrap">
                {/* Mobile menu button */}
                <div className={`lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onMobileMenuToggle(!isMobileMenuOpen)}
                        className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 hover:bg-zinc-800"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
                {children}
            </div>
        </div>
    )
}
