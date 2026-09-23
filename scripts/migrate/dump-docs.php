<?php

/**
 * Dumps PagesSeeder's docs/... pages as JSON via reflection (see migrate-scripts/README.md).
 */

declare(strict_types=1);

require __DIR__.'/../host-worktree/vendor/autoload.php';

$seederClass = 'Database\\Seeders\\PagesSeeder';
require __DIR__.'/../host-worktree/database/seeders/Support/SeedLinks.php';
require __DIR__.'/../host-worktree/database/seeders/PagesSeeder.php';

$ref = new ReflectionClass($seederClass);
$seeder = $ref->newInstanceWithoutConstructor();

$pages = $ref->getConstant('PAGES');

$editorial = $ref->getMethod('editorial');
$editorial->setAccessible(true);
$seo = $ref->getMethod('seo');
$seo->setAccessible(true);

$locale = 'en';
$out = [];

foreach ($pages as $definition) {
    $path = $definition['path'];

    if (!str_starts_with($path, 'docs')) {
        continue;
    }

    $ed = $editorial->invoke($seeder, $path, $definition['title']);
    $seoData = $seo->invoke($seeder, $path, $locale);

    $out[] = [
        'path' => $path,
        'type' => $definition['type'],
        'title' => $definition['title'],
        'summary' => $ed['summary'],
        'seoDescription' => $seoData['description'][$locale] ?? null,
        'body' => $ed['body'],
    ];
}

echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), "\n";
