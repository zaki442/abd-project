'use server'

import { createClient } from '@/lib/supabase'

export async function registerUser(prevState: any, formData: FormData) {
    const supabase = createClient()

    const fullName = formData.get('full_name') as string
    const email = formData.get('email') as string
    const phoneNumber = formData.get('phone_number') as string
    const motivation = formData.get('motivation') as string
    const formationId = formData.get('formation_id') as string

    if (!fullName || !email || !formationId) {
        return {
            success: false,
            message: 'Email and name are required.',
        }
    }

    try {
        const { error } = await supabase
            .from('registrations')
            .insert([
                {
                    full_name: fullName,
                    email: email,
                    phone_number: phoneNumber,
                    motivation: motivation,
                    formation_id: formationId,
                },
            ])

        if (error) {
            console.error('Supabase error:', error)
            return {
                success: false,
                message: 'A problem occurred during registration. Please try again later.',
            }
        }

        return {
            success: true,
            message: 'Successfully registered! We will contact you soon.',
        }
    } catch (error) {
        console.error('Server error:', error)
        return {
            success: false,
            message: 'A system error occurred. Please try again.',
        }
    }
}
