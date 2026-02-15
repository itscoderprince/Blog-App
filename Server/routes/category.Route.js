import express from "express";
import { addCategory, deleteAllCategory, deleteCategory, getAllCategory, showCategory, updateCategory } from "../controllers/category.Controller.js";

const route = express.Router();


route.post('/add', addCategory)
route.put('/update/:category_id', updateCategory)
route.delete('/delete/:category_id', deleteCategory)
route.delete('/delete-all', deleteAllCategory)
route.get('/show/:category_id', showCategory)
route.get('/all-category', getAllCategory)


export default route;