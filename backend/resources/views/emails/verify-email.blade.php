<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code de Vérification Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .header {
            background-color: #007bff;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px;
        }
        .content {
            background-color: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .code-box {
            background-color: #f0f0f0;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
            text-align: center;
        }
        .code {
            font-size: 32px;
            font-weight: bold;
            color: #007bff;
            letter-spacing: 5px;
        }
        .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 20px;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            padding: 10px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Vérification de votre Email</h1>
        </div>
        
        <div class="content">
            <p>Bonjour,</p>
            
            <p>Vous avez demandé à vérifier votre adresse email sur <strong>Cleanix.com</strong>.</p>
            
            <p>Veuillez utiliser le code de vérification ci-dessous dans votre profil:</p>
            
            <div class="code-box">
                <div class="code">{{ $code }}</div>
            </div>
            
            <p>Ce code est valide pendant <strong>10 minutes</strong>.</p>
            
            <div class="warning">
                <strong>Sécurité:</strong> Ne partagez jamais ce code avec quiconque. L'équipe de Cleanix ne vous demandera jamais votre code par email ou message.
            </div>
            
            <p>Si vous n'avez pas demandé cette vérification, vous pouvez ignorer cet email.</p>
            
            <p>Cordialement,<br>
            L'équipe Cleanix</p>
        </div>
        
        <div class="footer">
            <p>&copy; 2024 Cleanix.com - Tous droits réservés</p>
        </div>
    </div>
</body>
</html>
