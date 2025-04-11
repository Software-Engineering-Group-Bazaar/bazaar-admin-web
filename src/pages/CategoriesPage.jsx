import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import CategoriesHeader from "../sections/CategoriesHeader.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import UserManagementPagination from "../components/UserManagementPagination.jsx";
import AddCategoryModal from "../components/AddCategoryModal";
import {
  apiGetProductCategoriesAsync,
  apiDeleteCategoryAsync,
  apiAddCategoryAsync,
  apiUpdateCategoryAsync,
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
      const data = await apiGetProductCategoriesAsync();
      setAllCategories(data);
    };
    fetchCategories();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

 const handleAddCategory = async (newCategory) => {
   const response = await apiAddCategoryAsync(newCategory);
   if (response?.success) {
     setAllCategories((prev) => [...prev, response.data]);
   }
 };

  const handleUpdateCategory = async (updatedCategory) => {
    const response = await apiUpdateCategoryAsync(updatedCategory);
    if (response?.success) {
      setAllCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === updatedCategory.id ? updatedCategory : category
        )
      );
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const response = await apiDeleteCategoryAsync(categoryId);
    if (response?.success) {
      setAllCategories((prev) =>
        prev.filter((category) => category.id !== categoryId)
      );
    }
  };

  const filteredCategories = allCategories
    .filter((category) => category.type === selectedType)
    .filter((category) =>
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
      />
    </Box>
  );
};

export default CategoriesPage;
