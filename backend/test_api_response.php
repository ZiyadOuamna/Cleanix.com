<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);

// Get first user
$user = \App\Models\User::first();

if ($user) {
    echo "User: " . $user->email . "\n";
    
    // Get notifications with the same logic as the controller
    $notifications = \App\Models\Notification::where('user_id', $user->id)
        ->orderBy('date_envoi', 'desc')
        ->paginate(20);

    echo "API Response Structure:\n";
    echo json_encode([
        'data' => $notifications->items(),
        'current_page' => $notifications->currentPage(),
        'last_page' => $notifications->lastPage(),
        'total' => $notifications->total(),
        'per_page' => $notifications->perPage()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
} else {
    echo "No user found\n";
}
