<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {

    // xdebug_info();
    // exit;

    return [
        'Message' => 'Hooray, the Laravel app is working!',
        'Laravel' => app()->version(),
    ];
});
