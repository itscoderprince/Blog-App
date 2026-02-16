export const RouteIndex = "/";
export const RouteLogin = "/login";
export const RouteRegister = "/register";
export const RouteProfile = "/profile";

// Category Routes
export const RouteCategories = "/categories";
export const RouteAddCategory = "/category/add";
export const RouteEditCategory = (id) => {
    return id ? `/category/edit/${id}` : "/category/edit/:id"
}

// Blog Routes
export const RouteBlog = "/admin/blogs";
export const RouteCategory = "/category/:categoryName";
export const RouteAddBlog = "/admin/add-blog";
export const RouteEditBlog = (id) => {
    return id ? `/blog/edit/${id}` : "/blog/edit/:id"
}
export const RouteBlogDetails = (id) => {
    return id ? `/blog/details/${id}` : "/blog/details/:id"
}

// Admin Management Routes
export const RouteManageUsers = "/admin/manage-users"
export const RouteManageComments = "/admin/manage-comments"