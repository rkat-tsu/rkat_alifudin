<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Notifications\ResetPasswordNotification;
use App\Models\Unit; 

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, CanResetPassword;

    protected $table = 'users';
    protected $primaryKey = 'id_user';
    
    protected $fillable = [
        'username',
        'email', 
        'password',
        'nama_lengkap',
        'peran',
        'id_unit',
        'is_aktif', // Pastikan kolom ini ada di sini
        'no_telepon',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_aktif' => 'boolean', // Pastikan casting ini ada
    ];
    
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPasswordNotification($token, $this));
    }

    public function isAdmin(): bool
    {
        return $this->peran === 'Admin';
    }

    public function isApprover(): bool
    {
        return in_array($this->peran, ['Dekan', 'Kepala_Unit', 'WR_1', 'WR_2', 'WR_3', 'Rektor']);
    }

    public function isUnitHead(): bool
    {
        return in_array($this->peran, ['Dekan', 'Kepala_Unit']);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'id_unit', 'id_unit');
    }
}