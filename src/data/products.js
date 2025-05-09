let products = [
  {
    id: 1,
    name: 'Proizvod 1 - Nova Market',
    price: 98.15,
    weight: 3.16,
    weightunit: 'lbs',
    volume: 1.69,
    volumeunit: 'ml',
    productcategoryid: 2,
    storeId: 1,
    isActive: true,
    photos: [],
  },
  {
    id: 2,
    name: 'Proizvod 2 - Nova Market',
    price: 15.97,
    weight: 1.6,
    weightunit: 'kg',
    volume: 1.46,
    volumeunit: 'L',
    productcategoryid: 2,
    storeId: 1,
    isActive: true,
    photos: [],
  },
  {
    id: 3,
    name: 'Proizvod 3 - Nova Market',
    price: 81.78,
    weight: 1.01,
    weightunit: 'kg',
    volume: 1.53,
    volumeunit: 'ml',
    productcategoryid: 2,
    storeId: 1,
    isActive: true,
    photos: [],
  },
  {
    id: 4,
    name: 'Proizvod 4 - Nova Market',
    price: 33.99,
    weight: 3.67,
    weightunit: 'lbs',
    volume: 1.41,
    volumeunit: 'ml',
    productcategoryid: 2,
    storeId: 1,
    isActive: true,
    photos: [],
  },
  {
    id: 5,
    name: 'Proizvod 5 - Nova Market',
    price: 14.45,
    weight: 4.9,
    weightunit: 'lbs',
    volume: 2.68,
    volumeunit: 'oz',
    productcategoryid: 2,
    storeId: 1,
    isActive: true,
    photos: [],
  },
  {
    id: 6,
    name: 'Proizvod 1 - Tech World',
    price: 41.53,
    weight: 4.82,
    weightunit: 'lbs',
    volume: 0.83,
    volumeunit: 'oz',
    productcategoryid: 4,
    storeId: 2,
    isActive: true,
    photos: [],
  },
  {
    id: 7,
    name: 'Proizvod 2 - Tech World',
    price: 20.78,
    weight: 4.95,
    weightunit: 'kg',
    volume: 2.61,
    volumeunit: 'oz',
    productcategoryid: 4,
    storeId: 2,
    isActive: true,
    photos: [],
  },
  {
    id: 8,
    name: 'Proizvod 3 - Tech World',
    price: 60.7,
    weight: 0.21,
    weightunit: 'g',
    volume: 1.86,
    volumeunit: 'oz',
    productcategoryid: 4,
    storeId: 2,
    isActive: true,
    photos: [],
  },
  {
    id: 9,
    name: 'Proizvod 4 - Tech World',
    price: 61.91,
    weight: 2.65,
    weightunit: 'kg',
    volume: 1.54,
    volumeunit: 'oz',
    productcategoryid: 4,
    storeId: 2,
    isActive: true,
    photos: [],
  },
  {
    id: 10,
    name: 'Proizvod 5 - Tech World',
    price: 76.28,
    weight: 0.5,
    weightunit: 'kg',
    volume: 2.24,
    volumeunit: 'oz',
    productcategoryid: 4,
    storeId: 2,
    isActive: true,
    photos: [],
  },
  {
    id: 11,
    name: 'Proizvod 1 - BioShop',
    price: 90.87,
    weight: 3.65,
    weightunit: 'lbs',
    volume: 2.94,
    volumeunit: 'oz',
    productcategoryid: 6,
    storeId: 3,
    isActive: true,
    photos: [],
  },
  {
    id: 12,
    name: 'Proizvod 2 - BioShop',
    price: 43.25,
    weight: 3.75,
    weightunit: 'lbs',
    volume: 0.14,
    volumeunit: 'L',
    productcategoryid: 6,
    storeId: 3,
    isActive: true,
    photos: [],
  },
  {
    id: 13,
    name: 'Proizvod 3 - BioShop',
    price: 22.33,
    weight: 0.33,
    weightunit: 'lbs',
    volume: 2.76,
    volumeunit: 'oz',
    productcategoryid: 6,
    storeId: 3,
    isActive: true,
    photos: [],
  },
  {
    id: 14,
    name: 'Proizvod 4 - BioShop',
    price: 84.77,
    weight: 2.97,
    weightunit: 'g',
    volume: 0.28,
    volumeunit: 'ml',
    productcategoryid: 6,
    storeId: 3,
    isActive: true,
    photos: [],
  },
  {
    id: 15,
    name: 'Proizvod 5 - BioShop',
    price: 23.74,
    weight: 4.3,
    weightunit: 'kg',
    volume: 2.38,
    volumeunit: 'ml',
    productcategoryid: 6,
    storeId: 3,
    isActive: true,
    photos: [],
  },
  {
    id: 16,
    name: 'Proizvod 1 - Fashion Spot',
    price: 34.13,
    weight: 4.67,
    weightunit: 'g',
    volume: 0.77,
    volumeunit: 'oz',
    productcategoryid: 2,
    storeId: 4,
    isActive: true,
    photos: [],
  },
  {
    id: 17,
    name: 'Proizvod 2 - Fashion Spot',
    price: 46.35,
    weight: 2.24,
    weightunit: 'g',
    volume: 1.35,
    volumeunit: 'oz',
    productcategoryid: 2,
    storeId: 4,
    isActive: true,
    photos: [],
  },
  {
    id: 18,
    name: 'Proizvod 3 - Fashion Spot',
    price: 70.68,
    weight: 2.06,
    weightunit: 'kg',
    volume: 2.42,
    volumeunit: 'oz',
    productcategoryid: 2,
    storeId: 4,
    isActive: true,
    photos: [],
  },
  {
    id: 19,
    name: 'Proizvod 4 - Fashion Spot',
    price: 67.49,
    weight: 3.99,
    weightunit: 'lbs',
    volume: 1.94,
    volumeunit: 'ml',
    productcategoryid: 2,
    storeId: 4,
    isActive: true,
    photos: [],
  },
  {
    id: 20,
    name: 'Proizvod 5 - Fashion Spot',
    price: 86.13,
    weight: 1.58,
    weightunit: 'kg',
    volume: 2.44,
    volumeunit: 'ml',
    productcategoryid: 2,
    storeId: 4,
    isActive: true,
    photos: [],
  },
  {
    id: 21,
    name: 'Proizvod 1 - Office Plus',
    price: 31.87,
    weight: 1.66,
    weightunit: 'kg',
    volume: 0.26,
    volumeunit: 'L',
    productcategoryid: 4,
    storeId: 5,
    isActive: true,
    photos: [],
  },
  {
    id: 22,
    name: 'Proizvod 2 - Office Plus',
    price: 23.21,
    weight: 3.64,
    weightunit: 'g',
    volume: 1.14,
    volumeunit: 'ml',
    productcategoryid: 4,
    storeId: 5,
    isActive: true,
    photos: [],
  },
  {
    id: 23,
    name: 'Proizvod 3 - Office Plus',
    price: 55.47,
    weight: 2.71,
    weightunit: 'lbs',
    volume: 0.83,
    volumeunit: 'ml',
    productcategoryid: 4,
    storeId: 5,
    isActive: true,
    photos: [],
  },
  {
    id: 24,
    name: 'Proizvod 4 - Office Plus',
    price: 32.69,
    weight: 1.19,
    weightunit: 'g',
    volume: 2.29,
    volumeunit: 'L',
    productcategoryid: 4,
    storeId: 5,
    isActive: true,
    photos: [],
  },
  {
    id: 25,
    name: 'Proizvod 5 - Office Plus',
    price: 85.67,
    weight: 2.23,
    weightunit: 'g',
    volume: 2.24,
    volumeunit: 'oz',
    productcategoryid: 4,
    storeId: 5,
    isActive: true,
    photos: [],
  },
  {
    id: 26,
    name: 'Proizvod 1 - Auto Centar',
    price: 28.39,
    weight: 2.23,
    weightunit: 'lbs',
    volume: 1.75,
    volumeunit: 'ml',
    productcategoryid: 6,
    storeId: 6,
    isActive: true,
    photos: [],
  },
  {
    id: 27,
    name: 'Proizvod 2 - Auto Centar',
    price: 69.33,
    weight: 2.8,
    weightunit: 'kg',
    volume: 1.33,
    volumeunit: 'L',
    productcategoryid: 6,
    storeId: 6,
    isActive: true,
    photos: [],
  },
  {
    id: 28,
    name: 'Proizvod 3 - Auto Centar',
    price: 21.79,
    weight: 0.78,
    weightunit: 'g',
    volume: 2.87,
    volumeunit: 'L',
    productcategoryid: 6,
    storeId: 6,
    isActive: true,
    photos: [],
  },
  {
    id: 29,
    name: 'Proizvod 4 - Auto Centar',
    price: 58.72,
    weight: 2.24,
    weightunit: 'lbs',
    volume: 0.94,
    volumeunit: 'oz',
    productcategoryid: 6,
    storeId: 6,
    isActive: true,
    photos: [],
  },
  {
    id: 30,
    name: 'Proizvod 5 - Auto Centar',
    price: 11.48,
    weight: 4.07,
    weightunit: 'lbs',
    volume: 2.18,
    volumeunit: 'oz',
    productcategoryid: 6,
    storeId: 6,
    isActive: true,
    photos: [],
  },
  {
    id: 31,
    name: 'Proizvod 1 - Pet Planet',
    price: 36.24,
    weight: 0.43,
    weightunit: 'lbs',
    volume: 1.46,
    volumeunit: 'oz',
    productcategoryid: 2,
    storeId: 7,
    isActive: true,
    photos: [],
  },
  {
    id: 32,
    name: 'Proizvod 2 - Pet Planet',
    price: 10.93,
    weight: 1.67,
    weightunit: 'kg',
    volume: 2.84,
    volumeunit: 'ml',
    productcategoryid: 2,
    storeId: 7,
    isActive: true,
    photos: [],
  },
  {
    id: 33,
    name: 'Proizvod 3 - Pet Planet',
    price: 30.42,
    weight: 2.76,
    weightunit: 'lbs',
    volume: 1.0,
    volumeunit: 'L',
    productcategoryid: 2,
    storeId: 7,
    isActive: true,
    photos: [],
  },
  {
    id: 34,
    name: 'Proizvod 4 - Pet Planet',
    price: 96.84,
    weight: 4.39,
    weightunit: 'kg',
    volume: 0.33,
    volumeunit: 'ml',
    productcategoryid: 2,
    storeId: 7,
    isActive: true,
    photos: [],
  },
  {
    id: 35,
    name: 'Proizvod 5 - Pet Planet',
    price: 19.83,
    weight: 4.5,
    weightunit: 'kg',
    volume: 2.16,
    volumeunit: 'L',
    productcategoryid: 2,
    storeId: 7,
    isActive: true,
    photos: [],
  },
  {
    id: 36,
    name: 'Proizvod 1 - Green Garden',
    price: 26.15,
    weight: 1.44,
    weightunit: 'g',
    volume: 1.98,
    volumeunit: 'oz',
    productcategoryid: 4,
    storeId: 8,
    isActive: true,
    photos: [],
  },
  {
    id: 37,
    name: 'Proizvod 2 - Green Garden',
    price: 57.42,
    weight: 1.61,
    weightunit: 'kg',
    volume: 1.91,
    volumeunit: 'ml',
    productcategoryid: 4,
    storeId: 8,
    isActive: true,
    photos: [],
  },
  {
    id: 38,
    name: 'Proizvod 3 - Green Garden',
    price: 8.21,
    weight: 4.83,
    weightunit: 'kg',
    volume: 0.22,
    volumeunit: 'oz',
    productcategoryid: 4,
    storeId: 8,
    isActive: true,
    photos: [],
  },
  {
    id: 39,
    name: 'Proizvod 4 - Green Garden',
    price: 50.65,
    weight: 4.81,
    weightunit: 'kg',
    volume: 0.69,
    volumeunit: 'ml',
    productcategoryid: 4,
    storeId: 8,
    isActive: true,
    photos: [],
  },
  {
    id: 40,
    name: 'Proizvod 5 - Green Garden',
    price: 75.39,
    weight: 1.66,
    weightunit: 'lbs',
    volume: 0.33,
    volumeunit: 'oz',
    productcategoryid: 4,
    storeId: 8,
    isActive: true,
    photos: [],
  },
  {
    id: 41,
    name: 'Proizvod 1 - Kids Toys',
    price: 72.01,
    weight: 2.09,
    weightunit: 'lbs',
    volume: 2.5,
    volumeunit: 'L',
    productcategoryid: 6,
    storeId: 9,
    isActive: true,
    photos: [],
  },
  {
    id: 42,
    name: 'Proizvod 2 - Kids Toys',
    price: 93.6,
    weight: 3.67,
    weightunit: 'kg',
    volume: 0.29,
    volumeunit: 'ml',
    productcategoryid: 6,
    storeId: 9,
    isActive: true,
    photos: [],
  },
  {
    id: 43,
    name: 'Proizvod 3 - Kids Toys',
    price: 97.21,
    weight: 0.55,
    weightunit: 'kg',
    volume: 0.41,
    volumeunit: 'L',
    productcategoryid: 6,
    storeId: 9,
    isActive: true,
    photos: [],
  },
  {
    id: 44,
    name: 'Proizvod 4 - Kids Toys',
    price: 87.46,
    weight: 1.72,
    weightunit: 'g',
    volume: 2.34,
    volumeunit: 'oz',
    productcategoryid: 6,
    storeId: 9,
    isActive: true,
    photos: [],
  },
  {
    id: 45,
    name: 'Proizvod 5 - Kids Toys',
    price: 63.83,
    weight: 2.05,
    weightunit: 'kg',
    volume: 2.15,
    volumeunit: 'ml',
    productcategoryid: 6,
    storeId: 9,
    isActive: true,
    photos: [],
  },
  {
    id: 46,
    name: 'Proizvod 1 - Mega Market',
    price: 72.02,
    weight: 0.74,
    weightunit: 'kg',
    volume: 1.0,
    volumeunit: 'ml',
    productcategoryid: 2,
    storeId: 10,
    isActive: true,
    photos: [],
  },
  {
    id: 47,
    name: 'Proizvod 2 - Mega Market',
    price: 67.61,
    weight: 0.22,
    weightunit: 'g',
    volume: 0.35,
    volumeunit: 'L',
    productcategoryid: 2,
    storeId: 10,
    isActive: true,
    photos: [],
  },
  {
    id: 48,
    name: 'Proizvod 3 - Mega Market',
    price: 47.57,
    weight: 1.04,
    weightunit: 'lbs',
    volume: 1.99,
    volumeunit: 'oz',
    productcategoryid: 2,
    storeId: 10,
    isActive: true,
    photos: [],
  },
  {
    id: 49,
    name: 'Proizvod 4 - Mega Market',
    price: 31.82,
    weight: 1.61,
    weightunit: 'g',
    volume: 1.72,
    volumeunit: 'ml',
    productcategoryid: 2,
    storeId: 10,
    isActive: true,
    photos: [],
  },
  {
    id: 50,
    name: 'Proizvod 5 - Mega Market',
    price: 15.47,
    weight: 2.2,
    weightunit: 'g',
    volume: 2.19,
    volumeunit: 'ml',
    productcategoryid: 2,
    storeId: 10,
    isActive: true,
    photos: [],
  },
  {
    id: 51,
    name: 'Proizvod 1 - Green Garden',
    price: 43.8,
    weight: 0.65,
    weightunit: 'g',
    volume: 1.36,
    volumeunit: 'oz',
    productcategoryid: 4,
    storeId: 11,
    isActive: true,
    photos: [],
  },
  {
    id: 52,
    name: 'Proizvod 2 - Green Garden',
    price: 64.01,
    weight: 4.12,
    weightunit: 'kg',
    volume: 2.98,
    volumeunit: 'ml',
    productcategoryid: 4,
    storeId: 11,
    isActive: true,
    photos: [],
  },
  {
    id: 53,
    name: 'Proizvod 3 - Green Garden',
    price: 56.9,
    weight: 1.63,
    weightunit: 'g',
    volume: 1.65,
    volumeunit: 'oz',
    productcategoryid: 4,
    storeId: 11,
    isActive: true,
    photos: [],
  },
  {
    id: 54,
    name: 'Proizvod 4 - Green Garden',
    price: 81.11,
    weight: 2.52,
    weightunit: 'lbs',
    volume: 0.48,
    volumeunit: 'oz',
    productcategoryid: 4,
    storeId: 11,
    isActive: true,
    photos: [],
  },
  {
    id: 55,
    name: 'Proizvod 5 - Green Garden',
    price: 96.97,
    weight: 4.15,
    weightunit: 'kg',
    volume: 2.64,
    volumeunit: 'ml',
    productcategoryid: 4,
    storeId: 11,
    isActive: true,
    photos: [],
  },
  {
    id: 56,
    name: 'Proizvod 1 - Kids Toys',
    price: 24.87,
    weight: 2.4,
    weightunit: 'g',
    volume: 0.9,
    volumeunit: 'oz',
    productcategoryid: 6,
    storeId: 12,
    isActive: true,
    photos: [],
  },
  {
    id: 57,
    name: 'Proizvod 2 - Kids Toys',
    price: 23.0,
    weight: 0.34,
    weightunit: 'kg',
    volume: 1.8,
    volumeunit: 'oz',
    productcategoryid: 6,
    storeId: 12,
    isActive: true,
    photos: [],
  },
  {
    id: 58,
    name: 'Proizvod 3 - Kids Toys',
    price: 64.82,
    weight: 4.21,
    weightunit: 'kg',
    volume: 2.17,
    volumeunit: 'ml',
    productcategoryid: 6,
    storeId: 12,
    isActive: true,
    photos: [],
  },
  {
    id: 59,
    name: 'Proizvod 4 - Kids Toys',
    price: 81.12,
    weight: 4.26,
    weightunit: 'kg',
    volume: 1.79,
    volumeunit: 'L',
    productcategoryid: 6,
    storeId: 12,
    isActive: true,
    photos: [],
  },
  {
    id: 60,
    name: 'Proizvod 5 - Kids Toys',
    price: 15.55,
    weight: 1.11,
    weightunit: 'lbs',
    volume: 1.31,
    volumeunit: 'ml',
    productcategoryid: 6,
    storeId: 12,
    isActive: true,
    photos: [],
  },
  {
    id: 61,
    name: 'Proizvod 1 - Mega Market',
    price: 43.55,
    weight: 1.39,
    weightunit: 'g',
    volume: 2.83,
    volumeunit: 'oz',
    productcategoryid: 2,
    storeId: 13,
    isActive: true,
    photos: [],
  },
  {
    id: 62,
    name: 'Proizvod 2 - Mega Market',
    price: 95.59,
    weight: 1.12,
    weightunit: 'kg',
    volume: 0.47,
    volumeunit: 'L',
    productcategoryid: 2,
    storeId: 13,
    isActive: true,
    photos: [],
  },
  {
    id: 63,
    name: 'Proizvod 3 - Mega Market',
    price: 72.76,
    weight: 2.67,
    weightunit: 'g',
    volume: 2.31,
    volumeunit: 'L',
    productcategoryid: 2,
    storeId: 13,
    isActive: true,
    photos: [],
  },
  {
    id: 64,
    name: 'Proizvod 4 - Mega Market',
    price: 55.62,
    weight: 4.23,
    weightunit: 'lbs',
    volume: 2.19,
    volumeunit: 'oz',
    productcategoryid: 2,
    storeId: 13,
    isActive: true,
    photos: [],
  },
  {
    id: 65,
    name: 'Proizvod 5 - Mega Market',
    price: 29.55,
    weight: 2.81,
    weightunit: 'lbs',
    volume: 2.97,
    volumeunit: 'L',
    productcategoryid: 2,
    storeId: 13,
    isActive: true,
    photos: [],
  },
  {
    id: 66,
    name: 'Proizvod 1 - Green Garden',
    price: 71.32,
    weight: 1.71,
    weightunit: 'g',
    volume: 0.29,
    volumeunit: 'oz',
    productcategoryid: 4,
    storeId: 14,
    isActive: true,
    photos: [],
  },
  {
    id: 67,
    name: 'Proizvod 2 - Green Garden',
    price: 37.28,
    weight: 2.48,
    weightunit: 'g',
    volume: 1.15,
    volumeunit: 'ml',
    productcategoryid: 4,
    storeId: 14,
    isActive: true,
    photos: [],
  },
  {
    id: 68,
    name: 'Proizvod 3 - Green Garden',
    price: 53.29,
    weight: 4.85,
    weightunit: 'lbs',
    volume: 0.52,
    volumeunit: 'oz',
    productcategoryid: 4,
    storeId: 14,
    isActive: true,
    photos: [],
  },
  {
    id: 69,
    name: 'Proizvod 4 - Green Garden',
    price: 54.9,
    weight: 4.31,
    weightunit: 'lbs',
    volume: 2.09,
    volumeunit: 'oz',
    productcategoryid: 4,
    storeId: 14,
    isActive: true,
    photos: [],
  },
  {
    id: 70,
    name: 'Proizvod 5 - Green Garden',
    price: 6.86,
    weight: 3.49,
    weightunit: 'kg',
    volume: 2.9,
    volumeunit: 'L',
    productcategoryid: 4,
    storeId: 14,
    isActive: true,
    photos: [],
  },
  {
    id: 71,
    name: 'Proizvod 1 - Kids Toys',
    price: 87.8,
    weight: 1.93,
    weightunit: 'lbs',
    volume: 0.27,
    volumeunit: 'ml',
    productcategoryid: 6,
    storeId: 15,
    isActive: true,
    photos: [],
  },
  {
    id: 72,
    name: 'Proizvod 2 - Kids Toys',
    price: 73.06,
    weight: 2.18,
    weightunit: 'kg',
    volume: 2.15,
    volumeunit: 'ml',
    productcategoryid: 6,
    storeId: 15,
    isActive: true,
    photos: [],
  },
  {
    id: 73,
    name: 'Proizvod 3 - Kids Toys',
    price: 33.27,
    weight: 4.64,
    weightunit: 'kg',
    volume: 2.64,
    volumeunit: 'ml',
    productcategoryid: 6,
    storeId: 15,
    isActive: true,
    photos: [],
  },
  {
    id: 74,
    name: 'Proizvod 4 - Kids Toys',
    price: 68.53,
    weight: 2.69,
    weightunit: 'g',
    volume: 1.49,
    volumeunit: 'ml',
    productcategoryid: 6,
    storeId: 15,
    isActive: true,
    photos: [],
  },
  {
    id: 75,
    name: 'Proizvod 5 - Kids Toys',
    price: 31.55,
    weight: 0.76,
    weightunit: 'kg',
    volume: 0.73,
    volumeunit: 'oz',
    productcategoryid: 6,
    storeId: 15,
    isActive: true,
    photos: [],
  },
  {
    id: 76,
    name: 'Proizvod 1 - Mega Market',
    price: 43.07,
    weight: 2.92,
    weightunit: 'g',
    volume: 2.0,
    volumeunit: 'L',
    productcategoryid: 2,
    storeId: 16,
    isActive: true,
    photos: [],
  },
  {
    id: 77,
    name: 'Proizvod 2 - Mega Market',
    price: 70.38,
    weight: 2.2,
    weightunit: 'kg',
    volume: 1.75,
    volumeunit: 'ml',
    productcategoryid: 2,
    storeId: 16,
    isActive: true,
    photos: [],
  },
  {
    id: 78,
    name: 'Proizvod 3 - Mega Market',
    price: 69.44,
    weight: 3.04,
    weightunit: 'kg',
    volume: 0.59,
    volumeunit: 'oz',
    productcategoryid: 2,
    storeId: 16,
    isActive: true,
    photos: [],
  },
  {
    id: 79,
    name: 'Proizvod 4 - Mega Market',
    price: 83.14,
    weight: 4.55,
    weightunit: 'kg',
    volume: 0.95,
    volumeunit: 'L',
    productcategoryid: 2,
    storeId: 16,
    isActive: true,
    photos: [],
  },
  {
    id: 80,
    name: 'Proizvod 5 - Mega Market',
    price: 91.73,
    weight: 1.42,
    weightunit: 'g',
    volume: 1.98,
    volumeunit: 'oz',
    productcategoryid: 2,
    storeId: 16,
    isActive: true,
    photos: [],
  },
  {
    id: 81,
    name: 'Proizvod 1 - Green Garden',
    price: 24.71,
    weight: 0.48,
    weightunit: 'g',
    volume: 1.66,
    volumeunit: 'oz',
    productcategoryid: 4,
    storeId: 17,
    isActive: true,
    photos: [],
  },
  {
    id: 82,
    name: 'Proizvod 2 - Green Garden',
    price: 94.13,
    weight: 2.36,
    weightunit: 'kg',
    volume: 1.75,
    volumeunit: 'ml',
    productcategoryid: 4,
    storeId: 17,
    isActive: true,
    photos: [],
  },
  {
    id: 83,
    name: 'Proizvod 3 - Green Garden',
    price: 34.28,
    weight: 3.54,
    weightunit: 'lbs',
    volume: 2.42,
    volumeunit: 'oz',
    productcategoryid: 4,
    storeId: 17,
    isActive: true,
    photos: [],
  },
  {
    id: 84,
    name: 'Proizvod 4 - Green Garden',
    price: 51.48,
    weight: 4.33,
    weightunit: 'g',
    volume: 0.13,
    volumeunit: 'oz',
    productcategoryid: 4,
    storeId: 17,
    isActive: true,
    photos: [],
  },
  {
    id: 85,
    name: 'Proizvod 5 - Green Garden',
    price: 6.2,
    weight: 2.18,
    weightunit: 'g',
    volume: 2.23,
    volumeunit: 'oz',
    productcategoryid: 4,
    storeId: 17,
    isActive: true,
    photos: [],
  },
  {
    id: 86,
    name: 'Proizvod 1 - Kids Toys',
    price: 5.95,
    weight: 4.27,
    weightunit: 'lbs',
    volume: 0.54,
    volumeunit: 'ml',
    productcategoryid: 6,
    storeId: 18,
    isActive: true,
    photos: [],
  },
  {
    id: 87,
    name: 'Proizvod 2 - Kids Toys',
    price: 88.59,
    weight: 3.56,
    weightunit: 'g',
    volume: 2.99,
    volumeunit: 'ml',
    productcategoryid: 6,
    storeId: 18,
    isActive: true,
    photos: [],
  },
  {
    id: 88,
    name: 'Proizvod 3 - Kids Toys',
    price: 50.45,
    weight: 0.34,
    weightunit: 'g',
    volume: 2.75,
    volumeunit: 'ml',
    productcategoryid: 6,
    storeId: 18,
    isActive: true,
    photos: [],
  },
  {
    id: 89,
    name: 'Proizvod 4 - Kids Toys',
    price: 28.4,
    weight: 3.65,
    weightunit: 'g',
    volume: 0.34,
    volumeunit: 'ml',
    productcategoryid: 6,
    storeId: 18,
    isActive: true,
    photos: [],
  },
  {
    id: 90,
    name: 'Proizvod 5 - Kids Toys',
    price: 99.99,
    weight: 2.91,
    weightunit: 'g',
    volume: 0.81,
    volumeunit: 'oz',
    productcategoryid: 6,
    storeId: 18,
    isActive: true,
    photos: [],
  },
  {
    id: 91,
    name: 'Proizvod 1 - Mega Market',
    price: 40.21,
    weight: 2.1,
    weightunit: 'kg',
    volume: 1.77,
    volumeunit: 'ml',
    productcategoryid: 2,
    storeId: 19,
    isActive: true,
    photos: [],
  },
  {
    id: 92,
    name: 'Proizvod 2 - Mega Market',
    price: 26.51,
    weight: 1.9,
    weightunit: 'g',
    volume: 2.62,
    volumeunit: 'L',
    productcategoryid: 2,
    storeId: 19,
    isActive: true,
    photos: [],
  },
  {
    id: 93,
    name: 'Proizvod 3 - Mega Market',
    price: 69.04,
    weight: 3.45,
    weightunit: 'lbs',
    volume: 1.45,
    volumeunit: 'ml',
    productcategoryid: 2,
    storeId: 19,
    isActive: true,
    photos: [],
  },
  {
    id: 94,
    name: 'Proizvod 4 - Mega Market',
    price: 26.02,
    weight: 4.57,
    weightunit: 'kg',
    volume: 1.27,
    volumeunit: 'L',
    productcategoryid: 2,
    storeId: 19,
    isActive: true,
    photos: [],
  },
  {
    id: 95,
    name: 'Proizvod 5 - Mega Market',
    price: 94.53,
    weight: 0.5,
    weightunit: 'lbs',
    volume: 0.64,
    volumeunit: 'L',
    productcategoryid: 2,
    storeId: 19,
    isActive: true,
    photos: [],
  },
];

export default products;
