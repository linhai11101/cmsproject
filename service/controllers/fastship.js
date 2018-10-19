/*
*快速航运
*@time 2017/01/18
*/

var mongoose = require('mongoose');
var _ = require('underscore');
var Superagent = require('superagent');

var domainCrm = require('../config').java_api_host;
// 模型
var FastShipIndexModuls = require('../models/fastshipindexmodule');
var FastShipIndexFloors = require('../models/fastshipindexfloor');
var FastShipIndexFloorPro = require('../models/fastshipindexfloorpro');
var FastShipIndexFloorCate = require('../models/fastshipindexfloorcate');
var FastShipFirstStair = require('../models/fastshipfirststair');
var FastShipSecStair = require('../models/fastshipsecstair');
var FastShipThrStair = require('../models/fastshipthrstair');
var FastShipChennalCate = require('../models/fastshipchennalcate');
var FastShipProduct = require('../models/fastshipproduct');



// 方法
// 首页
exports.getIndexModuls = function(req,res){
	var sortName = req.query.sortName || 'sortId';

	FastShipIndexModuls.find()
		.sort(sortName)
		.exec(function(err,indexmoduls){
			if (err) {
				return res.json({status:0,msg:err});
			};
			FastShipIndexModuls.find().count(function(err,count){
				return res.json({status:1,data:indexmoduls,count:count});
			});
		});
};
exports.saveIndexModuls = function(req,res){
	var id = req.body._id;
	var indexmodulsObj = req.body;
	var _indexmoduls;
	console.log(indexmodulsObj);
	if (id) {
		console.log(indexmodulsObj);
		FastShipIndexModuls.findById(id,function(err,indexmoduls){
			if (err) {
				return res.json({status:0,msg:err});
			};
			_indexmoduls = _.extend(indexmoduls,indexmodulsObj);
			_indexmoduls.save(function(err,indexmodulsi){
				if (err) {
					return res.json({status:0,msg:err});
				};
				return res.json({status:1});
			});
		});
	}else{
		console.log(indexmodulsObj);
		_indexmoduls = new FastShipIndexModuls(indexmodulsObj);
		_indexmoduls.save(function(err,indexmoduls){
			if (err) {
				return res.json({status:0,msg:err});
			};
			return res.json({status:1,data:indexmoduls});
		});
	};
};
exports.delIndexModuls = function(req,res){
	var ids = req.params.ids;
	var idArr;
	if (ids) {
		idArr = ids.split(',');
	}else{
		return res.json({status:0,msg:'ids can not be empty.'});
	};
	FastShipIndexModuls.remove({_id:{$in:idArr}},function(err,resmoduls){
		if (err) {
			return res.json({status:0,msg:err});
		};
		return res.json({status:1,data:resmoduls});
	});
};
exports.getIndexFloor = function(req,res){
	var sortName = req.query.sortName || 'sortId';
	FastShipIndexFloors.find()
		.sort(sortName)
		.exec(function(err,indexfloor){
			if (err) {
				return res.json({status:0,msg:err});
			};
			FastShipIndexFloors.find().count(function(err,count){
				return res.json({status:1,data:indexfloor,count:count});
			});
		});
};
exports.saveIndexFloor = function(req,res){
	var id = req.body._id;
	var indexfloorObj = req.body;
	var _indexfloor;
	console.log(indexfloorObj);
	if (id) {
		FastShipIndexFloors.findById(id,function(err,indexfloor){
			if (err) {
				return res.json({status:0,msg:err});
			};
			_indexfloor = _.extend(indexfloor,indexfloorObj);
			_indexfloor.save(function(err,indexfloori){
				if (err) {
					return res.json({status:0,msg:err});
				};
				return res.json({status:1,data:indexfloori});
			});
		});
	}else{
		_indexfloor = new FastShipIndexFloors(indexfloorObj);
		_indexfloor.save(function(err,indexfloor){
			if (err) {
				return res.json({status:0,msg:err});
			};
			return res.json({status:1,data:indexfloor});
		});
	};
};
exports.delIndexFloor = function(req,res){
	var ids = req.params.ids;
	var idArr;
	if (ids) {
		idArr = ids.split(',');
	}else{
		return res.json({status:0,msg:'ids can not ba empty'});
	};
	FastShipIndexFloors.remove({_id:{$in:idArr}},function(err,floor){
		if (err) {
			return res.json({status:0,msg:err});
		};
		return res.json({status:1,data:floor});
	});
};
exports.getIndexFloorPro = function(req,res){
	var floorId = req.query.floorId;
	var sortName = req.query.sortName || 'sortId';
	if (!floorId) {
		return res.json({status:0,msg:'floorId can not be empty.'});
	};
	var search = {
		floorId:floorId,
	};
	FastShipIndexFloorPro.find(search)
		.sort('sortId')
		.exec(function(err,floorpro){
			if (err) {
				return res.json({status:0,msg:err});
			};
			FastShipIndexFloorPro.find(search).count(function(err,count){
				if (err) {
					return res.json({status:0,msg:err});
				};
				return res.json({status:1,data:floorpro,count:count});
			});
		});
};
exports.saveIndexFloorPro = function(req,res){
	var id = req.body._id;
	var floorproObj = req.body;
	var _floorpro;
	if (id) {
		FastShipIndexFloorPro.findById(id,function(err,floorpro){
			if (err) {
				return res.json({status:0,msge:err});
			};
			_floorpro = _.extend(floorpro,floorproObj);
			_floorpro.save(function(err,floorproi){
				return res.json({status:1,data:floorproi});
			});
		});
	}else{
		_floorpro = new FastShipIndexFloorPro(floorproObj);
		_floorpro.save(function(err,floorpro){
			if (err) {
				return res.json({status:0,msg:err});
			};
			return res.json({status:1,data:floorpro});
		});
	};
};
exports.delIndexFloorPro = function(req,res){
	var ids = req.params.ids;
	var idArr;
	if (ids) {
		idArr = ids.split(',');
	}else{
		return res.json({status:0,msg:'ids can not ba empty'});
	};
	FastShipIndexFloorPro.remove({_id:{$in:idArr}},function(err,floorpro){
		if (err) {
			return res.json({status:0,msg:err});
		};
		return res.json({status:1,data:floorpro});
	});
};
exports.getIndexFloorCate = function(req,res){
	var sortName = req.query.sortName || 'sortId';
	var floorId = req.query.floorId;
	if (!floorId) {
		return res.json({status:0,msg:'floorId can not be empty.'});
	};
	var search = {
		floorId:floorId
	};
	FastShipIndexFloorCate.find(search)
		.sort(sortName)
		.exec(function(err,floorcate){
			if (err) {
				return res.json({status:0,msg:err});
			};
			FastShipIndexFloorCate.find(search).count(function(err,count){
				if (err) {
					return res.json({status:0,msg:err});
				};
				return res.json({status:1,data:floorcate,count:count});
			});
		});
};
exports.saveIndexFloorCate = function(req,res){
	var id = req.body._id;
	var floorcateObj = req.body;
	var _floorcate;
	if (id) {
		FastShipIndexFloorCate.findById(id,function(err,floorcate){
			if (err) {
				return res.json({stauts:0,msg:err});
			};
			_floorcate = _.extend(floorcate,floorcateObj);
			_floorcate.save(function(err,floorcatei){
				if (err) {
					return res.json({status:0,msg:err});
				};
				return res.json({status:1,data:floorcatei});
			});
		});
	}else{
		_floorcate = new FastShipIndexFloorCate(floorcateObj);
		_floorcate.save(function(err,floorcate){
			if (err) {
				return res.json({status:0,msg:err});
			};
			return res.json({status:1,data:floorcate});
		});
	};
};
exports.delIndexFloorCate = function(req,res){
	var ids  = req.params.ids;
	var idArr;
	if (ids) {
		idArr = ids.split(',');
	}else{
		return res.json({status:0,msg:'ids can not ba empty.'});
	};
	FastShipIndexFloorCate.remove({_id:{$in:idArr}},function(err,floorcateRes){
		if (err) {
			return res.json({status:0,msg:err});
		};
		return res.json({status:1,data:floorcateRes});
	});
};

// 快速航运类目
exports.getFirstStair = function(req,res){
	var sortName = req.query.sortName || 'sortId';
	FastShipFirstStair.find()
		.sort(sortName)
		.exec(function(err,firststair){
			if (err) {
				return res.json({status:0,msg:err});
			};
			FastShipFirstStair.find().count(function(err,count){
				if (err) {
					return res.json({status:0,msg:err});
				};
				return res.json({status:1,data:firststair,count:count});
			});
		});
};
exports.saveFirstStair = function(req,res){
	var id = req.body._id;
	var firststairObj = req.body;
	var _firststair;
	if (id) {
		FastShipFirstStair.findById(id,function(err,firststair){
			if (err) {
				return res.json({status:0,msg:err});
			};
			_firststair = _.extend(firststair,firststairObj);
			_firststair.save(function(err,firststairi){
				if (err) {
					return res.json({status:0,msg:err});
				};
				return res.json({status:1,data:firststairi});
			});
		});
	}else{
		_firststair = new FastShipFirstStair(firststairObj);
		_firststair.save(function(err,firststair){
			if (err) {
				return res.json({status:0,msg:err});
			};
			return res.json({status:1,data:firststair});
		});
	};
};
exports.delFirstStair = function(req,res){
	var ids = req.params.ids;
	var idArr;
	if (ids) {
		idArr = ids.split(',');
	}else{
		return res.json({status:0,msg:'ids can not be empty.'});
	};
	FastShipFirstStair.remove({_id:{$in:idArr}},function(err,firststairRes){
		if (err) {
			return res.json({status:0,msg:err});
		};
		return res.json({status:1});
	});
};
// 二级类目
exports.getSecStair = function(req,res){
	var parentId = req.query.parentId || null;
	var sortName = req.query.sortName || 'sortId';
	if (!parentId) {
		return res.json({status:0,msg:'parentId can not empty.'})
	};
	var search = {
		parentId:parentId
	};
	FastShipSecStair.find(search)
		.sort(sortName)
		.exec(function(err,secstair){
			if (err) {
				return res.json({status:0,msg:err});
			};
			var _secstair = JSON.parse(JSON.stringify(secstair));
			if (!_secstair.length) {
				FastShipSecStair.find(search).count(function(err,count){
						if (err) {
							return res.json({status:0,msg:err});
						};
						return res.json({status:1,data:_secstair,count:count});
					});
				};

			var a = 0;
			_secstair.forEach(function(item,i){
				FastShipThrStair.find({parentId:item._id})
				.sort(sortName)
				.exec(function(err,thrstair){
					if (err) {
						return res.json({status:0,msg:err});
					};
					_secstair[i].thrCates = thrstair;
					a++;
					if (a == _secstair.length) {
						console.log(_secstair);
						FastShipSecStair.find(search).count(function(err,count){
							if (err) {
								return res.json({status:0,msg:err});
							};
							return res.json({status:1,data:_secstair,count:count});
						});
					};
				});
			})
		});
};
exports.saveSecStair = function(req,res){
	var id = req.body._id;
	var secstairObj = req.body;
	var _secstair;
	if (id) {
		FastShipSecStair.findById(id,function(err,secstair){
			if (err) {
				return res.json({status:0,msg:err});
			};
			_secstair = _.extend(secstair,secstairObj);
			_secstair.save(function(err,secstairi){
				if (err) {
					return res.json({status:0,msg:err});
				};
				return res.json({status:1,data:secstairi});
			});
		});
	}else{
		_secstair = new FastShipSecStair(secstairObj);
		_secstair.save(function(err,secstair){
			if (err) {
				return res.json({status:0,msg:err});
			};
			return res.json({status:1,data:secstair});
		});
	};
};
exports.delSecStair = function(req,res){
	var ids = req.params.ids;
	var idArr;
	if (ids) {
		idArr = ids.split(',');
	}else{
		return res.json({status:0,msg:'ids can not be empty.'});
	};
	FastShipSecStair.remove({_id:{$in:idArr}},function(err,secstairRes){
		if (err) {
			return res.json({status:0,msg:err});
		};
		return res.json({status:1});
	});
};
// 三级类目
exports.getThrStair = function(req,res){
	var parentId = req.query.parentId || null;
	var sortName = req.query.sortName || 'sortId';
	if (!parentId) {
		return res.json({status:0,msg:'parentId can not empty.'})
	};
	var search = {
		parentId:parentId
	};
	FastShipThrStair.find(search)
		.sort(sortName)
		.exec(function(err,thrstair){
			if (err) {
				return res.json({status:0,msg:err});
			};
			FastShipThrStair.find(search).count(function(err,count){
				if (err) {
					return res.json({status:0,msg:err});
				};
				return res.json({status:1,data:thrstair,count:count});
			});
		});
};
exports.saveThrStair = function(req,res){
	var id = req.body._id;
	var thrstairObj = req.body;
	var _thrstair;
	if (id) {
		FastShipThrStair.findById(id,function(err,thrstair){
			if (err) {
				return res.json({status:0,msg:err});
			};
			_thrstair = _.extend(thrstair,thrstairObj);
			_thrstair.save(function(err,thrstairi){
				if (err) {
					return res.json({status:0,msg:err});
				};
				return res.json({status:1,data:thrstairi});
			});
		});
	}else{
		_thrstair = new FastShipThrStair(thrstairObj);
		_thrstair.save(function(err,thrstair){
			if (err) {
				return res.json({status:0,msg:err});
			};
			return res.json({status:1,data:thrstair});
		});
	};
};
exports.delThrStair = function(req,res){
	var ids = req.params.ids;
	var idArr;
	if (ids) {
		idArr = ids.split(',');
	}else{
		return res.json({status:0,msg:'ids can not be empty.'});
	};
	FastShipThrStair.remove({_id:{$in:idArr}},function(err,thrstairRes){
		if (err) {
			return res.json({status:0,msg:err});
		};
		return res.json({status:1});
	});
};

// 快速航运频道
exports.getChennalCate = function(req,res){
	var type = req.query.type;
	var sortName = req.query.sortName || 'sortId';
	var search = {
		type:type
	};
	if (!type) {
		return res.json({status:0,msg:'type can not be empty.'});
	};

	FastShipChennalCate.find(search)
		.sort(sortName)
		.exec(function(err,chennalCate){
			if (err) {
				return res.json({status:0,msg:err});
			};
			FastShipChennalCate.find(search).count(function(err,count){
				if (err) {
					return res.json({status:0,msg:err});
				};
				return res.json({status:1,data:chennalCate,count:count});
			})
		})


};
exports.saveChennalCate = function(req,res){
	var id = req.body._id;
	var chennalCateObj = req.body;
	var _chennalCate;
	if (id) {
		FastShipChennalCate.findById(id,function(err,chennalCate){
			if (err) {
				res.json({status:0,msg:err});
			};
			_chennalCate = _.extend(chennalCate,chennalCateObj);
			_chennalCate.save(function(err,chennalCatei){
				if (err) {
					res.json({status:0,msg:err});
				};
				res.json({status:1,data:chennalCatei});
			})
		})
	}else{
		_chennalCate = new FastShipChennalCate(chennalCateObj);
		_chennalCate.save(function(err,chennalCate){
			if (err) {
				res.json({status:0,msg:err});
			};
			res.json({status:1,data:chennalCate});
		});
	};

};
exports.delChennalCate = function(req,res){
	var ids = req.params.ids;
	var idArr;
	if (ids) {
		idArr = ids.split(',');
	}else{
		return res.json({status:0,msg:'ids can not be empty.'});
	};
	FastShipChennalCate.remove({_id:{$in:idArr}},function(err,resCate){
		if (err) {
			return res.json({status:0,msg:err});
		};
		return res.json({status:1});
	})
	
	
};
exports.getProduct = function(req,res){
	var parentId = req.query.parentId || null;
	var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
	var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 20;
	var startRow = (current - 1)*perPage;
	var sortName = req.query.sortName || 'sortId';
	console.log(req);
	if (!parentId) {
		return res.json({status:0,msg:'parentId can not be empty.'});
	};
	console.log(parentId);
	var search = {
		parentId:parentId
	};

	FastShipProduct.find(search)
		.skip(startRow)
		.limit(perPage)
		.sort(sortName)
		.exec(function(err,product){
			if (err) {
				return res.json({status:0,msg:err});
			};
			FastShipProduct.find(search).count(function(err,count){
				return res.json({status:1,data:product,count:count});
			});
		});
};
exports.saveProduct = function(req,res){
	var id = req.body._id;
	var productObj = req.body;
	var _product;
	if (id) {
		FastShipProduct.findById(id,function(err,product){
			if (err) {
				res.json({status:0,msg:err});
			};
			_product = _.extend(product,productObj);
			_product.save(function(err,producti){
				if (err) {
					res.json({status:0,msg:err});
				};
				res.json({status:1,data:producti});
			});
		});
	}else{
		_product = new FastShipProduct(productObj);
		_product.save(function(err,product){
			if (err) {
				res.json({status:0,msg:err});
			};
			res.json({status:1,data:product});
		});
	};

};
exports.delProduct = function(req,res){
	var ids = req.params.ids;
	var idArr;
	if (ids) {
		idArr = ids.split(',');
	}else{
		return res.json({status:0,msg:'ids cant not ba empty.'});
	};
	FastShipProduct.remove({_id:{$in:idArr}},function(err,resPro){
		if (err) {
			return res.json({status:0,msg:err});
		};
		return res.json({status:1})
	})
};

exports.getProducts = function(req,res){
	var current = ~~req.query.current > 0 ? ~~req.query.current : 1;
	var perPage = ~~req.query.perPage > 0 ? ~~req.query.perPage : 20;
	var parentId = req.query.parentId;
	var sortName = req.query.sortName || 'sortId';
	var startRow = (current - 1)*perPage;
	if (!parentId) {
		res.josn({status:0,msg:'parentId can not be emprty.'});
	};
	var search = {
		parentId:parentId,
	};
	FastShipProduct.find(search)
		.skip(startRow)
		.sort(sortName)
		.limit(perPage)
		.exec(function(err,pro){
			if (err) {
				return res.json({status:0,msg:err});
			};
			FastShipProduct.find(search).count(function(err,count){
				if (err) {
					res.json({status:0,msg:'can not get count.'});
				};
				return res.json({"status":1,"data":pro,"count":count,"current":current,"perPage":perPage,"maxPage":Math.ceil(count/perPage)});
			});
		});
};