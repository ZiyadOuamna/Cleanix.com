<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Client;
use App\Models\Freelancer;
use App\Models\Superviseur;
use App\Models\Order;
use App\Models\Paiement;
use App\Models\Reclamation;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SuperviseurController extends Controller
{
    /**
     * Check if user is superviseur
     */
    private function isSuperviseur(Request $request)
    {
        $user = $request->user();
        return $user && $user->user_type === 'Superviseur';
    }

    // ========== CLIENTS ==========

    /**
     * Get all clients with pagination and filtering
     */
    public function getClients(Request $request)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $page = $request->query('page', 1);
        $search = $request->query('search', '');
        $filter = $request->query('filter', 'all');

        $query = User::where('user_type', 'Client')
            ->with('client');

        // Search by name or email
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%$search%")
                  ->orWhere('prenom', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }

        // Status filter (if needed)
        if ($filter !== 'all') {
            $query->where('status', $filter);
        }

        $clients = $query->paginate(10, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'data' => $clients,
        ]);
    }

    /**
     * Get single client by ID
     */
    public function getClientById(Request $request, $clientId)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $client = User::where('user_type', 'Client')
            ->where('id', $clientId)
            ->with('client')
            ->first();

        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Client not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $client,
        ]);
    }

    /**
     * Update client
     */
    public function updateClient(Request $request, $clientId)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $clientId,
            'telephone' => 'sometimes|string',
            'genre' => 'sometimes|in:Homme,Femme',
            'adresse' => 'sometimes|string',
            'ville' => 'sometimes|string',
            'code_postal' => 'sometimes|string',
        ]);

        $user = User::where('type', 'Client')->find($clientId);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Client not found'
            ], 404);
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Client updated successfully',
            'data' => $user,
        ]);
    }

    /**
     * Delete client
     */
    public function deleteClient(Request $request, $clientId)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $user = User::where('user_type', 'Client')->find($clientId);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Client not found'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Client deleted successfully',
        ]);
    }

    // ========== FREELANCERS ==========

    /**
     * Get all freelancers with pagination and filtering
     */
    public function getFreelancers(Request $request)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $page = $request->query('page', 1);
        $search = $request->query('search', '');
        $filter = $request->query('filter', 'all');

        $query = User::where('user_type', 'Freelancer')
            ->with('freelancer');

        // Search by name or email
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%$search%")
                  ->orWhere('prenom', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }

        // Status filter
        if ($filter !== 'all') {
            $query->whereHas('freelancer', function ($q) use ($filter) {
                $q->where('statut_disponibilite', $filter);
            });
        }

        $freelancers = $query->paginate(10, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'data' => $freelancers,
        ]);
    }

    /**
     * Get single freelancer by ID
     */
    public function getFreelancerById(Request $request, $freelancerId)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $freelancer = User::where('user_type', 'Freelancer')
            ->where('id', $freelancerId)
            ->with('freelancer')
            ->first();

        if (!$freelancer) {
            return response()->json([
                'success' => false,
                'message' => 'Freelancer not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $freelancer,
        ]);
    }

    /**
     * Update freelancer
     */
    public function updateFreelancer(Request $request, $freelancerId)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $freelancerId,
            'telephone' => 'sometimes|string',
            'genre' => 'sometimes|in:Homme,Femme',
            'details_compte_bancaire' => 'sometimes|string',
        ]);

        $user = User::where('user_type', 'Freelancer')->find($freelancerId);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Freelancer not found'
            ], 404);
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Freelancer updated successfully',
            'data' => $user,
        ]);
    }

    /**
     * Delete freelancer
     */
    public function deleteFreelancer(Request $request, $freelancerId)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $user = User::where('user_type', 'Freelancer')->find($freelancerId);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Freelancer not found'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Freelancer deleted successfully',
        ]);
    }

    // ========== DASHBOARD STATS ==========

    /**
     * Get dashboard statistics
     */
    public function getDashboardStats(Request $request)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $totalClients = User::where('user_type', 'Client')->count();
        $totalFreelancers = User::where('user_type', 'Freelancer')->count();
        $totalOrders = Order::count();
        $totalRevenue = Paiement::where('statut', 'confirmé')->sum('montant');

        return response()->json([
            'success' => true,
            'data' => [
                'totalClients' => $totalClients,
                'totalFreelancers' => $totalFreelancers,
                'totalOrders' => $totalOrders,
                'totalRevenue' => $totalRevenue,
            ]
        ]);
    }

    /**
     * Get users statistics
     */
    public function getUsersStats(Request $request)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $stats = [
            'totalUsers' => User::count(),
            'clients' => User::where('user_type', 'Client')->count(),
            'freelancers' => User::where('user_type', 'Freelancer')->count(),
            'newUsersThisMonth' => User::where('created_at', '>=', now()->startOfMonth())->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Get transaction statistics
     */
    public function getTransactionStats(Request $request)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $stats = [
            'totalTransactions' => Paiement::count(),
            'totalRevenue' => Paiement::where('statut', 'confirmé')->sum('montant'),
            'pendingPayments' => Paiement::where('statut', 'en attente')->sum('montant'),
            'transactionsThisMonth' => Paiement::where('created_at', '>=', now()->startOfMonth())->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    // ========== RECLAMATIONS ==========

    /**
     * Get all reclamations
     */
    public function getReclamations(Request $request)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $page = $request->query('page', 1);
        $search = $request->query('search', '');
        $filter = $request->query('filter', 'all');

        $query = Reclamation::with(['ordre', 'client']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('objet', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%");
            });
        }

        if ($filter !== 'all') {
            $query->where('statut', $filter);
        }

        $reclamations = $query->paginate(10, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'data' => $reclamations,
        ]);
    }

    /**
     * Get single reclamation
     */
    public function getReclamationById(Request $request, $reclamationId)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $reclamation = Reclamation::with(['ordre', 'client'])->find($reclamationId);

        if (!$reclamation) {
            return response()->json([
                'success' => false,
                'message' => 'Reclamation not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $reclamation,
        ]);
    }

    /**
     * Update reclamation status
     */
    public function updateReclamation(Request $request, $reclamationId)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'statut' => 'required|in:en attente,en cours,résolu,rejeté',
            'resolution' => 'sometimes|string',
        ]);

        $reclamation = Reclamation::find($reclamationId);

        if (!$reclamation) {
            return response()->json([
                'success' => false,
                'message' => 'Reclamation not found'
            ], 404);
        }

        $reclamation->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Reclamation updated successfully',
            'data' => $reclamation,
        ]);
    }

    /**
     * Resolve reclamation
     */
    public function resolveReclamation(Request $request, $reclamationId)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'resolution' => 'required|string',
        ]);

        $reclamation = Reclamation::find($reclamationId);

        if (!$reclamation) {
            return response()->json([
                'success' => false,
                'message' => 'Reclamation not found'
            ], 404);
        }

        $reclamation->update([
            'statut' => 'résolu',
            'resolution' => $validated['resolution'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reclamation resolved successfully',
            'data' => $reclamation,
        ]);
    }

    // ========== PAYMENTS ==========

    /**
     * Get all payments
     */
    public function getPayments(Request $request)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $page = $request->query('page', 1);
        $search = $request->query('search', '');
        $filter = $request->query('filter', 'all');

        $query = Paiement::with(['ordre', 'client']);

        if ($search) {
            $query->where('reference', 'like', "%$search%");
        }

        if ($filter !== 'all') {
            $query->where('statut', $filter);
        }

        $payments = $query->paginate(10, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'data' => $payments,
        ]);
    }

    /**
     * Get single payment
     */
    public function getPaymentById(Request $request, $paymentId)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $payment = Paiement::with(['ordre', 'client'])->find($paymentId);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $payment,
        ]);
    }

    /**
     * Process refund
     */
    public function processRefund(Request $request, $paymentId)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        $payment = Paiement::find($paymentId);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found'
            ], 404);
        }

        if ($validated['amount'] > $payment->montant) {
            return response()->json([
                'success' => false,
                'message' => 'Refund amount exceeds payment amount'
            ], 422);
        }

        $payment->update([
            'statut' => 'remboursé',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Refund processed successfully',
            'data' => $payment,
        ]);
    }

    // ========== ORDERS ==========

    /**
     * Get all orders
     */
    public function getOrders(Request $request)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $page = $request->query('page', 1);
        $search = $request->query('search', '');
        $filter = $request->query('filter', 'all');

        $query = Order::with(['client', 'freelancer', 'service']);

        if ($search) {
            $query->where('reference', 'like', "%$search%");
        }

        if ($filter !== 'all') {
            $query->where('statut', $filter);
        }

        $orders = $query->paginate(10, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    /**
     * Get single order
     */
    public function getOrderById(Request $request, $orderId)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $order = Order::with(['client', 'freelancer', 'service'])->find($orderId);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * Update order status
     */
    public function updateOrderStatus(Request $request, $orderId)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:en attente,accepté,en cours,complété,annulé',
        ]);

        $order = Order::find($orderId);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        $order->update([
            'statut' => $validated['status'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'data' => $order,
        ]);
    }

    /**
     * Create new client (by superviseur)
     */
    public function createClient(Request $request)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $validated = $request->validate([
                'prenom' => 'required|string|max:255',
                'nom' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'telephone' => 'nullable|string|max:20',
                'ville' => 'nullable|string|max:255',
                'password' => 'required|string|min:8',
            ]);

            DB::beginTransaction();

            // Create user
            $user = User::create([
                'prenom' => $validated['prenom'],
                'nom' => $validated['nom'],
                'email' => $validated['email'],
                'telephone' => $validated['telephone'] ?? null,
                'password' => bcrypt($validated['password']),
                'user_type' => 'Client',
                'email_verified_at' => now(), // Auto-verify for superviseur-created users
            ]);

            // Create client profile
            $client = Client::create([
                'user_id' => $user->id,
                'ville' => $validated['ville'] ?? 'Non spécifiée',
                'solde' => 0,
            ]);

            // Send email with login credentials
            $this->sendCredentialsEmail($user, $validated['password']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Client created successfully',
                'data' => $user->load('client'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error creating client: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create new freelancer (by superviseur)
     */
    public function createFreelancer(Request $request)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $validated = $request->validate([
                'prenom' => 'required|string|max:255',
                'nom' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'telephone' => 'nullable|string|max:20',
                'ville' => 'nullable|string|max:255',
                'password' => 'required|string|min:8',
            ]);

            DB::beginTransaction();

            // Create user
            $user = User::create([
                'prenom' => $validated['prenom'],
                'nom' => $validated['nom'],
                'email' => $validated['email'],
                'telephone' => $validated['telephone'] ?? null,
                'password' => bcrypt($validated['password']),
                'user_type' => 'Freelancer',
                'email_verified_at' => now(), // Auto-verify for superviseur-created users
            ]);

            // Create freelancer profile
            $freelancer = Freelancer::create([
                'user_id' => $user->id,
                'ville' => $validated['ville'] ?? 'Non spécifiée',
                'solde' => 0,
                'note' => 0,
                'statut' => 'actif',
            ]);

            // Send email with login credentials
            $this->sendCredentialsEmail($user, $validated['password']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Freelancer created successfully',
                'data' => $user->load('freelancer'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error creating freelancer: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Send credentials email to newly created user
     */
    private function sendCredentialsEmail($user, $password)
    {
        try {
            \Mail::send('emails.credentials', [
                'user' => $user,
                'password' => $password,
                'loginUrl' => config('app.frontend_url') . '/login',
            ], function ($message) use ($user) {
                $message->to($user->email)
                        ->subject('[Cleanix] Vos identifiants de connexion');
            });
        } catch (\Exception $e) {
            \Log::error('Error sending credentials email: ' . $e->getMessage());
        }
    }

    /**
     * Get all superviseurs (with pagination)
     */
    public function getSuperviseurs(Request $request)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $page = $request->query('page', 1);
            $search = $request->query('search', '');
            $perPage = 15;

            $query = User::where('user_type', 'Superviseur')
                        ->with('superviseur');

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('prenom', 'like', '%' . $search . '%')
                      ->orWhere('nom', 'like', '%' . $search . '%')
                      ->orWhere('email', 'like', '%' . $search . '%');
                });
            }

            $superviseurs = $query->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'data' => $superviseurs,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching superviseurs: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get superviseur by ID
     */
    public function getSuperviseurById($superviseurId)
    {
        try {
            $user = User::where('id', $superviseurId)
                       ->where('user_type', 'Superviseur')
                       ->with('superviseur')
                       ->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Superviseur not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $user,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching superviseur: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create new superviseur (by main superviseur)
     */
    public function createSuperviseur(Request $request)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $validated = $request->validate([
                'prenom' => 'required|string|max:255',
                'nom' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'telephone' => 'nullable|string|max:20',
                'ville' => 'nullable|string|max:255',
                'password' => 'required|string|min:8',
            ]);

            DB::beginTransaction();

            // Create user
            $user = User::create([
                'prenom' => $validated['prenom'],
                'nom' => $validated['nom'],
                'email' => $validated['email'],
                'telephone' => $validated['telephone'] ?? null,
                'password' => bcrypt($validated['password']),
                'user_type' => 'Superviseur',
                'email_verified_at' => now(),
            ]);

            // Create superviseur profile
            $superviseur = Superviseur::create([
                'user_id' => $user->id,
                'ville' => $validated['ville'] ?? 'Non spécifiée',
                'statut' => 'actif',
            ]);

            // Send email with login credentials
            $this->sendCredentialsEmail($user, $validated['password']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Superviseur created successfully',
                'data' => $user->load('superviseur'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error creating superviseur: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update superviseur
     */
    public function updateSuperviseur(Request $request, $superviseurId)
    {
        if (!$this->isSuperviseur($request)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $user = User::where('id', $superviseurId)
                       ->where('user_type', 'Superviseur')
                       ->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Superviseur not found'
                ], 404);
            }

            $validated = $request->validate([
                'prenom' => 'nullable|string|max:255',
                'nom' => 'nullable|string|max:255',
                'email' => 'nullable|email|unique:users,email,' . $superviseurId,
                'telephone' => 'nullable|string|max:20',
                'ville' => 'nullable|string|max:255',
                'password' => 'nullable|string|min:8',
            ]);

            // Remove empty fields
            $validated = array_filter($validated, fn($value) => !is_null($value));

            // Hash password if provided
            if (isset($validated['password'])) {
                $validated['password'] = bcrypt($validated['password']);
            }

            $user->update($validated);

            // Update superviseur profile if ville is provided
            if (isset($validated['ville'])) {
                $user->superviseur?->update(['ville' => $validated['ville']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Superviseur updated successfully',
                'data' => $user->load('superviseur'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating superviseur: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete superviseur
     */
    public function deleteSuperviseur($superviseurId)
    {
        try {
            $user = User::where('id', $superviseurId)
                       ->where('user_type', 'Superviseur')
                       ->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Superviseur not found'
                ], 404);
            }

            // Delete superviseur profile first
            $user->superviseur?->delete();

            // Delete user
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Superviseur deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting superviseur: ' . $e->getMessage(),
            ], 500);
        }
    }
}
