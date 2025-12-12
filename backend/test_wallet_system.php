<?php
// Test script to verify Wallet and Transaction system

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

use App\Models\Wallet;
use App\Models\Transaction;
use App\Models\User;

echo "=== TESTING WALLET & TRANSACTION SYSTEM ===\n\n";

// Get all wallets
echo "📊 WALLETS:\n";
$wallets = Wallet::with('user')->get();
foreach ($wallets as $wallet) {
    echo "- User #" . $wallet->user_id . " (" . ($wallet->user?->firstname ?? 'Unknown') . "): Balance=" . $wallet->balance . " DH, Pending=" . $wallet->pending . " DH\n";
}

// Get all transactions
echo "\n💳 TRANSACTIONS:\n";
$transactions = Transaction::with('wallet', 'user')->get();
if ($transactions->isEmpty()) {
    echo "- No transactions found\n";
} else {
    foreach ($transactions as $trans) {
        echo "- Trans #" . $trans->id . ": Type=" . $trans->type . ", Montant=" . $trans->montant . " DH, Statut=" . $trans->statut . ", Wallet=" . $trans->wallet_id . ", User=" . $trans->user_id . "\n";
    }
}

echo "\n✅ Test completed!\n";
