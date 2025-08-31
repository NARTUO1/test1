export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  vendor: string;
  rating: number;
  reviewCount: number;
  category: string;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
}

export const products: Product[] = [
  // Electronics
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 99599,
    image:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop",
    vendor: "Apple Store",
    rating: 4.9,
    reviewCount: 1247,
    category: "electronics",
    isNew: true,
  },
  {
    id: "2",
    name: "MacBook Air M3",
    price: 91299,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    vendor: "TechPro",
    rating: 4.8,
    reviewCount: 892,
    category: "electronics",
    isFeatured: true,
  },
  {
    id: "3",
    name: "Premium Wireless Headphones",
    price: 24899,
    originalPrice: 33199,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    vendor: "AudioTech",
    rating: 4.8,
    reviewCount: 324,
    category: "electronics",
    discount: 25,
  },
  {
    id: "4",
    name: "4K Gaming Monitor",
    price: 49799,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
    vendor: "DisplayMax",
    rating: 4.7,
    reviewCount: 456,
    category: "electronics",
  },
  {
    id: "5",
    name: "Samsung Galaxy S24 Ultra",
    price: 107899,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    vendor: "Samsung Official",
    rating: 4.8,
    reviewCount: 567,
    category: "electronics",
  },

  // Fashion
  {
    id: "6",
    name: "Designer Leather Jacket",
    price: 20749,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    vendor: "StyleCraft",
    rating: 4.6,
    reviewCount: 234,
    category: "fashion",
    isNew: true,
  },
  {
    id: "7",
    name: "Premium Running Shoes",
    price: 13279,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    vendor: "SportStyle",
    rating: 4.8,
    reviewCount: 567,
    category: "fashion",
    isFeatured: true,
  },
  {
    id: "8",
    name: "Elegant Evening Dress",
    price: 15769,
    image:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=400&fit=crop",
    vendor: "Elegance Co",
    rating: 4.9,
    reviewCount: 189,
    category: "fashion",
  },
  {
    id: "9",
    name: "Classic Watch Collection",
    price: 24899,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    vendor: "TimeKeepers",
    rating: 4.7,
    reviewCount: 312,
    category: "fashion",
  },
  {
    id: "10",
    name: "Denim Jacket",
    price: 7469,
    originalPrice: 10789,
    image:
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&h=400&fit=crop",
    vendor: "CasualWear",
    rating: 4.5,
    reviewCount: 445,
    category: "fashion",
    discount: 31,
  },

  // Home & Garden
  {
    id: "11",
    name: "Modern Coffee Table",
    price: 33199,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    vendor: "HomeComfort",
    rating: 4.5,
    reviewCount: 156,
    category: "home & garden",
  },
  {
    id: "12",
    name: "Garden Tool Set",
    price: 7469,
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    vendor: "GreenThumb",
    rating: 4.6,
    reviewCount: 223,
    category: "home & garden",
    isNew: true,
  },
  {
    id: "13",
    name: "Smart Home Security System",
    price: 66399,
    image:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop",
    vendor: "SecureHome",
    rating: 4.8,
    reviewCount: 445,
    category: "home & garden",
    isFeatured: true,
  },
  {
    id: "14",
    name: "Luxury Bedding Set",
    price: 16599,
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop",
    vendor: "ComfortHome",
    rating: 4.7,
    reviewCount: 334,
    category: "home & garden",
  },

  // Audio & Music
  {
    id: "15",
    name: "Professional Studio Microphone",
    price: 16599,
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop",
    vendor: "AudioPro",
    rating: 4.9,
    reviewCount: 234,
    category: "audio & music",
  },
  {
    id: "16",
    name: "Bluetooth Speaker System",
    price: 12449,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    vendor: "SoundWave",
    rating: 4.7,
    reviewCount: 345,
    category: "audio & music",
    isNew: true,
  },
  {
    id: "17",
    name: "Guitar Acoustic Professional",
    price: 49799,
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    vendor: "MusicMaster",
    rating: 4.8,
    reviewCount: 234,
    category: "audio & music",
  },

  // Photography
  {
    id: "18",
    name: "Professional Camera Lens 85mm",
    price: 107899,
    image:
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop",
    vendor: "CameraTech",
    rating: 4.9,
    reviewCount: 156,
    category: "photography",
    isFeatured: true,
  },
  {
    id: "19",
    name: "DSLR Camera Kit",
    price: 74699,
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop",
    vendor: "PhotoPro",
    rating: 4.8,
    reviewCount: 234,
    category: "photography",
  },
  {
    id: "20",
    name: "Camera Tripod Professional",
    price: 14939,
    image:
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=400&fit=crop",
    vendor: "StudioGear",
    rating: 4.6,
    reviewCount: 445,
    category: "photography",
  },

  // Sports & Fitness
  {
    id: "21",
    name: "Smart Fitness Watch",
    price: 24899,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    vendor: "FitGear",
    rating: 4.6,
    reviewCount: 892,
    category: "sports & fitness",
    isNew: true,
  },
  {
    id: "22",
    name: "Home Gym Equipment Set",
    price: 49799,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    vendor: "FitnessZone",
    rating: 4.7,
    reviewCount: 345,
    category: "sports & fitness",
  },
  {
    id: "23",
    name: "Yoga Mat Premium",
    price: 4149,
    image:
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
    vendor: "YogaLife",
    rating: 4.8,
    reviewCount: 567,
    category: "sports & fitness",
  },

  // Food & Beverages
  {
    id: "24",
    name: "Organic Coffee Beans",
    price: 2075,
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop",
    vendor: "CoffeeCraft",
    rating: 4.8,
    reviewCount: 567,
    category: "food & beverages",
    isNew: true,
  },
  {
    id: "25",
    name: "Gourmet Chocolate Collection",
    price: 4149,
    image:
      "https://images.unsplash.com/photo-1511910849309-0dffb8785146?w=400&h=400&fit=crop",
    vendor: "ChocolateHouse",
    rating: 4.9,
    reviewCount: 234,
    category: "food & beverages",
  },
  {
    id: "26",
    name: "Artisan Tea Collection",
    price: 3319,
    image:
      "https://images.unsplash.com/photo-1597318181409-cf64e5d1d72b?w=400&h=400&fit=crop",
    vendor: "TeaMaster",
    rating: 4.7,
    reviewCount: 334,
    category: "food & beverages",
  },

  // Health & Beauty
  {
    id: "27",
    name: "Skincare Essential Set",
    price: 7469,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    vendor: "BeautyLux",
    rating: 4.7,
    reviewCount: 445,
    category: "health & beauty",
    isFeatured: true,
  },
  {
    id: "28",
    name: "Professional Makeup Kit",
    price: 10789,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop",
    vendor: "MakeupMaster",
    rating: 4.6,
    reviewCount: 334,
    category: "health & beauty",
  },
  {
    id: "29",
    name: "Hair Care Premium Set",
    price: 5809,
    image:
      "https://images.unsplash.com/photo-1631730486887-41d12cf31ad1?w=400&h=400&fit=crop",
    vendor: "HairCare Pro",
    rating: 4.8,
    reviewCount: 234,
    category: "health & beauty",
  },

  // Books & Media
  {
    id: "30",
    name: "Programming Complete Guide",
    price: 3319,
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
    vendor: "BookWise",
    rating: 4.8,
    reviewCount: 567,
    category: "books & media",
  },
  {
    id: "31",
    name: "Classic Literature Collection",
    price: 4979,
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
    vendor: "ClassicBooks",
    rating: 4.9,
    reviewCount: 234,
    category: "books & media",
  },

  // Baby & Kids
  {
    id: "32",
    name: "Educational Toy Set",
    price: 6639,
    image:
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop",
    vendor: "KidsWorld",
    rating: 4.8,
    reviewCount: 445,
    category: "baby & kids",
    isNew: true,
  },
  {
    id: "33",
    name: "Baby Care Essential Kit",
    price: 8299,
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop",
    vendor: "BabyCare",
    rating: 4.9,
    reviewCount: 234,
    category: "baby & kids",
  },

  // Automotive
  {
    id: "34",
    name: "Car Dashboard Camera",
    price: 12449,
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=400&fit=crop",
    vendor: "AutoTech",
    rating: 4.6,
    reviewCount: 345,
    category: "automotive",
  },
  {
    id: "35",
    name: "Premium Car Accessories Set",
    price: 16599,
    image:
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=400&fit=crop",
    vendor: "CarStyle",
    rating: 4.7,
    reviewCount: 234,
    category: "automotive",
  },

  // Gifts & Special
  {
    id: "36",
    name: "Luxury Gift Hamper",
    price: 16599,
    image:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop",
    vendor: "GiftCraft",
    rating: 4.9,
    reviewCount: 189,
    category: "gifts & special",
    isFeatured: true,
  },
  {
    id: "37",
    name: "Personalized Photo Frame",
    price: 2489,
    image:
      "https://images.unsplash.com/photo-1573641287741-f49c597d8db1?w=400&h=400&fit=crop",
    vendor: "MemoryKeepers",
    rating: 4.7,
    reviewCount: 334,
    category: "gifts & special",
  },

  // Anime & Manga
  {
    id: "38",
    name: "Naruto Complete Box Set",
    price: 8999,
    originalPrice: 12999,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    vendor: "Manga World",
    rating: 4.9,
    reviewCount: 1567,
    category: "anime & manga",
    isNew: true,
    discount: 31,
  },
  {
    id: "39",
    name: "Attack on Titan Eren Yeager Figure",
    price: 3299,
    image:
      "https://images.unsplash.com/photo-1606918801925-e2c914c4b503?w=400&h=400&fit=crop",
    vendor: "Figure Paradise",
    rating: 4.8,
    reviewCount: 892,
    category: "anime & manga",
    isFeatured: true,
  },
  {
    id: "40",
    name: "One Piece Manga Volume 1-100",
    price: 15999,
    originalPrice: 19999,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    vendor: "Manga Central",
    rating: 4.9,
    reviewCount: 2134,
    category: "anime & manga",
    discount: 20,
  },
  {
    id: "41",
    name: "Dragon Ball Z Goku Super Saiyan Figure",
    price: 2799,
    image:
      "https://images.unsplash.com/photo-1606918801925-e2c914c4b503?w=400&h=400&fit=crop",
    vendor: "Anime Collectibles",
    rating: 4.7,
    reviewCount: 756,
    category: "anime & manga",
  },
  {
    id: "42",
    name: "Demon Slayer Tanjiro Kamado Cosplay Costume",
    price: 4599,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    vendor: "Cosplay Corner",
    rating: 4.6,
    reviewCount: 445,
    category: "anime & manga",
    isNew: true,
  },
  {
    id: "43",
    name: "My Hero Academia Complete Poster Set",
    price: 1599,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    vendor: "Poster Pro",
    rating: 4.5,
    reviewCount: 334,
    category: "anime & manga",
  },
  {
    id: "44",
    name: "Studio Ghibli Collection Box Set",
    price: 6999,
    originalPrice: 8999,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    vendor: "Ghibli Store",
    rating: 4.9,
    reviewCount: 1789,
    category: "anime & manga",
    isFeatured: true,
    discount: 22,
  },
  {
    id: "45",
    name: "Akira Manga Complete Edition",
    price: 3499,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    vendor: "Classic Manga",
    rating: 4.8,
    reviewCount: 567,
    category: "anime & manga",
  },
  {
    id: "46",
    name: "Sailor Moon Luna Plush Toy",
    price: 1899,
    image:
      "https://images.unsplash.com/photo-1606918801925-e2c914c4b503?w=400&h=400&fit=crop",
    vendor: "Anime Plushies",
    rating: 4.7,
    reviewCount: 892,
    category: "anime & manga",
  },
  {
    id: "47",
    name: "Jujutsu Kaisen Satoru Gojo Nendoroid",
    price: 4299,
    image:
      "https://images.unsplash.com/photo-1606918801925-e2c914c4b503?w=400&h=400&fit=crop",
    vendor: "Nendoroid Shop",
    rating: 4.8,
    reviewCount: 1234,
    category: "anime & manga",
    isNew: true,
  },
];
