import fs from 'fs';

let content = fs.readFileSync('app/actions/admin.ts', 'utf8');

// 1. Remove the retry helper function
content = content.replace(/\/\/ Retry utility for failed requests[\s\S]*?throw lastError \|\| new Error\('Max retries exceeded'\)\n}\n\n/, '');

// 2. Remove all `return retry(async () => {` instances and unindent
// We'll just replace `return retry(async () => {` with empty string or `try {`, and handle `.catch((e) => {` 

// A safer approach: I'll use simple string replacements based on what's there
// 2.a getAdmins
content = content.replace(
    /return retry\(async \(\) => {\n        const supabase/g,
    'try {\n        const supabase'
);
content = content.replace(
    /    }\)\.catch\(\(e\) => {\n        console\.error\('Permanent error fetching admins after retries:', e\)\n        return { data: \[\], count: 0, page, pageSize, totalPages: 0 }\n    }\)/g,
    '    } catch (e) {\n        console.error("Permanent error fetching admins:", e)\n        return { data: [], count: 0, page, pageSize, totalPages: 0 }\n    }'
);

content = content.replace(
    /    }\)\.catch\(\(e\) => {\n        console\.error\('Permanent error fetching registrations after retries:', e\)\n        return { data: \[\], count: 0, page, pageSize, totalPages: 0 }\n    }\)/,
    '    } catch (e) {\n        console.error("Permanent error fetching registrations:", e)\n        return { data: [], count: 0, page, pageSize, totalPages: 0 }\n    }'
);

content = content.replace(
    /    }\)\.catch\(\(e\) => {\n        console\.error\('Permanent error fetching all registrations after retries:', e\)\n        return \[\]\n    }\)/,
    '    } catch (e) {\n        console.error("Permanent error fetching all registrations:", e)\n        return []\n    }'
);

content = content.replace(
    /    }\)\.catch\(\(e\) => {\n        console\.error\('Permanent error fetching stats after retries:', e\)\n        return { total: 0, byFormation: {}, page, pageSize, totalPages: 0 }\n    }\)/,
    '    } catch (e) {\n        console.error("Permanent error fetching stats:", e)\n        return { total: 0, byFormation: {}, page, pageSize, totalPages: 0 }\n    }'
);

content = content.replace(
    /    }\)\.catch\(\(e\) => {\n        console\.error\('Permanent error fetching formations after retries:', e\)\n        return { data: \[\], count: 0, page, pageSize, totalPages: 0 }\n    }\)/,
    '    } catch (e) {\n        console.error("Permanent error fetching formations:", e)\n        return { data: [], count: 0, page, pageSize, totalPages: 0 }\n    }'
);

content = content.replace(
    /    }\)\.catch\(\(e\) => {\n        console\.error\('Permanent error fetching formation after retries:', e\)\n        return null\n    }\)/,
    '    } catch (e) {\n        console.error("Permanent error fetching formation:", e)\n        return null\n    }'
);


content = content.replace(/return retry\(async \(\) => {\n        console\.log\(`Attempting to update admin ID: \${id}`\)/g, "console.log(`Attempting to update admin ID: ${id}`)");
content = content.replace(/    }, 2, 500\)/g, "");

content = content.replace(/return retry\(async \(\) => {\n        console\.log\(`Attempting to delete admin ID: \${id}`\)/, "console.log(`Attempting to delete admin ID: ${id}`)");

content = content.replace(/return retry\(async \(\) => {\n        const supabase = await createServerSupabaseClient\(\)\n\n        const \{ error \} = await supabase/g, 'const supabase = await createServerSupabaseClient()\n\n        const { error } = await supabase');

// updateRegistration has this:
//     return retry(async () => {
//         const supabase = await createServerSupabaseClient()
content = content.replace(/    return retry\(async \(\) => {\n        const supabase/g, '    const supabase');

content = content.replace(/return retry\(async \(\) => {\n        const supabase = await createServerSupabaseClient\(\)\n\n        const deleteCategoryLinks/g, 'const supabase = await createServerSupabaseClient()\n\n        const deleteCategoryLinks');


fs.writeFileSync('app/actions/admin.ts', content);
