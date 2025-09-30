"use client";

import { appId, db, signIn } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Product = {
    id: string;
    name: string;
    // description?: string;
    price: number;
    category: string;
    imageUrl: string;
};

type MenuItemProps = {
    product: Product;
};

function MenuItem({ product }: MenuItemProps) {
    const formatPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(product.price);

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group border border-gray-100 flex flex-col">
            <div className="relative h-48 w-full overflow-hidden">
                <img
                    src={product.imageUrl || 'https://placehold.co/600x400/a78b71/FFFFFF?text=Kopi'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                    <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded-full">{product.category}</span>
                    <h3 className="text-lg text-gray-800 font-bold mt-2 mb-1 truncate">{product.name}</h3>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xl font-bold text-amber-900">{formatPrice}</span>
                    <button className="bg-amber-800 text-white group-hover:bg-green-600 cursor-pointer px-4 py-2 rounded-lg transition-colors font-semibold text-sm">
                        Pesan
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function MenuDisplay() {
    const [menuItems, setMenuItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Semua');

    const menuItemsCollectionPath = `artifacts/${appId}/public/data/menuItems`;

    useEffect(() => {
        const setupListener = async () => {
            await signIn();
            const menuItemsCollection = collection(db, menuItemsCollectionPath);

            const unsubscribe = onSnapshot(menuItemsCollection, (snapshot) => {
                const productList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
                setMenuItems(productList);
                setLoading(false);
            }, (error) => {
                console.error("Error fetching menu items:", error);
                setLoading(false);
            });

            return () => unsubscribe();
        };
        setupListener();
    }, [menuItemsCollectionPath]);

    const categories = useMemo(() => {
        const allCategories = menuItems.map(item => item.category);
        return ['Semua', ...Array.from(new Set(allCategories))];
    }, [menuItems]);

    const filteredMenuItems = useMemo(() => {
        if (activeCategory === 'Semua') return menuItems;
        return menuItems.filter(item => item.category === activeCategory);
    }, [menuItems, activeCategory]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 bg-stone-50 min-h-screen">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-gray-700 dark:text-gray-200 tracking-tight sm:text-5xl">Menu Lengkap Kami</h2>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">Temukan kopi favoritmu dan nikmati hidangan spesial dari Kopi Senja.</p>
            </div>

            {/* Tombol Filter Kategori */}
            <div className="flex justify-center flex-wrap gap-3 mb-10">
                {categories.length > 2 && categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 ${activeCategory === category
                            ? 'bg-amber-800 text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-amber-100 shadow-sm'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Tampilan Menu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredMenuItems.map(product => (
                    <MenuItem key={product.id} product={product} />
                ))}
            </div>
            {filteredMenuItems.length === 0 && !loading && (
                <div className="col-span-full text-center py-10">
                    <p className="text-gray-600 font-semibold">Tidak ada item ditemukan untuk kategori "{activeCategory}".</p>
                    <p className="text-gray-500 text-sm mt-1">Coba pilih kategori lain.</p>
                </div>
            )}
        </div>
    );
}