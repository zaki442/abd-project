import fs from 'fs';

let content = fs.readFileSync('app/actions/admin.ts', 'utf8');

// 1. Remove the retry helper function
content = content.replace(/\/\/ Retry utility for failed requests[\s\S]*?throw lastError \|\| new Error\('Max retries exceeded'\)\n}\n\n/, '');

// Helper to replace wrappers with try/catch
function replaceWrapperWithTryCatch(regexMatchStart, regexMatchEnd, fallbackReturn) {
    const startRegex = new RegExp(`return retry\\(async \\(\\) => \\{\\n([\\s\\S]*?)${regexMatchEnd}`, 'g');
    content = content.replace(startRegex, (match, body) => {
        return `try {\n${body}\n    } catch (e) {\n        console.error("Permanent error:", e)\n        return ${fallbackReturn}\n    }`;
    });
}

function replaceWrapperNoTryCatch(funcNameRegex, endRegex) {
    // For simple writes where try/catch is already inside or just throws
    // Not strictly AST safe but works for our specific file
}

// Just doing strict manual string replacement for exact blocks is safer.
