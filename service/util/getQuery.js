
var _ = require('underscore');


module.exports = function(req,a){
	console.log(a);
	if (!a || typeof a !== "object") return {};
	console.log(a);
	var QUERY_OBJ = {},_a = {};
	_.extend(QUERY_OBJ,req.body,req.query,req.params);
	for (key in a) {
		if (!!QUERY_OBJ[key]) {
			if (a[key]==="Number") {
				_a[key] = ~~QUERY_OBJ[key];
			}else{
				_a[key] = QUERY_OBJ[key];
			}
		}
	}
	return _a;
}

