const User = require("../models/user");
const bcrypt=require("bcrypt");
const emailService=require("../helpers/send-mail");
const config=require("../config");
const crypto=require("crypto");
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
        const newUser=await User.create({//create ile veritabanına kayıt ekleriz
            fullname:name,
            email:email,
            password:hashedPassword,
        });
        emailService
          .sendMail({
            from: config.email.from,
            to: newUser.email,
            subject: "Hesabınız Oluşturuldu.",
            text: "Hesabınız başarıyla oluşturuldu. Giriş yapabilirsiniz. Daha sonra profil sayfanızdan bilgilerinizi güncelleyebilirsiniz. Ayrıca profil sayfanızdan şifrenizi değiştirebilirsiniz.Blog uygulamamızı kullandığınız için teşekkür ederiz. İyi günler dileriz.",
          })
          .then((info) => {
            console.log("E-posta başarıyla gönderildi:", info.response);
          })
          .catch((error) => {
            console.error("E-posta gönderme hatası:", error);
          });//sendMail ile mail göndeririz
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
        delete req.session.isAuth;
        return res.redirect("/account/login");
    }catch(err){
        console.log(err);
    }
}
exports.get_reset=async function(req,res){
    try{
        return res.render("auth/reset-password",{
            title:"Şifreyi Sıfırla",

        })
    }
    catch(err){
        console.log(err);
    }
}
exports.post_reset = async function (req, res) {
    const email=req.body.email;

  try {
    var token = crypto.randomBytes(32).toString("hex"); //randomBytes ile 32 karakterli token oluştururuz
    const user = await User.findOne({ where: { email: email } }); //findOne ile veritabanında emaili eşleşen kullanıcıyı buluruz

    if (!user) {
      req.session.message = { text: "Email bulunamadı", class: "danger" };
      return res.redirect("reset-password");
    }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; //1 saatlik süre
    await user.save();
    emailService
      .sendMail({
        from: config.email.from,
        to: email,
        subject: "Şifre Sıfırlama",
        html:`<p>Parolanızı güncellemek için aşağıdaki linke tıklayınız.</p>
        <p>
        <a href="http://127.0.0.1:3000/account/reset-password/${token}">Parola Sıfırlama</a>
        </p>`
      })
      .then((info) => {
        console.log("E-posta başarıyla gönderildi:", info.response);
      })
      .catch((error) => {
        console.error("E-posta gönderme hatası:", error);
      }); //sendMail ile mail göndeririz
      req.session.message={text:"parolarınızı sıfırlamak için e-posta adresinizi kontrol ediniz.",class:"success"};
      return res.redirect("login");
  } catch (err) {
    console.log(err);
  }
};