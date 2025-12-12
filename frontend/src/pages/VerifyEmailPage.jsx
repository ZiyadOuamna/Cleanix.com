import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { confirmEmailCode, sendVerificationEmail } from '../services/settingsService';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [emailCode, setEmailCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    
    if (!emailCode || emailCode.length !== 6) {
      Swal.fire({
        icon: 'error',
        title: 'Code invalide',
        text: 'Veuillez saisir un code valide (6 chiffres)',
      });
      return;
    }

    setIsLoading(true);
    try {
      await confirmEmailCode(emailCode, user.email);
      
      // Mettre à jour l'utilisateur dans localStorage
      const updatedUser = { ...user, email_verified_at: new Date().toISOString() };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      Swal.fire({
        icon: 'success',
        title: 'Email vérifié!',
        text: 'Votre adresse email a été vérifiée avec succès.',
        confirmButtonText: 'Continuer'
      }).then(() => {
        // Rediriger vers le dashboard approprié
        const userType = localStorage.getItem('user_type').toLowerCase();
        switch (userType) {
          case 'client':
            navigate('/client/dashboard');
            break;
          case 'freelancer':
            navigate('/freelancer/dashboard');
            break;
          case 'superviseur':
            navigate('/superviseur/dashboard');
            break;
          default:
            navigate('/');
        }
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Code invalide',
        text: error.response?.data?.message || 'Le code saisi est incorrect ou expiré',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsSending(true);
    try {
      await sendVerificationEmail(user.email);
      
      Swal.fire({
        icon: 'success',
        title: 'Code renvoyé!',
        text: `Un nouveau code a été envoyé à ${user.email}`,
        confirmButtonText: 'OK'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Impossible d\'envoyer le code',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-teal-600 to-blue-600 rounded-full p-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Vérifiez votre Email
        </h1>
        
        {/* Subtitle */}
        <p className="text-center text-gray-600 mb-6">
          Un code de vérification a été envoyé à <strong>{user.email}</strong>
        </p>

        {/* Form */}
        <form onSubmit={handleVerifyEmail} className="space-y-4">
          {/* Code Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code de Vérification (6 chiffres)
            </label>
            <input 
              type="text" 
              value={emailCode} 
              onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
              maxLength="6"
              placeholder="000000"
              className="w-full px-4 py-3 text-center text-lg font-bold tracking-widest border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              Vérifie ta boîte email ou le dossier spam
            </p>
          </div>

          {/* Verify Button */}
          <button
            type="submit" 
            disabled={isLoading || emailCode.length !== 6} 
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white text-sm transition-all duration-300 ${
              isLoading || emailCode.length !== 6
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Vérification en cours...
              </div>
            ) : 'Vérifier mon Email'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>

        {/* Resend Button */}
        <button
          type="button"
          onClick={handleResendCode}
          disabled={isSending}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 border-2 ${
            isSending
              ? 'border-gray-400 text-gray-400 cursor-not-allowed'
              : 'border-teal-600 text-teal-600 hover:bg-teal-50'
          }`}
        >
          {isSending ? 'Envoi en cours...' : 'Renvoyer le Code'}
        </button>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-800">
            <span className="font-semibold">💡 Information:</span> Le code est valide pendant 10 minutes. Si tu ne l'as pas reçu, clique sur "Renvoyer le Code".
          </p>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            localStorage.removeItem('user_type');
            window.location.href = '/login';
          }}
          className="w-full mt-4 py-2 px-4 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Retour à la Connexion
        </button>
      </div>
    </div>
  );
}
