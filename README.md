##About##

[Icecream](http://github.com/nodengine/icecream) is a rapid web framework based on [NodeJS](http://nodejs.org). It was designed with a very small footprint for those who need a simple, elegant and pragmatic toolkit to build high-performing, full-featured web applications.

the source code is hosted on [github.com](http://github.com/nodengine/icecream) and licensed under the [MIT license](http://opensource.org/licenses/mit-license.php).

any question about [icecream](http://github.com/nodengine/icecream), please feel free to contact zhengzhiyu@yeah.net

##How to use##

####install nodejs####
  * download and install nodejs for your platform from http://nodejs.org/download/. 
  

####create your application####
  
  * open a shell prompt and type the following command
  
         mkdir myApp
         cd myApp
         
  * create application folders
         
         mkdir app
         mkdir app/controllers
         mkdir app/views
         mkdir app/views/layout
         mkdir app/views/page


####add icecream to the application####
  
  
  * add icecream module to your working directory
    
         cd myApp/app
         npm install icecream



####add files to the application####
  
  * create the main file _**start.js**_ in directory 'myApp/' 
  
         var icecream = require('icecream');
         icecream.createServer();
         icecream.set("appDir", __dirname +'/app');        
         icecream.listen(3000);
                
  * create controller file _**page.js**_ in directory 'myApp/app/controllers/'.
    
    
         action('index', function(){
             var data = {
                 name: 'icecream',
                 introduction: 'Icecream is a rapid web framework based on NodeJS. It was designed with a very small footprint for those who need a simple, elegant and pragmatic toolkit to build high-performing, full-featured web applications.'
             }
             render('index', data);
         })
 
  * create layout file _**layout.ejs**_ in directory 'myApp/app/views/layout/'.
    
         <html>
            <head>
                <meta http-equiv="Content-Type",content="text/html; charset=utf-8">
                <title>welcome to icecream!</title>
            </head>    
            <body>
                <div class="main">
                    <%-body%>   
                </div>
            </body>
         </html>
         
 > Note: icecream uses [ejs](https://github.com/visionmedia/ejs) as the default template engine, so 'ejs' is the default file name extention for views.

  * create view file _**index.ejs**_ in directory 'myApp/app/views/page/'.
  
         
         <h2><%=name%></h2>
         <div><%=introduction%></div>
  
####run the application####

  * open a shell prompt and change directory to your applicaton

         cd /path to your application (myApp)
         node start.js 

  * open [http://localhost:3000](http://localhost:3000) in browser

