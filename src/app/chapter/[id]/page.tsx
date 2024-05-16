"use client";

import { useRouter } from "next/navigation";

export default function Chapter({ params }: { params: { id: string } }) {
    const router = useRouter();

    router.push(`/chapter/${params.id}/1`);
}
