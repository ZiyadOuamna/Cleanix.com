<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = \Illuminate\Http\Request::capture()
);

// Get first user
$user = \App\Models\User::first();

if ($user) {
    echo "User found: " . $user->email . "\n";
    
    // Create token
    $token = $user->createToken('test')->plainTextToken;
    echo "Token: " . $token . "\n";
    
    // Get notifications
    $notifications = \App\Models\Notification::where('user_id', $user->id)->get();
    echo "Notifications count: " . $notifications->count() . "\n";
    foreach ($notifications as $notif) {
        echo "- " . $notif->titre . " (" . $notif->type . ")\n";
    }
} else {
    echo "No user found\n";
}
