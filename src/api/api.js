// Create a new product
export const apiCreateProductAsync = async (newProduct) => {
  console.log("Mock API - Creating Product:", newProduct);
  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: true, data: newProduct }), 1000)
  );
};

// Get product categories
export const apiGetProductCategoriesAsync = async () => {
    //izbrisi kad ne bude trebalo
  const mockCategories = [
    { id: "1", name: "Beverages" },
    { id: "2", name: "Snacks" },
    { id: "3", name: "Cleaning" },
  ];
  return new Promise((resolve) =>
    setTimeout(() => resolve(mockCategories), 500)
  );
};

// Get store details
export const apiGetStoreByIdAsync = async (storeId) => {
  // izbrisati naknadno
  const mockStore = {
    id: storeId,
    name: "Nova Market",
    description: "Brza i kvalitetna dostava proizvoda.",
    isOnline: true,
    createdAt: "2024-01-01",
    products: [],
  };

  return new Promise((resolve) =>
    setTimeout(() => resolve(mockStore), 500)
  );
};

//update store status (online/offline)
export const apiUpdateStoreStatusAsync = async (storeId, isOnline) => {
  console.log("Mock API - Updating store status:", { storeId, isOnline });

  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: true, isOnline }), 500)
  );
};

// Get all stores
export const apiGetAllStoresAsync = async () => {
  //izbrisati poslije
  const mockStores = [
    { id: 1, name: "Nova Market", description: "Brza i kvalitetna dostava proizvoda." },
    { id: 2, name: "Tech World", description: "Elektronika i gadgeti." },
    { id: 3, name: "BioShop", description: "Prirodna kozmetika i hrana." },
    { id: 4, name: "Fashion Spot", description: "Savremena garderoba." },
    { id: 5, name: "Office Plus", description: "Kancelarijski materijal i oprema." },
    { id: 6, name: "Auto Centar", description: "Dijelovi i oprema za automobile." },
    { id: 7, name: "Pet Planet", description: "Hrana i oprema za kućne ljubimce." },
    { id: 8, name: "Green Garden", description: "Sve za vašu baštu." },
    { id: 9, name: "Kids Toys", description: "Igračke i oprema za djecu." },
    { id: 10, name: "Mega Market", description: "Vaš svakodnevni supermarket." },
    { id: 11, name: "Green Garden", description: "Sve za vašu baštu." },
    { id: 12, name: "Kids Toys", description: "Igračke i oprema za djecu." },
    { id: 13, name: "Mega Market", description: "Vaš svakodnevni supermarket." },
    { id: 14, name: "Green Garden", description: "Sve za vašu baštu." },
    { id: 15, name: "Kids Toys", description: "Igračke i oprema za djecu." },
    { id: 16, name: "Mega Market", description: "Vaš svakodnevni supermarket." },
    { id: 17, name: "Green Garden", description: "Sve za vašu baštu." },
    { id: 18, name: "Kids Toys", description: "Igračke i oprema za djecu." },
    { id: 19, name: "Mega Market", description: "Vaš svakodnevni supermarket." }
  ];
  return new Promise((resolve) => setTimeout(() => resolve(mockStores), 500));
};







