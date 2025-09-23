export default function ContactPage() {
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-4xl font-extrabold text-center mb-8 text-coffee-dark">
                Hubungi Kami
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-coffee-brown">Lokasi Kami</h2>
                    <p className="font-semibold">R'Coffee Shop</p>
                    <p>Jl. Urip Sumoharjo No. 123</p>
                    <p>Makassar, Sulawesi Selatan</p>
                    <p>Indonesia</p>
                    <div className="mt-4">
                        <a href="#" className="text-coffee-brown hover:underline">Lihat di Google Maps &rarr;</a>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-coffee-brown">Jam Operasional</h2>
                    <p><span className="font-semibold">Senin - Jumat:</span> 08:00 - 22:00 WITA</p>
                    <p><span className="font-semibold">Sabtu - Minggu:</span> 09:00 - 23:00 WITA</p>

                    <h2 className="text-2xl font-bold mt-6 mb-4 text-coffee-brown">Kontak</h2>
                    <p><span className="font-semibold">Telepon:</span> (0411) 123-456</p>
                    <p><span className="font-semibold">Email:</span> halo@rcoffee.shop</p>
                </div>
            </div>
        </div>
    );
}
