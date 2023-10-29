//express
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const SequelizeStore=require("connect-session-sequelize")(session.Store);
const csurf = require("csurf");
//routes
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
//models

const Category = require("./models/category");
const Blog = require("./models/blog");
const User = require("./models/user");
//node modules
const path = require("path");
//custom modules
const sequelize = require("./data/db");
const dummyData = require("./data/dummy-data");
const locals = require("./middlewares/locals");
//template engine
app.set("view engine", "ejs");
//middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "eba1e643-853d-4475-840f-d8b49168a9f5", //session bilgilerini şifreleme
    resave: false, //her istekte session bilgilerini kaydetme
    saveUninitialized: false, //session bilgisi oluşmadan önce kaydetme
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, //cookie süresi
    },
    store:new SequelizeStore({ 
      db:sequelize 
    })
  })
);
app.use(csurf());
app.use(locals);
app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoutes);
app.use("/account", authRoutes);
app.use(userRoutes);



Blog.belongsTo(User, {
    foreignKey: {
        allowNull: true
    }
});
User.hasMany(Blog);

Blog.belongsToMany(Category, { through: "blogCategories"}); 
Category.belongsToMany(Blog, { through: "blogCategories"});

(async () => {
    // await sequelize.sync({ force: true });
    // await dummyData();
})();

app.listen(3000, function() {
    console.log("listening on port 3000");
});