<?php

namespace App\Console\Commands;

use App\Mail\NewUserRegisteredMail;
use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

#[Signature('app:send-new-user-registered-mail')]
#[Description('Command description')]
class SendNewUserRegisteredMail extends Command
{
    /**
     * Execute the console command.
     * sail artisan app:send-new-user-registered-mail
     */
    public function handle(): void
    {
        // We need a user for our mail (this user "just registered" in our system)
        $user = User::first();
        Mail::to(config('mail.admin_email'))
            ->send(new NewUserRegisteredMail($user));

        $this->info('New user registered email sent successfully.');
    }
}