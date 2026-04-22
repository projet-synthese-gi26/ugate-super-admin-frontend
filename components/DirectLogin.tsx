'use client';

import React, { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;

export const DirectLogin: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!accessToken || !refreshToken) {
      setError('Veuillez entrer les deux tokens');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 Connexion directe avec les tokens...');
      localStorage.setItem('ugate_access_token', accessToken);
      localStorage.setItem('ugate_refresh_token', refreshToken);

      const response = await fetch(`${AUTH_API_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token invalide ou expiré');
      }

      const userData = await response.json();
      localStorage.setItem('ugate_user_info', JSON.stringify(userData));

      const expiryTime = Date.now() + (15 * 60 * 1000);
      localStorage.setItem('ugate_token_expiry', expiryTime.toString());

      window.location.reload();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl relative">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <LogIn className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Connexion Directe</h1>
              <p className="text-gray-600">Utilisez les tokens reçus lors de la création de votre compte</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            <form onSubmit={handleDirectLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Token <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all resize-none font-mono text-xs"
                    placeholder="eyJhbGciOiJIUzI1NiJ9..."
                    rows={4}
                    disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refresh Token <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={refreshToken}
                    onChange={(e) => setRefreshToken(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all resize-none font-mono text-xs"
                    placeholder="eyJhbGciOiJIUzI1NiJ9..."
                    rows={4}
                    disabled={isLoading}
                />
              </div>
              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
                {isLoading ? 'Connexion...' : 'Se connecter avec les tokens'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs text-blue-800">
                <strong>Info:</strong> Collez les tokens que vous avez reçus lors de la création de votre compte.
              </p>
            </div>

            <button onClick={onBack} className="w-full mt-6 text-sm text-gray-600 hover:text-gray-900 transition-colors" disabled={isLoading}>
              ← Retour à la connexion normale
            </button>
          </div>
        </div>
      </div>
  );
};