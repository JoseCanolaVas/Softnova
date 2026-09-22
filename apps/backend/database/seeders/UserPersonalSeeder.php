<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;


class UserPersonalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->crearSuperAdmin(
            'daniel.giraldo@chocolatinazo',
            'Daniel',
            'Giraldo',
            '30000000',
            'X27carjo'
        );
    }

    private function crearSuperAdmin(string $email, string $nombre, string $apellido, string $telefono, ?string $password): void
    {
        $usuario = User::where('email', $email)->first();
        $datos = [
            'nombre' => $nombre,
            'apellido' => $apellido,
            'telefono' => $telefono,
            'es_super_admin' => true,
            'rol' => 'super_admin',
            'permisos' => [],
        ];
        if ($password || ! $usuario) {
            $datos['password'] = Hash::make($password ?: Str::random(40));
        }
        Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'api']);
        User::updateOrCreate(['email' => $email], $datos)->assignRole('super_admin');
    }
}
