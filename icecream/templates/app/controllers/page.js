action('index', function(){
     var data = {
         name: 'icecream',
         introduction: 'Icecream is a rapid web framework based on NodeJS. It was designed with a very small footprint for those who need a simple, elegant and pragmatic toolkit to build high-performing, full-featured web applications.'
     }
     render('page/index', data);
 })
