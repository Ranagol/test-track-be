<?php

namespace App\Services;

use Illuminate\Filesystem\Filesystem as BaseFilesystem;

class FilesystemService extends BaseFilesystem
{
    /**
     * Replace the given file content with the given content, safely handling tempnam() errors.
     * This prevents issues with tempnam() warnings in Docker environments.
     */
    public function replace($path, $content, $mode = null)
    {
        clearstatcache(true, $path);

        $path = realpath($path) ?: $path;

        // Suppress warnings from tempnam() which can occur in Docker environments
        $tempPath = @tempnam(dirname($path), basename($path));

        // If tempnam failed, try direct write (fallback for Docker permission issues)
        if (! $tempPath) {
            file_put_contents($path, $content);

            return;
        }

        // Fix permissions of tempPath because `tempnam()` creates it with permissions set to 0600
        if (! is_null($mode)) {
            @chmod($tempPath, $mode);
        } else {
            @chmod($tempPath, 0777 - umask());
        }

        file_put_contents($tempPath, $content);

        // Safely rename, with fallback to direct write
        if (! @rename($tempPath, $path)) {
            @unlink($tempPath);
            file_put_contents($path, $content);
        }
    }
}
