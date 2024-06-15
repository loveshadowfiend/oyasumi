import { NextRequest, NextResponse } from "next/server";

const corsOptions = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Origin": "*",
};

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    Object.entries(corsOptions).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
}

export const config = {
    matcher: "/api/:path*",
};
