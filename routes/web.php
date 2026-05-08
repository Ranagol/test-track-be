<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {

    // xdebug_info();
    // exit;

    return ['Laravel' => app()->version()];
});

require __DIR__.'/auth.php';
