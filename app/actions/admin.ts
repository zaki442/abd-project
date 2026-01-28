'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

// Fallback password from environment (for initial setup before admins table is populated)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function verifyAdminPassword(password: string) {
    // First, try to verify against the admins table
    try {
        const supabase = await createServerSupabaseClient()
        const { data: admins, error } = await supabase
            .from('admins')
            .select('password_hash')

        if (!error && admins && admins.length > 0) {
            // Check if password matches any admin's password_hash
            const isValid = admins.some(admin => admin.password_hash === password)
            if (isValid) {
                (await cookies()).set('admin_authenticated', 'true', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 24, // 1 day
                    path: '/',
                })
                return { success: true }
            }
        }
    } catch (e) {
        console.error('Error checking admins table:', e)
    }

    // Fallback to environment variable password
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
    const supabase = await createServerSupabaseClient()

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
    const supabase = await createServerSupabaseClient()

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

