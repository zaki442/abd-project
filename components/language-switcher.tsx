'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    function onSelectChange(nextLocale: 'en' | 'ar' | 'fr') {
        router.replace(pathname, { locale: nextLocale });
    }

    const languages = [
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'fr', label: 'Français', flag: '🇫🇷' },
        { code: 'ar', label: 'العربية', flag: '🇲🇦' },
    ];

    const currentLanguage = languages.find((lang) => lang.code === locale);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 h-9">
                    <Languages className="h-4 w-4" />
                    <span className="hidden sm:inline-block">{currentLanguage?.label}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => onSelectChange(lang.code as 'en' | 'ar' | 'fr')}
                        className={locale === lang.code ? 'bg-secondary font-bold' : ''}
                    >
                        <span className="mr-2">{lang.flag}</span>
                        {lang.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
