#!/bin/bash

set -e

echo "Resetting test database, doing new migration and seeding..."

vendor/bin/sail artisan migrate:fresh --seed --env=testing

echo "Running Playwright tests..."

cd test-track-fe
npx playwright test

cd ..

echo "Copying report..."
rm -rf playwright-report
cp -r test-track-fe/playwright-report . 2>/dev/null || true

echo "Done."
