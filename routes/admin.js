const express = require("express");
const router = express.Router();
const isAuth=require("../middlewares/auth");
const imageUpload = require("../helpers/image-upload");
const csrf = require("../middlewares/csrf");
const adminController = require("../controllers/admin");

router.get("/blog/delete/:blogid",csrf,isAuth, adminController.get_blog_delete);

router.post("/blog/delete/:blogid", isAuth, adminController.post_blog_delete);

router.get("/category/delete/:categoryid",csrf,isAuth, adminController.get_category_delete);

router.post("/category/delete/:categoryid",isAuth, adminController.post_category_delete);

router.get("/blog/create", isAuth, csrf, adminController.get_blog_create);

router.post("/categories/remove", isAuth, adminController.get_category_remove);

router.post("/blog/create",isAuth, imageUpload.upload.single("resim"), adminController.post_blog_create);

router.get("/category/create",csrf, isAuth, adminController.get_category_create);

router.post("/category/create", isAuth, adminController.post_category_create);

router.get("/blogs/:blogid", csrf, isAuth, adminController.get_blog_edit);

router.post("/blogs/:blogid", isAuth,imageUpload.upload.single("resim"), adminController.post_blog_edit);

router.get("/categories/:categoryid",csrf, isAuth,adminController.get_category_edit);

router.post("/categories/:categoryid", isAuth,adminController.post_category_edit);

router.get("/blogs", isAuth, adminController.get_blogs);

router.get("/categories", isAuth, adminController.get_categories);

module.exports = router;