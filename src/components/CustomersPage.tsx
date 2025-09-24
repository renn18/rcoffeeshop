'use client';

import React, { useState } from 'react';
import { Plus, Search, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

// ============================================================================
// DEFINISI TIPE & DATA MOCKUP
// ============================================================================

type Customer = {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
    joinDate: string;
    totalOrders: number;
    totalSpent: number;
};

const mockCustomers: Customer[] = [
    { id: 1, name: 'Budi Hartono', email: 'budi.h@example.com', avatarUrl: 'https://placehold.co/40x40/E2E8F0/4A5568?text=BH', joinDate: '15 Agu 2025', totalOrders: 12, totalSpent: 540000 },
    { id: 2, name: 'Citra Lestari', email: 'citra.l@example.com', avatarUrl: 'https://placehold.co/40x40/E2E8F0/4A5568?text=CL', joinDate: '10 Sep 2025', totalOrders: 8, totalSpent: 320000 },
    { id: 3, name: 'Andi Wijaya', email: 'andi.w@example.com', avatarUrl: 'https://placehold.co/40x40/E2E8F0/4A5568?text=AW', joinDate: '01 Jul 2025', totalOrders: 25, totalSpent: 1125000 },
    { id: 4, name: 'Rina Marlina', email: 'rina.m@example.com', avatarUrl: 'https://placehold.co/40x40/E2E8F0/4A5568?text=RM', joinDate: '20 Mei 2025', totalOrders: 5, totalSpent: 150000 },
    { id: 5, name: 'Joko Susilo', email: 'joko.s@example.com', avatarUrl: 'https://placehold.co/40x40/E2E8F0/4A5568?text=JS', joinDate: '18 Sep 2025', totalOrders: 15, totalSpent: 675000 },
    { id: 6, name: 'Dewi Anggraini', email: 'dewi.a@example.com', avatarUrl: 'https://placehold.co/40x40/E2E8F0/4A5568?text=DA', joinDate: '05 Feb 2025', totalOrders: 3, totalSpent: 90000 },
    { id: 7, name: 'Eko Prasetyo', email: 'eko.p@example.com', avatarUrl: 'https://placehold.co/40x40/E2E8F0/4A5568?text=EP', joinDate: '30 Agu 2025', totalOrders: 9, totalSpent: 405000 },
    { id: 8, name: 'Siti Aminah', email: 'siti.a@example.com', avatarUrl: 'https://placehold.co/40x40/E2E8F0/4A5568?text=SA', joinDate: '12 Jan 2025', totalOrders: 2, totalSpent: 60000 },
    { id: 9, name: 'Agus Santoso', email: 'agus.s@example.com', avatarUrl: 'https://placehold.co/40x40/E2E8F0/4A5568?text=AS', joinDate: '22 Jul 2025', totalOrders: 18, totalSpent: 810000 },
    { id: 10, name: 'Lia Kurnia', email: 'lia.k@example.com', avatarUrl: 'https://placehold.co/40x40/E2E8F0/4A5568?text=LK', joinDate: '03 Apr 2025', totalOrders: 7, totalSpent: 210000 },
];

// ============================================================================
// KOMPONEN HALAMAN UTAMA
// ============================================================================

export default function CustomersPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCustomers = mockCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6">
            {/* Header Halaman */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Pelanggan</h2>
                    <p className="text-gray-500 mt-1">Lihat dan kelola data pelanggan Anda.</p>
                </div>
                <button className="bg-amber-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center hover:bg-amber-900 transition-colors mt-3 sm:mt-0">
                    <Plus className="w-5 h-5 mr-2" />
                    Tambah Pelanggan
                </button>
            </div>

            {/* Bar Pencarian */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama atau email pelanggan..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabel Pelanggan */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nama</th>
                                <th scope="col" className="px-6 py-3">Tanggal Bergabung</th>
                                <th scope="col" className="px-6 py-3 text-center">Total Pesanan</th>
                                <th scope="col" className="px-6 py-3">Total Belanja</th>
                                <th scope="col" className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map(customer => (
                                <tr key={customer.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Image className="w-8 h-8 rounded-full mr-3" src={customer.avatarUrl} alt={customer.name} width={100} height={100} />
                                            <div>
                                                <div className="font-bold">{customer.name}</div>
                                                <div className="text-xs text-gray-500">{customer.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{customer.joinDate}</td>
                                    <td className="px-6 py-4 text-center">{customer.totalOrders}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">
                                        Rp {customer.totalSpent.toLocaleString('id-ID')}
                                    </td>
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
                {/* Pagination */}
                <div className="p-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
                    <p>Menampilkan 1-{filteredCustomers.length < 10 ? filteredCustomers.length : 10} dari {filteredCustomers.length} pelanggan</p>
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                        <button className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50" disabled>
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-md font-semibold">1</span>
                        <button className="p-2 rounded-md hover:bg-gray-100">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
