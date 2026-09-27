import {
  Category,
  MenuItem,
  Customer,
  UdhaarTransaction,
  InventoryItem,
  Purchase,
  Supplier,
  Expense,
  CashRegister,
  TableItem,
  KitchenOrder,
  StaffMember,
  BusinessProfile,
  Bill
} from '../types';

export const initialCategories: Category[] = [
  { id: 'all', name: 'All Items', nameMr: 'सर्व पदार्थ', nameHi: 'सभी व्यंजन', icon: 'Utensils' },
  { id: 'burger', name: 'Burger', nameMr: 'बर्गर', nameHi: 'बर्गर', icon: 'CircleDot' },
  { id: 'fries', name: 'Fries', nameMr: 'फ्राईज', nameHi: 'फ्राइज़', icon: 'Flame' },
  { id: 'khandoli', name: 'Khandoli', nameMr: 'खांदोळी', nameHi: 'खांदोली', icon: 'Layers' },
  { id: 'momos', name: 'Momos', nameMr: 'मोमोज', nameHi: 'मोमोज़', icon: 'Soup' },
  { id: 'nuggets', name: 'Nuggets', nameMr: 'नगेट्स', nameHi: 'नगेट्स', icon: 'Sparkles' },
  { id: 'maggie', name: 'Maggie', nameMr: 'मॅगी', nameHi: 'मैगी', icon: 'Bowl' },
  { id: 'pasta', name: 'Pasta', nameMr: 'पास्ता', nameHi: 'पास्ता', icon: 'Disc' },
  { id: 'mocktails', name: 'Mocktails', nameMr: 'मॉकटेल्स', nameHi: 'मॉकटेल', icon: 'GlassWater' },
  { id: 'hot_beverages', name: 'Hot Beverages', nameMr: 'गरम पेये', nameHi: 'गर्म पेय', icon: 'Coffee' },
  { id: 'cold_beverages', name: 'Cold Beverages', nameMr: 'थंड पेये', nameHi: 'ठंडे पेय', icon: 'CupSoda' },
  { id: 'milk_shakes', name: 'Milk Shakes', nameMr: 'मिल्क शेक्स', nameHi: 'मिल्क शेक', icon: 'Milk' },
  { id: 'sandwich', name: 'Sandwich & Grill', nameMr: 'सँडविच आणि ग्रील', nameHi: 'सैंडविच एवं ग्रिल', icon: 'Sandwich' },
  { id: 'pizza', name: 'Pizza', nameMr: 'पिझ्झा', nameHi: 'पिज़्ज़ा', icon: 'PieChart' }
];

export const initialMenuItems: MenuItem[] = [
  // BURGER
  {
    id: 'b1',
    name: 'Aloo Tikki Burger',
    nameMr: 'आलू टिक्की बर्गर',
    nameHi: 'आलू टिक्की बर्गर',
    categoryId: 'burger',
    illustration: 'burger',
    sellingPrice: 60,
    costPrice: 30,
    stock: 28,
    unit: 'pcs',
    minimumStock: 10,
    isAvailable: true,
    description: 'Crispy potato patty, onion, tomato, house mayo'
  },
  {
    id: 'b2',
    name: 'Cheese Tikki Burger',
    nameMr: 'चीझ टिक्की बर्गर',
    nameHi: 'चीज़ टिक्की बर्गर',
    categoryId: 'burger',
    illustration: 'burger',
    sellingPrice: 70,
    costPrice: 38,
    stock: 22,
    unit: 'pcs',
    minimumStock: 10,
    isAvailable: true,
    description: 'Golden tikki topped with melted cheddar slice'
  },
  {
    id: 'b3',
    name: 'Veg Burger',
    nameMr: 'व्हेज बर्गर',
    nameHi: 'वेज बर्गर',
    categoryId: 'burger',
    illustration: 'burger',
    sellingPrice: 70,
    costPrice: 36,
    stock: 25,
    unit: 'pcs',
    minimumStock: 10,
    isAvailable: true,
    description: 'Fresh vegetables with special spiced patty'
  },
  {
    id: 'b4',
    name: 'Veg. Ch. Burger',
    nameMr: 'व्हेज चीझ बर्गर',
    nameHi: 'वेज चीज़ बर्गर',
    categoryId: 'burger',
    illustration: 'burger',
    sellingPrice: 80,
    costPrice: 42,
    stock: 18,
    unit: 'pcs',
    minimumStock: 8,
    isAvailable: true,
    description: 'Loaded vegetable burger with cheese burst layer'
  },

  // FRIES
  {
    id: 'f1',
    name: 'French Fries',
    nameMr: 'फ्रेंच फ्राईज',
    nameHi: 'फ्रेंच फ्राइज़',
    categoryId: 'fries',
    illustration: 'fries',
    sellingPrice: 60,
    costPrice: 28,
    stock: 40,
    unit: 'plates',
    minimumStock: 15,
    isAvailable: true,
    description: 'Salted crispy potato fingers'
  },
  {
    id: 'f2',
    name: 'Cheese French Fries',
    nameMr: 'चीझ फ्रेंच फ्राईज',
    nameHi: 'चीज़ फ्रेंच फ्राइज़',
    categoryId: 'fries',
    illustration: 'fries',
    sellingPrice: 70,
    costPrice: 35,
    stock: 24,
    unit: 'plates',
    minimumStock: 10,
    isAvailable: true,
    description: 'Crispy fries drizzled with creamy warm cheese'
  },
  {
    id: 'f3',
    name: 'Peri Peri French Fries',
    nameMr: 'पेरी पेरी फ्रेंच फ्राईज',
    nameHi: 'पेरी पेरी फ्रेंच फ्राइज़',
    categoryId: 'fries',
    illustration: 'fries',
    sellingPrice: 70,
    costPrice: 32,
    stock: 26,
    unit: 'plates',
    minimumStock: 10,
    isAvailable: true,
    description: 'Tossed in hot and tangy African peri peri spice'
  },
  {
    id: 'f4',
    name: 'Cheese Peri Peri',
    nameMr: 'चीझ पेरी पेरी फ्राईज',
    nameHi: 'चीज़ पेरी पेरी फ्राइज़',
    categoryId: 'fries',
    illustration: 'fries',
    sellingPrice: 80,
    costPrice: 38,
    stock: 20,
    unit: 'plates',
    minimumStock: 10,
    isAvailable: true,
    description: 'Spicy peri-peri seasoning with liquid cheese'
  },
  {
    id: 'f5',
    name: 'Spl. Cheese Fries',
    nameMr: 'स्पेशल चीझ फ्राईज',
    nameHi: 'स्पेशल चीज़ फ्राइज़',
    categoryId: 'fries',
    illustration: 'fries',
    sellingPrice: 100,
    costPrice: 48,
    stock: 14,
    unit: 'plates',
    minimumStock: 8,
    isAvailable: true,
    description: 'Double cheese, jalapenos, seasonings and herbs'
  },

  // KHANDOLI
  {
    id: 'k1',
    name: 'Khandoli',
    nameMr: 'खांदोळी',
    nameHi: 'खांदोली',
    categoryId: 'khandoli',
    illustration: 'khandoli',
    sellingPrice: 50,
    costPrice: 25,
    stock: 25,
    unit: 'plates',
    minimumStock: 8,
    isAvailable: true,
    variants: [
      { id: 'k1_half', name: 'Half', nameMr: 'हाफ', nameHi: 'हाफ', sellingPrice: 50, costPrice: 25 },
      { id: 'k1_full', name: 'Full', nameMr: 'फुल', nameHi: 'फुल', sellingPrice: 80, costPrice: 40 }
    ],
    description: 'Traditional SYS crispy spiced roll bites'
  },
  {
    id: 'k2',
    name: 'Meyo Khandoli',
    nameMr: 'मेयो खांदोळी',
    nameHi: 'मेयो खांदोली',
    categoryId: 'khandoli',
    illustration: 'khandoli',
    sellingPrice: 50,
    costPrice: 26,
    stock: 22,
    unit: 'plates',
    minimumStock: 8,
    isAvailable: true,
    variants: [
      { id: 'k2_half', name: 'Half', nameMr: 'हाफ', nameHi: 'हाफ', sellingPrice: 50, costPrice: 26 },
      { id: 'k2_full', name: 'Full', nameMr: 'फुल', nameHi: 'फुल', sellingPrice: 80, costPrice: 42 }
    ],
    description: 'Topped with garlic mayonnaise and seasonings'
  },
  {
    id: 'k3',
    name: 'Cheese Khandoli',
    nameMr: 'चीझ खांदोळी',
    nameHi: 'चीज़ खांदोली',
    categoryId: 'khandoli',
    illustration: 'khandoli',
    sellingPrice: 60,
    costPrice: 32,
    stock: 16,
    unit: 'plates',
    minimumStock: 6,
    isAvailable: true,
    variants: [
      { id: 'k3_half', name: 'Half', nameMr: 'हाफ', nameHi: 'हाफ', sellingPrice: 60, costPrice: 32 },
      { id: 'k3_full', name: 'Full', nameMr: 'फुल', nameHi: 'फुल', sellingPrice: 100, costPrice: 52 }
    ],
    description: 'Loaded grated cheese on hot crispy khandoli'
  },

  // MOMOS
  {
    id: 'm1',
    name: 'Veg. Momos',
    nameMr: 'व्हेज मोमोज',
    nameHi: 'वेज मोमोज़',
    categoryId: 'momos',
    illustration: 'momos',
    sellingPrice: 70,
    costPrice: 35,
    stock: 35,
    unit: 'plates',
    minimumStock: 10,
    isAvailable: true,
    variants: [
      { id: 'm1_half', name: 'Half', nameMr: 'हाफ', nameHi: 'हाफ', sellingPrice: 70, costPrice: 35 },
      { id: 'm1_full', name: 'Full', nameMr: 'फुल', nameHi: 'फुल', sellingPrice: 80, costPrice: 42 }
    ],
    description: 'Steamed vegetable dumplings with fiery red chutney'
  },
  {
    id: 'm2',
    name: 'Veg. Ch. Momos',
    nameMr: 'व्हेज चीझ मोमोज',
    nameHi: 'वेज चीज़ मोमोज़',
    categoryId: 'momos',
    illustration: 'momos',
    sellingPrice: 90,
    costPrice: 45,
    stock: 22,
    unit: 'plates',
    minimumStock: 8,
    isAvailable: true,
    description: 'Cheese melt stuffed vegetable momos'
  },
  {
    id: 'm3',
    name: 'Paneer Momos',
    nameMr: 'पनीर मोमोज',
    nameHi: 'पनीर मोमोज़',
    categoryId: 'momos',
    illustration: 'momos',
    sellingPrice: 80,
    costPrice: 42,
    stock: 18,
    unit: 'plates',
    minimumStock: 8,
    isAvailable: true,
    variants: [
      { id: 'm3_half', name: 'Half', nameMr: 'हाफ', nameHi: 'हाफ', sellingPrice: 80, costPrice: 42 },
      { id: 'm3_full', name: 'Full', nameMr: 'फुल', nameHi: 'फुल', sellingPrice: 100, costPrice: 52 }
    ],
    description: 'Fresh paneer and herbs filling'
  },
  {
    id: 'm4',
    name: 'Veg. Kurkure',
    nameMr: 'व्हेज कुरकुरे मोमोज',
    nameHi: 'वेज कुरकुरे मोमोज़',
    categoryId: 'momos',
    illustration: 'momos',
    sellingPrice: 90,
    costPrice: 45,
    stock: 20,
    unit: 'plates',
    minimumStock: 8,
    isAvailable: true,
    description: 'Ultra-crispy coated fried momos'
  },

  // NUGGETS
  {
    id: 'n1',
    name: 'Veggie Nuggets',
    nameMr: 'व्हेज नगेट्स',
    nameHi: 'वेज नगेट्स',
    categoryId: 'nuggets',
    illustration: 'nuggets',
    sellingPrice: 80,
    costPrice: 40,
    stock: 24,
    unit: 'plates',
    minimumStock: 8,
    isAvailable: true
  },
  {
    id: 'n2',
    name: 'Ch. Veggie Nuggets',
    nameMr: 'चीझ व्हेज नगेट्स',
    nameHi: 'चीज़ वेज नगेट्स',
    categoryId: 'nuggets',
    illustration: 'nuggets',
    sellingPrice: 100,
    costPrice: 50,
    stock: 15,
    unit: 'plates',
    minimumStock: 8,
    isAvailable: true
  },
  {
    id: 'n3',
    name: 'Corn Veggie Nuggets',
    nameMr: 'कॉर्न व्हेज नगेट्स',
    nameHi: 'कॉर्न वेज नगेट्स',
    categoryId: 'nuggets',
    illustration: 'nuggets',
    sellingPrice: 80,
    costPrice: 40,
    stock: 18,
    unit: 'plates',
    minimumStock: 8,
    isAvailable: true
  },
  {
    id: 'n4',
    name: 'Cheese Corn Nuggets',
    nameMr: 'चीझ कॉर्न नगेट्स',
    nameHi: 'चीज़ कॉर्न नगेट्स',
    categoryId: 'nuggets',
    illustration: 'nuggets',
    sellingPrice: 100,
    costPrice: 50,
    stock: 16,
    unit: 'plates',
    minimumStock: 8,
    isAvailable: true
  },
  {
    id: 'n5',
    name: 'Tandoor Chilli Garlic',
    nameMr: 'तंदूर चिली गार्लिक',
    nameHi: 'तंदूर चिली गार्लिक',
    categoryId: 'nuggets',
    illustration: 'nuggets',
    sellingPrice: 100,
    costPrice: 50,
    stock: 12,
    unit: 'plates',
    minimumStock: 6,
    isAvailable: true
  },

  // MAGGIE
  {
    id: 'mg1',
    name: 'Plain Maggie',
    nameMr: 'प्लेन मॅगी',
    nameHi: 'सादा मैगी',
    categoryId: 'maggie',
    illustration: 'maggie',
    sellingPrice: 50,
    costPrice: 22,
    stock: 45,
    unit: 'bowls',
    minimumStock: 15,
    isAvailable: true
  },
  {
    id: 'mg2',
    name: 'Masala Maggie',
    nameMr: 'मसाला मॅगी',
    nameHi: 'मसाला मैगी',
    categoryId: 'maggie',
    illustration: 'maggie',
    sellingPrice: 60,
    costPrice: 26,
    stock: 38,
    unit: 'bowls',
    minimumStock: 15,
    isAvailable: true
  },
  {
    id: 'mg3',
    name: 'Cheese Maggie',
    nameMr: 'चीझ मॅगी',
    nameHi: 'चीज़ मैगी',
    categoryId: 'maggie',
    illustration: 'maggie',
    sellingPrice: 70,
    costPrice: 32,
    stock: 25,
    unit: 'bowls',
    minimumStock: 10,
    isAvailable: true
  },
  {
    id: 'mg4',
    name: 'Peri Peri Maggie',
    nameMr: 'पेरी पेरी मॅगी',
    nameHi: 'पेरी पेरी मैगी',
    categoryId: 'maggie',
    illustration: 'maggie',
    sellingPrice: 70,
    costPrice: 32,
    stock: 20,
    unit: 'bowls',
    minimumStock: 10,
    isAvailable: true
  },

  // PASTA
  {
    id: 'p1',
    name: 'Pasta Arrabita (Red Sauce)',
    nameMr: 'पास्ता अराबीता (रेड सॉस)',
    nameHi: 'पास्ता अराबीता (रेड सॉस)',
    categoryId: 'pasta',
    illustration: 'pasta',
    sellingPrice: 120,
    costPrice: 55,
    stock: 18,
    unit: 'plates',
    minimumStock: 6,
    isAvailable: true
  },
  {
    id: 'p2',
    name: 'Pasta Alfredo (White Sauce)',
    nameMr: 'पास्ता अल्फ्रेडो (व्हाईट सॉस)',
    nameHi: 'पास्ता अल्फ्रेडो (व्हाइट सॉस)',
    categoryId: 'pasta',
    illustration: 'pasta',
    sellingPrice: 120,
    costPrice: 58,
    stock: 16,
    unit: 'plates',
    minimumStock: 6,
    isAvailable: true
  },

  // MOCKTAILS
  {
    id: 'mk1',
    name: 'Virgin Mojito',
    nameMr: 'व्हर्जिन मोहीतो',
    nameHi: 'वर्जिन मोजितो',
    categoryId: 'mocktails',
    illustration: 'mocktail',
    sellingPrice: 100,
    costPrice: 35,
    stock: 25,
    unit: 'glasses',
    minimumStock: 8,
    isAvailable: true
  },
  {
    id: 'mk2',
    name: 'Lemon Ice Tea',
    nameMr: 'लेमन आईस टी',
    nameHi: 'लेमन आइस टी',
    categoryId: 'mocktails',
    illustration: 'mocktail',
    sellingPrice: 90,
    costPrice: 30,
    stock: 20,
    unit: 'glasses',
    minimumStock: 8,
    isAvailable: true
  },
  {
    id: 'mk3',
    name: 'Blue Curacao',
    nameMr: 'ब्लू कुराकाओ',
    nameHi: 'ब्लू कुराकाओ',
    categoryId: 'mocktails',
    illustration: 'mocktail',
    sellingPrice: 100,
    costPrice: 35,
    stock: 22,
    unit: 'glasses',
    minimumStock: 8,
    isAvailable: true
  },
  {
    id: 'mk4',
    name: 'Classic Lemon',
    nameMr: 'क्लासिक लेमन',
    nameHi: 'क्लासिक लेमन',
    categoryId: 'mocktails',
    illustration: 'mocktail',
    sellingPrice: 100,
    costPrice: 32,
    stock: 20,
    unit: 'glasses',
    minimumStock: 8,
    isAvailable: true
  },
  {
    id: 'mk5',
    name: 'Watermelon Mojito',
    nameMr: 'टरबूज मोहीतो',
    nameHi: 'तरबूज मोजितो',
    categoryId: 'mocktails',
    illustration: 'mocktail',
    sellingPrice: 100,
    costPrice: 35,
    stock: 18,
    unit: 'glasses',
    minimumStock: 8,
    isAvailable: true
  },
  {
    id: 'mk6',
    name: 'Mint Majito',
    nameMr: 'मिंट मोहीतो',
    nameHi: 'मिंट मोजितो',
    categoryId: 'mocktails',
    illustration: 'mocktail',
    sellingPrice: 100,
    costPrice: 35,
    stock: 22,
    unit: 'glasses',
    minimumStock: 8,
    isAvailable: true
  },
  {
    id: 'mk7',
    name: 'Blue Barry Mojito',
    nameMr: 'ब्लूबेरी मोहीतो',
    nameHi: 'ब्लूबेरी मोजितो',
    categoryId: 'mocktails',
    illustration: 'mocktail',
    sellingPrice: 100,
    costPrice: 38,
    stock: 15,
    unit: 'glasses',
    minimumStock: 6,
    isAvailable: true
  },
  {
    id: 'mk8',
    name: 'Orange Mojito',
    nameMr: 'ऑरेंज मोहीतो',
    nameHi: 'ऑरेंज मोजितो',
    categoryId: 'mocktails',
    illustration: 'mocktail',
    sellingPrice: 100,
    costPrice: 35,
    stock: 18,
    unit: 'glasses',
    minimumStock: 8,
    isAvailable: true
  },
  {
    id: 'mk9',
    name: 'Green Apple',
    nameMr: 'ग्रीन ॲपल मोहीतो',
    nameHi: 'ग्रीन एप्पल मोजितो',
    categoryId: 'mocktails',
    illustration: 'mocktail',
    sellingPrice: 100,
    costPrice: 35,
    stock: 16,
    unit: 'glasses',
    minimumStock: 8,
    isAvailable: true
  },

  // HOT BEVERAGES
  {
    id: 'hb1',
    name: 'Spl. Tea',
    nameMr: 'स्पेशल चहा',
    nameHi: 'स्पेशल चाय',
    categoryId: 'hot_beverages',
    illustration: 'tea',
    sellingPrice: 20,
    costPrice: 8,
    stock: 60,
    unit: 'cups',
    minimumStock: 20,
    isAvailable: true
  },
  {
    id: 'hb2',
    name: 'Black Tea',
    nameMr: 'ब्लॅक टी',
    nameHi: 'ब्लैक टी',
    categoryId: 'hot_beverages',
    illustration: 'tea',
    sellingPrice: 20,
    costPrice: 7,
    stock: 35,
    unit: 'cups',
    minimumStock: 10,
    isAvailable: true
  },
  {
    id: 'hb3',
    name: 'Hot Coffee',
    nameMr: 'गरम कॉफी',
    nameHi: 'गर्म कॉफी',
    categoryId: 'hot_beverages',
    illustration: 'coffee',
    sellingPrice: 30,
    costPrice: 12,
    stock: 45,
    unit: 'cups',
    minimumStock: 15,
    isAvailable: true
  },
  {
    id: 'hb4',
    name: 'Black Coffee',
    nameMr: 'ब्लॅक कॉफी',
    nameHi: 'ब्लैक कॉफी',
    categoryId: 'hot_beverages',
    illustration: 'coffee',
    sellingPrice: 30,
    costPrice: 10,
    stock: 30,
    unit: 'cups',
    minimumStock: 10,
    isAvailable: true
  },
  {
    id: 'hb5',
    name: 'Hot Chocolate',
    nameMr: 'हॉट चॉकलेट',
    nameHi: 'हॉट चॉकलेट',
    categoryId: 'hot_beverages',
    illustration: 'coffee',
    sellingPrice: 50,
    costPrice: 22,
    stock: 16,
    unit: 'cups',
    minimumStock: 8,
    isAvailable: true
  },

  // COLD BEVERAGES
  {
    id: 'cb1',
    name: 'Cold Coffee',
    nameMr: 'कोल्ड कॉफी',
    nameHi: 'कोल्ड कॉफी',
    categoryId: 'cold_beverages',
    illustration: 'coffee',
    sellingPrice: 70,
    costPrice: 28,
    stock: 32,
    unit: 'glasses',
    minimumStock: 10,
    isAvailable: true
  },
  {
    id: 'cb2',
    name: 'Soft Drinks',
    nameMr: 'सॉफ्ट ड्रिंक्स',
    nameHi: 'सॉफ्ट ड्रिंक्स',
    categoryId: 'cold_beverages',
    illustration: 'colddrink',
    sellingPrice: 20,
    costPrice: 14,
    stock: 40,
    unit: 'cans',
    minimumStock: 15,
    isAvailable: true
  },
  {
    id: 'cb3',
    name: 'Mineral Water',
    nameMr: 'मिनरल वॉटर',
    nameHi: 'मिनरल वाटर',
    categoryId: 'cold_beverages',
    illustration: 'water',
    sellingPrice: 20,
    costPrice: 12,
    stock: 55,
    unit: 'bottles',
    minimumStock: 20,
    isAvailable: true
  },

  // MILK SHAKES
  {
    id: 'ms1',
    name: 'Cad-b',
    nameMr: 'कॅड-बी शेक',
    nameHi: 'कैड-बी शेक',
    categoryId: 'milk_shakes',
    illustration: 'milkshake',
    sellingPrice: 100,
    costPrice: 45,
    stock: 18,
    unit: 'glasses',
    minimumStock: 8,
    isAvailable: true
  },
  {
    id: 'ms2',
    name: 'Oreo Shake',
    nameMr: 'ओरिओ शेक',
    nameHi: 'ओरियो शेक',
    categoryId: 'milk_shakes',
    illustration: 'milkshake',
    sellingPrice: 100,
    costPrice: 42,
    stock: 24,
    unit: 'glasses',
    minimumStock: 8,
    isAvailable: true
  },
  {
    id: 'ms3',
    name: 'Mango Shake',
    nameMr: 'मँगो शेक',
    nameHi: 'मैंगो शेक',
    categoryId: 'milk_shakes',
    illustration: 'milkshake',
    sellingPrice: 100,
    costPrice: 40,
    stock: 15,
    unit: 'glasses',
    minimumStock: 8,
    isAvailable: true
  },
  {
    id: 'ms4',
    name: 'Chocolate Shake',
    nameMr: 'चॉकलेट शेक',
    nameHi: 'चॉकलेट शेक',
    categoryId: 'milk_shakes',
    illustration: 'milkshake',
    sellingPrice: 100,
    costPrice: 42,
    stock: 20,
    unit: 'glasses',
    minimumStock: 8,
    isAvailable: true
  },
  {
    id: 'ms5',
    name: 'Black Current',
    nameMr: 'ब्लॅक करंट शेक',
    nameHi: 'ब्लैक करेंट शेक',
    categoryId: 'milk_shakes',
    illustration: 'milkshake',
    sellingPrice: 100,
    costPrice: 42,
    stock: 14,
    unit: 'glasses',
    minimumStock: 6,
    isAvailable: true
  },
  {
    id: 'ms6',
    name: 'Strawberry Shakes',
    nameMr: 'स्ट्रॉबेरी शेक',
    nameHi: 'स्ट्रॉबेरी शेक',
    categoryId: 'milk_shakes',
    illustration: 'milkshake',
    sellingPrice: 100,
    costPrice: 40,
    stock: 16,
    unit: 'glasses',
    minimumStock: 6,
    isAvailable: true
  },

  // SANDWICH / GRILL
  {
    id: 'sw1',
    name: 'Veg Grilled Sandwich',
    nameMr: 'व्हेज ग्रील्ड सँडविच',
    nameHi: 'वेज ग्रिल्ड सैंडविच',
    categoryId: 'sandwich',
    illustration: 'sandwich',
    sellingPrice: 80,
    costPrice: 38,
    stock: 22,
    unit: 'pcs',
    minimumStock: 10,
    isAvailable: true
  },
  {
    id: 'sw2',
    name: 'Cheese Corn Sandwich',
    nameMr: 'चीझ कॉर्न सँडविच',
    nameHi: 'चीज़ कॉर्न सैंडविच',
    categoryId: 'sandwich',
    illustration: 'sandwich',
    sellingPrice: 90,
    costPrice: 42,
    stock: 19,
    unit: 'pcs',
    minimumStock: 8,
    isAvailable: true
  },
  {
    id: 'sw3',
    name: 'Paneer Tikka Sandwich',
    nameMr: 'पनीर टिक्का सँडविच',
    nameHi: 'पनीर टिक्का सैंडविच',
    categoryId: 'sandwich',
    illustration: 'sandwich',
    sellingPrice: 110,
    costPrice: 52,
    stock: 15,
    unit: 'pcs',
    minimumStock: 6,
    isAvailable: true
  },

  // PIZZA
  {
    id: 'pz1',
    name: 'Margherita Pizza',
    nameMr: 'मार्गेरिटा पिझ्झा',
    nameHi: 'मार्गेरिटा पिज़्ज़ा',
    categoryId: 'pizza',
    illustration: 'pizza',
    sellingPrice: 140,
    costPrice: 60,
    stock: 14,
    unit: 'pcs',
    minimumStock: 5,
    isAvailable: true
  },
  {
    id: 'pz2',
    name: 'Farmhouse Veg Pizza',
    nameMr: 'फार्महाऊस व्हेज पिझ्झा',
    nameHi: 'फार्महाउस वेज पिज़्ज़ा',
    categoryId: 'pizza',
    illustration: 'pizza',
    sellingPrice: 180,
    costPrice: 80,
    stock: 12,
    unit: 'pcs',
    minimumStock: 5,
    isAvailable: true
  },
  {
    id: 'pz3',
    name: 'Cheese Burst Pizza',
    nameMr: 'चीझ बर्स्ट पिझ्झा',
    nameHi: 'चीज़ बर्स्ट पिज़्ज़ा',
    categoryId: 'pizza',
    illustration: 'pizza',
    sellingPrice: 210,
    costPrice: 95,
    stock: 10,
    unit: 'pcs',
    minimumStock: 5,
    isAvailable: true
  }
];

export const initialCustomers: Customer[] = [];

export const initialUdhaarTransactions: UdhaarTransaction[] = [];

export const initialBills: Bill[] = [];

export const initialSuppliers: Supplier[] = [];

export const initialPurchases: Purchase[] = [];

export const initialExpenses: Expense[] = [];

export const initialCashRegister: CashRegister = {
  openingCash: 0,
  cashSales: 0,
  cashExpenses: 0,
  cashReceived: 0,
  cashWithdrawn: 0,
  expectedCash: 0,
  actualCash: 0,
  difference: 0,
  isClosed: false
};

export const initialTables: TableItem[] = [
  { id: 't1', number: 1, name: 'Table 1', status: 'available' },
  { id: 't2', number: 2, name: 'Table 2', status: 'available' },
  { id: 't3', number: 3, name: 'Table 3', status: 'available' },
  { id: 't4', number: 4, name: 'Table 4', status: 'available' },
  { id: 't5', number: 5, name: 'Table 5', status: 'available' },
  { id: 't6', number: 6, name: 'Table 6', status: 'available' },
  { id: 't7', number: 7, name: 'Table 7', status: 'available' },
  { id: 't8', number: 8, name: 'Table 8', status: 'available' }
];

export const initialKitchenOrders: KitchenOrder[] = [];

export const initialStaffMembers: StaffMember[] = [];

export const initialBusinessProfile: BusinessProfile = {
  name: 'SYS Cafe',
  tagline: 'Cafe & Fast Food Management',
  phone: '+91 98223 34455',
  whatsapp: '+91 98223 34455',
  address: 'Shop No. 4, Opposite City College, Shivaji Road, Maharashtra 416001',
  openingHours: '10:00 AM - 11:00 PM (All Days)',
  gstNumber: '27AABCS1234F1Z5 (Optional)',
  upiId: 'syscafe@okhdfcbank'
};
