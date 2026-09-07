<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Image;
use Illuminate\Http\Request;

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
            'image' => 'required|string|max:255',
        ]);

        $image = Image::create($validated);

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
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'image' => 'required|string|max:255',
        ]);

        $image->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Image modifiée avec succès.',
            'data' => $image
        ]);
    }

    public function destroy(Image $image)
    {
        $image->delete();

        return response()->json([
            'success' => true,
            'message' => 'Image supprimée avec succès.'
        ]);
    }
}

