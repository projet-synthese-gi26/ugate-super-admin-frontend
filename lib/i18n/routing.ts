import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    locales:['fr', 'en', 'de'],
    defaultLocale: 'fr',
    localePrefix: 'as-needed' // N'ajoute pas /fr si c'est la langue par défaut
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);