"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/admin");
        } catch (error) {
            setError("Email atau password salah. Silakan coba lagi.");
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 p-4 dark:bg-gradient-to-b dark:from-gray-500 dark:to-gray-700">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Login Karyawan</h1>
                <form onSubmit={handleLogin}>
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-gray-700"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-gray-700"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="cursor-pointer w-full bg-gray-200 dark:bg-gray-500 dark:text-gray-200 text-gray-500 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

