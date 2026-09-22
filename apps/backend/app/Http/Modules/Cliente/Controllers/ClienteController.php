<?php

namespace App\Http\Modules\Cliente\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Modules\Cliente\Repositories\ClienteRepository;
use App\Http\Modules\Cliente\Services\ClienteService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ClienteController extends Controller
{
    public function __construct(
        protected ClienteService $clienteService,
        protected ClienteRepository $clienteRepository
    ) {}

    public function listarClientes()
    {
        try {   

        } catch (\Throwable $th) {
            return response()->json([
                'mensaje' => 'Ha ocurrido un error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
