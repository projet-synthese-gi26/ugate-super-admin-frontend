'use client';

import React, { useState } from 'react';
import { Shield, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;

interface Role {
  id: string;
  name: string;
}

export const RoleChecker: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [accessToken, setAccessToken] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckRoles = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setRoles([]);

    if (!accessToken) {
      setError('Veuillez entrer un token d\'accès');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${AUTH_API_URL}/roles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Échec de la récupération des rôles');
      }

      const data: Role[] = await response.json();
      setRoles(data);

      if (data.length === 0) {
        setSuccess('Aucun rôle n\'existe dans le système. Vous devez créer le rôle SUPER_ADMIN.');
      } else {
        setSuccess(`${data.length} rôle(s) trouvé(s) dans le système.`);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl relative">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Vérifier les Rôles</h1>
              <p className="text-gray-600">Consultez les rôles existants dans le backend</p>
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

            <form onSubmit={handleCheckRoles} className="space-y-5 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Token d&apos;accès <span className="text-red-500">*</span></label>
                <textarea value={accessToken} onChange={(e) => setAccessToken(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all resize-none font-mono text-xs" placeholder="Collez le token..." rows={4} disabled={isLoading} />
              </div>
              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
                <Search className="w-5 h-5 mr-2" />
                {isLoading ? 'Vérification...' : 'Vérifier les rôles'}
              </Button>
            </form>

            {roles.length > 0 && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <h3 className="text-sm font-semibold text-blue-900 mb-3">Rôles existants :</h3>
                  <div className="space-y-2">
                    {roles.map((role) => (
                        <div key={role.id} className="bg-white p-3 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between">
                            <div><p className="font-semibold text-gray-900">{role.name}</p><p className="text-xs text-gray-500 font-mono">{role.id}</p></div>
                            {role.name === 'SUPER_ADMIN' && <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">✓ Trouvé</span>}
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
            )}

            <button onClick={onClose} className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors" disabled={isLoading}>
              ← Retour
            </button>
          </div>
        </div>
      </div>
  );
};