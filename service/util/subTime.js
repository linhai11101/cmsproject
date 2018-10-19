
exports.subTime = function(str){
	if(str.lastIndexOf(" ")==-1){
		return str
	}else{

	 var index = str.lastIndexOf(" ");
     var newStr = str.substr(0, index)
    
      return newStr;
	}
     

 
  
}
