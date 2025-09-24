'use client';

import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Coffee, ClipboardList, Users, Settings, Menu } from 'lucide-react';

// ============================================================================
// KOMPONEN-KOMPONEN UNTUK LAYOUT
// ============================================================================

type NavItemProps = {
    href: string;
    icon: ReactNode;
    text: string;
    onClick?: () => void;
};

// NavItem kembali menggunakan <Link> dari Next.js dan hook usePathname
const NavItem: React.FC<NavItemProps> = ({ href, icon, text, onClick }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <li>
            <Link
                href={href}
                onClick={onClick}
                className={`flex items-center p-3 my-1 font-medium rounded-lg cursor-pointer transition-colors ${isActive
                        ? 'bg-amber-100 text-amber-900'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
            >
                {icon}
                <span className="ml-4">{text}</span>
            </Link>
        </li>
    );
};

type SidebarProps = {
    isSidebarOpen: boolean;
    closeSidebar: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, closeSidebar }) => (
    <aside className={`fixed inset-y-0 left-0 bg-white z-20 w-64 p-4 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:shadow-none shadow-xl`}>
        <div className="flex items-center mb-8">
            <div className="bg-amber-800 p-2 rounded-lg">
                <Coffee className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold ml-3 text-gray-800">Kopi Bahagia</h1>
        </div>
        <nav>
            <ul>
                <NavItem href="/admin" icon={<LayoutDashboard className="w-5 h-5" />} text="Dasbor" onClick={closeSidebar} />
                <NavItem href="/admin/orders" icon={<ClipboardList className="w-5 h-5" />} text="Pesanan" onClick={closeSidebar} />
                <NavItem href="/admin/menu" icon={<Coffee className="w-5 h-5" />} text="Menu" onClick={closeSidebar} />
                <NavItem href="/admin/customers" icon={<Users className="w-5 h-5" />} text="Pelanggan" onClick={closeSidebar} />
            </ul>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
            <NavItem href="/admin/settings" icon={<Settings className="w-5 h-5" />} text="Pengaturan" onClick={closeSidebar} />
        </div>
    </aside>
);

type HeaderProps = {
    toggleSidebar: () => void;
};

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    const pathname = usePathname();
    // Mengambil judul halaman dari URL
    const pageTitle = pathname.split('/').pop();
    const formattedTitle = pageTitle ? pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1) : 'Dasbor';

    return (
        <header className="bg-gray-50/80 backdrop-blur-sm p-4 flex items-center justify-between sticky top-0 z-10 border-b border-gray-200">
            <div className="flex items-center">
                <button onClick={toggleSidebar} className="md:hidden p-2 rounded-md hover:bg-gray-200"><Menu className="w-6 h-6 text-gray-700" /></button>
                <h2 className="text-xl font-bold text-gray-800 ml-2 md:ml-0">{formattedTitle === 'admin' ? 'Dasbor' : formattedTitle}</h2>
            </div>
            <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden"><img src="https://placehold.co/40x40/E2E8F0/4A5568?text=A" alt="Admin Avatar" className="w-full h-full object-cover" /></div>
                <div className="ml-3 hidden sm:block"><p className="font-semibold text-sm text-gray-800">Admin Kopi</p><p className="text-xs text-gray-500">admin@kopibahagia.com</p></div>
            </div>
        </header>
    );
};


// ============================================================================
// KOMPONEN LAYOUT UTAMA
// ============================================================================

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
            <div className="flex">
                <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
                {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black/30 z-10 md:hidden"></div>}

                <main className="flex-1 transition-all duration-300">
                    <Header toggleSidebar={toggleSidebar} />
                    {/* Di sinilah konten halaman (page.tsx) akan ditampilkan oleh Next.js */}
                    {children}
                </main>
            </div>
        </div>
    );
}

