export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Espresso",
    description: "Ekstrak kopi murni dengan crema tebal yang kaya rasa.",
    price: 18000,
    imageUrl: "https://placehold.co/400x400/6F4E37/FFFFFF?text=Espresso",
  },
  {
    id: 2,
    name: "Caffe Latte",
    description: "Perpaduan espresso dengan susu steam yang lembut dan creamy.",
    price: 25000,
    imageUrl: "https://placehold.co/400x400/A0522D/FFFFFF?text=Latte",
  },
  {
    id: 3,
    name: "Cappuccino",
    description: "Espresso, susu steam, dan busa susu tebal dalam harmoni sempurna.",
    price: 25000,
    imageUrl: "https://placehold.co/400x400/8B4513/FFFFFF?text=Cappuccino",
  },
  {
    id: 4,
    name: "Kopi Gula Aren",
    description: "Kopi susu kekinian dengan manis legit dari gula aren asli.",
    price: 28000,
    imageUrl: "https://placehold.co/400x400/D2691E/FFFFFF?text=Kopi+Aren",
  },
  {
    id: 5,
    name: "Manual Brew V60",
    description: "Seduhan kopi manual yang menonjolkan karakter asli biji kopi.",
    price: 30000,
    imageUrl: "https://placehold.co/400x400/5C4033/FFFFFF?text=V60",
  },
  {
    id: 6,
    name: "Croissant",
    description: "Pastry renyah dan buttery, teman sempurna untuk minum kopi.",
    price: 22000,
    imageUrl: "https://placehold.co/400x400/DEB887/000000?text=Croissant",
  },
];