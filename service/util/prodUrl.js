
exports.prodUrl = function(name, id){
  var newName ="";
  console.log(name)
  newName = name.replace(/ /g,'-');

  return "/product/"+newName+"-"+id+".html"

  
}
