import Link from "next/link";

export default function ContactPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
            <h1 className="md:text-4xl text-2xl font-extrabold mb-6">
                Hubungi Kami
            </h1>
            <div className="max-w-4xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="md:text-2xl text-xl font-bold mb-4 ">Lokasi Kami</h2>
                        <p className="font-semibold">R'Coffee Shop</p>
                        <p>Jl. Urip Sumoharjo No. 123</p>
                        <p>Makassar, Sulawesi Selatan</p>
                        <p>Indonesia</p>
                        <div className="mt-4">
                            <Link href="#" className=" hover:underline">Lihat di Google Maps &rarr;</Link>
                        </div>
                    </div>
                    <div>
                        <h2 className="md:text-2xl text-xl font-bold mb-4 ">Jam Operasional</h2>
                        <p><span className="font-semibold">Senin - Jumat:</span> 08:00 - 22:00 WITA</p>
                        <p><span className="font-semibold">Sabtu - Minggu:</span> 09:00 - 23:00 WITA</p>

                        <h2 className="md:text-2xl text-xl font-bold mt-6 mb-4 ">Kontak</h2>
                        <p><span className="font-semibold">Telepon:</span> (0411) 123-456</p>
                        <p><span className="font-semibold">Email:</span> halo@rcoffee.shop</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
