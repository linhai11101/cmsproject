

var _ = require('underscore'),
	eventproxy = require('eventproxy');

var ForecastIndex = require('../../models/activityForecast/forecastIndex'),
	ForecastCate = require('../../models/activityForecast/forecastCate'),
	Forecast = require('../../models/activityForecast/forecast'),
	HomeAct = require('../../models/homeAct');


exports.actForecast = function(req,res){
	var parentId = req.params.id;
	var ep = new eventproxy();
  	ep.all('forecastIndex', 'forecastCate','forecast','homeActs',
  	 function(forecastIndex, forecastCate,forecast,homeActs){
  	   var resDate = {
  	      title: '活动预告',
  	      logoText:'Industrial Cluster',
  	      forecastIndex: forecastIndex,
  	      forecastCate: forecastCate,
  	      forecast: forecast,
  	      homeActs:homeActs
  	    }
  	    res.type('.html');
  	    res.render('activity-forecast/activity-forecast',resDate);
  	})
  	ForecastIndex
  	  .find({_id:parentId})
  	  .exec(function(err,findex){
  	    if (err) {
  	      console.log(err);
  	    };
  	    ep.emit('forecastIndex', findex||[]);
  	  });
  	ForecastCate
  	  .find({parentId:parentId,ishidden:1})
  	  .limit(6)
  	  .sort('sortId')
  	  .exec(function(err,cate){
  	    if (err) {
  	      console.log(err);
  	    };
  	    console.log(cate);
  	    ep.emit('forecastCate', cate||[]);
  	  });
  	Forecast
  	  .find({parentId:parentId,ishidden:1})
  	  .sort('sortId')
  	  .exec(function(err,forecast){
  	    if (err) {
  	      console.log(err);
  	    };
  	    ep.emit('forecast', forecast||[]);
  	  });
  	HomeAct.find()
      .sort('sortId')
      .exec(function(err, recommend){
        if (err) {
          console.log(err);
        };
        ep.emit('homeActs', recommend||[]);
      });
}
