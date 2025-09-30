"use client";

import { useEffect, useState, FormEvent } from 'react';
import { auth, db, appId, signIn } from '../lib/firebase';
import { onAuthStateChanged, updatePassword, updateProfile, User } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { Building, KeyRound, Save, UserCircle, ImageIcon } from 'lucide-react';


type CompanyInfo = {
    name: string;
    motto: string;
    address: string;
    phone: string;
    logoUrl: string;
};

export default function SettingsPage() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({ name: '', motto: '', address: '', phone: '', logoUrl: '' });
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPhotoUrl, setNewPhotoUrl] = useState('');
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [loading, setLoading] = useState(true);

    const companyInfoDocPath = `artifacts/${appId}/public/data/settings`;
    const companyInfoDocRef = doc(db, companyInfoDocPath, "companyInfo");

    useEffect(() => {
        const setupListeners = async () => {
            await signIn();

            // Listener untuk data perusahaan
            const unsubCompanyInfo = onSnapshot(companyInfoDocRef, (doc) => {
                if (doc.exists()) {
                    setCompanyInfo(doc.data() as CompanyInfo);
                }
                setLoading(false);
            }, (error) => {
                console.error("Error fetching company info:", error);
                setLoading(false);
            });

            // Listener untuk status autentikasi user
            const unsubAuth = onAuthStateChanged(auth, (user) => {
                setCurrentUser(user);
                if (user && user.photoURL) {
                    setNewPhotoUrl(user.photoURL);
                }
            });

            return () => {
                unsubCompanyInfo();
                unsubAuth();
            };
        };
        setupListeners();
    }, [companyInfoDocRef]);

    const showFeedback = (type: 'success' | 'error', message: string) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 3000);
    };

    const handleCompanyInfoSave = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await setDoc(companyInfoDocRef, companyInfo, { merge: true });
            showFeedback('success', 'Informasi toko berhasil diperbarui!');
        } catch (error) {
            console.error(error);
            showFeedback('error', 'Gagal menyimpan informasi toko.');
        }
    };

    const handleProfileUpdate = async (e: FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        try {
            await updateProfile(currentUser, { photoURL: newPhotoUrl });
            showFeedback('success', 'Foto profil berhasil diperbarui!');
        } catch (error) {
            console.error(error);
            showFeedback('error', 'Gagal memperbarui foto profil.');
        }
    };


    const handlePasswordUpdate = async (e: FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        if (newPassword !== confirmPassword) {
            showFeedback('error', 'Password baru dan konfirmasi tidak cocok.');
            return;
        }
        if (newPassword.length < 6) {
            showFeedback('error', 'Password baru minimal harus 6 karakter.');
            return;
        }
        try {
            await updatePassword(currentUser, newPassword);
            setNewPassword('');
            setConfirmPassword('');
            showFeedback('success', 'Password berhasil diganti!');
        } catch (error: any) {
            console.error(error);
            // Firebase seringkali meminta re-login untuk aksi sensitif ini
            showFeedback('error', 'Gagal mengganti password. Coba login ulang.');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan</h1>

            {/* Feedback Message */}
            {feedback && (
                <div className={`p-4 mb-4 rounded-lg text-sm ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {feedback.message}
                </div>
            )}

            {/* Informasi Toko */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                <div className="flex items-center mb-4">
                    <Building className="w-6 h-6 mr-3 text-amber-800" />
                    <h2 className="text-lg font-bold text-gray-800">Informasi Toko</h2>
                </div>
                <form onSubmit={handleCompanyInfoSave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nama Toko</label>
                            <input type="text" value={companyInfo.name} onChange={e => setCompanyInfo({ ...companyInfo, name: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Motto</label>
                            <input type="text" value={companyInfo.motto} onChange={e => setCompanyInfo({ ...companyInfo, motto: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Alamat</label>
                        <input type="text" value={companyInfo.address} onChange={e => setCompanyInfo({ ...companyInfo, address: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Telepon</label>
                            <input type="text" value={companyInfo.phone} onChange={e => setCompanyInfo({ ...companyInfo, phone: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">URL Logo</label>
                            <input type="text" value={companyInfo.logoUrl} onChange={e => setCompanyInfo({ ...companyInfo, logoUrl: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                    </div>
                    <div className="text-right">
                        <button type="submit" className="bg-amber-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center hover:bg-amber-900 transition-colors ml-auto">
                            <Save className="w-4 h-4 mr-2" /> Simpan Informasi
                        </button>
                    </div>
                </form>
            </div>

            {/* Pengaturan Akun */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ganti Foto Profil */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center mb-4">
                        <UserCircle className="w-6 h-6 mr-3 text-amber-800" />
                        <h2 className="text-lg font-bold text-gray-800">Profil Akun</h2>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Email: {currentUser?.email || 'Tidak tersedia'}</p>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="flex items-center gap-4">
                            <img src={newPhotoUrl || `https://ui-avatars.com/api/?name=${currentUser?.email || 'A'}&background=random`} alt="Avatar" className="w-16 h-16 rounded-full object-cover bg-gray-200" />
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">URL Foto Profil Baru</label>
                                <input type="text" value={newPhotoUrl} onChange={e => setNewPhotoUrl(e.target.value)} placeholder="https://..." className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg" />
                            </div>
                        </div>
                        <div className="text-right">
                            <button type="submit" className="bg-amber-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center hover:bg-amber-900 transition-colors ml-auto">
                                <ImageIcon className="w-4 h-4 mr-2" /> Ganti Foto
                            </button>
                        </div>
                    </form>
                </div>

                {/* Ganti Password */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center mb-4">
                        <KeyRound className="w-6 h-6 mr-3 text-amber-800" />
                        <h2 className="text-lg font-bold text-gray-800">Ganti Password</h2>
                    </div>
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password Baru</label>
                            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div className="text-right">
                            <button type="submit" className="bg-amber-800 text-white font-semibold py-2 px-4 rounded-lg flex items-center hover:bg-amber-900 transition-colors ml-auto">
                                <KeyRound className="w-4 h-4 mr-2" /> Ganti Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );

};