import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "UGate Super Admin",
    description: "Plateforme d'administration UGate",
};

export default async function RootLayout({
                                             children,
                                             params
                                         }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {

    const { locale } = await params;
    const messages = await getMessages();

    return (
        <html lang={locale}>
        <body className={`${inter.variable} antialiased bg-gray-50 text-slate-900`}>
        <NextIntlClientProvider messages={messages}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}