<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Panggil Seeder Admin yang baru kita buat
        $this->call([
            AdminUserSeeder::class,
            
            // Anda bisa tambahkan seeder lain di sini jika ada (misal UnitSeeder)
            // UnitSeeder::class, 
        ]);
    }
}
