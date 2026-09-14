<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Product;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $messages = Message::with([
            'sender:id,name,email',
            'receiver:id,name,email',
            'product:id,title,user_id',
        ])
            ->where(function ($query) use ($userId) {
                $query->where('sender_id', $userId)
                    ->orWhere('receiver_id', $userId);
            })
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $messages,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'message' => 'required|string|max:2000',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        if ($product->user_id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas vous contacter vous-même.',
            ], 422);
        }

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $product->user_id,
            'product_id' => $product->id,
            'message' => $validated['message'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message envoyé avec succès.',
            'data' => $message->load([
                'sender:id,name,email',
                'receiver:id,name,email',
                'product:id,title,user_id',
            ]),
        ], 201);
    }

    public function show(Request $request, Message $message)
    {
        $userId = $request->user()->id;

        if (
            $message->sender_id !== $userId &&
            $message->receiver_id !== $userId
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas consulter ce message.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $message->load([
                'sender:id,name,email',
                'receiver:id,name,email',
                'product:id,title,user_id',
            ]),
        ]);
    }
}