'use client';

import React, { useState } from 'react';
import { Plus, Tag, Coffee, GlassWater, Sandwich, MoreHorizontal } from 'lucide-react';

// ============================================================================
// DATA CONTOH & TIPE
// ============================================================================

type MenuItem = {
    id: number;
    name: string;
    category: 'Kopi' | 'Non-Kopi' | 'Makanan';
    price: number;
    imageUrl: string;
    isAvailable: boolean;
};

const menuItems: MenuItem[] = [
    { id: 1, name: 'Espresso', category: 'Kopi', price: 18000, imageUrl: 'https://placehold.co/300x200/A37F61/FFFFFF?text=Espresso', isAvailable: true },
    { id: 2, name: 'Latte', category: 'Kopi', price: 25000, imageUrl: 'https://placehold.co/300x200/C3A68F/FFFFFF?text=Latte', isAvailable: true },
    { id: 3, name: 'Matcha Latte', category: 'Non-Kopi', price: 28000, imageUrl: 'https://placehold.co/300x200/87A96B/FFFFFF?text=Matcha', isAvailable: false },
    { id: 4, name: 'Croissant', category: 'Makanan', price: 22000, imageUrl: 'https://placehold.co/300x200/D4A276/FFFFFF?text=Croissant', isAvailable: true },
    { id: 5, name: 'Americano', category: 'Kopi', price: 20000, imageUrl: 'https://placehold.co/300x200/5B3A29/FFFFFF?text=Americano', isAvailable: true },
    { id: 6, name: 'Red Velvet', category: 'Non-Kopi', price: 28000, imageUrl: 'https://placehold.co/300x200/9B2C2C/FFFFFF?text=Red+Velvet', isAvailable: true },
    { id: 7, name: 'Tuna Sandwich', category: 'Makanan', price: 35000, imageUrl: 'https://placehold.co/300x200/F4A261/FFFFFF?text=Sandwich', isAvailable: false },
    { id: 8, name: 'Cappuccino', category: 'Kopi', price: 25000, imageUrl: 'https://placehold.co/300x200/8B5E3C/FFFFFF?text=Cappuccino', isAvailable: true },
];

const categories = ['Semua', 'Kopi', 'Non-Kopi', 'Makanan'];
const categoryIcons = {
    'Kopi': <Coffee className="w-4 h-4 mr-2" />,
    'Non-Kopi': <GlassWater className="w-4 h-4 mr-2" />,
    'Makanan': <Sandwich className="w-4 h-4 mr-2" />,
};

// ============================================================================
// KOMPONEN-KOMPONEN KECIL
// ============================================================================

const MenuItemCard: React.FC<{ item: MenuItem }> = ({ item }) => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-lg">
        <div className="relative">
            <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover" />
            {!item.isAvailable && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-sm bg-red-500/80 px-3 py-1 rounded-full">Habis</span>
                </div>
            )}
            <div className={`absolute top-2 left-2 flex items-center text-xs font-semibold px-2 py-1 rounded-full text-white ${item.category === 'Kopi' ? 'bg-amber-700' : item.category === 'Non-Kopi' ? 'bg-emerald-600' : 'bg-orange-500'
                }`}>
                {categoryIcons[item.category]} {item.category}
            </div>
        </div>
        <div className="p-4">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <button className="text-gray-400 hover:text-gray-700 p-1 -mt-1 -mr-1">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>
            <p className="text-amber-900 font-semibold mt-1">
                Rp {item.price.toLocaleString('id-ID')}
            </p>
        </div>
    </div>
);

// ============================================================================
// KOMPONEN UTAMA HALAMAN MENU
// ============================================================================

export default function MenuPage() {
    const [activeCategory, setActiveCategory] = useState('Semua');

    const filteredItems = activeCategory === 'Semua'
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    return (
        <div className="p-4 md:p-6">
            {/* Header Halaman */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Menu Produk</h2>
                    <p className="text-gray-500 mt-1">Kelola daftar menu yang tersedia di coffee shop Anda.</p>
                </div>
                <button className="bg-amber-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center hover:bg-amber-900 transition-colors mt-3 sm:mt-0">
                    <Plus className="w-5 h-5 mr-2" />
                    Tambah Item
                </button>
            </div>

            {/* Filter Kategori */}
            <div className="mb-6">
                <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeCategory === category
                                    ? 'bg-amber-900 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Daftar Item Menu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map(item => (
                    <MenuItemCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}
