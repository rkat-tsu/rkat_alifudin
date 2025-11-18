<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RkatController;
use App\Http\Controllers\ApprovalController;
use App\Http\Controllers\IkuController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\TahunAnggaranController;
use App\Http\Controllers\DashboardController; 
use App\Http\Controllers\MonitoringController;
use App\Http\Controllers\UserController; // <-- [DIUBAH] 1. Tambahkan ini
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'), // <-- Nanti kita akan nonaktifkan ini
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// ROUTE DASHBOARD
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Semua rute yang memerlukan otentikasi
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

// ▼▼▼ [DIUBAH] 2. GRUP RUTE KHUSUS ADMIN ▼▼▼
Route::middleware(['auth', 'verified'])->group(function () {

    // === RUTE MASTER DATA (TAHUN ANGGARAN) ===
    // [DIUBAH] Dilindungi oleh Gate 'manage-settings'
    Route::middleware('can:manage-settings')->group(function () {
        Route::resource('tahun', TahunAnggaranController::class)
            ->only(['index', 'create', 'store', 'edit', 'update', 'destroy'])
            ->parameters(['tahun' => 'tahun']) // <-- Ini untuk Route Model Binding Anda
            ->names('tahun');
    });

    // === RUTE MANAJEMEN USER (BARU) ===
    // [DIUBAH] Dilindungi oleh Gate 'manage-users'
    Route::middleware('can:manage-users')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        // (Nanti tambahkan edit, update, delete di sini)
    });
    
});
// ▲▲▲ AKHIR BLOK ▲▲▲


// Rute Profil (Biarkan terpisah, karena bukan hanya untuk Admin)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';