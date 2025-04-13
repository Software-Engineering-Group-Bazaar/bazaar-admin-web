import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import CategoriesHeader from "../sections/CategoriesHeader.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import UserManagementPagination from "../components/UserManagementPagination.jsx";
import AddCategoryModal from "../components/AddCategoryModal";
import {
  apiGetProductCategoriesAsync,
  apiGetStoreCategoriesAsync,
  apiDeleteProductCategoryAsync,
  apiDeleteStoreCategoryAsync,
  apiAddProductCategoryAsync,
  apiAddStoreCategoryAsync,
  apiUpdateProductCategoryAsync,
  apiUpdateStoreCategoryAsync,
} from "@api/api.js";
import CategoryTabs from "@components/CategoryTabs";

const CategoriesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedType, setSelectedType] = useState("product");
  const categoriesPerPage = 20;

  useEffect(() => {
  const fetchCategories = async () => {
    const data =
      selectedType === "product"
        ? await apiGetProductCategoriesAsync()
        : await apiGetStoreCategoriesAsync();

    const enriched = data.map((cat) => ({ ...cat, type: selectedType }));

    console.log(enriched)

    setAllCategories(enriched);
  };

  fetchCategories();
}, [selectedType]);


  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

 const handleAddCategory = async (newCategory) => {
  let response;
  console.log(newCategory.type)
  if (newCategory.type === "product") {
    response = await apiAddProductCategoryAsync(newCategory.name);
  } else {
    response = await apiAddStoreCategoryAsync(newCategory.name);
  }

  if (response?.success) {
    if (newCategory.type === selectedType) {
      setAllCategories((prev) => [...prev, response.data]);
    }
  }
};


  const handleUpdateCategory = async (updatedCategory) => {
  const response = selectedType === "product"
    ? await apiUpdateProductCategoryAsync(updatedCategory)
    : await apiUpdateStoreCategoryAsync(updatedCategory);

  if (response?.success) {
    setAllCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  }
};


  const handleDeleteCategory = async (categoryId) => {
  let response;
  if (selectedType === "product") {
    response = await apiDeleteProductCategoryAsync(categoryId);
  } else {
    response = await apiDeleteStoreCategoryAsync(categoryId);
  }

  if (response?.success || response?.status === 204) {
    setAllCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
  }
};

  const filteredCategories = allCategories.filter((category) =>
  category.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  return (
    <Box sx={{ width: "100%", backgroundColor: "#fefefe", minHeight: "100vh" }}>
      <Box
        sx={{
          width: "100%",
          maxWidth: "1400px",
          marginLeft: "260px",
          pt: 2,
          px: 2,
        }}
      >
        <CategoriesHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddCategory={handleOpenModal}
        />
        <CategoryTabs
          selectedType={selectedType}
          onChangeType={setSelectedType}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 0.75,
            mt: 3,
            ml: 4,
          }}
        >
          {currentCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          ))}
        </Box>
        <Box sx={{ mt: 4 }}>
          <UserManagementPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </Box>
      </Box>

      <AddCategoryModal
        open={openModal}
        onClose={handleCloseModal}
        onAddCategory={handleAddCategory}
        selectedType={selectedType}
      />
    </Box>
  );
};

export default CategoriesPage;
