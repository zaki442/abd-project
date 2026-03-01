'use server'

import { createServerSupabaseClient, createServerSupabaseAdminClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

// Retry utility for failed requests
async function retry<T>(fn: () => Promise<T>, maxRetries: number = 3, delay: number = 1000): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn()
        } catch (error) {
            console.warn(`Attempt ${i + 1} failed:`, error)
            if (i === maxRetries - 1) throw error
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
        }
    }
    throw new Error('Max retries exceeded')
}

// Fallback password from environment (for initial setup before admins table is populated)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function verifyAdminLogin(name: string, password: string) {
    console.log(`Login attempt for: ${name}`)
    // First, try to verify against the admins table
    try {
        const supabase = await createServerSupabaseClient()
        const { data: admin, error } = await supabase
            .from('admins')
            .select('id, name, password_hash')
            .eq('name', name)
            .single()

        if (!error && admin) {
            const isMatch = await bcrypt.compare(password, admin.password_hash)
            if (isMatch) {
                const cookieStore = await cookies()
                cookieStore.set('admin_authenticated', 'true', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 24, // 1 day
                    path: '/',
                })
                cookieStore.set('admin_name', admin.name || 'Admin', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 24, // 1 day
                    path: '/',
                })
                cookieStore.set('admin_id', admin.id, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 24, // 1 day
                    path: '/',
                })
                console.log(`Login successful for: ${name}`)
                return { success: true }
            }
        }
    } catch (e) {
        console.error('Error checking admins table during login:', e)
    }

    // Fallback to environment variable password for System Admin
    if (name === 'System Admin' && password === ADMIN_PASSWORD) {
        const cookieStore = await cookies()
        cookieStore.set('admin_authenticated', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        })
        cookieStore.set('admin_name', 'System Admin', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        })
        cookieStore.set('admin_id', 'system-admin-id', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        })
        console.log(`Login successful for: System Admin (Fallback)`)
        return { success: true }
    }

    console.log(`Login failed for: ${name}`)
    return { success: false, message: 'Invalid name or password.' }
}

export async function getAdmins(page: number = 1, pageSize: number = 50) {
    console.log('Fetching admins...')
    return retry(async () => {
        const supabase = await createServerSupabaseClient()
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        const { data, error, count } = await supabase
            .from('admins')
            .select('id, name, email, created_at', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to)

        if (error) {
            console.error('Error fetching admins:', error)
            return { data: [], count: 0, page, pageSize, totalPages: 0 }
        }
        
        const totalPages = Math.ceil((count || 0) / pageSize)
        console.log(`Successfully fetched ${data?.length || 0} admins.`)
        return { data: data || [], count: count || 0, page, pageSize, totalPages }
    })
}

export async function createAdmin(name: string, email: string, password: string) {
    console.log(`Attempting to create admin: ${name} (${email})`)
    const supabase = await createServerSupabaseClient()
    const password_hash = await bcrypt.hash(password, 10)

    const { error } = await supabase
        .from('admins')
        .insert({ name, email, password_hash })

    if (error) {
        console.error('Error creating admin result:', JSON.stringify(error, null, 2))
        return { success: false, message: `Failed to create admin: ${error.message}` }
    }

    console.log('Admin created successfully in database.')
    revalidatePath('/admin')
    return { success: true, message: 'Admin created successfully!' }
}

export async function updateAdmin(id: string, name: string, email: string, password?: string) {
    console.log(`Attempting to update admin ID: ${id}`)

    // Protection: don't allow renaming someone to 'admin' or 'System Admin'
    // unless they already have that name (or it's a super-admin updating)
    const normalizedName = name.toLowerCase().trim()
    if (normalizedName === 'admin' || normalizedName === 'system admin') {
        const cookieStore = await cookies()
        const currentAdminName = cookieStore.get('admin_name')?.value
        if (currentAdminName !== 'admin' && currentAdminName !== 'System Admin') {
            return { success: false, message: 'Reserved name. Cannot use this name.' }
        }
    }

    const supabase = await createServerSupabaseClient()

    // Check if we are updating a super-admin
    const { data: targetAdmin } = await supabase
        .from('admins')
        .select('name')
        .eq('id', id)
        .single()

    if (targetAdmin) {
        if (targetAdmin.name === 'admin' || targetAdmin.name === 'System Admin') {
            // If target is super-admin, name must remain the same
            if (name !== targetAdmin.name) {
                return { success: false, message: 'Cannot change the name of the primary super-admin.' }
            }
        }
    }

    const updateData: any = { name, email }

    if (password && password.trim() !== '') {
        updateData.password_hash = await bcrypt.hash(password, 10)
    }

    const { error } = await supabase
        .from('admins')
        .update(updateData)
        .eq('id', id)

    if (error) {
        console.error('Error updating admin:', JSON.stringify(error, null, 2))
        return { success: false, message: `Failed to update admin: ${error.message}` }
    }

    console.log('Admin updated successfully in database.')
    revalidatePath('/admin')

    // Update cookie if updating self
    const cookieStore = await cookies()
    if (cookieStore.get('admin_id')?.value === id) {
        cookieStore.set('admin_name', name, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        })
    }

    return { success: true, message: 'Profile updated successfully!' }
}

export async function deleteAdmin(id: string) {
    console.log(`Attempting to delete admin ID: ${id}`)
    const supabase = await createServerSupabaseAdminClient()

    // 1. Protection: Check if this is a primary admin
    const { data: adminToDelete, error: fetchError } = await supabase
        .from('admins')
        .select('name')
        .eq('id', id)
        .single()

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching admin to delete:', fetchError)
        return { success: false, message: 'Failed to verify admin account.' }
    }

    if (adminToDelete) {
        if (adminToDelete.name === 'admin' || adminToDelete.name === 'System Admin') {
            return { success: false, message: 'Cannot delete primary super-admin accounts.' }
        }
    }

    // 2. Perform deletion
    const { error: deleteError } = await supabase
        .from('admins')
        .delete()
        .eq('id', id)

    if (deleteError) {
        console.error('Error deleting admin:', JSON.stringify(deleteError, null, 2))
        return { success: false, message: `Failed to delete admin: ${deleteError.message}` }
    }

    console.log('Admin deleted successfully from database.')

    // 3. Handle self-deletion: logout if the deleted admin is the current user
    const cookieStore = await cookies()
    const currentAdminId = cookieStore.get('admin_id')?.value

    if (currentAdminId === id) {
        console.log('Admin deleted their own account. Logging out...')
        cookieStore.delete('admin_authenticated')
        cookieStore.delete('admin_name')
        cookieStore.delete('admin_id')
        return { success: true, message: 'Your account was deleted and you have been logged out.', redirected: true }
    }

    revalidatePath('/admin')
    return { success: true, message: 'Admin deleted successfully.' }
}

export async function logoutAdmin() {
    const cookieStore = await cookies()
    cookieStore.delete('admin_authenticated')
    cookieStore.delete('admin_name')
    cookieStore.delete('admin_id')
    return { success: true }
}

export async function getCurrentAdmin() {
    const cookieStore = await cookies()
    const id = cookieStore.get('admin_id')?.value
    const name = cookieStore.get('admin_name')?.value

    if (!id) return null

    // For system-admin-id, return a synthetic object
    if (id === 'system-admin-id') {
        return {
            id,
            name: 'System Admin',
            email: 'system@example.com',
            created_at: new Date().toISOString()
        }
    }

    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from('admins')
        .select('id, name, email, created_at')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching current admin:', error)
        return null
    }

    return data
}

export async function getRegistrations(page: number = 1, pageSize: number = 50) {
    return retry(async () => {
        const supabase = await createServerSupabaseClient()
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        const { data, error, count } = await supabase
            .from('registrations')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to)

        if (error) {
            console.error('Error fetching registrations:', error)
            return { data: [], count: 0, page, pageSize, totalPages: 0 }
        }

        const totalPages = Math.ceil((count || 0) / pageSize)
        return { data: data || [], count: count || 0, page, pageSize, totalPages }
    })
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
    where_did_you_hear?: string
    formation_id: string
}) {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
        .from('registrations')
        .insert({
            full_name: data.full_name,
            email: data.email,
            phone_number: data.phone_number,
            where_did_you_hear: data.where_did_you_hear,
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
        where_did_you_hear?: string
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

export async function getStatsByFormation(page: number = 1, pageSize: number = 1000) {
    return retry(async () => {
        const supabase = await createServerSupabaseClient()
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        const { data, error, count } = await supabase
            .from('registrations')
            .select('formation_id', { count: 'exact' })
            .range(from, to)

        if (error) {
            console.error('Error fetching stats:', error)
            return { total: 0, byFormation: {}, page, pageSize, totalPages: 0 }
        }

        const byFormation: Record<string, number> = {}
        data?.forEach((reg) => {
            byFormation[reg.formation_id] = (byFormation[reg.formation_id] || 0) + 1
        })

        const totalPages = Math.ceil((count || 0) / pageSize)
        return {
            total: count || 0,
            byFormation,
            page,
            pageSize,
            totalPages
        }
    })
}

// ==========================================
// FORMATIONS MANAGEMENT
// ==========================================

export async function getFormations(page: number = 1, pageSize: number = 50) {
    return retry(async () => {
        const supabase = await createServerSupabaseClient()
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        const { data, error, count } = await supabase
            .from('formations')
            .select(`
                *,
                categories:formation_category_link(
                    category:formations_category(id, name)
                )
            `, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to)

        if (error) {
            console.error('Error fetching formations:', error)
            return { data: [], count: 0, page, pageSize, totalPages: 0 }
        }

        // Transform data to flat array of categories
        const transformedData = (data || []).map((f: any) => ({
            ...f,
            categories: f.categories.map((c: any) => c.category)
        }))
        
        const totalPages = Math.ceil((count || 0) / pageSize)
        return { data: transformedData, count: count || 0, page, pageSize, totalPages }
    })
}

export async function getFormation(id: string) {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
        .from('formations')
        .select(`
            *,
            categories:formation_category_link(
                category:formations_category(id, name)
            )
        `)
        .eq('id', id)
        .single()

    if (error || !data) {
        return null
    }

    return {
        ...data,
        categories: (data as any).categories?.map((c: any) => c.category) ?? []
    }
}

export async function createFormation(data: {
    title: string
    description: string
    date: string
    price: string
    image_url: string
    category_ids: string[]
}) {
    const supabase = await createServerSupabaseClient()

    // 1. Create Formation
    const { data: formation, error } = await supabase
        .from('formations')
        .insert({
            title: data.title,
            description: data.description,
            date: data.date,
            price: data.price,
            image_url: data.image_url,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating formation:', error)
        return { success: false, message: 'Failed to create formation.' }
    }

    // 2. Link Categories (can be done in parallel with revalidation)
    if (data.category_ids && data.category_ids.length > 0) {
        const links = data.category_ids.map(catId => ({
            formation_id: formation.id,
            category_id: catId
        }))

        const [linkResult] = await Promise.all([
            supabase
                .from('formation_category_link')
                .insert(links),
            // Start revalidation early while linking categories
            Promise.resolve().then(() => {
                revalidatePath('/admin')
                revalidatePath('/')
                revalidatePath('/en/formations')
                revalidatePath('/fr/formations')
                revalidatePath('/ar/formations')
            })
        ])

        if (linkResult.error) {
            console.error('Error linking categories:', linkResult.error)
            return { success: false, message: 'Formation created but failed to link categories.' }
        }
    } else {
        // Revalidate immediately if no categories to link
        revalidatePath('/admin')
        revalidatePath('/')
        revalidatePath('/en/formations')
        revalidatePath('/fr/formations')
        revalidatePath('/ar/formations')
    }

    return { success: true, message: 'Formation added successfully!' }
}

export async function updateFormation(id: string, data: {
    title: string
    description: string
    date: string
    price: string
    image_url: string
    category_ids: string[]
}) {
    const supabase = await createServerSupabaseClient()

    // 1. Update Formation Details and delete existing categories in parallel
    const [updateResult, deleteResult] = await Promise.all([
        supabase
            .from('formations')
            .update({
                title: data.title,
                description: data.description,
                date: data.date,
                price: data.price,
                image_url: data.image_url,
            })
            .eq('id', id),
        supabase
            .from('formation_category_link')
            .delete()
            .eq('formation_id', id)
    ])

    if (updateResult.error) {
        console.error('Error updating formation:', updateResult.error)
        return { success: false, message: 'Failed to update formation.' }
    }

    if (deleteResult.error) {
        console.error('Error deleting old categories:', deleteResult.error)
        return { success: false, message: 'Failed to update categories.' }
    }

    // 2. Insert new categories if any
    if (data.category_ids && data.category_ids.length > 0) {
        const links = data.category_ids.map(catId => ({
            formation_id: id,
            category_id: catId
        }))

        const { error: linkError } = await supabase
            .from('formation_category_link')
            .insert(links)

        if (linkError) {
            console.error('Error linking new categories:', linkError)
            return { success: false, message: 'Failed to link new categories.' }
        }
    }

    revalidatePath('/admin')
    revalidatePath('/')
    revalidatePath('/en/formations')
    revalidatePath('/fr/formations')
    revalidatePath('/ar/formations')
    return { success: true, message: 'Formation updated successfully!' }
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
    revalidatePath('/en/formations')
    revalidatePath('/fr/formations')
    revalidatePath('/ar/formations')
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

export async function updateCategory(id: string, name: string) {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
        .from('formations_category')
        .update({ name })
        .eq('id', id)

    if (error) {
        console.error('Error updating category:', error)
        return { success: false, message: 'Failed to update category.' }
    }

    revalidatePath('/admin')
    return { success: true, message: 'Category updated successfully!' }
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

