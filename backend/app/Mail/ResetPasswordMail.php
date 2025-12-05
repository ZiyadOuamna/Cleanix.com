<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $email;
    public $token;
    public $userName;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($email, $token, $userName)
    {
        $this->email = $email;
        $this->token = $token;
        $this->userName = $userName;
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        return new Envelope(
            subject: 'Réinitialisation de votre mot de passe - Cleanix',
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        $resetLink = config('app.frontend_url') . '/reset-password?token=' . $this->token . '&email=' . urlencode($this->email);
        
        return new Content(
            view: 'emails.reset-password',
                with: [
                'resetLink' => $resetLink,
                'userName' => $this->userName,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        return [];
    }
}
