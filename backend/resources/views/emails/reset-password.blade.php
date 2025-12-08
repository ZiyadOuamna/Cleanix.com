<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de mot de passe | Cleanix</title>
    <style>
        /* Reset et styles de base */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }
        
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }
        
        /* En-tête */
        .email-header {
            background: linear-gradient(135deg, #2968c5 0%, #144dd1 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header-pattern {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.1;
            background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><path fill="%23ffffff" d="M20,20 Q40,0 60,20 T100,20 L100,80 Q80,100 60,80 T20,80 Z"/></svg>');
        }
        
        .brand-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
        }
        
        .logo-icon {
            width: 48px;
            height: 48px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .brand-name {
            color: white;
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        
        .header-title {
            color: white;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }
        
        .header-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            font-weight: 400;
            position: relative;
            z-index: 1;
        }
        
        /* Contenu principal */
        .email-content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            color: #2d3748;
            margin-bottom: 30px;
            font-weight: 500;
        }
        
        .greeting-name {
            color: #2968c5;
            font-weight: 700;
        }
        
        .message {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        
        /* Bouton principal */
        .action-container {
            text-align: center;
            margin: 40px 0;
        }
        
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #2968c5 0%, #144dd1 100%);
            color: white;
            text-decoration: none;
            padding: 18px 40px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 0.5px;
            box-shadow: 0 8px 20px rgba(41, 104, 197, 0.3);
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        
        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 25px rgba(41, 104, 197, 0.4);
        }
        
        .reset-button:active {
            transform: translateY(0);
        }
        
        .button-icon {
            margin-right: 10px;
            font-size: 18px;
        }
        
        /* Section d'urgence */
        .urgent-section {
            background: linear-gradient(135deg, #fff5f5 0%, #fff0f0 100%);
            border-left: 4px solid #fc8181;
            padding: 20px;
            border-radius: 12px;
            margin: 30px 0;
        }
        
        .urgent-title {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #c53030;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .urgent-text {
            color: #742a2a;
            font-size: 14px;
            line-height: 1.6;
        }
        
        /* Section de sécurité */
        .security-section {
            background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
            border-left: 4px solid #38a169;
            padding: 20px;
            border-radius: 12px;
            margin: 30px 0;
        }
        
        .security-title {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #276749;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .security-text {
            color: #22543d;
            font-size: 14px;
            line-height: 1.6;
        }
        
        /* Lien alternatif */
        .alternative-link {
            background: #f7fafc;
            padding: 20px;
            border-radius: 12px;
            margin: 30px 0;
            border: 1px solid #e2e8f0;
        }
        
        .link-label {
            font-size: 14px;
            color: #718096;
            margin-bottom: 10px;
            font-weight: 500;
        }
        
        .link-text {
            font-size: 14px;
            color: #2968c5;
            word-break: break-all;
            font-family: 'Courier New', monospace;
            background: white;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        
        /* Pied de page */
        .email-footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer-text {
            font-size: 14px;
            color: #718096;
            margin-bottom: 20px;
            line-height: 1.5;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 20px 0;
        }
        
        .social-icon {
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #2968c5;
            text-decoration: none;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
        }
        
        .social-icon:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .copyright {
            font-size: 12px;
            color: #a0aec0;
            margin-top: 20px;
        }
        
        /* Responsive */
        @media (max-width: 640px) {
            .email-container {
                margin: 20px auto;
                border-radius: 16px;
            }
            
            .email-header {
                padding: 30px 20px;
            }
            
            .email-content {
                padding: 30px 20px;
            }
            
            .brand-name {
                font-size: 28px;
            }
            
            .header-title {
                font-size: 24px;
            }
            
            .reset-button {
                padding: 16px 32px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- En-tête -->
        <div class="email-header">
            <div class="header-pattern"></div>
            <div class="brand-logo">
                <div class="logo-icon">🔐</div>
                <div class="brand-name">Cleanix</div>
            </div>
            <h1 class="header-title">Réinitialisation de mot de passe</h1>
            <p class="header-subtitle">Sécurisez votre compte en quelques clics</p>
        </div>
        
        <!-- Contenu principal -->
        <div class="email-content">
            <div class="greeting">
                Bonjour <span class="greeting-name">{{ $userName }}</span>,
            </div>
            
            <div class="message">
                Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Cleanix. 
                Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe sécurisé.
            </div>
            
            <!-- Bouton de réinitialisation -->
            <div class="action-container">
                <a href="{{ $resetLink }}" class="reset-button">
                    <span class="button-icon">🔑</span>
                    Réinitialiser mon mot de passe
                </a>
            </div>
            
            <!-- Section d'urgence -->
            <div class="urgent-section">
                <div class="urgent-title">
                    <span>⏰</span>
                    Lien à durée limitée
                </div>
                <div class="urgent-text">
                    Ce lien de réinitialisation est valable pendant 60 minutes seulement. 
                    Après cette période, vous devrez faire une nouvelle demande pour réinitialiser votre mot de passe.
                </div>
            </div>
            
            <!-- Section de sécurité -->
            <div class="security-section">
                <div class="security-title">
                    <span>🛡️</span>
                    Sécurité de votre compte
                </div>
                <div class="security-text">
                    Si vous n'avez pas effectué cette demande, veuillez ignorer cet email. 
                    Votre compte reste sécurisé et aucune action n'est requise de votre part.
                </div>
            </div>
            
            <!-- Lien alternatif -->
            <div class="alternative-link">
                <div class="link-label">Vous avez des difficultés avec le bouton ? Copiez-collez ce lien :</div>
                <div class="link-text">{{ $resetLink }}</div>
            </div>
        </div>
        
        <!-- Pied de page -->
        <div class="email-footer">
            <div class="footer-text">
                Besoin d'aide supplémentaire ? Contactez notre équipe de support à support@cleanix.com
            </div>
            
            <div class="social-links">
                <a href="#" class="social-icon">🌐</a>
                <a href="#" class="social-icon">🐦</a>
                <a href="#" class="social-icon">📘</a>
                <a href="#" class="social-icon">📷</a>
            </div>
            
            <div class="copyright">
                © 2025 Cleanix. Tous droits réservés.<br>
                Cet email a été envoyé automatiquement, veuillez ne pas y répondre.
            </div>
        </div>
    </div>
</body>
</html>