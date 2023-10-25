const Category=require("../models/category");
const Blog=require("../models/blog");

async function populate(){
    const count=await Category.count();
    if(count==0){
        await Category.bulkCreate([
            {name:"Web Geliştirme"},
            {name:"Mobil Geliştirme"},
            {name:"Programlama"}
        ]);

        await Blog.create({
          baslik: "Node.js ile Sıfırdan İleri Seviye Web Geliştirme",
          altbaslik:
            "Node.js ile sıfırdan ileri seviye dinamik web uygulaması geliştirmeyi öğren.",
            aciklama:"En popüler programlama dili olan Javascript programlama dilini artık Node.js sayesinde server tabanlı bir dil olarak kullanabilirsin.Kurs sonunda sadece Javascript programlama dilini kullanarak Fullstack bir web geliştirici olmak istiyorsan hemen kursa katılmalısın Üstelik 30 gün iade garantisiyle",
            resim:"3.jpeg",
            anasayfa:true,
            onay:true,
            categoryId:1
        });
    }

}
module.exports=populate;