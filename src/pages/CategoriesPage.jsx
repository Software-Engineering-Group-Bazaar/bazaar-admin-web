import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import CategoriesHeader from "../sections/CategoriesHeader.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import UserManagementPagination from "../components/UserManagementPagination.jsx";
import { apiGetAllCategoriesAsync } from "../api/api.js";
import AddCategoryModal from "../components/AddCategoryModal"; 

const CategoriesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const categoriesPerPage = 16;

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await apiGetAllCategoriesAsync();
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

  const handleAddCategory = (categoryName) => {
    const newCategory = { id: Date.now(), name: categoryName, description: "" };
    setAllCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  const handleUpdateCategory = (updatedCategory) => {
    setAllCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  };

  const filteredCategories = allCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

  return (
    <Box sx={{ width: "100%", backgroundColor: "#fefefe", minHeight: "100vh" }}>
      <Box sx={{ width: "100%", maxWidth: "1400px", marginLeft: "260px", pt: 2, px: 2 }}>
        <CategoriesHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} onAddCategory={handleOpenModal} />
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 1.5, mt: 3 }}>
          {currentCategories.map((category) => (
            <CategoryCard key={category.id} category={category} onUpdateCategory={handleUpdateCategory} />
          ))}
        </Box>
        <Box sx={{ mt: 4 }}>
          <UserManagementPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </Box>
      </Box>

      <AddCategoryModal open={openModal} onClose={handleCloseModal} onAddCategory={handleAddCategory} />
    </Box>
  );
};

export default CategoriesPage;
