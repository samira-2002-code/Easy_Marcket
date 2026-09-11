<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'user']);

        // Recherche
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filtre par catégorie
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filtre par type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Prix minimum
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        // Prix maximum
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Tri
        $sort = $request->get('sort', 'latest');

        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;

            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;

            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;

            default:
                $query->latest();
                break;
        }

        $products = $query->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'type' => [
                'required',
                Rule::in(['sale', 'exchange']),
            ],
            'image' => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;

        $product = Product::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Produit créé avec succès.',
            'data' => $product->load(['category', 'user'])
        ], 201);
    }

    public function show(Product $product)
    {
        return response()->json([
            'success' => true,
            'data' => $product->load([
                'category',
                'user',
                'images'
            ])
        ]);
    }

    public function update(Request $request, Product $product)
    {
        if ($product->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez modifier que vos propres annonces.'
            ], 403);
        }

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'type' => [
                'required',
                Rule::in(['sale', 'exchange']),
            ],
            'image' => 'nullable|string',
        ]);

        $product->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Produit modifié avec succès.',
            'data' => $product->load([
                'category',
                'user',
                'images'
            ])
        ]);
    }

    public function destroy(Request $request, Product $product)
    {
        if ($product->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez supprimer que vos propres annonces.'
            ], 403);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produit supprimé avec succès.'
        ]);
    }
}
