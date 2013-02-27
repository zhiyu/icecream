<%
methods.forEach(function(method){
%>
<%="action('"+method+"', function(){ \n    render('"+method+"'); \n});"
%>
<%
});
%>