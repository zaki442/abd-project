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

async function setupSuperAdmin() {
    loadEnv();

    const name = "admin";
    const email = "admin@example.com";
    const password = process.argv[2];

    if (!password) {
        console.log('Error: Please provide a password as an argument.');
        console.log('Usage: node scripts/setup-super-admin.mjs "your_secure_password"');
        process.exit(1);
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Setting up super admin: ${name} (${email})...`);

    try {
        const password_hash = await bcrypt.hash(password, 10);

        // Check if admin already exists
        const { data: existing } = await supabase
            .from('admins')
            .select('id')
            .eq('name', name)
            .single();

        let result;
        if (existing) {
            console.log('Admin already exists. Updating password...');
            result = await supabase
                .from('admins')
                .update({ email, password_hash })
                .eq('id', existing.id)
                .select();
        } else {
            result = await supabase
                .from('admins')
                .insert({
                    name,
                    email,
                    password_hash
                })
                .select();
        }

        if (result.error) {
            console.error('Error:', result.error.message);
            process.exit(1);
        }

        console.log('Successfully set up super admin:', result.data[0].name);
    } catch (err) {
        console.error('Unexpected error:', err.message);
        process.exit(1);
    }
}

setupSuperAdmin();
