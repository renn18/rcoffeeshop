'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';
import Image from 'next/image';
import { db, signIn } from '@/lib/firebase';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from './LoadingSpinner';

type MenuItem = {
    id: string;
    name: string;
    category: 'Kopi' | 'Non-Kopi' | 'Makanan';
    price: number;
    imageUrl: string;
    isAvailable: boolean;
};

type NewMenuItem = Omit<MenuItem, 'id'>;

type MenuItemModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (item: NewMenuItem | MenuItem) => Promise<void>;
    initialData?: MenuItem | null;
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState<MenuItem['category']>('Kopi');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = !!initialData;

    useEffect(() => {
        if (isEditMode) {
            setName(initialData.name);
            setCategory(initialData.category);
            setPrice(String(initialData.price));
            setImageUrl(initialData.imageUrl || '');
        } else {
            setName('');
            setCategory('Kopi');
            setPrice('');
            setImageUrl('');
        }
    }, [initialData, isEditMode, isOpen]);


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!name || !price) return;

        setIsSubmitting(true);
        const itemData = {
            name,
            category,
            price: Number(price),
            imageUrl,
        };

        if (isEditMode) {
            await onSubmit({ ...itemData, id: initialData.id, isAvailable: initialData.isAvailable });
        } else {
            await onSubmit({ ...itemData, isAvailable: true });
        }

        setIsSubmitting(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 transition-opacity">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-bold text-gray-800">{isEditMode ? 'Edit Item Menu' : 'Tambah Item Menu Baru'}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        {/* Form Inputs ... */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Item</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" required />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                            <select id="category" value={category} onChange={e => setCategory(e.target.value as MenuItem['category'])} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                                <option>Kopi</option>
                                <option>Non-Kopi</option>
                                <option>Makanan Ringan</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
                            <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" required />
                        </div>
                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">URL Gambar (Opsional)</label>
                            <input type="text" id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
                        </div>
                    </div>
                    <div className="flex justify-end items-center p-4 bg-gray-50 rounded-b-xl space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Batal</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-amber-800 border border-amber-800 rounded-lg text-sm font-semibold text-white hover:bg-amber-900 disabled:bg-amber-400">
                            {isSubmitting ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Simpan Item')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const MenuItemCard: React.FC<{ item: MenuItem; onEdit: () => void; onDelete: () => void; }> = ({ item, onEdit, onDelete }) => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
            {item.imageUrl ? (
                <img src={item.imageUrl} onError={(e) => e.currentTarget.src = 'https://placehold.co/300x200/E2E8F0/4A5568?text=Error'} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
                // Only render a placeholder if imageUrl is falsy
                <div className="w-12 h-12 flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">No Image</span>
                </div>
            )}
        </div>
        <div className="p-4">
            <p className="text-xs font-semibold text-amber-700">{item.category}</p>
            <h3 className="font-bold text-gray-800 mt-1 truncate">{item.name}</h3>
            <p className="text-lg font-extrabold text-gray-900 mt-2">
                Rp {typeof item.price === 'number' ? item.price.toLocaleString('id-ID') : '0'}
            </p>
        </div>
        <div className="p-2 bg-gray-50 flex justify-end space-x-2">
            <button onClick={onEdit} className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
            <button onClick={onDelete} className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
    </div>
);

export default function MenuPage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<'Semua' | MenuItem['category']>('Semua');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

    const collectionPath = `artifacts/1:844771099035:web:cee2355d34600f1afba13e/public/data/menuItems`;

    useEffect(() => {
        const setupListener = async () => {
            await signIn();
            const menuCollection = collection(db, collectionPath);
            const unsubscribe = onSnapshot(menuCollection, (snapshot) => {
                const items = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.name,
                        category: data.category,
                        price: data.price,
                        imageUrl: data.imageUrl,
                        isAvailable: data.isAvailable,
                    } as MenuItem;
                });
                setMenuItems(items);
                setLoading(false);
            }, (error) => {
                console.error("Error fetching menu items:", error);
                setLoading(false);
            });
            return () => unsubscribe();
        };
        setupListener();
    }, [collectionPath]);

    const handleModalSubmit = async (item: NewMenuItem | MenuItem) => {
        if ('id' in item) { // Edit mode
            const docRef = doc(db, collectionPath, item.id);
            const { id, ...dataToUpdate } = item;
            await updateDoc(docRef, dataToUpdate);
            toast.success('Item berhasil diperbarui!');
        } else { // Add mode
            await addDoc(collection(db, collectionPath), item);
            toast.success('Item berhasil ditambahkan!');
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
            try {
                const docRef = doc(db, collectionPath, itemId);
                await deleteDoc(docRef);
                toast.success('Item berhasil dihapus!');
            } catch (error) {
                toast.error('Gagal menghapus item!');
            }
        }
    };

    const openAddModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: MenuItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const categories: ('Semua' | MenuItem['category'])[] = ['Semua', 'Kopi', 'Non-Kopi'];
    const filteredItems = menuItems
        .filter(item => activeCategory === 'Semua' || item.category === activeCategory)
        .filter(item => (item.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <>
            <MenuItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={editingItem}
            />
            <div className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Menu</h2>
                        <p className="text-gray-500 mt-1">Kelola item yang tersedia di coffee shop Anda.</p>
                    </div>
                    <button onClick={openAddModal} className="bg-amber-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center hover:bg-amber-900 transition-colors mt-3 sm:mt-0">
                        <Plus className="w-5 h-5 mr-2" />
                        Tambah Item
                    </button>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder="Cari item menu..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                        {categories.map(category => (
                            <button key={category} onClick={() => setActiveCategory(category)} className={`px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${activeCategory === category ? 'bg-amber-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>
                ) : filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredItems.map(item => <MenuItemCard key={item.id} item={item} onEdit={() => openEditModal(item)} onDelete={() => handleDeleteItem(item.id)} />)}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                        <p className="text-gray-500">Belum ada item menu yang cocok.</p>
                        <p className="text-sm text-gray-400 mt-1">Coba ubah filter atau tambahkan item baru.</p>
                    </div>
                )}
            </div>
        </>
    );
}