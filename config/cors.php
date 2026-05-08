<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    // Ensures CSRF endpoint and auth routes are CORS-enabled.
    'paths' => ['*'],

    'allowed_methods' => ['*'],

    // Must match your Vue dev server exactly.
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5174')],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // REQUIRED so cookies (session + CSRF) are sent.
    'supports_credentials' => true,

];
