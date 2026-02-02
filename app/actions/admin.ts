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

    return { success: false, message: 'Invalid password.' }
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
        return { success: false, message: 'Failed to delete.' }
    }

    revalidatePath('/admin')
    return { success: true, message: 'Deleted successfully.' }
}

export async function createRegistration(data: {
    full_name: string
    email: string
    phone_number?: string
    motivation?: string
    formation_id: string
}) {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
        .from('registrations')
        .insert({
            full_name: data.full_name,
            email: data.email,
            phone_number: data.phone_number,
            motivation: data.motivation,
            formation_id: data.formation_id,
        })

    if (error) {
        console.error('Error creating registration:', error)
        return { success: false, message: 'Failed to create.' }
    }

    revalidatePath('/admin')
    return { success: true, message: 'Added successfully!' }
}

export async function updateRegistration(
    id: string,
    data: {
        full_name?: string
        email?: string
        phone_number?: string
        motivation?: string
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
        return { success: false, message: 'Failed to update.' }
    }

    revalidatePath('/admin')
    return { success: true, message: 'Updated successfully!' }
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

// ==========================================
// FORMATIONS MANAGEMENT
// ==========================================

export async function getFormations() {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
        .from('formations')
        .select(`
            *,
            category:formations_category(id, name)
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching formations:', error)
        return []
    }

    return data
}

export async function createFormation(data: {
    title: string
    description: string
    date: string
    price: string
    image_url: string
    category_id: string
}) {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
        .from('formations')
        .insert({
            title: data.title,
            description: data.description,
            date: data.date,
            price: data.price,
            image_url: data.image_url,
            category_id: data.category_id,
        })

    if (error) {
        console.error('Error creating formation:', error)
        return { success: false, message: 'Failed to create formation.' }
    }

    revalidatePath('/admin')
    revalidatePath('/') // Revalidate home page to show new formations
    return { success: true, message: 'Formation added successfully!' }
}

export async function deleteFormation(id: string) {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
        .from('formations')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting formation:', error)
        return { success: false, message: 'Failed to delete formation.' }
    }

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true, message: 'Formation deleted successfully.' }
}

// ==========================================
// CATEGORIES MANAGEMENT
// ==========================================

export async function getCategories() {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
        .from('formations_category')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching categories:', error)
        return []
    }

    return data
}

export async function createCategory(name: string) {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
        .from('formations_category')
        .insert({ name })

    if (error) {
        console.error('Error creating category:', error)
        return { success: false, message: 'Failed to create category.' }
    }

    revalidatePath('/admin')
    return { success: true, message: 'Category added successfully!' }
}

export async function deleteCategory(id: string) {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
        .from('formations_category')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting category:', error)
        return { success: false, message: 'Failed to delete category.' }
    }

    revalidatePath('/admin')
    return { success: true, message: 'Category deleted successfully.' }
}

