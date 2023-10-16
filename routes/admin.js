const express = require("express");
const router = express.Router();
const db = require("../data/db");
const imageUpload=require("../helpers/image-upload");
const fs=require("fs");

router.get("/blog/delete/:blogid",async function(req,res){
  const blogid=req.params.blogid;
  try{
     const [blogs,]=await db.execute("select * from blog where blogid=?",[blogid]);
     const blog=blogs[0];
     res.render("admin/blog-delete",{
      title:"delete blog",
      blog:blog,
     })
  }
  catch(err){
    console.log(err);
  }
});
router.post("/blog/delete/:blogid",async function(req,res){
  const blogid=req.body.blogid;
  try{
     await db.execute("DELETE FROM blog where blogid=?",[blogid]);
     res.redirect("/admin/blogs?action=delete&blogid=" + blogid);
  }
  catch(err){
   console.log(err);
  }
})
router.get("/categories/delete/:categoryid",async function(req,res){
  const categoryid=req.params.categoryid;
  try{
    const [categories,]=await db.execute("select * from category where categoryid=?",[categoryid]);
    const category=categories[0];
    res.render("admin/category-delete",{
      title:"delete category",
      category:category,
    })
  }catch(err){
    console.log(err);
  }
})
router.post("/categories/delete/:Categoryid",async function(req,res){
  const categoryid=req.body.categoryid;
  try{
    await db.execute("DELETE FROM category WHERE categoryid=?",[categoryid]);
    res.redirect("/admin/categories?action=delete&categoryid="+categoryid);
  }
  catch(err){
    console.log(err);
  }
})
router.get("/blog/create", async function (req, res) {
  try {
    const [categories,] = await db.execute("select * from category");
    res.render("admin/blog-create", {
      title: "add blog",
      categories: categories
    });
  } catch (err) {
    console.log(err);
  }
});
router.post("/blog/create",imageUpload.upload.single("resim"), async function (req, res) {
  const baslik = req.body.baslik;
  const aciklama = req.body.aciklama;
  const resim = req.file.filename;
  const kategori = req.body.kategori;
  const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
  const onay = req.body.onay == "on" ? 1 : 0;
  console.log(req.body);
  try {
    await db.execute(
      "INSERT INTO blog(baslik,aciklama,resim,anasayfa,onay,categoryid) VALUES (?,?,?,?,?,?)",
      [baslik, aciklama, resim, anasayfa, onay, kategori]);
      res.redirect("/admin/blogs?action=add");

    
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
router.get("/blogs/:blogid",async function (req, res) {
  const blogid=req.params.blogid;
  try{
      const [blogs,]=await db.execute("select * from blog where blogid=?",[blogid]);
      const [categories,]=await db.execute("select * from category");
      const blog=blogs[0];
     if(blog){
      res.render("admin/blog-edit", {
        title: blog.baslik,
        blog: blog,
        categories: categories,
      });
     }
     res.redirect("/admin/blogs");

  }
  catch(err){
    console.log(err);
  }
  
});
router.post("/blogs/:blogid",imageUpload.upload.single("resim"),async function(req,res){
  const blogid=req.body.blogid;
    const baslik = req.body.baslik;
    const aciklama = req.body.aciklama;
    let resim = req.body.resim;
    if(req.file){
      resim=req.file.filename;
      fs.unlink("./public/images"+req.body.resim,err=>{
        console.log(err);
      })

    }
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
    const onay = req.body.onay == "on" ? 1 : 0;
    const kategoriid=req.body.kategori;
    try{
       await db.execute("UPDATE blog SET baslik=?,aciklama=?,resim=?,anasayfa=?,onay=?,categoryid=? where blogid=?",
       [baslik,aciklama,resim,anasayfa,onay,kategoriid,blogid]);
       res.redirect("/admin/blogs?action=edit&blogid="+blogid);
       
    }
    catch(err){
      console.log(err);
    }
})
router.get("/blogs",async function (req, res) {
  try {
    const [blogs,]=await db.execute("select blogid,baslik,resim from blog");
    res.render("admin/blog-list", {
      title: "blog list",
      blogs:blogs,
      action:req.query.action,
      blogid:req.query.blogid
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/categories", async function (req, res) {
  try {
    const [categories,] = await db.execute("select * from category");
    res.render("admin/category-list", {
      title: "category list",
      categories: categories,
      action: req.query.action,
      categoryid: req.query.categoryid
    });
  } catch (err) {
    console.log(err);
  }
});
router.get("/categories/:categoryid", async function (req, res) {
  const categoryid = req.params.categoryid;
  try {
    const [categories,] = await db.execute("select * from category where categoryid=?",[categoryid]);
    const category = categories[0];
    if (category) {
      res.render("admin/category-edit", {
        title:category.name,
        category: category
      });
    }
    res.redirect("/admin/categories");
  } catch (err) {
    console.log(err);
  }
});
router.post("/blogs/:categoryid", async function (req, res) {
const categoryid = req.body.categoryid;
const name=req.body.name;
  try {
    await db.execute("UPDATE category SET name=? where categoryid=?",[name,categoryid]);
    res.redirect("/admin/categories?action=edit&categoryid=" + categoryid);
  } catch (err) {
    console.log(err);
  }
});
router.get("/category/create",function(req,res){
  try{
     res.render("admin/category-create",{
        title:"add category"
     })
  }
  catch(err){
    console.log(err);
  }
})
router.post("/category/create", async function (req, res) {
  const name=req.body.name;
  try {
    await db.execute("INSERT INTO category (name) VALUES (?)",[name]);
    res.redirect("/admin/categories?action=create");
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
