
exports.substr = function(str, num){
  if(str.length>num){
     return str.substr(0, num)+'...';
  }else{
    
    return str.substr(0, num)

  }
  
}
