/**
 * 递归生成树结构
 * @param  {[Array]} data [数据]
 * @param  {[string]} pid  [父id]
 * @return {[Array]}
 */
function toTreeData(data,pid){
  var result = [] , temp;
  for(var i in data){
      if(data[i].parentid==pid){
          result.push(data[i]);
          data[i].children = [];
          temp = toTreeData(data,data[i]._id);
          if(temp.length>0){
              data[i].children=temp;
          }
      }
  }
  return result;
}
module.exports.toTreeData = toTreeData;
