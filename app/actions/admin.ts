'use server'

import { createServerSupabaseClient, createServerSupabaseAdminClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

// ==========================================
// CONSTANTS AND TYPES
// ==========================================

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const RESERVED_NAMES = ['admin', 'system admin']
const SUPER_ADMIN_NAMES = ['admin', 'System Admin']

interface PaginatedResponse<T> {
    data: T[]
    count: number
    page: number
    pageSize: number
    totalPages: number
}

interface ApiResponse {
    success: boolean
    message: string
    redirected?: boolean
}

interface Admin {
    id: string
    name: string
    email: string
    created_at: string
}

interface Formation {
    id: string
    title: string
    description: string
    date: string
    price: string
    image_url: string
    status: string
    categories: Array<{ id: string; name: string }>
}

interface Category {
    id: string
    name: string
    created_at: string
}

interface Registration {
    id: string
    full_name: string
    email: string
    phone_number?: string
    where_did_you_hear?: string
    specialite?: string
    ville?: string
    formation_id: string
    created_at: string
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function createSuccessResponse(message: string, redirected = false): ApiResponse {
    return { success: true, message, redirected }
}

function createErrorResponse(message: string): ApiResponse {
    return { success: false, message }
}

function handleSupabaseError(error: any, context: string): string {
    console.error(`${context}:`, error)
    return error?.message || `Failed to ${context.toLowerCase()}`
}

async function setAuthCookies(adminId: string, adminName: string) {
    const cookieStore = await cookies()
    cookieStore.set('admin_authenticated', 'true', COOKIE_OPTIONS)
    cookieStore.set('admin_name', adminName, COOKIE_OPTIONS)
    cookieStore.set('admin_id', adminId, COOKIE_OPTIONS)
}

async function clearAuthCookies() {
    const cookieStore = await cookies()
    cookieStore.delete('admin_authenticated')
    cookieStore.delete('admin_name')
    cookieStore.delete('admin_id')
}

function isReservedName(name: string): boolean {
    return RESERVED_NAMES.includes(name.toLowerCase().trim())
}

function isSuperAdmin(name: string): boolean {
    return SUPER_ADMIN_NAMES.includes(name)
}

function revalidateAllPaths() {
    revalidatePath('/admin')
    revalidatePath('/')
    revalidatePath('/en/formations')
    revalidatePath('/fr/formations')
    revalidatePath('/ar/formations')
}

// Retry utility removed since fetchWithRetry handles it globally in lib/supabase.ts

export async function verifyAdminLogin(name: string, password: string): Promise<ApiResponse> {
    console.log(`Login attempt for: ${name}`)

    // Try to verify against the admins table
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
                await setAuthCookies(admin.id, admin.name || 'Admin')
                console.log(`Login successful for: ${name}`)
                return createSuccessResponse('Login successful')
            }
        }
    } catch (e) {
        console.error('Error checking admins table during login:', e)
    }

    // Fallback to environment variable password for System Admin
    if (name === 'System Admin' && password === ADMIN_PASSWORD) {
        await setAuthCookies('system-admin-id', 'System Admin')
        console.log(`Login successful for: System Admin (Fallback)`)
        return createSuccessResponse('Login successful')
    }

    console.log(`Login failed for: ${name}`)
    return createErrorResponse('Invalid name or password.')
}

export async function getAdmins(page: number = 1, pageSize: number = 50): Promise<PaginatedResponse<Admin>> {
    console.log('Fetching admins...')
    try {
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
            throw error
        }

        const totalPages = Math.ceil((count || 0) / pageSize)
        console.log(`Successfully fetched ${data?.length || 0} admins.`)
        return { data: data || [], count: count || 0, page, pageSize, totalPages }
    } catch (e) {
        console.error('Permanent error fetching admins after retries:', e)
        return { data: [], count: 0, page, pageSize, totalPages: 0 }
    }
}

export async function createAdmin(name: string, email: string, password: string): Promise<ApiResponse> {
    console.log(`Attempting to create admin: ${name} (${email})`)
    const supabase = await createServerSupabaseClient()
    const password_hash = await bcrypt.hash(password, 10)

    const { error } = await supabase
        .from('admins')
        .insert({ name, email, password_hash })

    if (error) {
        return createErrorResponse(`Failed to create admin: ${error.message}`)
    }

    console.log('Admin created successfully in database.')
    revalidatePath('/admin')
    return createSuccessResponse('Admin created successfully!')
}

export async function updateAdmin(id: string, name: string, email: string, password?: string): Promise<ApiResponse> {
    try {
        console.log(`Attempting to update admin ID: ${id}`)

        // Protection: don't allow renaming someone to reserved names unless they're a super-admin
        if (isReservedName(name)) {
            const cookieStore = await cookies()
            const currentAdminName = cookieStore.get('admin_name')?.value
            if (!isSuperAdmin(currentAdminName || '')) {
                return createErrorResponse('Reserved name. Cannot use this name.')
            }
        }

        const supabase = await createServerSupabaseClient()

        // Check if we are updating a super-admin
        const { data: targetAdmin } = await supabase
            .from('admins')
            .select('name')
            .eq('id', id)
            .single()

        if (targetAdmin && isSuperAdmin(targetAdmin.name) && name !== targetAdmin.name) {
            return createErrorResponse('Cannot change the name of the primary super-admin.')
        }

        const updateData: { name: string; email: string; password_hash?: string } = { name, email }

        if (password && password.trim() !== '') {
            updateData.password_hash = await bcrypt.hash(password, 10)
        }

        const { error } = await supabase
            .from('admins')
            .update(updateData)
            .eq('id', id)

        if (error) {
            return createErrorResponse(`Failed to update admin: ${error.message}`)
        }

        console.log('Admin updated successfully in database.')
        revalidatePath('/admin')

        // Update cookie if updating self
        const cookieStore = await cookies()
        if (cookieStore.get('admin_id')?.value === id) {
            cookieStore.set('admin_name', name, COOKIE_OPTIONS)
        }

        return createSuccessResponse('Profile updated successfully!')
    } catch (e) {
        return createErrorResponse('Failed to update admin')
    }
}

export async function deleteAdmin(id: string): Promise<ApiResponse> {
    try {
        console.log(`Attempting to delete admin ID: ${id}`)
        const supabase = await createServerSupabaseAdminClient()

        // Protection: Check if this is a primary admin
        const { data: adminToDelete, error: fetchError } = await supabase
            .from('admins')
            .select('name')
            .eq('id', id)
            .single()

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
            console.error('Error fetching admin to delete:', fetchError)
            return createErrorResponse('Failed to verify admin account.')
        }

        if (adminToDelete && isSuperAdmin(adminToDelete.name)) {
            return createErrorResponse('Cannot delete primary super-admin accounts.')
        }

        // Perform deletion
        const { error: deleteError } = await supabase
            .from('admins')
            .delete()
            .eq('id', id)

        if (deleteError) {
            return createErrorResponse(`Failed to delete admin: ${deleteError.message}`)
        }

        console.log('Admin deleted successfully from database.')

        // Handle self-deletion: logout if the deleted admin is the current user
        const cookieStore = await cookies()
        const currentAdminId = cookieStore.get('admin_id')?.value

        if (currentAdminId === id) {
            console.log('Admin deleted their own account. Logging out...')
            await clearAuthCookies()
            return createSuccessResponse('Your account was deleted and you have been logged out.', true)
        }

        revalidatePath('/admin')
        return createSuccessResponse('Admin deleted successfully.')
    } catch (e) {
        return createErrorResponse('Failed to delete admin')
    }
}

export async function logoutAdmin(): Promise<ApiResponse> {
    await clearAuthCookies()
    return createSuccessResponse('Logged out successfully')
}

export async function getCurrentAdmin(): Promise<Admin | null> {
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

export async function getRegistrations(
    page: number = 1,
    pageSize: number = 10,
    searchQuery: string = ''
): Promise<PaginatedResponse<Registration>> {
    try {
        const supabase = await createServerSupabaseClient()
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        let query = supabase
            .from('registrations')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })

        if (searchQuery) {
            const { data: matchedFormations } = await supabase
                .from('formations')
                .select('id')
                .ilike('title', `%${searchQuery}%`)

            const formationIds = matchedFormations?.map(f => f.id) || []

            const searchLower = searchQuery.toLowerCase()
            if ('agile darija'.includes(searchLower)) formationIds.push('agile-darija')
            if ('mindset'.includes(searchLower)) formationIds.push('mindset')
            if ('agile teamwork'.includes(searchLower)) formationIds.push('agile-teamwork')
            if ('design thinking'.includes(searchLower)) formationIds.push('design-thinking')

            let orCondition = `full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone_number.ilike.%${searchQuery}%`
            if (formationIds.length > 0) {
                const formattedIds = formationIds.map(id => `"${id}"`).join(',')
                orCondition += `,formation_id.in.(${formattedIds})`
            }
            query = query.or(orCondition)
        }

        const { data, error, count } = await query.range(from, to)

        if (error) {
            console.error('Error fetching registrations:', error)
            throw error
        }

        const totalPages = Math.ceil((count || 0) / pageSize)
        return { data: data || [], count: count || 0, page, pageSize, totalPages }
    } catch (e) {
        console.error('Permanent error fetching registrations after retries:', e)
        return { data: [], count: 0, page, pageSize, totalPages: 0 }
    }
}

export async function exportAllRegistrations(searchQuery: string = ''): Promise<Registration[]> {
    try {
        const supabase = await createServerSupabaseClient()

        let query = supabase
            .from('registrations')
            .select('*')
            .order('created_at', { ascending: false })

        if (searchQuery) {
            const { data: matchedFormations } = await supabase
                .from('formations')
                .select('id')
                .ilike('title', `%${searchQuery}%`)

            const formationIds = matchedFormations?.map(f => f.id) || []

            const searchLower = searchQuery.toLowerCase()
            if ('agile darija'.includes(searchLower)) formationIds.push('agile-darija')
            if ('mindset'.includes(searchLower)) formationIds.push('mindset')
            if ('agile teamwork'.includes(searchLower)) formationIds.push('agile-teamwork')
            if ('design thinking'.includes(searchLower)) formationIds.push('design-thinking')

            let orCondition = `full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone_number.ilike.%${searchQuery}%`
            if (formationIds.length > 0) {
                const formattedIds = formationIds.map(id => `"${id}"`).join(',')
                orCondition += `,formation_id.in.(${formattedIds})`
            }
            query = query.or(orCondition)
        }

        const { data, error } = await query

        if (error) {
            console.error('Error fetching all registrations:', error)
            throw error
        }

        return data || []
    } catch (e) {
        console.error('Permanent error fetching all registrations after retries:', e)
        return []
    }
}

export async function deleteRegistration(id: string): Promise<ApiResponse> {
    try {
        const supabase = await createServerSupabaseClient()

        const { error } = await supabase
            .from('registrations')
            .delete()
            .eq('id', id)

        if (error) {
            return createErrorResponse('Failed to delete registration')
        }

        revalidatePath('/admin')
        return createSuccessResponse('Deleted successfully')
    } catch (e) {
        return createErrorResponse('Failed to delete registration')
    }
}

export async function createRegistration(data: {
    full_name: string
    email: string
    phone_number?: string
    where_did_you_hear?: string
    specialite?: string
    ville?: string
    formation_id: string
}): Promise<ApiResponse> {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
        .from('registrations')
        .insert({
            full_name: data.full_name,
            email: data.email,
            phone_number: data.phone_number,
            where_did_you_hear: data.where_did_you_hear,
            specialite: data.specialite,
            ville: data.ville,
            formation_id: data.formation_id,
        })

    if (error) {
        return createErrorResponse('Failed to create registration')
    }

    revalidatePath('/admin')
    return createSuccessResponse('Added successfully')
}

export async function updateRegistration(
    id: string,
    data: {
        full_name?: string
        email?: string
        phone_number?: string
        where_did_you_hear?: string
        specialite?: string
        ville?: string
        formation_id?: string
    }
): Promise<ApiResponse> {
    try {
        const supabase = await createServerSupabaseClient()

        const { error } = await supabase
            .from('registrations')
            .update(data)
            .eq('id', id)

        if (error) {
            return createErrorResponse('Failed to update registration')
        }

        revalidatePath('/admin')
        return createSuccessResponse('Updated successfully')
    } catch (e) {
        return createErrorResponse('Failed to update registration')
    }
}

// Test function to verify Supabase connection
export async function testSupabaseConnection() {
    try {
        const supabase = await createServerSupabaseClient()
        const { data, error } = await supabase.from('registrations').select('count').limit(1)

        if (error) {
            console.error('Connection test failed:', JSON.stringify(error, null, 2))
            return { success: false, error }
        }

        console.log('Supabase connection successful')
        return { success: true, data }
    } catch (error) {
        console.error('Connection test exception:', error)
        return { success: false, error }
    }
}

export async function getStatsByFormation(page: number = 1, pageSize: number = 1000) {
    try {
        const supabase = await createServerSupabaseClient()
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        const { data, error, count } = await supabase
            .from('registrations')
            .select('formation_id', { count: 'exact' })
            .range(from, to)

        if (error) {
            console.error('Error fetching stats:', JSON.stringify(error, null, 2))
            console.error('Error details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            })
            throw error
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
    } catch (e) {
        console.error('Permanent error fetching stats after retries:', e)
        return { total: 0, byFormation: {}, page, pageSize, totalPages: 0 }
    }
}

// ==========================================
// FORMATIONS MANAGEMENT
// ==========================================

export async function getFormations(page: number = 1, pageSize: number = 1000, activeOnly: boolean = false): Promise<PaginatedResponse<Formation>> {
    try {
        const supabase = await createServerSupabaseClient()
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        let query = supabase
            .from('formations')
            .select(`
                *,
                categories:formation_category_link(
                    category:formations_category(id, name)
                )
            `, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to)

        if (activeOnly) {
            query = query.eq('status', 'ACTIVE')
        }

        const { data, error, count } = await query

        if (error) {
            console.error('Error fetching formations:', error)
            throw error
        }

        // Transform data to flat array of categories
        const transformedData = (data || []).map((f: any) => ({
            ...f,
            categories: f.categories?.map((c: any) => c.category) || []
        }))

        const totalPages = Math.ceil((count || 0) / pageSize)
        return { data: transformedData, count: count || 0, page, pageSize, totalPages }
    } catch (e) {
        console.error('Permanent error fetching formations after retries:', e)
        return { data: [], count: 0, page, pageSize, totalPages: 0 }
    }
}

export async function getFormation(id: string): Promise<Formation | null> {
    try {
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

        if (error) {
            throw error
        }

        if (!data) return null;

        return {
            ...data,
            categories: (data as any).categories?.map((c: any) => c.category) || []
        }
    } catch (e) {
        console.error('Permanent error fetching formation after retries:', e)
        return null
    }
}

export async function createFormation(data: {
    title: string
    description: string
    date: string
    price: string
    image_url: string
    status: string
    category_ids: string[]
}): Promise<ApiResponse> {
    try {
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
                status: data.status,
            })
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to create formation: ${error.message}`)
        }

        // Check if formation was actually created
        if (!formation || !formation.id) {
            throw new Error('Formation was not created properly')
        }

        // 2. Link Categories (only if categories provided)
        if (data.category_ids && data.category_ids.length > 0) {
            const links = data.category_ids.map(catId => ({
                formation_id: formation.id,
                category_id: catId
            }))

            try {
                const { error: linkError } = await supabase
                    .from('formation_category_link')
                    .insert(links)

                if (linkError) {
                    console.error('Error linking categories:', linkError)
                    // Don't throw error here, formation was created successfully
                }
            } catch (categoryError) {
                console.error('Exception linking categories:', categoryError)
                // Don't throw error here, formation was created successfully
            }
        }

        // 3. Revalidate paths
        revalidateAllPaths()

        return createSuccessResponse('Formation created successfully')
    } catch (e) {
        return createErrorResponse('Failed to create formation')
    }
}

export async function updateFormation(id: string, data: {
    title: string
    description: string
    date: string
    price: string
    image_url: string
    status: string
    category_ids: string[]
}): Promise<ApiResponse> {
    try {
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
                    status: data.status,
                })
                .eq('id', id),
            supabase
                .from('formation_category_link')
                .delete()
                .eq('formation_id', id)
        ])

        if (updateResult.error) {
            return createErrorResponse('Failed to update formation')
        }

        if (deleteResult.error) {
            return createErrorResponse('Failed to update categories')
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
                return createErrorResponse('Failed to link new categories')
            }
        }
        revalidateAllPaths()
        return createSuccessResponse('Formation updated successfully')
    } catch (e) {
        return createErrorResponse('Failed to update formation')
    }
}

export async function deleteFormation(id: string): Promise<ApiResponse> {
    try {
        const supabase = await createServerSupabaseClient()

        const deleteCategoryLinks = async () => {
            const { error } = await supabase
                .from('formation_category_link')
                .delete()
                .eq('formation_id', id)

            if (error) {
                throw new Error(`Failed to delete category links: ${error.message}`)
            }
        }

        const deleteFormation = async () => {
            const { error } = await supabase
                .from('formations')
                .delete()
                .eq('id', id)

            if (error) {
                throw new Error(`Failed to delete formation: ${error.message}`)
            }
        }

        try {
            await deleteCategoryLinks()
            await deleteFormation()
        } catch (error) {
            return createErrorResponse('Failed to delete formation')
        }

        revalidateAllPaths()
        return createSuccessResponse('Formation deleted successfully')
    } catch (e) {
        return createErrorResponse('Failed to delete formation')
    }
}

// ==========================================
// CATEGORIES MANAGEMENT
// ==========================================
export async function getCategories(): Promise<Category[]> {
    try {
        const supabase = await createServerSupabaseClient()

        const { data, error } = await supabase
            .from('formations_category')
            .select('*')
            .order('name', { ascending: true })

        if (error) {
            console.error('Error fetching categories:', error)
            throw error
        }

        return data || []
    } catch (e) {
        console.error('Permanent error fetching categories after retries:', e)
        return []
    }
}

export async function createCategory(name: string): Promise<ApiResponse> {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
        .from('formations_category')
        .insert({ name })

    if (error) {
        return createErrorResponse('Failed to create category')
    }

    revalidatePath('/admin')
    return createSuccessResponse('Category added successfully')
}

export async function updateCategory(id: string, name: string): Promise<ApiResponse> {
    try {
        const supabase = await createServerSupabaseClient()

        const { error } = await supabase
            .from('formations_category')
            .update({ name })
            .eq('id', id)

        if (error) {
            return createErrorResponse('Failed to update category')
        }

        revalidatePath('/admin')
        return createSuccessResponse('Category updated successfully')
    } catch (e) {
        return createErrorResponse('Failed to update category')
    }
}

export async function deleteCategory(id: string): Promise<ApiResponse> {
    try {
        const supabase = await createServerSupabaseClient()

        const { error } = await supabase
            .from('formations_category')
            .delete()
            .eq('id', id)

        if (error) {
            return createErrorResponse('Failed to delete category')
        }

        revalidatePath('/admin')
        return createSuccessResponse('Category deleted successfully')
    } catch (e) {
        return createErrorResponse('Failed to delete category')
    }
}
