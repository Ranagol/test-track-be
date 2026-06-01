<?php

namespace App\Providers;

use App\Interfaces\TestAttemptEvaluatorInterface;
use App\Interfaces\TestControllerServiceInterface;
use App\Services\TestAttemptEvaluator;
use App\Services\TestControllerService;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            TestAttemptEvaluatorInterface::class,
            TestAttemptEvaluator::class
        );

        $this->app->bind(
            TestControllerServiceInterface::class,
            TestControllerService::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url') . "/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });
    }
}
