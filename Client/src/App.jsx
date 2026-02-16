import "./App.css";
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loading from "./components/Loading";

// Layouts
const Layout = lazy(() => import("./Layout/Layout"));
const AuthLayout = lazy(() => import("./Layout/AuthLayout"));

// Pages
const Index = lazy(() => import("./Layout/pages/Index"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));
const Profile = lazy(() => import("./Layout/pages/Profile"));
const Categories = lazy(() => import("./Layout/pages/categories/Categories"));
const Blogs = lazy(() => import("./Layout/pages/Blog/Blogs"));
const AddBlog = lazy(() => import("./Layout/pages/Blog/AddBlog"));
const EditBlog = lazy(() => import("./Layout/pages/Blog/EditBlog"));
const BlogDetail = lazy(() => import("./Layout/pages/Blog/blogDetail"));
const CategoryBlogs = lazy(() => import("./Layout/pages/Blog/CategoryBlogs"));
const ManageUsers = lazy(() => import("./Layout/pages/admin/ManageUsers"));
const ManageComments = lazy(() => import("./Layout/pages/admin/ManageComments"));

import {
  RouteIndex,
  RouteProfile,
  RouteCategories,
  RouteCategory,
  RouteBlog,
  RouteAddBlog,
  RouteEditBlog,
  RouteBlogDetails,
  RouteManageUsers,
  RouteManageComments
} from "./helpers/Route.js";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path={RouteIndex} element={<Layout />}>
            <Route index element={<Index />} />
            <Route path={RouteProfile} element={<Profile />} />

            {/* Category */}
            <Route path={RouteCategories} element={<Categories />} />
            <Route path={RouteCategory} element={<CategoryBlogs />} />

            {/* Blogs */}
            <Route path={RouteBlog} element={<Blogs />} />
            <Route path={RouteAddBlog} element={<AddBlog />} />
            <Route path={RouteEditBlog()} element={<EditBlog />} />
            <Route path={RouteBlogDetails()} element={<BlogDetail />} />

            {/* Admin Management */}
            <Route path={RouteManageUsers} element={<ManageUsers />} />
            <Route path={RouteManageComments} element={<ManageComments />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
