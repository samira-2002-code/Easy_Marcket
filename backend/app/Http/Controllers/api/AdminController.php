<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Message;
use App\Models\Product;
use App\Models\Report;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json(['success' => true, 'data' => [
            'users' => User::count(),
            'products' => Product::count(),
            'categories' => Category::count(),
            'messages' => Message::count(),
        ]]);
    }

    public function users()
    {
        return response()->json(['success' => true, 'data' => User::latest()->get()]);
    }

    public function destroyUser(User $user, Request $request)
    {
        abort_if($user->id === $request->user()->id, 422, 'Vous ne pouvez pas supprimer votre propre compte.');
        $user->delete();
        return response()->json(['success' => true]);
    }

    public function products()
    {
        return response()->json(['success' => true, 'data' => Product::with(['category', 'user'])->latest()->get()]);
    }

    public function destroyProduct(Product $product)
    {
        $product->delete();
        return response()->json(['success' => true]);
    }

    public function reports()
    {
        return response()->json(['success' => true, 'data' => Report::with(['user:id,name,email', 'product:id,title'])->latest()->get()]);
    }

    public function updateReport(Request $request, Report $report)
    {
        $validated = $request->validate(['status' => 'required|in:pending,reviewed,resolved']);
        $wasResolved = $report->status === 'resolved';
        $report->update($validated);

        if (!$wasResolved && $validated['status'] === 'resolved' && $report->product) {
            Notification::create([
                'user_id' => $report->product->user_id,
                'type' => 'report_resolved',
                'message' => 'Un signalement concernant votre produit a été traité par un administrateur.',
            ]);
        }

        return response()->json(['success' => true, 'data' => $report]);
    }
}
