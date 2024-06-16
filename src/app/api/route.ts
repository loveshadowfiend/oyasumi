import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const res = await fetch("https://api.mangadex.org/");

    const data: Response = new Response(res.body, {
        status: 200,
    });

    data.headers.set("Access-Control-Allow-Origin", "*");

    return data;
}
