import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Edit({ auth, tahun }) {
    // 'tahun' adalah prop dari controller
    
    const formatDateForInput = (dateString) => new Date(dateString).toISOString().split('T')[0];

    const { data, setData, patch, processing, errors } = useForm({
        tanggal_mulai: formatDateForInput(tahun.tanggal_mulai),
        tanggal_akhir: formatDateForInput(tahun.tanggal_akhir),
        status_rkat: tahun.status_rkat,
    });

    const statusOptions = ['Drafting', 'Submission', 'Approved', 'Closed'];

    const submit = (e) => {
        e.preventDefault();
        patch(route('tahun.update', tahun.tahun_anggaran)); //
    };

    const handleDelete = (e) => {
        e.preventDefault();
        if (confirm('Apakah Anda yakin ingin menghapus tahun anggaran ini? SEMUA RKAT terkait akan ikut terhapus.')) {
            router.delete(route('tahun.destroy', tahun.tahun_anggaran)); //
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl ...">Edit Tahun Anggaran: {tahun.tahun_anggaran}</h2>}
        >
            <Head title={`Edit ${tahun.tahun_anggaran}`} />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            
                            <div>
                                <InputLabel htmlFor="tahun_anggaran" value="Tahun Anggaran (Tidak bisa diubah)" />
                                <TextInput
                                    id="tahun_anggaran" type="number"
                                    value={tahun.tahun_anggaran}
                                    className="mt-1 block w-full bg-gray-100 dark:bg-gray-700"
                                    disabled
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="tanggal_mulai" value="Tanggal Mulai" />
                                <TextInput
                                    id="tanggal_mulai" type="date"
                                    value={data.tanggal_mulai}
                                    onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.tanggal_mulai} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="tanggal_akhir" value="Tanggal Akhir" />
                                <TextInput
                                    id="tanggal_akhir" type="date"
                                    value={data.tanggal_akhir}
                                    onChange={(e) => setData('tanggal_akhir', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.tanggal_akhir} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="status_rkat" value="Status RKAT" />
                                <SelectInput
                                    id="status_rkat"
                                    value={data.status_rkat}
                                    onChange={(e) => setData('status_rkat', e.target.value)}
                                    className="mt-1 block w-full"
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </SelectInput>
                                <InputError message={errors.status_rkat} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-between">
                                <DangerButton type="button" onClick={handleDelete}>Hapus</DangerButton>
                                <div className="flex items-center space-x-4">
                                    <Link href={route('tahun.index')}>
                                        <SecondaryButton type="button">Batal</SecondaryButton>
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Memperbarui...' : 'Perbarui'}
                                    </PrimaryButton>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}