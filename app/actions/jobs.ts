'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export interface Job {
    id: string
    title: string
    description: string
    is_active: boolean
    created_at: string
}

export interface JobRegistration {
    id: string
    job_id: string
    full_name: string
    email: string
    phone_number?: string
    cover_letter?: string
    created_at: string
    job?: { title: string }
}

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
}

function createSuccessResponse(message: string): ApiResponse {
    return { success: true, message }
}

function createErrorResponse(message: string): ApiResponse {
    return { success: false, message }
}

function revalidateJobsPaths() {
    revalidatePath('/admin/jobs')
    revalidatePath('/admin/job-registrations')
    revalidatePath('/en/jobs')
    revalidatePath('/fr/jobs')
    revalidatePath('/ar/jobs')
}

// ==========================================
// JOBS
// ==========================================

export async function getJobs(page: number = 1, pageSize: number = 50, activeOnly: boolean = false): Promise<PaginatedResponse<Job>> {
    try {
        const supabase = await createServerSupabaseClient()
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        let query = supabase
            .from('jobs')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })

        if (activeOnly) {
            query = query.eq('is_active', true)
        }

        const { data, error, count } = await query.range(from, to)

        if (error) throw error

        const totalPages = Math.ceil((count || 0) / pageSize)
        return { data: data || [], count: count || 0, page, pageSize, totalPages }
    } catch (e) {
        console.error('Error fetching jobs:', e)
        return { data: [], count: 0, page, pageSize, totalPages: 0 }
    }
}

export async function getJob(id: string): Promise<Job | null> {
    try {
        const supabase = await createServerSupabaseClient()
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data as Job
    } catch (e) {
        console.error('Error fetching job:', e)
        return null
    }
}

export async function createJob(data: {
    title: string
    description: string
    is_active?: boolean
}): Promise<ApiResponse> {
    try {
        const supabase = await createServerSupabaseClient()
        const { error } = await supabase
            .from('jobs')
            .insert({
                title: data.title,
                description: data.description,
                is_active: data.is_active ?? true
            })

        if (error) throw error

        revalidateJobsPaths()
        return createSuccessResponse('Job created successfully')
    } catch (e) {
        console.error('Error creating job:', e)
        return createErrorResponse('Failed to create job')
    }
}

export async function updateJob(id: string, data: {
    title?: string
    description?: string
    is_active?: boolean
}): Promise<ApiResponse> {
    try {
        const supabase = await createServerSupabaseClient()
        const { error } = await supabase
            .from('jobs')
            .update(data)
            .eq('id', id)

        if (error) throw error

        revalidateJobsPaths()
        return createSuccessResponse('Job updated successfully')
    } catch (e) {
        console.error('Error updating job:', e)
        return createErrorResponse('Failed to update job')
    }
}

export async function deleteJob(id: string): Promise<ApiResponse> {
    try {
        const supabase = await createServerSupabaseClient()
        const { error } = await supabase
            .from('jobs')
            .delete()
            .eq('id', id)

        if (error) throw error

        revalidateJobsPaths()
        return createSuccessResponse('Job deleted successfully')
    } catch (e) {
        console.error('Error deleting job:', e)
        return createErrorResponse('Failed to delete job')
    }
}

// ==========================================
// JOB REGISTRATIONS
// ==========================================

export async function getJobRegistrations(page: number = 1, pageSize: number = 50, searchQuery: string = ''): Promise<PaginatedResponse<JobRegistration>> {
    try {
        const supabase = await createServerSupabaseClient()
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        let query = supabase
            .from('job_registrations')
            .select('*, job:jobs(title)', { count: 'exact' })
            .order('created_at', { ascending: false })

        if (searchQuery) {
            query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone_number.ilike.%${searchQuery}%`)
        }

        const { data, error, count } = await query.range(from, to)

        if (error) throw error

        const totalPages = Math.ceil((count || 0) / pageSize)
        return { data: data || [], count: count || 0, page, pageSize, totalPages }
    } catch (e) {
        console.error('Error fetching job registrations:', e)
        return { data: [], count: 0, page, pageSize, totalPages: 0 }
    }
}

export async function createJobRegistration(data: {
    job_id: string
    full_name: string
    email: string
    phone_number?: string
    cover_letter?: string
}): Promise<ApiResponse> {
    try {
        const supabase = await createServerSupabaseClient()
        const { error } = await supabase
            .from('job_registrations')
            .insert(data)

        if (error) throw error

        revalidateJobsPaths()
        return createSuccessResponse('Application submitted successfully')
    } catch (e) {
        console.error('Error creating job registration:', e)
        return createErrorResponse('Failed to submit application')
    }
}

export async function deleteJobRegistration(id: string): Promise<ApiResponse> {
    try {
        const supabase = await createServerSupabaseClient()
        const { error } = await supabase
            .from('job_registrations')
            .delete()
            .eq('id', id)

        if (error) throw error

        revalidateJobsPaths()
        return createSuccessResponse('Application deleted successfully')
    } catch (e) {
        console.error('Error deleting job registration:', e)
        return createErrorResponse('Failed to delete application')
    }
}
