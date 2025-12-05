<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Réinitialisation de mot de passe</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2968c5ff;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #2968c5ff;
            margin: 0;
            font-size: 28px;
        }
        .content {
            color: #333;
            line-height: 1.6;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #165ed1ff;
            color: #ffffff;
            padding: 12px 30px;
            border-radius: 5px;
            text-decoration: none;
            margin: 20px 0;
            font-weight: bold;
        }
        .button:hover {
            background-color: #295377ff;
        }
        .security-notice {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            border: 1px solid #e9ecef;
        }
        .security-notice p {
            margin: 0;
            color: #6c757d;
            font-size: 14px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #999;
            font-size: 12px;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 Cleanix</h1>
            <p>Réinitialisation de mot de passe</p>
        </div>

        <div class="content">
            <p>Bonjour {{ $userName }},</p>

            <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Cleanix.</p>

            <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>

            <div style="text-align: center;">
                <a href="{{ $resetLink }}" class="button">Réinitialiser mon mot de passe</a>
            </div>

            <!-- <p>Ou copiez et collez ce lien dans votre navigateur :</p>
            <p style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all;">
                {{ $resetLink }}
            </p> -->

            <div class="warning">
                <strong>⚠️ Important :</strong> Ce lien n'est valide que pour 60 minutes. Si vous ne l'avez pas utilisé avant l'expiration, vous devrez redemander une réinitialisation.
            </div>

 <div class="security-notice">
                <p><strong>🛡️ Note de sécurité :</strong> Si vous n'avez pas effectué cette demande, veuillez ignorer cet email. Votre compte reste sécurisé et aucune action n'est requise de votre part.</p>
            </div>        </div>

        <div class="footer">
            <p>© 2025 Cleanix. Tous droits réservés.</p>
            <p>Ceci est un email automatisé, veuillez ne pas y répondre.</p>
        </div>
    </div>
</body>
</html>
