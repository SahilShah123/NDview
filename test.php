<body id="bd">
<script src="js/jquery-1.9.0.js"></script>
<script src="js/jquery.bpopup-0.8.0.min.js"></script>
<button id="my-button">POP IT UP</button>
<style>
#popup
{
	background-color:#fff;
	border-radius:10px 10px 10px 10px;
	box-shadow:0 0 25px 5px #999;
	color:#111;
	display:none;
	min-width:550px;
	padding:25px;
	min-height:400px;
}
.button
{
  background-color: #2B91AF;
}
.sbtn{
   background-color:#03F;	
  -moz-border-radius: 10px;
  border-radius: 10px;
  border: 1px solid #000;
  padding: 10px;
  cursor:pointer;
  color:#FFF;
  font-weight:bold;
}
.button:hover{background-color:#1e1e1e;color:#fff;cursor:pointer;}.button>span{font-size:84%}.button.bClose{border-radius:7px 7px 7px 7px;box-shadow:none;font:bold 131% sans-serif;padding:0 6px 2px;position:absolute;right:-7px;top:-7px}
</style>
<div id="popup" style="display:none;background-color:#CCF;;font-family:Verdana, Geneva, sans-serif;"><span class="button bClose">
<span>X</span>
</span>
<form action="1.php" method="post">
<table align="center">
<tr><td colspan="2"><center><img src="images/register.png" height="60px"/></center></td></tr>
<tr><td colspan="2"></td></tr>
<tr><td>Name:</td><td><input type="text" name="name" size="40px" style="border:1px solid #09F;"/></td></tr>
<tr><td>Contact No:</td><td><input type="text" name="cn" style="border:1px solid #09F;" /></td></tr> 
<tr><td>Age:</td><td><input type="text" name="name" style="border:1px solid #09F;"/></td></tr>
<tr><td>Gender:</td><td><input type="radio" name="gen" value="male" checked/> Male<input type="radio" name="gen" value="female" /> Female</td></tr>
<tr><td>Occupation:</td><td><input type="text" name="occupation" style="border:1px solid #09F;"/></td></tr>
<tr><td>Salary:</td><td><input type="text" name="salary" style="border:1px solid #09F;"/></td></tr>
<tr><td>Zip code:</td><td><input type="text" name="zipcode" style="border:1px solid #09F;"/></td></tr>
<tr><td>Favorite clothing:</td><td><input type="text" name="fclothing" size="40px" style="border:1px solid #09F;"/></td></tr>
<tr><td>Favorite retail store:</td><td><input type="text" name="frstore" size="40px" style="border:1px solid #09F;"/></td></tr>
<tr><td>Favorite online store:</td><td><input type="text" name="fostore" size="40px" style="border:1px solid #09F;"/></td></tr>
<tr><td colspan="2"></td></tr>
<tr><td colspan="2"></center></td></tr>
<tr><td colspan="2"><center><input type="submit" value="Submit" class="sbtn" /></center></td></tr>
</table>
</form>
</div>
<script>
  ;(function($) {
        $(function() {
            $('#my-button').bind('click', function(e) {
                e.preventDefault();
                 $('#popup').bPopup({
            fadeSpeed: 'slow', //can be a string ('slow'/'fast') or int
            followSpeed: 1500, //can be a string ('slow'/'fast') or int
            modalColor: '#6E6E6E'
                                        });
            });
         });
     })(jQuery);

</script>
</body>