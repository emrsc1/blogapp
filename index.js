const express = require("express");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const path = require("path");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(userRoutes); 
const sequelize=require("./data/db");
const dummyData=require("./data/dummy-data");
const Category=require("./models/category");
const Blog=require("./models/blog");

//ilişkiler
Category.hasMany(
  Blog,
  {
    // Blog tablosundaki categoryid yi FK yapar// Blog tablosundaki categoryid yi FK yapar
    name: "categoryId",
    allowNull: false,
    // defaultValue:1
  },
    // onDelete: "RESTRICT", // kategoriye ait blog varsa kategori silme işlemine izin verilmez.
    // onUpdate: "RESTRICT",  // default olarak cascade olur.
  
); 
Blog.belongsTo(Category);
//IIFE
(async ()=>{
    await sequelize.sync({alter:true});
    await dummyData();
})


app.listen(3000, function() {
    console.log("listening on port 3000");
});