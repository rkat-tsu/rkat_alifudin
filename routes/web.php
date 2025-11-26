<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RkatController;
use App\Http\Controllers\ApprovalController;
use App\Http\Controllers\IkuController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\TahunAnggaranController;
use App\Http\Controllers\DashboardController; 
use App\Http\Controllers\MonitoringController;
use App\Http\Controllers\UserController; // Pastikan ini ada
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// ROUTE DASHBOARD
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// === SEMUA RUTE YANG MEMERLUKAN LOGIN (ROLE APAPUN) ===
Route::middleware(['auth', 'verified'])->group(function () {

    // === RUTE MONITORING RKAT ===
    Route::get('/monitoring', [MonitoringController::class, 'index'])
        ->name('monitoring.index'); 

    // === RUTE MEMBER / UNIT ===
    Route::get('/member/units', [UnitController::class, 'index'])->name('member.unit.index');

    // === RUTE RKAT ===
    Route::get('/rkat/input', [RkatController::class, 'create'])->name('rkat.create');
    Route::post('/rkat', [RkatController::class, 'store'])->name('rkat.store');

    // === RUTE IKU ===
    Route::get('/iku/input', [IkuController::class, 'create'])->name('iku.create');
    Route::post('/iku', [IkuController::class, 'store'])->name('iku.store');
    
    // === RUTE PERSETUJUAN ===
    Route::get('/approval', [ApprovalController::class, 'index'])->name('approver.index');
    Route::post('/approval/approve/{rkatHeader}', [ApprovalController::class, 'approve'])->name('approver.approve');
});

// === GRUP RUTE KHUSUS ADMIN ===
Route::middleware(['auth', 'verified'])->group(function () {

    // 1. MASTER DATA (TAHUN ANGGARAN)
    // Dilindungi oleh Gate 'manage-settings'
    Route::middleware('can:manage-settings')->group(function () {
        Route::resource('tahun', TahunAnggaranController::class)
            ->only(['index', 'create', 'store', 'edit', 'update', 'destroy'])
            ->parameters(['tahun' => 'tahun']) // Penting untuk Route Model Binding
            ->names('tahun');
    });

    // 2. MANAJEMEN USER / AKUN
    // Dilindungi oleh Gate 'manage-users'
    Route::middleware('can:manage-users')->group(function () {
        // Rute Dasar (Lihat & Buat)
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        
        // [TAMBAHAN PENTING] Rute Edit, Update, & Hapus
        // Ini wajib ada agar tombol Edit/Hapus di Frontend berfungsi
        Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::patch('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });
    
});

// Rute Profil (Untuk semua user)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';