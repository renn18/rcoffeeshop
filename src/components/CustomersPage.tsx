'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { Plus, Search, MoreVertical, ChevronLeft, ChevronRight, UserPlus, ChevronDown, X, Trash2, Edit } from 'lucide-react';
import Image from 'next/image';
import { db, signIn } from '@/lib/firebase';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { LoadingSpinner } from './LoadingSpinner';

type Customer = {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    joinDate: string;
    totalOrders: number;
    totalSpent: number;
};

type NewCustomer = Omit<Customer, 'id'>;

type CustomerModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (customer: NewCustomer | Customer) => Promise<void>;
    initialData?: Customer | null;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = !!initialData;

    useEffect(() => {
        if (isEditMode && isOpen) {
            setName(initialData.name);
            setEmail(initialData.email);
            setAvatarUrl(initialData.avatarUrl || '');
        } else {
            setName('');
            setEmail('');
            setAvatarUrl('');
        }
    }, [initialData, isEditMode, isOpen]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!name || !email) return;

        setIsSubmitting(true);
        let customerData: NewCustomer | Customer;

        if (isEditMode) {
            customerData = {
                ...initialData,
                name,
                email,
                avatarUrl,
            };
        } else {
            customerData = {
                name,
                email,
                avatarUrl,
                joinDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                totalOrders: 0,
                totalSpent: 0,
            };
        }

        await onSubmit(customerData);
        setIsSubmitting(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-bold text-gray-800">{isEditMode ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5 text-gray-600" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="customer-name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                            <input type="text" id="customer-name" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" required />
                        </div>
                        <div>
                            <label htmlFor="customer-email" className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                            <input type="email" id="customer-email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" required />
                        </div>
                        <div>
                            <label htmlFor="customer-avatar" className="block text-sm font-medium text-gray-700 mb-1">URL Avatar (Opsional)</label>
                            <input type="text" id="customer-avatar" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
                        </div>
                    </div>
                    <div className="flex justify-end items-center p-4 bg-gray-50 rounded-b-xl space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Batal</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-amber-800 border border-amber-800 rounded-lg text-sm font-semibold text-white hover:bg-amber-900 disabled:bg-amber-400">
                            {isSubmitting ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Simpan Pelanggan')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const collectionPath = `artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/public/data/customers`;

    useEffect(() => {
        const setupListener = async () => {
            await signIn();
            const customersCollection = collection(db, collectionPath);

            const unsubscribe = onSnapshot(customersCollection, (snapshot) => {
                const customerList = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.name ?? '',
                        email: data.email ?? '',
                        avatarUrl: data.avatarUrl,
                        joinDate: data.joinDate ?? '',
                        totalOrders: data.totalOrders ?? 0,
                        totalSpent: data.totalSpent ?? 0,
                    } as Customer;
                });
                setCustomers(customerList);
                setLoading(false);
            }, (error) => {
                console.error("Error fetching customers:", error);
                setLoading(false);
            });

            return () => unsubscribe();
        };

        setupListener();
    }, [collectionPath]);

    const handleModalSubmit = async (customer: NewCustomer | Customer) => {
        if ('id' in customer) {
            const docRef = doc(db, collectionPath, customer.id);
            const { id, ...dataToUpdate } = customer;
            await updateDoc(docRef, dataToUpdate);
        } else { // Add mode
            await addDoc(collection(db, collectionPath), customer);
        }
    };

    const handleDeleteCustomer = async (customerId: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
            const docRef = doc(db, collectionPath, customerId);
            await deleteDoc(docRef);
        }
    };

    const openAddModal = () => {
        setEditingCustomer(null);
        setIsModalOpen(true);
    };

    const openEditModal = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <>
            <CustomerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={editingCustomer}
            />
            <div className="p-4 md:p-6">
                {/* Header Halaman */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Pelanggan</h2>
                        <p className="text-gray-500 mt-1">Lihat dan kelola data pelanggan Anda.</p>
                    </div>
                    <button onClick={openAddModal} className="bg-amber-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center hover:bg-amber-900 transition-colors mt-3 sm:mt-0">
                        <UserPlus className="w-5 h-5 mr-2" />
                        Tambah Pelanggan
                    </button>
                </div>

                {/* Kontrol & Pencarian */}
                <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 w-full">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder="Cari nama atau email pelanggan..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <button className="w-full md:w-auto flex items-center justify-center text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border rounded-lg px-4 py-2 transition-colors">
                        Filter <ChevronDown className="w-4 h-4 ml-2" />
                    </button>
                </div>

                {/* Tabel Pelanggan */}
                <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-80"><LoadingSpinner /></div>
                    ) : (
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Nama Pelanggan</th>
                                    <th scope="col" className="px-6 py-3">Tanggal Bergabung</th>
                                    <th scope="col" className="px-6 py-3 text-center">Total Pesanan</th>
                                    <th scope="col" className="px-6 py-3 text-right">Total Belanja</th>
                                    <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img className="w-10 h-10 rounded-full mr-3 object-cover" src={customer.avatarUrl || `https://ui-avatars.com/api/?name=${customer.name.replace(/ /g, "+")}&background=random`} alt={customer.name} />
                                                <div>
                                                    <div>{customer.name}</div>
                                                    <div className="text-xs text-gray-500">{customer.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{new Date(customer.joinDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                        <td className="px-6 py-4 text-center">{customer.totalOrders}</td>
                                        <td className="px-6 py-4 text-right">Rp {customer.totalSpent.toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4 text-center space-x-2">
                                            <button onClick={() => openEditModal(customer)} className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeleteCustomer(customer.id)} className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredCustomers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12 text-gray-500">
                                            Tidak ada pelanggan yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}
