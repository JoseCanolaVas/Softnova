<?php

namespace App\Http\Modules\Cliente\Services;

use App\Http\Modules\Cliente\Repositories\ClienteRepository;

class ClienteService
{
    public function __construct(protected ClienteRepository $repository){}

    
}