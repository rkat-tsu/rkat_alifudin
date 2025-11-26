<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    private function getNonAdminRoles(): array
    {
        return [
            'Inputer', 'Kaprodi', 'Kepala_Unit', 
            'Dekan', 'WR_1', 'WR_2', 'WR_3', 'Rektor'
        ];
    }

    public function index(): Response
    {
        $users = User::with('unit')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/User/Index', [
            'users' => $users,
        ]);
    }

    public function create(): Response
    {
        $units = Unit::select('id_unit', 'nama_unit')->orderBy('nama_unit')->get();

        return Inertia::render('Admin/User/Create', [
            'roles' => $this->getNonAdminRoles(),
            'units' => $units,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_lengkap' => 'required|string|max:100',
            'email' => 'required|string|email|max:255|unique:users',
            'peran' => ['required', Rule::in($this->getNonAdminRoles())],
            'id_unit' => 'nullable|exists:unit,id_unit',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $username = explode('@', $request->email)[0];

        User::create([
            'username' => $username,
            'nama_lengkap' => $request->nama_lengkap,
            'email' => $request->email,
            'peran' => $request->peran,
            'id_unit' => $request->id_unit,
            'password' => Hash::make($request->password),
            'is_aktif' => true,
            'email_verified_at' => now(),
        ]);

        return Redirect::route('users.index')->with('success', 'Akun berhasil dibuat!');
    }

    // ▼▼▼ TAMBAHAN UNTUK EDIT (SOLUSI ERROR ANDA) ▼▼▼
    public function edit(User $user): Response
    {
        // Ambil data unit untuk dropdown
        $units = Unit::select('id_unit', 'nama_unit')->orderBy('nama_unit')->get();

        return Inertia::render('Admin/User/Edit', [
            'user' => $user,
            'roles' => $this->getNonAdminRoles(),
            'units' => $units,
        ]);
    }

    // ▼▼▼ TAMBAHAN UNTUK UPDATE ▼▼▼
    public function update(Request $request, User $user)
    {
        $request->validate([
            'nama_lengkap' => 'required|string|max:100',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id_user, 'id_user')],
            'peran' => ['required', Rule::in($this->getNonAdminRoles())],
            'id_unit' => 'nullable|exists:unit,id_unit',
            'is_aktif' => 'required|boolean',
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        $user->fill([
            'nama_lengkap' => $request->nama_lengkap,
            'email' => $request->email,
            'peran' => $request->peran,
            'id_unit' => $request->id_unit,
            'is_aktif' => $request->is_aktif,
        ]);

        // Hanya update password jika diisi
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return Redirect::route('users.index')->with('success', 'Akun berhasil diperbarui!');
    }

    // ▼▼▼ TAMBAHAN UNTUK DELETE ▼▼▼
    public function destroy(User $user)
    {
        if ($user->id_user === Auth::id()) {
            return Redirect::back()->withErrors(['error' => 'Anda tidak dapat menghapus akun Anda sendiri.']);
        }

        $user->delete();

        return Redirect::route('users.index')->with('success', 'Akun berhasil dihapus!');
    }
}