"use strict";var Timer=function(){var e=$("#slice");return{drawSlice:function(n){var r=6*n+90;n<=30?e.css({"background-image":"linear-gradient("+r+"deg, transparent 50%, white 50%),linear-gradient(90deg, white 50%, transparent 50%)"}):(r-=180,console.log(r),e.css({"background-image":"linear-gradient("+r+"deg, transparent 50%, green 50%),linear-gradient(90deg, white 50%, transparent 50%)"}))}}};$(document).ready(function(){var e=new Timer,n=29;$("#plus").on("click",function(r){r.preventDefault(),n++,$(".percent").find("p").text(n),e.drawSlice(n)}),$("#minus").on("click",function(r){r.preventDefault(),n--,$(".percent").find("p").text(n),e.drawSlice(n)})});