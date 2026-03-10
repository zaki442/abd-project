import fs from 'fs';

let content = fs.readFileSync('app/actions/admin.ts', 'utf8');

// The regex we ran before left a lot of trailing `}` or missed starting `try {` blocks.
// Let's just restore the file from git and do it cleanly with AST or simple exact replacements.
