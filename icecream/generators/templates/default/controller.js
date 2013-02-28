<%
methods.forEach(function(method){
%>
<%="action('"+method.name+"', function(){ \n    render('"+method.name+"'); \n});"
%>
<%
});
%>