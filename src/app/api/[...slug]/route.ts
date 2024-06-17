import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const res = await fetch("https://api.mangadex.org/");

    const defaultHeaders = new Headers({
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
    });

    const data = new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: defaultHeaders,
    });

    return data;
}
