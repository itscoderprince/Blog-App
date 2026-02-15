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
export const RouteBlog = "/blogs";
export const RouteAddBlog = "/blog/add";
export const RouteEditBlog = (id) => {
    return id ? `/blog/edit/${id}` : "/blog/edit/:id"
}
export const RouteBlogDetails = (id) => {
    return id ? `/blog/details/${id}` : "/blog/details/:id"
}