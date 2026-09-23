<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Report;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $validated = $request->validate(['reason' => 'required|string|max:1000']);

        $report = Report::updateOrCreate(
            ['user_id' => $request->user()->id, 'product_id' => $product->id],
            ['reason' => $validated['reason'], 'status' => 'pending']
        );

        if ($report->wasRecentlyCreated) {
            User::where('role', 'admin')->get()->each(function (User $admin) {
                Notification::create([
                    'user_id' => $admin->id,
                    'type' => 'report',
                    'message' => 'Un nouveau produit a été signalé.',
                ]);
            });
        }

        return response()->json(['success' => true, 'data' => $report], 201);
    }
}
