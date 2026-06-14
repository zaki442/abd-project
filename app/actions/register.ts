'use server'

import { createClient } from '@/lib/supabase'
import { hasDuplicateEmail, normalizeRegistrationEmail } from '@/lib/registration-utils'

export async function registerUser(prevState: any, formData: FormData) {
    const supabase = createClient()

    const fullName = formData.get('full_name') as string
    const email = formData.get('email') as string
    const phoneNumber = formData.get('phone_number') as string
    const whereDidYouHear = formData.get('where_did_you_hear') as string
    const specialite = formData.get('specialite') as string
    const ville = formData.get('ville') as string
    const formationId = formData.get('formation_id') as string

    if (!fullName || !email || !formationId || !specialite || !ville) {
        return {
            success: false,
            message: 'Email and name are required.',
        }
    }

    try {
        const normalizedEmail = normalizeRegistrationEmail(email)

        const { data: existingRegistrations, error: duplicateCheckError } = await supabase
            .from('registrations')
            .select('id, email, formation_id')
            .eq('formation_id', formationId)
            .ilike('email', normalizedEmail)

        if (duplicateCheckError) {
            console.error('Duplicate check error:', duplicateCheckError)
            return {
                success: false,
                message: 'A problem occurred while validating your registration. Please try again.',
            }
        }

        if (hasDuplicateEmail(existingRegistrations || [], email, formationId, 'formation_id')) {
            return {
                success: false,
                message: 'This email is already registered for this formation. Please use another email address.',
            }
        }

        const { error } = await supabase
            .from('registrations')
            .insert([
                {
                    full_name: fullName,
                    email: email,
                    phone_number: phoneNumber,
                    where_did_you_hear: whereDidYouHear,
                    specialite: specialite,
                    ville: ville,
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
