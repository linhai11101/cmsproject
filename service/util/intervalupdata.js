/*
*实时同步CRM信息
*2017-04-07
*/ 
var mongoose = require('mongoose');
var _ = require('underscore');
var superagent = require('superagent');
var domainCrm = require('../config').java_api_host;
// 模型
// var industrial = require('../models/industrial');
var Cluster = require('../models/cluster');
var FairActive = require('../models/fair-active');


exports.upIndustrialData = function (num,str){
	if (!num || num<600000) {
		var num = 600000;
	};
	var url = domainCrm + '/cms/iwIclusters/home/iwIclustersInfo.cf';
    setInterval(function() {
    	var agentDone = false;
    	var mongoDone = false;
    	var remoteData = [];
    	// 获取远程数据
        superagent.post(url)
        	.end(function(err,res){
        		if (err) {
        			console.warn('Error:' + err);
        			return;
        		};
        		var data = JSON.parse(res.text);
        		remoteData = data.data;
        		// 获取mongoose的数据
        		remoteData.forEach(function(item,index){
        			Cluster.find({iwId:item.iwId})
        			  .exec(function(err,reszyz){
        			  	if (err) return console.warn('Error:' + err);
        			  	if (reszyz.length != 0) {
        			  		reszyz[0].clickTraffic = item.clickTraffic;
      			  			reszyz[0].feedbackNumber = item.feedbackNumber;
							reszyz[0].collections = item.collection;
							reszyz[0].productNumber = item.productNumber;
							reszyz[0].volume = item.volume;
							reszyz[0].suppliersNumber = item.suppliersNumber;
							Cluster.update({_id:reszyz[0]._id},reszyz[0],function(err){

								if (err) return console.warn('Error:' + err);

							});
        			  	};
        			  });
        		});
        	})
    }, num);
};

exports.updateFairActive = function (num) {
    if (num < 60000 || !num) num = 60000;

    var url = domainCrm + "/cms/activitys/getAllExhibitionTradeActivity.cf";

    setInterval(function(){
       superagent.post(url)
        .end(function(err,res){
            if (err) return console.warn('Error:' + err);

            var data_res = res.body.data;
            data_res.forEach(function(item,index){
                FairActive.find({id:item.id})
                    .exec(function(err,resact){
                        if (err) return console.warn('Error:' + err);
                        if (resact.length != 0 && !!resact[0]) {
                            resact[0].pageViews = item.pageViews;

                            var m = JSON.parse(JSON.stringify(resact[0]));
                            
                            FairActive.update({_id:m._id},m,function(err) {

                                if (err) return console.warn('Error:' + err);
                            })
                        }
                    })
            })
        })
    },num)
    
}

