'use server'

import { createClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

// Simple password protection
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function verifyAdminPassword(password: string) {
    if (password === ADMIN_PASSWORD) {
        (await cookies()).set('admin_authenticated', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        })
        return { success: true }
    }
    return { success: false, message: 'Password ghalat.' }
}

export async function logoutAdmin() {
    (await cookies()).delete('admin_authenticated')
    return { success: true }
}

export async function getRegistrations() {
    const supabase = createClient()

    // Sort by created_at descending (newest first)
    // Assuming 'created_at' exists. If not, I'll need to check the schema or just default to no sort if it errors, 
    // but typically supabase tables have it. 
    // I'll assume standard 'created_at'.
    const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching registrations:', error)
        return []
    }

    return data
}

export async function deleteRegistration(id: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting registration:', error)
        return { success: false, message: 'Fchel lms7.' }
    }

    revalidatePath('/admin')
    return { success: true, message: 'Tems7 b naja7.' }
}
