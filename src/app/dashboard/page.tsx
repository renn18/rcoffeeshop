"use client";
import { useAuth } from "@/context/AuthContext";
import React, { ReactNode, useState } from "react";
import { LayoutDashboard, Coffee, ClipboardList, Users, Settings, DollarSign, TrendingUp, ShoppingCart, Menu, X, MoreVertical } from 'lucide-react';

type Stat = {
    title: string;
    value: string;
    change: string;
    icon: ReactNode;
};

type Order = {
    id: string;
    customer: string;
    total: string;
    status: 'Selesai' | 'Diproses' | 'Dibatalkan';
};

type NavItemProps = {
    icon: ReactNode;
    text: string;
    active?: boolean;
    onClick?: () => void;
};

type StatCardProps = {
    title: string;
    value: string;
    change: string;
    icon: ReactNode;
};

type StatusBadgeProps = {
    status: Order['status'];
};

type SidebarProps = {
    isSidebarOpen: boolean;
    activeMenu: string;
    setActiveMenu: (menu: string) => void;
};

type HeaderProps = {
    toggleSidebar: () => void;
    user: string;
};


// Data Mockup untuk contoh
const mockStats: Stat[] = [
    {
        title: "Total Pendapatan",
        value: "Rp 12.580.000",
        change: "+12.5%",
        icon: <DollarSign className="w-6 h-6 text-green-500" />
    },
    {
        title: "Total Penjualan",
        value: "350 Pesanan",
        change: "+8.2%",
        icon: <ShoppingCart className="w-6 h-6 text-blue-500" />
    },
    {
        title: "Pelanggan Baru",
        value: "42",
        change: "+21.7%",
        icon: <Users className="w-6 h-6 text-indigo-500" />
    },
    {
        title: "Produk Terlaris",
        value: "Kopi Susu Gula Aren",
        change: "120 Terjual",
        icon: <TrendingUp className="w-6 h-6 text-amber-500" />
    }
];

const mockRecentOrders: Order[] = [
    { id: '#01H8X', customer: 'Budi Hartono', total: 'Rp 45.000', status: 'Selesai' },
    { id: '#01H8W', customer: 'Citra Lestari', total: 'Rp 78.000', status: 'Diproses' },
    { id: '#01H8V', customer: 'Andi Wijaya', total: 'Rp 25.000', status: 'Selesai' },
    { id: '#01H8U', customer: 'Rina Marlina', total: 'Rp 55.000', status: 'Dibatalkan' },
    { id: '#01H8T', customer: 'Joko Susilo', total: 'Rp 92.000', status: 'Selesai' },
];

// Komponen Kecil dan Reusable
const NavItem: React.FC<NavItemProps> = ({ icon, text, active, onClick }) => (
    <li
        onClick={onClick}
        className={`flex items-center p-3 my-1 font-medium rounded-lg cursor-pointer transition-colors ${active
            ? 'bg-amber-100 text-amber-900'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
    >
        {icon}
        <span className="ml-4">{text}</span>
    </li>
);

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-gray-500">{title}</span>
            {icon}
        </div>
        <div>
            <h3 className="text-2xl font-bold mt-2 text-gray-800">{value}</h3>
            <p className={`text-sm mt-1 font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-gray-500'}`}>{change}</p>
        </div>
    </div>
);

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";
    switch (status) {
        case 'Selesai':
            return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
        case 'Diproses':
            return <span className={`${baseClasses} bg-amber-100 text-amber-800`}>{status}</span>;
        case 'Dibatalkan':
            return <span className={`${baseClasses} bg-red-100 text-red-800`}>{status}</span>;
        default:
            return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
};


// Komponen Utama
const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, activeMenu, setActiveMenu }) => (
    <aside className={`fixed inset-y-0 left-0 bg-white z-20 w-64 p-4 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:shadow-none shadow-xl`}>
        <div className="flex items-center mb-8">
            <div className="bg-amber-800 p-2 rounded-lg">
                <Coffee className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold ml-3 text-gray-800">Kopi Bahagia</h1>
        </div>
        <nav>
            <ul>
                <NavItem
                    icon={<LayoutDashboard className="w-5 h-5" />}
                    text="Dasbor"
                    active={activeMenu === 'Dasbor'}
                    onClick={() => setActiveMenu('Dasbor')}
                />
                <NavItem
                    icon={<ClipboardList className="w-5 h-5" />}
                    text="Pesanan"
                    active={activeMenu === 'Pesanan'}
                    onClick={() => setActiveMenu('Pesanan')}
                />
                <NavItem
                    icon={<Coffee className="w-5 h-5" />}
                    text="Menu"
                    active={activeMenu === 'Menu'}
                    onClick={() => setActiveMenu('Menu')}
                />
                <NavItem
                    icon={<Users className="w-5 h-5" />}
                    text="Pelanggan"
                    active={activeMenu === 'Pelanggan'}
                    onClick={() => setActiveMenu('Pelanggan')}
                />
            </ul>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
            <NavItem icon={<Settings className="w-5 h-5" />} text="Pengaturan" />
        </div>
    </aside>
);

const Header: React.FC<HeaderProps> = ({ toggleSidebar, user }) => (
    <header className="bg-gray-50/80 backdrop-blur-sm p-4 flex items-center justify-between sticky top-0 z-10">
        <button onClick={toggleSidebar} className="md:hidden p-2 rounded-md hover:bg-gray-200">
            <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 hidden md:block">Dasbor</h2>
        <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                <img src="https://placehold.co/40x40/E2E8F0/4A5568?text=A" alt="Admin Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="ml-3 hidden sm:block">
                <p className="font-semibold text-sm text-gray-800">Admin Kopi</p>
                <p className="text-xs text-gray-500">{user}</p>
            </div>
        </div>
    </header>
);

const SalesChartPlaceholder: React.FC = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Analisis Penjualan Mingguan</h3>
        <div className="flex items-end h-64 space-x-4">
            {/* Ini adalah placeholder visual untuk grafik. Ganti dengan library grafik seperti Recharts atau Chart.js */}
            <div className="flex-1 bg-amber-200 rounded-t-lg w-full" style={{ height: '60%' }} title="Senin"></div>
            <div className="flex-1 bg-amber-300 rounded-t-lg w-full" style={{ height: '80%' }} title="Selasa"></div>
            <div className="flex-1 bg-amber-400 rounded-t-lg w-full" style={{ height: '75%' }} title="Rabu"></div>
            <div className="flex-1 bg-amber-200 rounded-t-lg w-full" style={{ height: '50%' }} title="Kamis"></div>
            <div className="flex-1 bg-amber-300 rounded-t-lg w-full" style={{ height: '90%' }} title="Jumat"></div>
            <div className="flex-1 bg-amber-500 rounded-t-lg w-full" style={{ height: '100%' }} title="Sabtu"></div>
            <div className="flex-1 bg-amber-400 rounded-t-lg w-full" style={{ height: '85%' }} title="Minggu"></div>
        </div>
    </div>
);

const RecentOrdersTable: React.FC = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Pesanan Terbaru</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">ID Pesanan</th>
                        <th scope="col" className="px-6 py-3">Pelanggan</th>
                        <th scope="col" className="px-6 py-3">Total</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3"></th>
                    </tr>
                </thead>
                <tbody>
                    {mockRecentOrders.map(order => (
                        <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{order.id}</td>
                            <td className="px-6 py-4">{order.customer}</td>
                            <td className="px-6 py-4">{order.total}</td>
                            <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-1 rounded-full hover:bg-gray-200">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <p>Loading...</p>;
    }

    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [activeMenu, setActiveMenu] = useState<string>('Dasbor');

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
            <div className="flex">
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                />
                {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black/30 z-10 md:hidden"></div>}

                <main className="flex-1 transition-all duration-300">
                    <Header toggleSidebar={toggleSidebar} user={user.email ?? ""} />
                    <div className="p-6 md:p-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Selamat Datang Kembali, {user.email}</h1>
                        <p className="text-gray-500 mb-8">Berikut adalah ringkasan aktivitas coffee shop Anda hari ini.</p>

                        {/* Grid Statistik */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {mockStats.map((stat, index) => (
                                <StatCard key={index} {...stat} />
                            ))}
                        </div>

                        {/* Grid Konten Utama */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <SalesChartPlaceholder />
                            </div>
                            <div className="lg:col-span-1">
                                <RecentOrdersTable />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DashboardPage;

