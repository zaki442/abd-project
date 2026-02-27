import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Simple .env.local parser
function loadEnv() {
    const envPath = path.join(rootDir, '.env.local');
    if (!fs.existsSync(envPath)) {
        console.error('Error: .env.local file not found at', envPath);
        process.exit(1);
    }

    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            const key = match[1];
            let value = match[2] || '';
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
            process.env[key] = value;
        }
    });
}

async function createAdmin() {
    loadEnv();

    const name = process.argv[2];
    const email = process.argv[3];
    const password = process.argv[4];

    if (!name || !email || !password) {
        console.log('Usage: node scripts/create-admin.mjs "Name" "email@example.com" "password"');
        process.exit(1);
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Creating admin: ${name} (${email})...`);

    try {
        const password_hash = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from('admins')
            .insert({
                name,
                email,
                password_hash
            })
            .select();

        if (error) {
            if (error.code === '42501') {
                console.error('Error: Permission denied (RLS). Please ensure you have applied the RLS policies provided in the walkthrough.');
            } else {
                console.error('Error creating admin:', error.message);
            }
            process.exit(1);
        }

        console.log('Successfully created admin:', data[0].name);
        console.log('ID:', data[0].id);
    } catch (err) {
        console.error('Unexpected error:', err.message);
        process.exit(1);
    }
}

createAdmin();
