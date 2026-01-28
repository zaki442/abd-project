'use server'

import { createClient } from '@/lib/supabase'

export async function registerUser(prevState: any, formData: FormData) {
    const supabase = createClient()

    const fullName = formData.get('full_name') as string
    const email = formData.get('email') as string
    const formationId = formData.get('formation_id') as string

    if (!fullName || !email || !formationId) {
        return {
            success: false,
            message: 'Email w smiya daroryin.',
        }
    }

    try {
        const { error } = await supabase
            .from('registrations')
            .insert([
                {
                    full_name: fullName,
                    email: email,
                    formation_id: formationId,
                },
            ])

        if (error) {
            console.error('Supabase error:', error)
            return {
                success: false,
                message: 'Wqe3 mochkil f tasjil. 3awd jerrab men be3d.',
            }
        }

        return {
            success: true,
            message: 'Tssajaliti b naja7! Ghan ttaslo bik qrib.',
        }
    } catch (error) {
        console.error('Server error:', error)
        return {
            success: false,
            message: 'Wqe3 mochkil f system. 3awd jerrab.',
        }
    }
}
