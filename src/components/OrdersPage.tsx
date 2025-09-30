"use client";

import React, { useState, ReactNode, useEffect, useMemo, FormEvent } from 'react';
import { MoreVertical, Search, ChevronLeft, ChevronRight, Printer, X, Trash2, Plus } from 'lucide-react';
import jsPDF from 'jspdf';
import { db, signIn } from '@/lib/firebase';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { LoadingSpinner } from './LoadingSpinner';

declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}
export type Customer = {
    id: string;
    name: string;
    email: string;
};

export type OrderItem = {
    productName: string;
    quantity: number;
    price: number;
};

export type Order = {
    id: string;
    customerId: string; // Diubah dari customerName
    orderDate: string; // ISO String
    status: 'Tertunda' | 'Selesai' | 'Dibatalkan';
    items: OrderItem[];
    subtotal: number;
    discount: number;
    total: number;
};

export type OrderWithCustomer = Order & {
    customerName: string;
};
export type MenuItem = { id: string; name: string; price: number; category: string; };
type NewOrder = Omit<Order, 'id'>;

const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full";
    const statusClasses = {
        'Tertunda': 'bg-yellow-100 text-yellow-800',
        'Selesai': 'bg-green-100 text-green-800',
        'Dibatalkan': 'bg-red-100 text-red-800',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

type OrderModalProps = { isOpen: boolean; onClose: () => void; customers: Customer[]; menuItems: MenuItem[]; onSubmit: (order: NewOrder) => Promise<void>; }
const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, customers, menuItems, onSubmit }) => {
    const [customerId, setCustomerId] = useState('');
    const [items, setItems] = useState<OrderItem[]>([]);
    const [discount, setDiscount] = useState(0);
    const [status, setStatus] = useState<'Tertunda' | 'Selesai' | 'Dibatalkan'>('Tertunda');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
    const total = useMemo(() => subtotal - discount, [subtotal, discount]);

    const handleAddItem = (menuItem: MenuItem) => {
        setItems(prev => [...prev, { productName: menuItem.name, price: menuItem.price, quantity: 1 }]);
    };
    const handleRemoveItem = (index: number) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };
    const handleQuantityChange = (index: number, quantity: number) => {
        if (quantity < 1) return;
        setItems(prev => prev.map((item, i) => i === index ? { ...item, quantity } : item));
    };

    const resetForm = () => {
        setCustomerId(''); setItems([]); setDiscount(0); setStatus('Tertunda');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!customerId || items.length === 0) {
            alert("Harap pilih pelanggan dan tambahkan setidaknya satu item.");
            return;
        }
        setIsSubmitting(true);
        const newOrder: NewOrder = {
            customerId, items, discount, status, subtotal, total,
            orderDate: new Date().toISOString(),
        };
        await onSubmit(newOrder);
        setIsSubmitting(false);
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    const availableMenuItems = menuItems.filter(menuItem => !items.some(item => item.productName === menuItem.name));

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-bold text-gray-800">Buat Pesanan Baru</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5 text-gray-600" /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* Customer & Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">Pelanggan</label>
                                <select id="customer" value={customerId} onChange={e => setCustomerId(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                                    <option value="" disabled>Pilih Pelanggan</option>
                                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status Pesanan</label>
                                <select id="status" value={status} onChange={e => setStatus(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                                    <option>Tertunda</option><option>Selesai</option><option>Dibatalkan</option>
                                </select>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Item Pesanan</h4>
                            <div className="space-y-2">
                                {items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                        <span className="flex-1 font-medium text-gray-700">{item.productName}</span>
                                        <span className="text-sm text-gray-500">Rp {item.price.toLocaleString('id-ID')}</span>
                                        <input type="number" value={item.quantity} onChange={e => handleQuantityChange(index, parseInt(e.target.value))} className="w-16 text-center border border-gray-300 rounded-md" />
                                        <button type="button" onClick={() => handleRemoveItem(index)} className="p-1 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                            {items.length === 0 && <p className="text-center text-gray-400 py-4">Belum ada item ditambahkan.</p>}

                            <div className="mt-2">
                                <label htmlFor="menu-item-select" className="sr-only">Tambah Item</label>
                                <select id="menu-item-select" onChange={e => handleAddItem(menuItems.find(mi => mi.id === e.target.value)!)} value="" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-500">
                                    <option value="" disabled>+ Tambah item dari menu...</option>
                                    {availableMenuItems.map(mi => <option key={mi.id} value={mi.id}>{mi.name} - Rp {mi.price.toLocaleString('id-ID')}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Calculation */}
                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold text-gray-800">Rp {subtotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <label htmlFor="discount" className="text-gray-600">Diskon (Rp)</label>
                                <input type="number" id="discount" value={discount} onChange={e => setDiscount(Math.max(0, parseInt(e.target.value) || 0))} className="w-32 px-2 py-1 text-right border border-gray-300 rounded-md" />
                            </div>
                            <div className="flex justify-between items-center text-lg">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="font-bold text-amber-800">Rp {total.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center p-4 bg-gray-50 rounded-b-xl space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Batal</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-amber-800 border border-amber-800 rounded-lg text-sm font-semibold text-white hover:bg-amber-900 disabled:bg-amber-400">
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Pesanan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [scriptsLoaded, setScriptsLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const ordersCollectionPath = `artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/public/data/orders`;
    const customersCollectionPath = `artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/public/data/customers`;
    const menuItemsCollectionPath = `artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/public/data/menuItems`;

    // Efek untuk memuat skrip PDF secara dinamis
    useEffect(() => {
        const jspdfScriptId = 'jspdf-script';
        if (document.getElementById(jspdfScriptId)) {
            setScriptsLoaded(true);
            return;
        }

        const jspdfScript = document.createElement('script');
        jspdfScript.id = jspdfScriptId;
        jspdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        jspdfScript.async = true;
        document.body.appendChild(jspdfScript);

        jspdfScript.onload = () => {
            const autotableScript = document.createElement('script');
            autotableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js';
            autotableScript.async = true;
            document.body.appendChild(autotableScript);
            autotableScript.onload = () => {
                setScriptsLoaded(true);
            };
        };
    }, []);

    useEffect(() => {
        const setupListeners = async () => {
            await signIn();

            const unsubOrders = onSnapshot(collection(db, ordersCollectionPath), (snapshot) => {
                const ordersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
                setOrders(ordersList);
                setLoading(false);
            });

            const unsubCustomers = onSnapshot(collection(db, customersCollectionPath), (snapshot) => {
                const customersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
                setCustomers(customersList);
            });

            const unsubMenuItems = onSnapshot(collection(db, menuItemsCollectionPath), (snapshot) => setMenuItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem))));


            return () => {
                unsubOrders();
                unsubCustomers();
                unsubMenuItems();
            };
        };
        setupListeners();
    }, [ordersCollectionPath, customersCollectionPath, menuItemsCollectionPath]);

    const displayOrders = useMemo(() => {
        const customerMap = new Map(customers.map(c => [c.id, c.name]));
        return orders.map(order => ({ ...order, customerName: customerMap.get(order.customerId) || 'Pelanggan Dihapus' }));
    }, [orders, customers]);

    const handlePrintOrder = (order: OrderWithCustomer) => { /* ... (kode print PDF tetap sama) ... */
        if (!scriptsLoaded || !(window as any).jspdf) { console.error("jsPDF scripts not loaded yet."); return; }
        const { jsPDF } = (window as any).jspdf; const doc = new jsPDF();
        doc.setFontSize(20); doc.text("Struk Pesanan - R Coffee", 105, 22, { align: 'center' }); doc.setFontSize(10); doc.text("Jl. Kenangan No. 42, Makassar", 105, 28, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`ID Pesanan: ${order.id.substring(0, 8)}`, 14, 45);
        doc.text(`Tanggal: ${new Date(order.orderDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} ${new Date(order.orderDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`, 14, 52);
        doc.text(`Pelanggan: ${order.customerName}`, 14, 59);
        const tableColumn = ["Item", "Qty", "Harga", "Total Harga"];
        const tableRows = order.items.map(item => [item.productName, item.quantity, `Rp ${item.price.toLocaleString('id-ID')}`, `Rp ${(item.quantity * item.price - order.discount).toLocaleString('id-ID')}`]);
        (doc as any).autoTable({ head: [tableColumn], body: tableRows, startY: 65, theme: 'striped', headStyles: { fillColor: [63, 44, 30] } });
        const finalY = (doc as any).lastAutoTable.finalY;
        const rightAlign = 196; doc.setFontSize(12); doc.text(`Subtotal:`, rightAlign - 80, finalY + 10, { align: 'left' }); doc.text(`Rp ${order.subtotal.toLocaleString('id-ID')}`, rightAlign, finalY + 10, { align: 'right' }); doc.text(`Diskon:`, rightAlign - 80, finalY + 17, { align: 'left' }); doc.text(`- Rp ${order.discount.toLocaleString('id-ID')}`, rightAlign, finalY + 17, { align: 'right' }); doc.setFont("helvetica", "bold"); doc.text(`Total:`, rightAlign - 80, finalY + 24, { align: 'left' }); doc.text(`Rp ${order.total.toLocaleString('id-ID')}`, rightAlign, finalY + 24, { align: 'right' }); doc.setFontSize(10); doc.text("Terima kasih atas pesanan Anda!", 105, finalY + 45, { align: 'center' });
        doc.save(`struk_pesanan_${order.id.substring(0, 8)}.pdf`);
    };

    const filteredOrders = displayOrders.filter(order => order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleAddOrder = async (order: NewOrder) => {
        await addDoc(collection(db, ordersCollectionPath), order);
    };

    return (
        <>
            <OrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} customers={customers} menuItems={menuItems} onSubmit={handleAddOrder} />
            <div className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-300">Pesanan</h2>
                        <p className="text-gray-500 mt-1">Lacak dan kelola semua pesanan pelanggan.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="bg-amber-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center hover:bg-amber-900 transition-colors mt-3 sm:mt-0">
                        <Plus className="w-5 h-5 mr-2" />
                        Tambah Pesanan
                    </button>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" placeholder="Cari ID pesanan atau nama pelanggan..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                    {loading ? (<div className="flex justify-center items-center h-80"><LoadingSpinner /></div>) : (
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                                <tr>
                                    <th className="px-6 py-3">ID Pesanan</th><th className="px-6 py-3">Pelanggan</th><th className="px-6 py-3">Tanggal</th><th className="px-6 py-3 text-right">Total</th><th className="px-6 py-3 text-center">Status</th><th className="px-6 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{order.id.substring(0, 8)}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{order.customerName}</td>
                                        <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                        <td className="px-6 py-4 text-right font-semibold">Rp {order.total.toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4 text-center"><StatusBadge status={order.status} /></td>
                                        <td className="px-6 py-4 text-center">
                                            <button onClick={() => handlePrintOrder(order)} disabled={!scriptsLoaded} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                <Printer className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredOrders.length === 0 && (<tr><td colSpan={6} className="text-center py-12 text-gray-500">Tidak ada pesanan.</td></tr>)}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}
