<?php
// Check if the request is for a file that exists
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);
$file = __DIR__ . $path;

// If it's a file that exists, serve it
if (is_file($file)) {
    return false;
}

// Otherwise, serve index.html for React Router
readfile(__DIR__ . '/index.html');
?>