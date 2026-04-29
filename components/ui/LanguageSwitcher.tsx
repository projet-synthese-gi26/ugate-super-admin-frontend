'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { usePathname, useRouter } from '@/lib/i18n/routing';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

const LANGUAGES =[
    { code: "fr", label: "Français" },
    { code: "en", label: "English" },
    { code: "de", label: "Deutsch" },
];

export default function LanguageSwitcher({ variant = "dark" }: { variant?: "dark" | "light" }) {
    const [isOpen, setIsOpen] = useState(false);
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const ref = useRef<HTMLDivElement>(null);

    // Fermer au clic à l'extérieur
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    },[]);

    const changeLanguage = (newLocale: string) => {
        setIsOpen(false);
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all",
                    variant === "dark" ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
            >
                <Globe size={14} className="opacity-80" />
                <span>{LANGUAGES.find(l => l.code === locale)?.label || "Langue"}</span>
                <ChevronDown size={14} />
            </button>
            {isOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-32 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                    {LANGUAGES.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                            {lang.label}
                            {locale === lang.code && <Check size={14} className="text-blue-600" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}