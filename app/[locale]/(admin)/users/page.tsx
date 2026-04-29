import { UsersManagement } from '@/components/superadmin/UsersManagement';
import { getTranslations } from 'next-intl/server';

// Correction : params est une Promesse
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Nav' });
    return { title: `${t('users')} | UGate Super Admin` };
}

export default function UsersPage() {
    return <UsersManagement />;
}