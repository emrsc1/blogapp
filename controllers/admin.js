const Blog = require("../models/blog");
const Category = require("../models/category");

const { Op } = require("sequelize");

exports.get_blog_delete = async function (req, res) {
  const blogid = req.params.blogid;

  try {
    // const [blogs,] = await db.execute("select * from blog where id=?", [blogid]);
    const blogs = await Blog.findAll({
      where: {
        id: blogid,
      },
    });
    const blog = blogs[0];

    res.render("admin/blog-delete", {
      title: "delete blog",
      blog: blog,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.post_blog_delete = async function (req, res) {
  const blogid = req.body.blogid;
  try {
    // await db.execute("delete from blog where blogid=?", [blogid]);
    await Blog.destroy({
      where: {
        id: blogid,
      },
    });
    res.redirect("/admin/blogs?action=delete");
  } catch (err) {
    console.log(err);
  }
};
exports.get_category_delete = async function (req, res) {
  const categoryid = req.params.categoryid;

  try {
    // const [categories,] = await db.execute("select * from category where categoryid=?", [categoryid]);
    const category = await Category.findByPk(categoryid);

    res.render("admin/category-delete", {
      title: "delete category",
      category: category,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.post_category_delete = async function (req, res) {
  const categoryid = req.body.categoryid;
  try {
    // await db.execute("delete from category where categoryid=?", [categoryid]);
    Category.destroy({
      where: {
        categoryid: categoryid,
      },
    });
    res.redirect("/admin/categories?action=delete");
  } catch (err) {
    console.log(err);
  }
};
exports.get_blog_create = async function (req, res) {
  try {
    const categories = await Category.findAll();

    res.render("admin/blog-create", {
      title: "add blog",
      categories: categories,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.post_blog_create = async function (req, res) {
  const baslik = req.body.baslik;
  const altbaslik = req.body.altbaslik;
  const aciklama = req.body.aciklama;
  const resim = req.file.filename;
  const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
  const onay = req.body.onay == "on" ? 1 : 0;
  const kategori = req.body.kategori;

  try {
    await Blog.create({
      baslik: baslik,
      altbaslik: altbaslik,
      aciklama: aciklama,
      resim: resim,
      anasayfa: anasayfa,
      onay: onay,
      categoryid: kategori,
    });
    res.redirect("/admin/blogs?action=create");
  } catch (err) {
    console.log(err);
  }
};
exports.get_category_create = async function (req, res) {
  try {
    res.render("admin/category-create", {
      title: "add category",
    });
  } catch (err) {
    console.log(err);
  }
};
exports.post_category_create = async function (req, res) {
  const name = req.body.name;
  try {
    await Category.create({ name: name });
    res.redirect("/admin/categories?action=create");
  } catch (err) {
    console.log(err);
  }
};
exports.get_blog_edit = async function (req, res) {
  const blogid = req.params.blogid;

  try {
    const blog = await Blog.findByPk(blogid);
    const categories = await Category.findAll();

    if (blog) {
      return res.render("admin/blog-edit", {
        title: blog.dataValues.baslik,
        blog: blog.dataValues,
        categories: categories,
      });
    }

    res.redirect("admin/blogs");
  } catch (err) {
    console.log(err);
  }
};
exports.post_blog_edit = async function (req, res) {
  const blogid = req.body.blogid;
  const baslik = req.body.baslik;
  const altbaslik = req.body.altbaslik;
  const aciklama = req.body.aciklama;
  let resim = req.body.resim;

  if (req.file) {
    resim = req.file.filename;

    fs.unlink("./public/images/" + req.body.resim, (err) => {
      console.log(err);
    });
  }

  const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
  const onay = req.body.onay == "on" ? 1 : 0;
  const kategoriid = req.body.kategori;

  try {
    const blog = await Blog.findByPk(blogid);
    if (blog) {
      blog.baslik = baslik;
      blog.altbaslik = altbaslik;
      blog.aciklama = aciklama;
      blog.resim = resim;
      blog.anasayfa = anasayfa;
      blog.onay = onay;
      blog.id = kategoriid;
      await blog.save();
      return res.redirect("/admin/blogs?action=edit&blogid=" + blogid);
    }
    res.redirect("/admin/blogs");
  } catch (err) {
    console.log(err);
  }
};
exports.get_category_edit = async function (req, res) {
  const categoryid = req.params.categoryid;

  try {
    const category = await Category.findByPk(categoryid);
    const blogs=await category.getBlogs(); //lazy loading metodu
    const countBlogs=await category.countBlogs();

    if (category) {
      return res.render("admin/category-edit", {
        title: category.dataValues.name,
        category: category.dataValues,
        blogs:blogs,
        countBlog:countBlogs
      });
    }

    res.redirect("admin/categories");
  } catch (err) {
    console.log(err);
  }
};
exports.post_category_edit = async function (req, res) {
  const categoryid = req.body.categoryid;
  const name = req.body.name;

  try {
    const category = await Category.update(
      {
        name: name,
      },
      {
        where: {
          categoryid: categoryid,
        },
      }
    );
    res.redirect("/admin/categories?action=edit&categoryid=" + categoryid);
  } catch (err) {
    console.log(err);
  }
};
exports.blog_list = async function (req, res) {
  try {
    // const [blogs,] = await db.execute("select blogid, baslik, altbaslik, resim from blog");
    const blogs = await Blog.findAll({
      attributes: ["id", "baslik", "altbaslik", "resim"],
      include: {
        model:Category,
        attributes:["name"]
      } // JOIN işlemi yapar ve blog ile kategori tablosunu birleştirir.
    });
    console.log(blogs);
    res.render("admin/blog-list", {
      title: "blog list",
      blogs: blogs,
      action: req.query.action,
      id: req.query.blogid,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.category_list = async function (req, res) {
  try {
    const categories = await Category.findAll();

    res.render("admin/category-list", {
      title: "blog list",
      categories: categories,
      action: req.query.action,
      categoryid: req.query.categoryid,
    });
  } catch (err) {
    console.log(err);
  }
};