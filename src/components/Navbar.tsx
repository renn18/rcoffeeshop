"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        setIsOpen(false); // Tutup menu mobile jika terbuka
        router.push("/");
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Menu", href: "/menu" },
        { name: "Tentang Kami", href: "/tentang-kami" },
        { name: "Kontak", href: "/kontak" },
    ];

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <Link href="/" className="text-2xl font-bold text-coffee-brown">
                        R'Coffee
                    </Link>

                    {/* Menu Desktop */}
                    <div className="hidden md:flex space-x-6 items-center">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className="text-coffee-dark hover:text-coffee-brown transition-colors">
                                {link.name}
                            </Link>
                        ))}
                        {user ? (
                            <>
                                <Link href="/dashboard" className="font-semibold text-coffee-dark hover:text-coffee-brown transition-colors">
                                    Dasbor
                                </Link>
                                <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 text-sm">
                                Login Karyawan
                            </Link>
                        )}
                    </div>

                    {/* Tombol Menu Mobile */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-coffee-dark focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tampilan Menu Mobile */}
            {isOpen && (
                <div className="md:hidden px-4 pt-2 pb-4 space-y-2 border-t border-gray-200">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="block text-coffee-dark hover:text-coffee-brown transition-colors py-2">
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-4 mt-4 border-t border-gray-200">
                        {user ? (
                            <>
                                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block text-amber-600 font-semibold hover:text-coffee-brown transition-colors py-2">
                                    Dasbor
                                </Link>
                                <button onClick={handleLogout} className="w-full text-left text-red-600 py-2">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link href="/login" onClick={() => setIsOpen(false)} className="block bg-amber-700 text-white px-4 py-2 rounded-lg text-center hover:bg-opacity-90">
                                Login Karyawan
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}