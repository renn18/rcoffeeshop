import Image from "next/image";
import type { Product } from "@/lib/data";

type MenuItemProps = {
    product: Product;
};

export default function MenuItem({ product }: MenuItemProps) {
    const formatPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(product.price);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            <div className="relative h-56 w-full">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    unoptimized
                />
            </div>
            <div className="p-6 bg-white dark:bg-gray-800">
                <h3 className="text-xl text-gray-600 dark:text-gray-300 font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 h-12">{product.description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">{formatPrice}</span>
                    <button className="bg-gray-800 dark:bg-gray-400 text-white dark:text-gray-800 hover:bg-green-400 cursor-pointer px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                        Pesan
                    </button>
                </div>
            </div>
        </div>
    );
}
