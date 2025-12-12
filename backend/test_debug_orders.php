<?php
// Test script to debug orders

// Load Laravel
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Http\Kernel');
$request = \Illuminate\Http\Request::capture();
$response = $kernel->handle($request);

// Use Laravel
use App\Models\Order;
use App\Models\User;

// Get all orders
echo "=== ALL ORDERS ===\n";
$allOrders = Order::all();
foreach ($allOrders as $order) {
    echo "Order #" . $order->id . ": Status=" . $order->status . ", Freelancer=" . $order->freelancer_id . ", Client=" . $order->client_id . "\n";
}

// Get all freelancers
echo "\n=== ALL FREELANCERS ===\n";
$freelancers = User::where('user_type', 'Freelancer')->get();
foreach ($freelancers as $freelancer) {
    echo "Freelancer #" . $freelancer->id . ": " . $freelancer->firstname . " " . $freelancer->lastname . "\n";
}

// Check orders for each freelancer
echo "\n=== ORDERS PER FREELANCER ===\n";
foreach ($freelancers as $freelancer) {
    $orders = Order::where('freelancer_id', $freelancer->id)
        ->whereIn('status', ['accepted', 'in_progress'])
        ->get();
    echo "Freelancer #" . $freelancer->id . " (" . $freelancer->firstname . "): " . count($orders) . " accepted/in_progress orders\n";
}

// Check all orders statuses
echo "\n=== ALL ORDER STATUSES ===\n";
$statusGroups = Order::groupBy('status')->selectRaw('status, count(*) as count')->get();
foreach ($statusGroups as $group) {
    echo "Status '" . $group->status . "': " . $group->count . " orders\n";
}
