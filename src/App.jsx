import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./page/Dashboard";
import PosPage from "./page/feature/pos/PosPage";
import CustomersPage from "./page/CustomersPage";
import ReportsPage from "./page/ReportsPage";
import CategoryPage from "./page/feature/category/category";
//import Category_Page from "./page/feature/category/Category_Page";
import BrandPage from "./page/feature/brand/BrandPage";
import ProductPage from "./page/feature/products/ProductPage";
import Login from "./page/feature/login/login";
import MainPage from "./page/Frontend/HomePage/MainPage";
const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/sales" element={<PosPage />} />
        <Route path="/sales/new" element={<PosPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/brands" element={<BrandPage />} />
        <Route path="/pos" element={<PosPage />} />
      </Route>
      <Route path="*" element={<h2>Page not found</h2>} />
      <Route path="/frontend" element={<MainPage />} />
    </Routes>
  );
};

export default App;
