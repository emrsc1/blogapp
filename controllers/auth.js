const User = require("../models/user");
const bcrypt=require("bcrypt");
exports.get_register=async function(req,res){
    try{
        return res.render("auth/register",{
            title:"Üye Ol",
        
        });
    }
    catch(err){
        console.log(err);
    }
}

exports.post_register=async function(req,res){
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;

    const hashedPassword=await bcrypt.hash(password,10); //10 karakterli şifre oluşturur
    try{
        const user=await User.findOne({where:{email:email}});//findOne ile veritabanında emaili eşleşen kullanıcıyı buluruz
        if(user){
            req.session.message={text:"Girdiğiniz email adresiyle daha önce kayıt olunmuş",class:"warning"};
            return res.redirect("login");
        }
        await User.create({//create ile veritabanına kayıt ekleriz
            fullname:name,
            email:email,
            password:hashedPassword,
        });
        req.session.message={text:"Hesabınıza Giriş Yapabilirsiniz",class:"success"};
        return res.redirect("login");
    }
    catch(err){
        console.log(err);
    }
}
exports.get_login=async function(req,res){
    const message=req.session.message;
    delete req.session.message;
    try{
        return res.render("auth/login",{
            title:"Giriş Yap",
            message:message,
        });
    }
    catch(err){
        console.log(err);
    }
}
exports.post_login=async function(req,res){
    const email=req.body.email;
    const password=req.body.password;
    try{
        const user=await User.findOne({where:{email:email}});//findOne ile veritabanında emaili eşleşen kullanıcıyı buluruz
        if(!user){
            return res.render("auth/login", {
              title: "Giriş Yap",
              message: { text: "Email Hatalı", class: "danger" },
            });
        }
        const match=await bcrypt.compare(password,user.password);//compare ile girilen şifre ile veritabanındaki şifreyi karşılaştırırız
        if(match){
            const url=req.query.returnUrl || "/";
            req.session.isAuth=true; //session oluştururuz
            req.session.fullname=user.fullname;

          return res.redirect(url);
        }else{
            return res.render("auth/login",{
                title:"Giriş Yap",
                message:{text:"Parola Hatalı",class:"danger"}    
            });
        }
    }
    catch(err){
        console.log(err);
    }
}
exports.get_logout=async function(req,res){
    try{
        req.session.isAuth=false;
        return res.redirect("/account/login");
    }catch(err){
        console.log(err);
    }
}