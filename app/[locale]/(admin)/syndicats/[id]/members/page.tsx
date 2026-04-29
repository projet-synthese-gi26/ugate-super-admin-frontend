import { SyndicatMembers } from '@/components/superadmin/SyndicatMembers';
import { getTranslations } from 'next-intl/server';

// Correction : params est une Promesse
export async function generateMetadata({ params }: { params: Promise<{ locale: string, id: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'SyndicatMembers' });
    return { title: `${t('title')} | UGate Super Admin` };
}

export default async function MembersPage({ params }: { params: Promise<{ id: string }> }) {
    // Extraction asynchrone de l'ID depuis les paramètres Next.js 15+
    const { id } = await params;
    return <SyndicatMembers syndicatId={id} />;
}