<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User; // Import Model User
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Gunakan updateOrCreate agar tidak error jika seeder dijalankan 2x
        User::updateOrCreate(
            ['email' => 'admin@rkat.tsu.ac.id'], // Kunci pengecekan (Email Default)
            [
                'nama_lengkap' => 'Super Administrator',
                'username'     => 'admin',
                'password'     => Hash::make('password123'), // Password Default (Ganti sesuai keinginan)
                'peran'        => 'Admin', // Sesuai ENUM di database Anda
                'id_unit'      => null,    // Admin biasanya tidak terikat unit (pastikan kolom ini nullable)
                'is_aktif'     => true,    // Langsung aktif
                'no_telepon'   => '081234567890',
                'email_verified_at' => now(),
            ]
        );
    }
}