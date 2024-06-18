import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    const urlParam: string = searchParams.get("url") ?? "";

    const res = await fetch(urlParam.toString(), {
        headers: {
            "Content-Type": "image/jpg",
        },
    });

    const defaultHeaders = new Headers({
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "image/jpg",
    });

    const data = new NextResponse(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: defaultHeaders,
    });

    return await data;
}
