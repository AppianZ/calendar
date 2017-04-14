/**
 * Created by appian on 2017/4/14.
 */

(function(wid, dcm) {
	var win = wid;
	var doc = dcm;
	
	function $id(id) {
		return doc.getElementById(id);
	}
	
	function loop(begin, length, fn) {
		for ( var i = begin; i < length; i ++ ) {
			if(fn(i)) break;
		}
	}
	
	function on(action, selector, callback) {
		doc.addEventListener(action, function (e) {
			if (selector == e.target.tagName.toLowerCase() || selector == e.target.className || selector == e.target.id) {
				callback(e);
			}
		})
	}
	
	function Calendar(config) {
		this.container = config.container;
		this.beginTime = config.beginTime;
		this.endTime = config.endTime;
		this.recentTime = config.recentTime;
		this.isSundayFirst = config.isSundayFirst;
		this.isShowNeighbor = config.isShowNeighbor;
		this.isToggleBtn = config.isToggleBtn;
		this.monthType = config.monthType;
		this. beforeRender = config.beforeRender;
		this.success = config.success;
		this.toggleRender = config.toggleRender;
		
		
		this.box        = document.getElementById('box');
		this.item1 = document.querySelectorAll('.item.item1');
		this.item2 = document.querySelectorAll('.item.item2');
		this.item0 = document.querySelectorAll('.item.item0');
		this.currentIdx = 2;
		this.currentYear = new Date().getFullYear();
		this.currentMonth = new Date().getMonth();
		
		this.width = doc.body.offsetWidth;
		this.distance = 0;
		
		this.start       = {
			X: 0,
			Y: 0,
			time: ''
		};
		this.move        = {
			X: 0,
			Y: 0,
			speed: []
		};
		this.end         = {
			X: 0,
			Y: 0,
			index: 0
		};
		
		
		this.initDomFuc();
		this.initReady();
		this.initBinding();
	}
	
	
	Calendar.prototype = {
		constructor: Calendar,
		generateDate: function(year, month) {
			return new Date(year, month).getFullYear() + '年' +
				(new Date(year, month).getMonth() + 1) + '月';
		},
		initDomFuc: function () {
			var _this = this;
			this.item1.forEach(function(obj) {
				obj.innerHTML = _this.generateDate(_this.currentYear, _this.currentMonth - 1);
				obj.setAttribute('data-year', new Date(_this.currentYear, _this.currentMonth - 1).getFullYear());
				obj.setAttribute('data-month', new Date(_this.currentYear, _this.currentMonth - 1).getMonth() + 1);
			});
			this.item2.forEach(function(obj) {
				obj.innerHTML = _this.generateDate(_this.currentYear, _this.currentMonth);
				obj.setAttribute('data-year', new Date(_this.currentYear, _this.currentMonth).getFullYear());
				obj.setAttribute('data-month', new Date(_this.currentYear, _this.currentMonth).getMonth() + 1);
			});
			this.item0.forEach(function(obj) {
				obj.innerHTML = _this.generateDate(_this.currentYear, _this.currentMonth + 1);
				obj.setAttribute('data-year', new Date(_this.currentYear, _this.currentMonth + 1).getFullYear());
				obj.setAttribute('data-month', new Date(_this.currentYear, _this.currentMonth + 1).getMonth() + 1);
			});
			
		},
		initReady: function() {
			this.box.style.transform = 'translate3d(-' +  this.currentIdx * this.width  + 'px, 0 , 0)';
			this.box.style.transitionDuration = '0s';
			this.distance = -this.currentIdx * this.width;
		},
		initBinding: function() {
			var _this = this;
			this.box.addEventListener('touchstart', function () {
				_this.touch();
			}, false);
			this.box.addEventListener('touchmove', function () {
				_this.touch();
			}, false);
			this.box.addEventListener('touchend', function () {
				_this.touch();
			}, true);
		},
		
		touch: function () {
			var event = event || window.event;
			event.preventDefault();
			var _this = this;
			switch (event.type) {
				case "touchstart":
					_this.start.X = event.touches[0].clientX;
					if(_this.distance == 0) {
						_this.box.style.transform = 'translate3d(-' + 3 * _this.width + 'px, 0 , 0)';
						_this.box.style.transition = 'none';
						_this.distance = -3 * this.width;
					}else if(_this.distance == -4 * _this.width) {
						_this.box.style.transform = 'translate3d(-' + _this.width + 'px, 0 , 0)';
						_this.box.style.transition = 'none';
						_this.distance = -_this.width;
					}
					break;
				case "touchend":
					_this.end.X = event.changedTouches[0].clientX;
					var tempDis = (_this.end.X - _this.start.X).toFixed(2);
					var enddis = _this.distance + (tempDis - 0);
					_this.box.style.transform = 'translate3d(' + Math.round(enddis/_this.width) * _this.width + 'px, 0 , 0)';
					_this.box.style.transition = 'all .5s ease-out';
					if (_this.distance !== Math.round(enddis/_this.width) * _this.width) { // 确实滑动了
						_this.currentIdx = Math.abs(Math.round(enddis/_this.width)) % 3;
						_this.currentYear = doc.querySelectorAll('.item.item' + _this.currentIdx)[0].getAttribute('data-year');
						_this.currentMonth = doc.querySelectorAll('.item.item' + _this.currentIdx)[0].getAttribute('data-month') - 1;
						// console.log('currentIDX: ' + _this.currentIdx  + '     currentYear: ' + _this.currentYear + '   currentMonth: ' + _this.currentMonth);
						if(tempDis > 0){
							// 看左边的内容
							var itemNum = (Math.abs(Math.round(enddis/_this.width)) - 1) % 3 < 0 ? 2 : (Math.abs(Math.round(enddis/_this.width)) - 1) % 3;
							doc.querySelectorAll('.item.item' + itemNum).forEach(function(obj) {
								obj.innerHTML = _this.generateDate(_this.currentYear, _this.currentMonth - 1);
								obj.setAttribute('data-year', new Date(_this.currentYear, _this.currentMonth - 1).getFullYear());
								obj.setAttribute('data-month', new Date(_this.currentYear, _this.currentMonth - 1).getMonth() + 1);
							})
						} else {
							doc.querySelectorAll('.item.item' + (Math.abs(Math.round(enddis/_this.width)) + 1) % 3).forEach(function(obj) {
								obj.innerHTML = _this.generateDate(_this.currentYear, _this.currentMonth + 1);
								obj.setAttribute('data-year', new Date(_this.currentYear, _this.currentMonth + 1).getFullYear());
								obj.setAttribute('data-month', new Date(_this.currentYear, _this.currentMonth + 1).getMonth() + 1);
							})
						}
					}
					_this.distance = Math.round(enddis/_this.width) * _this.width;
					break;
				case "touchmove":
					event.preventDefault();
					_this.move.X = event.touches[0].clientX;
					var offset = (_this.move.X - _this.start.X).toFixed(2);
					var movedis = _this.distance + (offset - 0);
					_this.box.style.transform = 'translate3d(' + movedis + 'px, 0 , 0)';
					_this.box.style.transition = 'none';
					break;
			}
		}
	};
	
	if (typeof exports == "object") {
		module.exports = Calendar;
	} else if (typeof define == "function" && define.amd) {
		define([], function () {
			return Calendar;
		})
	} else {
		win.Calendar = Calendar;
	}
})(window, document);

