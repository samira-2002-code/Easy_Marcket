<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\UserController;

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->post(
    '/logout',
    [AuthController::class, 'logout']
);

// Categories
Route::apiResource('categories', CategoryController::class);

// Products
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Images publiques en lecture
Route::get('/images', [ImageController::class, 'index']);
Route::get('/images/{image}', [ImageController::class, 'show']);

// Actions protégées
Route::middleware('auth:sanctum')->group(function () {

    // Products
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::patch('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    // Images
    Route::post('/images', [ImageController::class, 'store']);
    Route::put('/images/{image}', [ImageController::class, 'update']);
    Route::patch('/images/{image}', [ImageController::class, 'update']);
    Route::delete('/images/{image}', [ImageController::class, 'destroy']);

    // Profile
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
});