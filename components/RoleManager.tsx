'use client';

import React, { useState } from 'react';
import { Shield, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL ;

export const RoleManager: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [userId, setUserId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'create-role' | 'assign-role'>('create-role');

  const handleCreateRole = async () => {
    setError(''); setSuccess('');
    if (!accessToken) { setError('Veuillez entrer un token d\'accès'); return; }

    setIsLoading(true);

    try {
      const response = await fetch(`${AUTH_API_URL}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name: 'SUPER_ADMIN' }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Échec de la création du rôle');
      }

      setSuccess('Rôle SUPER_ADMIN créé avec succès ! Passez à l\'étape suivante.');
      setStep('assign-role');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignRole = async () => {
    setError(''); setSuccess('');
    if (!userId || !accessToken) { setError('Veuillez remplir tous les champs'); return; }

    setIsLoading(true);

    try {
      const response = await fetch(`${AUTH_API_URL}/users/${userId}/roles/SUPER_ADMIN`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Échec de l\'attribution du rôle');
      }

      setSuccess('Rôle SUPER_ADMIN attribué avec succès ! Vous pouvez maintenant vous connecter.');
      setTimeout(() => onClose(), 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md relative">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Rôles</h1>
              <p className="text-gray-600">{step === 'create-role' ? 'Étape 1: Créer le rôle' : 'Étape 2: Attribuer le rôle'}</p>
            </div>

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800">{success}</p>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {step === 'create-role' ? (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Token d&apos;accès <span className="text-red-500">*</span></label>
                    <textarea value={accessToken} onChange={(e) => setAccessToken(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all resize-none" placeholder="Collez votre token d'accès ici..." rows={4} disabled={isLoading} />
                  </div>
                  <Button type="button" variant="primary" size="lg" className="w-full" onClick={handleCreateRole} isLoading={isLoading}>
                    <Plus className="w-5 h-5 mr-2" />
                    {isLoading ? 'Création en cours...' : 'Créer le rôle SUPER_ADMIN'}
                  </Button>
                </div>
            ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ID de l&apos;utilisateur <span className="text-red-500">*</span></label>
                    <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all" placeholder="UUID de l'utilisateur" disabled={isLoading} />
                  </div>
                  <Button type="button" variant="primary" size="lg" className="w-full" onClick={handleAssignRole} isLoading={isLoading}>
                    {isLoading ? 'Attribution en cours...' : 'Attribuer le rôle'}
                  </Button>
                </div>
            )}

            <div className="mt-6 flex gap-3">
              <Button type="button" variant="secondary" size="md" className="flex-1" onClick={onClose} disabled={isLoading}>Fermer</Button>
              {step === 'assign-role' && (
                  <Button type="button" variant="secondary" size="md" className="flex-1" onClick={() => setStep('create-role')} disabled={isLoading}>Retour</Button>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};