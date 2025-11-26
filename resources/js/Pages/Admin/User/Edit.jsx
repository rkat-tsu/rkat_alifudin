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
import Checkbox from '@/Components/Checkbox';

export default function Edit({ auth, user, roles, units }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        peran: user.peran,
        id_unit: user.id_unit || '',
        // Konversi nilai 1/0 dari DB menjadi true/false untuk React Checkbox
        is_aktif: user.is_aktif === 1 || user.is_aktif === true, 
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('users.update', user.id_user), {
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    };

    const deleteUser = () => {
        if (confirm('Yakin ingin menghapus akun ini secara permanen?')) {
            router.delete(route('users.destroy', user.id_user));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit Akun: {user.nama_lengkap}</h2>}
        >
            <Head title="Edit Akun" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        <form onSubmit={submit} className="space-y-6">
                            
                            <div>
                                <InputLabel htmlFor="nama_lengkap" value="Nama Lengkap" />
                                <TextInput
                                    id="nama_lengkap"
                                    value={data.nama_lengkap}
                                    onChange={(e) => setData('nama_lengkap', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.nama_lengkap} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="peran" value="Peran" />
                                <SelectInput
                                    id="peran"
                                    value={data.peran}
                                    onChange={(e) => setData('peran', e.target.value)}
                                    className="mt-1 block w-full"
                                >
                                    {roles.map((role, index) => (
                                        <option key={index} value={role}>{role}</option>
                                    ))}
                                </SelectInput>
                                <InputError message={errors.peran} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="id_unit" value="Unit Kerja" />
                                <SelectInput
                                    id="id_unit"
                                    value={data.id_unit}
                                    onChange={(e) => setData('id_unit', e.target.value)}
                                    className="mt-1 block w-full"
                                >
                                    <option value="">-- Pilih Unit --</option>
                                    {units.map((unit) => (
                                        <option key={unit.id_unit} value={unit.id_unit}>{unit.nama_unit}</option>
                                    ))}
                                </SelectInput>
                                <InputError message={errors.id_unit} className="mt-2" />
                            </div>

                            {/* CHECKBOX STATUS AKTIF */}
                            <div className="block mt-4">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="is_aktif"
                                        checked={data.is_aktif}
                                        onChange={(e) => setData('is_aktif', e.target.checked)}
                                    />
                                    <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">Akun Aktif</span>
                                </label>
                                <InputError message={errors.is_aktif} className="mt-2" />
                            </div>

                            <hr className="border-gray-200 dark:border-gray-700" />
                            <p className="text-sm text-gray-500">Kosongkan password jika tidak ingin menggantinya.</p>

                            <div>
                                <InputLabel htmlFor="password" value="Password Baru" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <DangerButton type="button" onClick={deleteUser}>
                                    Hapus Akun
                                </DangerButton>

                                <div className="flex gap-4">
                                    <Link href={route('users.index')}>
                                        <SecondaryButton>Batal</SecondaryButton>
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        Simpan Perubahan
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