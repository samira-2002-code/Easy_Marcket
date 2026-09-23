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
        /*
         * Support both:
         * - message : new frontend format
         * - content : old frontend format
         */
        if (!$request->filled('message') && $request->filled('content')) {
            $request->merge([
                'message' => $request->input('content'),
            ]);
        }

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'message' => 'required|string|max:2000',
            'receiver_id' => 'nullable|exists:users,id',
        ]);

        $userId = $request->user()->id;

        $product = Product::findOrFail($validated['product_id']);

        /*
         * First message:
         * receiver = product owner.
         *
         * Reply:
         * receiver_id is provided by the frontend.
         */
        if (!empty($validated['receiver_id'])) {
            $receiverId = (int) $validated['receiver_id'];

            /*
             * The receiver must be part of an existing
             * conversation about this product.
             */
            $conversationExists = Message::where('product_id', $product->id)
                ->where(function ($query) use ($userId, $receiverId) {
                    $query
                        ->where(function ($q) use ($userId, $receiverId) {
                            $q->where('sender_id', $userId)
                                ->where('receiver_id', $receiverId);
                        })
                        ->orWhere(function ($q) use ($userId, $receiverId) {
                            $q->where('sender_id', $receiverId)
                                ->where('receiver_id', $userId);
                        });
                })
                ->exists();

            if (!$conversationExists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cette conversation n’existe pas.',
                ], 403);
            }
        } else {
            /*
             * New conversation:
             * automatically contact the seller.
             */
            $receiverId = $product->user_id;
        }

        /*
         * Prevent self-contact.
         */
        if ($receiverId === $userId) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas vous contacter vous-même.',
            ], 422);
        }

        $message = Message::create([
            'sender_id' => $userId,
            'receiver_id' => $receiverId,
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