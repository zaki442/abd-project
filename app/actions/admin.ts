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
            .select('name, password_hash')

        if (!error && admins && admins.length > 0) {
            // Check if password matches any admin's password_hash
            const matchedAdmin = admins.find(admin => admin.password_hash === password)
            if (matchedAdmin) {
                const cookieStore = await cookies()
                cookieStore.set('admin_authenticated', 'true', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 24, // 1 day
                    path: '/',
                })
                cookieStore.set('admin_name', matchedAdmin.name || 'Admin', {
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
        const cookieStore = await cookies()
        cookieStore.set('admin_authenticated', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        })
        cookieStore.set('admin_name', 'Admin', {
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
    const cookieStore = await cookies()
    cookieStore.delete('admin_authenticated')
    cookieStore.delete('admin_name')
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

export async function createRegistration(data: {
    full_name: string
    email: string
    formation_id: string
}) {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
        .from('registrations')
        .insert({
            full_name: data.full_name,
            email: data.email,
            formation_id: data.formation_id,
        })

    if (error) {
        console.error('Error creating registration:', error)
        return { success: false, message: 'Fchel f creation.' }
    }

    revalidatePath('/admin')
    return { success: true, message: 'Tzad b naja7!' }
}

export async function updateRegistration(
    id: string,
    data: {
        full_name?: string
        email?: string
        formation_id?: string
    }
) {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
        .from('registrations')
        .update(data)
        .eq('id', id)

    if (error) {
        console.error('Error updating registration:', error)
        return { success: false, message: 'Fchel f update.' }
    }

    revalidatePath('/admin')
    return { success: true, message: 'Tbeddel b naja7!' }
}

export async function getStatsByFormation() {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
        .from('registrations')
        .select('formation_id')

    if (error) {
        console.error('Error fetching stats:', error)
        return { total: 0, byFormation: {} }
    }

    const byFormation: Record<string, number> = {}
    data.forEach((reg) => {
        byFormation[reg.formation_id] = (byFormation[reg.formation_id] || 0) + 1
    })

    return {
        total: data.length,
        byFormation,
    }
}
