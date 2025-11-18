import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput'; // Asumsi Anda punya komponen ini
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Create({ auth }) {
    
    const { data, setData, post, processing, errors } = useForm({
        tahun_anggaran: new Date().getFullYear(),
        tanggal_mulai: '',
        tanggal_akhir: '',
        status_rkat: 'Drafting', //
    });

    const statusOptions = ['Drafting', 'Submission', 'Approved', 'Closed'];

    const submit = (e) => {
        e.preventDefault();
        post(route('tahun.store')); //
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl ...">Tambah Tahun Anggaran</h2>}
        >
            <Head title="Tambah Tahun Anggaran" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 space-y-6">
                            
                            <div>
                                <InputLabel htmlFor="tahun_anggaran" value="Tahun Anggaran" />
                                <TextInput
                                    id="tahun_anggaran" type="number"
                                    value={data.tahun_anggaran}
                                    onChange={(e) => setData('tahun_anggaran', e.target.value)}
                                    className="mt-1 block w-full" isFocused
                                />
                                <InputError message={errors.tahun_anggaran} className="mt-2" />
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

                            <div className="flex items-center justify-end space-x-4">
                                <Link href={route('tahun.index')}>
                                    <SecondaryButton type="button">Batal</SecondaryButton>
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}