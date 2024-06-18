import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;
    const mangadexPath = pathname.slice(4);

    // Constructing the URL for the external API request
    const apiUrl = new URL(`https://api.mangadex.org/${mangadexPath}`);
    searchParams.forEach((value, key) => {
        apiUrl.searchParams.append(key, value);
    });

    // Fetching data from the external API
    const res = await fetch(apiUrl.toString());

    const defaultHeaders = new Headers({
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
    });

    const data = new NextResponse(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: defaultHeaders,
    });

    return await data;
}
