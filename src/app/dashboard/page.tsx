"use client";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
    const { user } = useAuth();

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold">Selamat Datang di Dasbor</h1>
            <p className="mt-4">Anda login sebagai: <strong>{user.email}</strong></p>
            <p className="mt-2">Halaman ini adalah tempat Anda mengelola pesanan, menu, dan lainnya.</p>
        </div>
    );
}

