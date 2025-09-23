"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Jika loading selesai dan tidak ada user, redirect ke halaman login
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // Selama loading atau jika tidak ada user, tampilkan pesan loading
    if (loading || !user) {
        return <p className="text-center mt-20">Memuat dan memverifikasi sesi...</p>;
    }

    // Jika user ada, tampilkan konten dasbor
    return <>{children}</>;
}

