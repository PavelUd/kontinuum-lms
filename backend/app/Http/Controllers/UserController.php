<?php

namespace App\Http\Controllers;
use OpenApi\Attributes as OA;

#[OA\Info(
    title: "Kontinuum LMS API",
    version: "1.0.0",
    description: "API документация внутренней LMS системы"
)]
#[OA\Server(
    url: "http://localhost",
    description: "Local server"
)]

class UserController extends Controller
{
    #[OA\Get(
        path: "/api/test",
        summary: "Test endpoint",
        tags: ["Test"],
        responses: [
            new OA\Response(
                response: 200,
                description: "OK"
            )
        ]
    )]
    public function index()
    {
        return response()->json([
            ['id' => 1, 'name' => 'John']
        ]);
    }
}
