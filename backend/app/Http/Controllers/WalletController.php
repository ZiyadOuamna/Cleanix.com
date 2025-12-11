<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Wallet;
use App\Models\Transaction;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    /**
     * Get wallet data
     */
    public function getWallet(Request $request)
    {
        $user = $request->user();
        
        $wallet = Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0, 'pending' => 0]
        );

        return response()->json([
            'success' => true,
            'wallet' => $wallet
        ]);
    }

    /**
     * Get transactions
     */
    public function getTransactions(Request $request)
    {
        $user = $request->user();
        
        $transactions = Transaction::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'transactions' => $transactions
        ]);
    }

    /**
     * Get payment methods
     */
    public function getPaymentMethods(Request $request)
    {
        $user = $request->user();
        
        $methods = PaymentMethod::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'methods' => $methods
        ]);
    }

    /**
     * Add payment method
     */
    public function addPaymentMethod(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:visa,mastercard,paypal,bank_transfer',
            'details' => 'required|array'
        ]);

        $user = $request->user();

        $method = PaymentMethod::create([
            'user_id' => $user->id,
            'type' => $validated['type'],
            'details' => $validated['details'],
            'verified' => false
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Méthode de paiement ajoutée',
            'method' => $method
        ]);
    }

    /**
     * Request withdrawal
     */
    public function requestWithdrawal(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:50',
            'payment_method_id' => 'required|exists:payment_methods,id'
        ]);

        $user = $request->user();
        $wallet = Wallet::where('user_id', $user->id)->first();

        if (!$wallet || $wallet->balance < $validated['amount']) {
            return response()->json([
                'success' => false,
                'message' => 'Solde insuffisant'
            ], 422);
        }

        $withdrawal = Transaction::create([
            'user_id' => $user->id,
            'type' => 'withdrawal',
            'amount' => $validated['amount'],
            'description' => 'Retrait de fonds',
            'status' => 'pending',
            'payment_method_id' => $validated['payment_method_id']
        ]);

        // Update wallet
        $wallet->update([
            'balance' => $wallet->balance - $validated['amount'],
            'pending' => $wallet->pending + $validated['amount']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Retrait demandé',
            'withdrawal' => $withdrawal
        ]);
    }
}
