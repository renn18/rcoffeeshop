"use client";

import React, { useState, ReactNode } from 'react';
import { MoreVertical, Search, ChevronLeft, ChevronRight } from 'lucide-react';

// ============================================================================
// DEFINISI TIPE & DATA MOCKUP
// ============================================================================

type OrderStatus = 'Selesai' | 'Diproses' | 'Dibatalkan' | 'Menunggu Pembayaran';

type Order = {
    id: string;
    customer: string;
    date: string;
    total: string;
    status: OrderStatus;
    items: number;
};

type StatusBadgeProps = {
    status: OrderStatus;
};

const mockOrders: Order[] = [
    { id: '#01H8X', customer: 'Budi Hartono', date: '24 Sep 2025', total: 'Rp 45.000', status: 'Selesai', items: 2 },
    { id: '#01H8W', customer: 'Citra Lestari', date: '24 Sep 2025', total: 'Rp 78.000', status: 'Diproses', items: 3 },
    { id: '#01H8V', customer: 'Andi Wijaya', date: '24 Sep 2025', total: 'Rp 25.000', status: 'Selesai', items: 1 },
    { id: '#01H8U', customer: 'Rina Marlina', date: '23 Sep 2025', total: 'Rp 55.000', status: 'Dibatalkan', items: 2 },
    { id: '#01H8T', customer: 'Joko Susilo', date: '23 Sep 2025', total: 'Rp 92.000', status: 'Selesai', items: 4 },
    { id: '#01H8S', customer: 'Dewi Anggraini', date: '22 Sep 2025', total: 'Rp 30.000', status: 'Menunggu Pembayaran', items: 1 },
    { id: '#01H8R', customer: 'Eko Prasetyo', date: '22 Sep 2025', total: 'Rp 65.000', status: 'Selesai', items: 3 },
    { id: '#01H8Q', customer: 'Siti Aminah', date: '21 Sep 2025', total: 'Rp 110.000', status: 'Selesai', items: 5 },
    { id: '#01H8P', customer: 'Agus Santoso', date: '21 Sep 2025', total: 'Rp 42.000', status: 'Diproses', items: 2 },
    { id: '#01H8O', customer: 'Lia Kurnia', date: '20 Sep 2025', total: 'Rp 18.000', status: 'Dibatalkan', items: 1 },
];

// ============================================================================
// KOMPONEN UI KECIL (REUSABLE)
// ============================================================================

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";
    const statusMap = {
        'Selesai': "bg-green-100 text-green-800",
        'Diproses': "bg-blue-100 text-blue-800",
        'Dibatalkan': "bg-red-100 text-red-800",
        'Menunggu Pembayaran': "bg-amber-100 text-amber-800",
    };
    return <span className={`${baseClasses} ${statusMap[status]}`}>{status}</span>;
};

// ============================================================================
// KOMPONEN HALAMAN UTAMA
// ============================================================================

const OrdersPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua');

    const filteredOrders = mockOrders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || order.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'Semua' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Daftar Pesanan</h1>
                    <p className="text-gray-500 mt-1">Kelola semua pesanan yang masuk di coffee shop Anda.</p>
                </div>
                <button className="bg-amber-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-900 transition-colors mt-4 sm:mt-0 flex items-center space-x-2"><span>+</span><span>Tambah Pesanan</span></button>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Cari ID Pesanan atau Nama Pelanggan..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition bg-white" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="Semua">Semua Status</option><option value="Menunggu Pembayaran">Menunggu Pembayaran</option><option value="Diproses">Diproses</option><option value="Selesai">Selesai</option><option value="Dibatalkan">Dibatalkan</option></select>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50"><tr>
                        <th scope="col" className="px-6 py-3">ID Pesanan</th><th scope="col" className="px-6 py-3">Pelanggan</th><th scope="col" className="px-6 py-3">Tanggal</th><th scope="col" className="px-6 py-3">Jumlah Item</th><th scope="col" className="px-6 py-3">Total</th><th scope="col" className="px-6 py-3">Status</th><th scope="col" className="px-6 py-3"></th>
                    </tr></thead>
                    <tbody>{filteredOrders.map(order => (
                        <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{order.id}</td>
                            <td className="px-6 py-4">{order.customer}</td><td className="px-6 py-4">{order.date}</td><td className="px-6 py-4 text-center">{order.items}</td><td className="px-6 py-4">{order.total}</td>
                            <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                            <td className="px-6 py-4 text-right"><button className="p-1 rounded-full hover:bg-gray-200"><MoreVertical className="w-4 h-4" /></button></td>
                        </tr>
                    ))}</tbody>
                </table></div>
                <div className="p-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600"><p>Menampilkan 1-{filteredOrders.length < 10 ? filteredOrders.length : 10} dari {filteredOrders.length} pesanan</p>
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                        <button className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50" disabled><ChevronLeft className="w-4 h-4" /></button>
                        <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-md font-semibold">1</span>
                        <button className="p-2 rounded-md hover:bg-gray-100"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
