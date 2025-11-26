import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput'; // Pastikan komponen ini ada (sudah kita bahas sebelumnya)
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Create({ auth, roles, units }) {
    // Inisialisasi form
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_lengkap: '',
        email: '',
        peran: '',
        id_unit: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('users.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Buat Akun Baru</h2>}
        >
            <Head title="Buat Akun" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* Nama Lengkap */}
                            <div>
                                <InputLabel htmlFor="nama_lengkap" value="Nama Lengkap" />
                                <TextInput
                                    id="nama_lengkap"
                                    value={data.nama_lengkap}
                                    onChange={(e) => setData('nama_lengkap', e.target.value)}
                                    className="mt-1 block w-full"
                                    isFocused
                                    placeholder="Contoh: Budi Santoso"
                                />
                                <InputError message={errors.nama_lengkap} className="mt-2" />
                            </div>

                            {/* Email */}
                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="contoh@tsu.ac.id"
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Role Dropdown */}
                            <div>
                                <InputLabel htmlFor="peran" value="Peran (Role)" />
                                <SelectInput
                                    id="peran"
                                    value={data.peran}
                                    onChange={(e) => setData('peran', e.target.value)}
                                    className="mt-1 block w-full"
                                >
                                    <option value="">-- Pilih Peran --</option>
                                    {roles.map((role, index) => (
                                        <option key={index} value={role}>{role}</option>
                                    ))}
                                </SelectInput>
                                <InputError message={errors.peran} className="mt-2" />
                            </div>

                            {/* Unit Dropdown */}
                            <div>
                                <InputLabel htmlFor="id_unit" value="Unit Kerja" />
                                <SelectInput
                                    id="id_unit"
                                    value={data.id_unit}
                                    onChange={(e) => setData('id_unit', e.target.value)}
                                    className="mt-1 block w-full"
                                >
                                    <option value="">-- Pilih Unit (Opsional) --</option>
                                    {units.map((unit) => (
                                        <option key={unit.id_unit} value={unit.id_unit}>
                                            {unit.nama_unit}
                                        </option>
                                    ))}
                                </SelectInput>
                                <InputError message={errors.id_unit} className="mt-2" />
                            </div>

                            {/* Password */}
                            <div>
                                <InputLabel htmlFor="password" value="Password" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Konfirmasi Password */}
                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4">
                                <Link href={route('users.index')}>
                                    <SecondaryButton>Batal</SecondaryButton>
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    Simpan Akun
                                </PrimaryButton>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}