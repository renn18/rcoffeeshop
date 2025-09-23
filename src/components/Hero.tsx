import Link from "next/link";

export default function Hero() {
    return (
        <section
            className="relative rounded-lg overflow-hidden h-96 flex items-center justify-center text-center text-white bg-cover bg-center"
            style={{ backgroundImage: "url('https://placehold.co/1200x400/3a241c/FFFFFF?text=Suasana+Coffee+Shop')" }}
        >
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 p-4">
                <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
                    Secangkir Cerita, Sejuta Rasa
                </h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
                    Temukan biji kopi terbaik dari seluruh nusantara, diseduh dengan penuh cinta hanya untuk Anda.
                </p>
                <Link
                    href="/menu"
                    className="mt-8 inline-block bg-coffee-brown hover:bg-opacity-90 transition-all text-white font-bold py-3 px-8 rounded-full shadow-lg"
                >
                    Lihat Menu
                </Link>
            </div>
        </section>
    );
}