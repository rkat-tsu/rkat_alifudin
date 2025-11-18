import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ auth, tahunAnggarans }) {
    const { flash } = usePage().props;

    // Helper untuk format tanggal Indonesia
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    };

    // Fungsi untuk menghapus tahun
    const deleteTahun = (tahun) => {
        if (confirm(`Yakin ingin menghapus tahun anggaran ${tahun}?`)) {
            router.delete(route('tahun.destroy', tahun));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Manajemen Tahun Anggaran</h2>}
        >
            <Head title="Tahun Anggaran" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Tombol Tambah */}
                    <div className="flex justify-end mb-4">
                        <Link href={route('tahun.create')}>
                            <PrimaryButton>+ Tambah Tahun Anggaran</PrimaryButton>
                        </Link>
                    </div>

                    {/* Flash Message (Sudah diperbaiki agar tidak error putih) */}
                    {flash && flash.success && (
                        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg border border-green-200">
                            {flash.success}
                        </div>
                    )}
                    {flash && flash.error && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
                            {flash.error}
                        </div>
                    )}

                    {/* Tabel Data */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    {/* TAHUN: Rata Tengah & Lebar Tetap */}
                                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-32">
                                        Tahun
                                    </th>
                                    {/* TANGGAL: Rata Kiri */}
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Tgl Mulai
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Tgl Akhir
                                    </th>
                                    {/* STATUS: Rata Tengah */}
                                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    {/* AKSI: Rata Tengah */}
                                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {tahunAnggarans.data.map((item) => (
                                    <tr key={item.tahun_anggaran} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
                                        
                                        {/* Tahun (Bold & Center) */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900 dark:text-gray-100">
                                            {item.tahun_anggaran}
                                        </td>
                                        
                                        {/* Tgl Mulai */}
                                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(item.tanggal_mulai)}
                                        </td>
                                        
                                        {/* Tgl Akhir */}
                                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(item.tanggal_akhir)}
                                        </td>
                                        
                                        {/* Status Badge */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                item.status_rkat === 'Drafting' ? 'bg-gray-100 text-gray-800 border border-gray-200' :
                                                item.status_rkat === 'Submission' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                                item.status_rkat === 'Approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                                                'bg-red-100 text-red-800 border border-red-200'
                                            }`}>
                                                {item.status_rkat}
                                            </span>
                                        </td>

                                        {/* Tombol Aksi */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <Link 
                                                href={route('tahun.edit', item.tahun_anggaran)} 
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4 font-semibold"
                                            >
                                                Edit
                                            </Link>
                                            <button 
                                                onClick={() => deleteTahun(item.tahun_anggaran)} 
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-semibold"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {tahunAnggarans.data.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 italic">
                                            Belum ada data tahun anggaran.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Jika ada pagination, tambahkan di sini */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}