<%
  var form_name = 'form_'+controller+'_'+method.name;
%><form class="form-horizontal" name="<%-form_name%>" id="<%-form_name%>">
<%
    if(method.fields){
    	method.fields.forEach(function(field){
%>    
    <div class="control-group">
        <label class="control-label" for="<%-field.name%>"><%-field.name%></label>
        <div class="controls">
            <%-elements[field.name]%>
        </div>
    </div>
<%
    	});
    }
%>
    <div class="control-group">
        <label class="control-label"></label>
        <div class="controls">
            <a href="javascript:;" class="btn">Submit</a>
        </div>
    </div>
</form>