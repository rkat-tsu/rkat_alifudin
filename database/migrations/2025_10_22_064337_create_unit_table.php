<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('unit', function (Blueprint $table) {
            $table->id('id_unit'); // PK
            $table->string('kode_unit', 10)->unique();
            $table->string('nama_unit', 100);

            // Tipe unit: Fakultas, Prodi, Unit, atau Lainnya
            $table->enum('tipe_unit', ['Fakultas', 'Prodi', 'Unit', 'Lainnya']);
            
            // ✅ Jalur persetujuan tanpa after()
            $table->enum('jalur_persetujuan', ['akademik', 'non_akademik'])
                  ->default('akademik');

            // Relasi Kepemimpinan
            $table->unsignedBigInteger('id_kepala')->nullable();
            $table->foreign('id_kepala')->references('id_user')->on('users')->onDelete('set null'); 

            // Hirarki antar unit
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->foreign('parent_id')->references('id_unit')->on('unit')->onDelete('cascade');

            $table->timestamps();
        });

        // Relasi users → unit
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('id_unit')->references('id_unit')->on('unit')->onDelete('set null');
        });
    }

    public function down(): void
    {
        // Hapus FK users → unit dulu sebelum drop tabel unit
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['id_unit']);
        });

        Schema::dropIfExists('unit');
    }
};