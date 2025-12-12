<?php
// Script pour mettre à jour les commandes existantes avec service_id

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

use App\Models\Order;
use App\Models\Service;

// Récupérer tous les services pour créer un mapping
$services = Service::all()->keyBy('nom');

// Mettre à jour toutes les commandes
$orders = Order::all();
foreach ($orders as $order) {
    if (!$order->service_id && $order->service_type) {
        // Chercher le service par son nom
        if (isset($services[$order->service_type])) {
            $order->update(['service_id' => $services[$order->service_type]->id]);
            echo "✅ Order #" . $order->id . " updated with service_id = " . $services[$order->service_type]->id . "\n";
        } else {
            echo "⚠️  Order #" . $order->id . " - Service '" . $order->service_type . "' not found\n";
        }
    }
}

echo "\n✅ Mise à jour terminée!\n";
