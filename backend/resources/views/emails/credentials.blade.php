<!DOCTYPE html>
<html dir="ltr" lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vos identifiants de connexion - Cleanix</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 16px;
            color: #333;
            margin-bottom: 20px;
        }
        .info-box {
            background-color: #f9f9f9;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .info-box p {
            margin: 8px 0;
            color: #555;
            font-size: 14px;
        }
        .label {
            font-weight: 600;
            color: #333;
            display: inline-block;
            width: 100px;
        }
        .value {
            color: #667eea;
            font-family: 'Courier New', monospace;
            font-weight: 600;
            word-break: break-all;
        }
        .button {
            display: inline-block;
            background-color: #667eea;
            color: #ffffff;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
            margin-top: 20px;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #764ba2;
        }
        .instructions {
            background-color: #e8f4f8;
            border-left: 4px solid #0099cc;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .instructions h3 {
            margin-top: 0;
            color: #0099cc;
            font-size: 16px;
        }
        .instructions ol {
            margin: 10px 0;
            padding-left: 20px;
        }
        .instructions li {
            margin: 8px 0;
            color: #333;
            font-size: 14px;
        }
        .security-note {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 13px;
            color: #856404;
        }
        .footer {
            background-color: #f9f9f9;
            border-top: 1px solid #e0e0e0;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #999;
        }
        .footer p {
            margin: 5px 0;
        }
        .divider {
            height: 1px;
            background-color: #e0e0e0;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Cleanix</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px;">Votre plateforme de services de nettoyage</p>
        </div>

        <div class="content">
            <p class="greeting">
                Bonjour <strong>{{ $user->prenom }} {{ $user->nom }}</strong>,
            </p>

            <p style="color: #555; font-size: 15px; line-height: 1.6;">
                Bienvenue sur <strong>Cleanix</strong>! Votre compte a été créé par notre équipe de support. 
                Vous pouvez maintenant vous connecter à votre tableau de bord avec les identifiants ci-dessous.
            </p>

            <div class="info-box">
                <p>
                    <span class="label">Email :</span>
                    <span class="value">{{ $user->email }}</span>
                </p>
                <p>
                    <span class="label">Mot de passe :</span>
                    <span class="value">{{ $password }}</span>
                </p>
            </div>

            <div class="instructions">
                <h3>📋 Étapes pour vous connecter :</h3>
                <ol>
                    <li>Accédez à la page de connexion en cliquant sur le bouton ci-dessous</li>
                    <li>Entrez votre email : <strong>{{ $user->email }}</strong></li>
                    <li>Entrez votre mot de passe</li>
                    <li>Cliquez sur "Se connecter"</li>
                    <li>Une fois connecté, nous vous recommandons de <strong>changer votre mot de passe</strong></li>
                </ol>
            </div>

            <center>
                <a href="{{ $loginUrl }}" class="button">Se connecter à Cleanix</a>
            </center>

            <div class="security-note">
                <strong>🔒 Note de sécurité :</strong> 
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Ne partagez jamais vos identifiants avec d'autres personnes</li>
                    <li>Changez votre mot de passe dès votre première connexion</li>
                    <li>Utilisez un mot de passe fort et unique</li>
                    <li>Assurez-vous toujours d'être sur le bon site avant de vous connecter</li>
                </ul>
            </div>

            <div class="divider"></div>

            <p style="color: #777; font-size: 14px; line-height: 1.6;">
                Si vous avez des questions ou besoin d'assistance, notre équipe de support est là pour vous aider. 
                N'hésitez pas à nous contacter à travers le formulaire de contact sur notre plateforme.
            </p>

            <p style="color: #777; font-size: 14px;">
                Cordialement,<br>
                <strong>L'équipe Cleanix</strong>
            </p>
        </div>

        <div class="footer">
            <p>&copy; 2024 Cleanix. Tous droits réservés.</p>
            <p>Cette email a été envoyé automatiquement. Veuillez ne pas y répondre.</p>
        </div>
    </div>
</body>
</html>
