import { products } from "@/lib/data";
import MenuItem from "./MenuItemCard";
import Link from "next/link";

export default function FeaturedProducts() {
    // Ambil 3 produk pertama sebagai produk unggulan
    const featured = products.slice(0, 3);

    return (
        <section>
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-700 dark:text-gray-300">Menu Favorit Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-8">
                {featured.map((product) => (
                    <MenuItem key={product.id} product={product} />
                ))}
            </div>
            <div className="text-center mt-12">
                <Link href="/menu" className="text-gray-700 dark:text-gray-300 hover:underline font-semibold">
                    Lihat Semua Menu &rarr;
                </Link>
            </div>
        </section>
    );
}