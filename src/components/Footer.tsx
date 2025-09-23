export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-coffee-dark text-white py-6 mt-12">
            <div className="container mx-auto text-center">
                <p>&copy; {currentYear} R'Coffee Shop. All Rights Reserved.</p>
                <p className="text-sm text-gray-400 mt-1">
                    Dibuat dengan ❤️ di Makassar
                </p>
            </div>
        </footer>
    );
}
