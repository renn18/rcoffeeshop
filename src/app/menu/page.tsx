import { products } from "@/lib/data";
import MenuItem from "@/components/MenuItemCard";

export default function MenuPage() {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12">
            <h1 className="text-4xl font-extrabold text-center my-12 text-coffee-dark">
                Menu Lengkap Kami
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-8">
                {products.map((product) => (
                    <MenuItem key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
