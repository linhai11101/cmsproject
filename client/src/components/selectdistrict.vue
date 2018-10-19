<template>
	<div class="lh-clearfix">
		<div class="province lh-float-left">
			<p @click="getProvice" v-text="province?province:'--请选择--'"></p>
			<!-- v-show="provinceListShow" -->
			<ul v-show="provinceListShow">
				<li class="provinceItem" v-for="item in provinceList" v-text="item.cnName" @click="selectprovince(item)"></li>
			</ul>
		</div>
		<div class="district lh-float-left mag-l-10">
			<p @click="getDistrict" v-text="district?district:'--请选择--'"></p>
			 <!-- v-show="districtListShow" -->
			<ul v-show="districtListShow">
				<li class="districtItem" v-for="item in districtList" v-text="item.cnName" @click="selectDistrict(item)"></li>
			</ul>
		</div>
	</div>
</template>
<script>
	module.exports = {
		props:{
			province:{
				type:String,
				default:null,
				twoway:true
			},
			district:{
				type:String,
				default:null,
				twoway:true
			},
			provinceid:{
				type:Number,
				default:null,
				twoway:true
			},
			districtid:{
				type:Number,
				default:null,
				twoway:true
			},
		},
		data:function(){
			return {
				provinceListShow:false,
				districtListShow:false,
				cprovinceId:0,
				cdistrictId:0,
				provinceList:[],
				districtList:[],
				pid:null
			}
		},
		methods:{
			getProvice:function(){
				var self = this;
				$.ajax({
					url:domainCrm + "/cms/location/province.cf",
					// url:"http://crm.local-world.com/cms/location/province.cf",
					type:"get",
					dataType:'json'
				}).done(function(res){
					console.log(res);
					self.provinceList = res.data;
				})
				self.provinceListShow=!self.provinceListShow;
			},
			getDistrict:function(){
				var self = this;
				var params = {pid:self.pid}
				$.ajax({
					url:domainCrm + "/cms/location/district.cf",
					// url:"http://crm.local-world.com/cms/location/district.cf",
					type:"get",
					dataType:'json',
					data:params
				}).done(function(res){
					self.districtList = res.data;
					
				})
				self.districtListShow=!self.districtListShow;
			},
			selectprovince:function(a){
				var self = this;
				self.provinceListShow = false;
				self.province = a.enName;
				self.provinceid = a.id;
				self.district = null;
				self.districtid = null;
				self.pid = a.id;
			},
			selectDistrict:function(a){
				var self = this;
				self.districtListShow = false;
				self.district = a.enName;
				self.districtid = a.id;
			},
		}
	}
</script>
<style>
	.province ul,.province li,.province p,.province div,.district ul,.district li,.district p,.district div{
		margin: 0px;
		padding: 0px;
		list-style: none;
	}
	.province,.district{width: 45%;min-width: 100px;position: relative;}
	.province>p,.district>p{width: 100%;height: 35px;border: 1px solid #eee;padding:5px;box-sizing: border-box;}
	.province>ul,.district>ul{position: absolute;width: 100%;z-index: 99;background: #fff;max-height: 220px;overflow: auto;}
	.provinceItem,.districtItem{width: 100%;height: 30px;box-sizing: border-box;border: 1px solid #eee;cursor: pointer;padding: 5px 10px !important;}
	.provinceItem:hover,.districtItem:hover{background-color: #0a51f3;color: #fff;}
	.lh-clearfix:before{content: "";display: table-cell;clear: both;display: block;}
	.lh-clearfix:after{content: "";display: table;clear: both;}
	.lh-float-left{float: left;}
	.lh-float-right{float: right;}
	.mag-l-10{margin-left: 10px;}

</style>

