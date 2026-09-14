<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function index()
    {
        $images = Image::with('product')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $images
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $product = \App\Models\Product::findOrFail($validated['product_id']);

        if ($product->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez ajouter une image qu’à votre propre annonce.'
            ], 403);
        }

        $path = $request->file('image')->store('products', 'public');

        $image = Image::create([
            'product_id' => $validated['product_id'],
            'image' => $path,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Image ajoutée avec succès.',
            'data' => $image
        ], 201);
    }

    public function show(Image $image)
    {
        return response()->json([
            'success' => true,
            'data' => $image->load('product')
        ]);
    }

    public function update(Request $request, Image $image)
    {
        $image->load('product');

        if ($image->product->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez modifier que les images de vos propres annonces.'
            ], 403);
        }

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $newProduct = \App\Models\Product::findOrFail($validated['product_id']);

        if ($newProduct->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas déplacer une image vers l’annonce d’un autre utilisateur.'
            ], 403);
        }

        if ($request->hasFile('image')) {
            if (Storage::disk('public')->exists($image->image)) {
                Storage::disk('public')->delete($image->image);
            }

            $image->image = $request->file('image')->store('products', 'public');
        }

        $image->product_id = $validated['product_id'];
        $image->save();

        return response()->json([
            'success' => true,
            'message' => 'Image modifiée avec succès.',
            'data' => $image
        ]);
    }

    public function destroy(Request $request, Image $image)
    {
        $image->load('product');

        if ($image->product->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez supprimer que les images de vos propres annonces.'
            ], 403);
        }

        if (Storage::disk('public')->exists($image->image)) {
            Storage::disk('public')->delete($image->image);
        }

        $image->delete();

        return response()->json([
            'success' => true,
            'message' => 'Image supprimée avec succès.'
        ]);
    }
}