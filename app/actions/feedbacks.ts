'use server'

import { createServerSupabaseAdminClient, createServerSupabaseClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function submitFeedback(data: { full_name: string; email?: string; role?: string; feedback: string; image_url?: string }) {
    try {
        const supabase = await createServerSupabaseClient()

        const payload: {
            full_name: string
            email: string | null
            role: string | null
            feedback: string
            image_url?: string
        } = {
            full_name: data.full_name,
            email: data.email || null,
            role: data.role || null,
            feedback: data.feedback,
        }

        if (data.image_url) {
            payload.image_url = data.image_url
        }

        const { error } = await supabase
            .from('feedbacks')
            .insert(payload)

        if (error) {
            const missingImageColumn = /column .*image_url/i.test(error.message)

            if (data.image_url && missingImageColumn) {
                const { image_url: _image_url, ...fallbackPayload } = payload

                const { error: fallbackError } = await supabase
                    .from('feedbacks')
                    .insert(fallbackPayload)

                if (fallbackError) {
                    console.error('Error inserting feedback without image URL:', fallbackError)
                    return { error: 'Failed to submit feedback' }
                }

                return { success: true }
            }

            console.error('Error inserting feedback:', error)
            return { error: 'Failed to submit feedback' }
        }

        return { success: true }
    } catch (error) {
        console.error('Exception submitting feedback:', error)
        return { error: 'An unexpected error occurred' }
    }
}

export async function getFeedbacks() {
    try {
        const supabase = await createServerSupabaseAdminClient()
        
        const { data, error } = await supabase
            .from('feedbacks')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching feedbacks:', error)
            return { data: [], error: 'Failed to fetch feedbacks' }
        }

        return { data: data || [] }
    } catch (error) {
        console.error('Exception fetching feedbacks:', error)
        return { data: [], error: 'An unexpected error occurred' }
    }
}

export async function deleteFeedback(id: string) {
    try {
        const supabase = await createServerSupabaseAdminClient()
        
        const { error } = await supabase
            .from('feedbacks')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting feedback:', error)
            return { error: 'Failed to delete feedback' }
        }

        revalidatePath('/[locale]/admin/feedbacks', 'page')
        revalidatePath('/[locale]/admin', 'layout')
        
        return { success: true }
    } catch (error) {
        console.error('Exception deleting feedback:', error)
        return { error: 'An unexpected error occurred' }
    }
}
