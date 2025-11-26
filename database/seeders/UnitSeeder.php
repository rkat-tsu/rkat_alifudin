<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Unit; // Pastikan import model Unit

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hapus data lama biar bersih (opsional)
        // Unit::truncate();

        // Masukkan data Unit (id_kepala kita set null dulu agar aman)
        Unit::create(['id_unit' => 1, 'kode_unit' => 'FT', 'nama_unit' => 'Fakultas Teknik', 'tipe_unit' => 'Fakultas', 'jalur_persetujuan' => 'akademik', 'id_kepala' => null, 'parent_id' => null]);
        
        Unit::create(['id_unit' => 2, 'kode_unit' => 'IF', 'nama_unit' => 'Prodi Informatika', 'tipe_unit' => 'Prodi', 'jalur_persetujuan' => 'akademik', 'id_kepala' => null, 'parent_id' => 1]);
        
        Unit::create(['id_unit' => 3, 'kode_unit' => 'KMH', 'nama_unit' => 'Unit Kemahasiswaan', 'tipe_unit' => 'Unit', 'jalur_persetujuan' => 'akademik', 'id_kepala' => null, 'parent_id' => null]);
        
        Unit::create(['id_unit' => 4, 'kode_unit' => 'CDC', 'nama_unit' => 'Character Dev. Center', 'tipe_unit' => 'Unit', 'jalur_persetujuan' => 'non_akademik', 'id_kepala' => null, 'parent_id' => null]);
    }
}