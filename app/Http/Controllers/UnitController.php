<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use App\Models\User; // Digunakan jika Anda ingin data Kepala Unit
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia; // Wajib diimport

class UnitController extends Controller
{
    /**
     * Menampilkan daftar semua Unit, memuat data untuk komponen React Inertia.
     */
    public function index(Request $request)
    {
        // Ambil parameter filter dari request (query string)
        $jalur = $request->get('jalur');
        $parent_id = $request->get('parent_id');
        $searchTerm = $request->get('search');
        
        // 1. Inisialisasi Query dengan Eager Loading
        $query = Unit::with([
            'kepala' => function ($q) {
                // Ambil data penting untuk tampilan
                $q->select('id_user', 'nama_lengkap', 'email', 'peran'); 
            },
            'parent' => function ($q) {
                // Ambil nama Biro Unit
                $q->select('id_unit', 'nama_unit');
            },
        ]);

        // 2. Filter Jalur Persetujuan (Akademik/Non-Akademik)
        if ($jalur && in_array($jalur, ['akademik', 'non_akademik'])) {
            $query->where('jalur_persetujuan', $jalur);
        }

        // 3. Filter Unit Induk/Biro (Berdasarkan ID parent_id)
        if ($parent_id && is_numeric($parent_id)) {
            $query->where('parent_id', $parent_id);
        }

        // 4. Pencarian Teks Global (Search Bar)
        if ($searchTerm) {
            $query->where(function (Builder $q) use ($searchTerm) {
                $q->where('nama_unit', 'like', '%' . $searchTerm . '%')
                  ->orWhere('kode_unit', 'like', '%' . $searchTerm . '%')
                  ->orWhereHas('kepala', function (Builder $q_user) use ($searchTerm) {
                      $q_user->where('nama_lengkap', 'like', '%' . $searchTerm . '%')
                             ->orWhere('email', 'like', '%' . $searchTerm . '%');
                  });
            });
        }
        
        // 5. Eksekusi Query dan Pagination
        $unitsPaginated = $query
            ->orderBy('jalur_persetujuan')
            ->orderBy('nama_unit')
            // Gunakan ->paginate() dan append request parameters
            ->paginate(15) 
            ->withQueryString() // Penting agar filter tetap terbawa saat ganti halaman
            ->through(function ($unit) {
                // Formatting data untuk React
                return [
                    'id_unit' => $unit->id_unit,
                    'kode_unit' => $unit->kode_unit,
                    'nama_unit' => $unit->nama_unit,
                    'jalur_persetujuan' => $unit->jalur_persetujuan,
                    
                    // Data Biro Unit (Parent)
                    'biro_unit' => $unit->parent ? $unit->parent->nama_unit : '-',
                    
                    // Data Kepala Unit (Akun)
                    'kepala' => [
                        'nama' => $unit->kepala ? $unit->kepala->nama_lengkap : 'N/A',
                        'email' => $unit->kepala ? $unit->kepala->email : 'N/A',
                        'peran' => $unit->kepala ? $unit->kepala->peran : 'N/A',
                    ],
                ];
            });

        // Data untuk dropdown filter Biro Unit
        $parentUnits = Unit::whereNull('parent_id')
                          ->orWhere('tipe_unit', 'Fakultas')
                          ->get(['id_unit', 'nama_unit']);
                          
        // 6. Kembalikan Inertia Response
        return Inertia::render('Member/UnitIndex', [
            'units' => $unitsPaginated,
            'parentUnitsOptions' => $parentUnits,
            
            // Kirim parameter filter saat ini untuk mengisi form filter di React
            'filters' => $request->only('jalur', 'parent_id', 'search'),
        ]);
    }

    // ... Metode CRUD lainnya
}