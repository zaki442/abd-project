'use client'

import { AdminDialog } from './admin-dialog'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

interface Admin {
    id: string
    name: string
    email: string
    created_at: string
}

interface AdminProfileButtonProps {
    admin: Admin
}

export function AdminProfileButton({ admin }: AdminProfileButtonProps) {
    const t = useTranslations('Admin')
    const router = useRouter()

    return (
        <AdminDialog
            mode="edit"
            admin={admin}
            onSuccess={() => {
                router.refresh()
            }}
        >
            <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>{t('editProfile')}</span>
            </Button>
        </AdminDialog>
    )
}
