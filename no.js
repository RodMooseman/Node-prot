var http = require('http');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');
var MongoClient = require('mongodb').MongoClient;
var isrod = "mongodb://rod:rod@10.191.237.56:27017/admin";
var mime =
{
  'html':'text/html',
  'css':'text/css',
  'jpg':'image/jpg',
  'ico':'image/x-icon',
  'mp3':'audio/mpeg3',
  'mp4':'video/mp4'
}
var serv = http.createServer(function(req,res)
{
   var ob=url.parse(req.url);
   var wa=ob.pathname;
   if(wa=='/')
       wa='/index.html';
   onw(req,res,wa);
});
serv.listen(80);
function onw(req,res,wa)
{
    console.log(wa);
    switch (wa)
    {
       case '/nuss':
       {
          reco(req,res);
          break;
       }
       default :
       {
          fs.exists(wa,function(existe)
          {
             if(existe)
             {
                fs.readFile(wa,function(err,cont)
                {
                   if (err)
                   {
                      res.writeHead(500,{'Content-Type':'text/plain'});
                      res.write('fail');
                      res.end();
                   }
                   else
                   {
                      var vec = wa.split('.');
                      var ext=vec[vec.length-1];
                      var mimearc=mime[ext];
                      res.writeHead(200,{'Content-Type':mimearc});
                      res.write(cont);
                      res.end();
                   }
                });
             }
             else
             {
                res.writeHead(404, {'Content-Type':'text/html'});
                res.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');
                res.end();
             }
          });
       }
    }
}

function reco(req,res)
{
    var info='';
    req.on('data',function(nuss)
    {
      info += nuss;
    });
    req.on('end',function()
    {
       var form=querystring.parse(info);
       var a=form['no1'];
       var c=0,b="";
       for (var i = parseInt(a)+1; i < 100; i++)
       {
           if(i!=1)
           for (var  j=2; j < i; j++)
           {
              if(i%j==0)
              {
                 c=1;
                 break;
              }
           }
           if(c==0)
           {
             if(b!="")
              b +=','+i;
             else
              b +=j;
           }
           c=0;
       }
       if (b=="")
       {
         res.writeHead(404, {'Content-Type':'text/html'});
         res.write('<!doctype html><html><head></head><body>Ningun numero, entrada no agregada<br><a href="index.html"> Regresar </a></body></html>');
         res.end();
       }
       else
       {
          res.writeHead(200,{'Content-Type':'text/html'});
          var pag ='<!doctype html><html><body>'+b+'<br>'+
                '<br>Insertado en la Bd some.so<br>'+
                '<a href="index.html"> Regresar </a>'+
                '</body></html>';
          MongoClient.connect(isrod,{useNewUrlParser:true},function(err,db)
          {
             if(err) throw err;
               var dbo=db.db("some");
             var my={response:b};
             console.log(my);
             dbo.collection("so").insertOne(my,function(err,foo)
             {
               if (err) throw err;
               db.close();
             });
           });
           res.end(pag);
        }
    });
}
console.log('La rueda esta girando');
