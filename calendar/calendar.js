/**
 * Created by appian on 2017/4/14.
 */

(function (wid, dcm) {
	var win = wid;
	var doc = dcm;
	
	function $id(id) {
		return doc.getElementById(id);
	}
	
	function loop(begin, length, fn) {
		for ( var i = begin; i < length; i++ ) {
			if (fn(i)) break;
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
		this.container      = config.container;
		this.beginTime      = config.beginTime;
		this.endTime        = config.endTime;
		this.recentTime     = config.recentTime;
		this.isSundayFirst  = config.isSundayFirst;
		this.isShowNeighbor = config.isShowNeighbor;
		this.isToggleBtn    = config.isToggleBtn;
		this.isChinese      = config.isChinese;
		this.monthType      = config.monthType;
		this.beforeRender   = config.beforeRender;
		this.success        = config.success;
		this.toggleRender   = config.toggleRender;
		
		
		this.box          = document.getElementById('box');
		this.item1        = document.querySelectorAll('.calendar-item.calendar-item1');
		this.item2        = document.querySelectorAll('.calendar-item.calendar-item2');
		this.item0        = document.querySelectorAll('.calendar-item.calendar-item0');
		this.currentIdx   = 2;
		this.currentYear  = new Date().getFullYear();
		this.currentMonth = new Date().getMonth();
		
		this.width    = doc.body.offsetWidth;
		this.distance = 0;
		
		this.start = {
			X: 0,
			Y: 0,
			time: ''
		};
		this.move  = {
			X: 0,
			Y: 0,
			speed: []
		};
		this.end   = {
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
		initDomFuc: function () {
			var _this = this;
			this.item1.forEach(function (obj) {
				// obj.innerHTML = _this.generateDate(_this.currentYear, _this.currentMonth - 1);
				obj.innerHTML = _this.generateItemBodyDom(_this.currentYear, _this.currentMonth - 1);
				obj.setAttribute('data-year', new Date(_this.currentYear, _this.currentMonth - 1).getFullYear());
				obj.setAttribute('data-month', new Date(_this.currentYear, _this.currentMonth - 1).getMonth() + 1);
			});
			this.item2.forEach(function (obj) {
				// obj.innerHTML = _this.generateDate(_this.currentYear, _this.currentMonth);
				obj.innerHTML = _this.generateItemBodyDom(_this.currentYear, _this.currentMonth);
				obj.setAttribute('data-year', new Date(_this.currentYear, _this.currentMonth).getFullYear());
				obj.setAttribute('data-month', new Date(_this.currentYear, _this.currentMonth).getMonth() + 1);
			});
			this.item0.forEach(function (obj) {
				// obj.innerHTML = _this.generateDate(_this.currentYear, _this.currentMonth + 1);
				obj.innerHTML = _this.generateItemBodyDom(_this.currentYear, _this.currentMonth + 1);
				obj.setAttribute('data-year', new Date(_this.currentYear, _this.currentMonth + 1).getFullYear());
				obj.setAttribute('data-month', new Date(_this.currentYear, _this.currentMonth + 1).getMonth() + 1);
			});
		},
		initReady: function () {
			this.box.style.transform                                         = 'translate3d(-' + this.currentIdx * this.width + 'px, 0 , 0)';
			this.box.style.webkitTransform                                   = 'translate3d(-' + this.currentIdx * this.width + 'px, 0 , 0)';
			this.box.style.transitionDuration                                = '0s';
			this.box.style.webkitTransitionDuration                          = '0s';
			this.distance                                                    = -this.currentIdx * this.width;
			doc.getElementsByClassName('calendar-title-center')[0].innerHTML = this.generateTitleMonth(this.currentYear, this.currentMonth);
		},
		initBinding: function () {
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
			
			on('touchstart', _this.container + '-calendar-title-left', function () {
				_this.distance                   = _this.distance + _this.width;
				_this.box.style.transform        = 'translate3d(' + _this.distance + 'px, 0 , 0)';
				_this.box.style.webkitTransform  = 'translate3d(' + _this.distance + 'px, 0 , 0)';
				_this.box.style.transition       = 'none';
				_this.box.style.webkitTransition = 'none';
				_this.switchItemBody(true, _this.distance / _this.width);
				_this.infinitePosition();
			});
			on('touchstart', _this.container + '-calendar-title-right', function () {
				_this.distance                   = _this.distance - _this.width;
				_this.box.style.transform        = 'translate3d(' + _this.distance + 'px, 0 , 0)';
				_this.box.style.webkitTransform  = 'translate3d(' + _this.distance + 'px, 0 , 0)';
				_this.box.style.transition       = 'none';
				_this.box.style.webkitTransition = 'none';
				_this.switchItemBody(false, _this.distance);
				_this.infinitePosition();
			});
		},
		generateTitleMonth: function (year, month) {
			var monthArr = [['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
				['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
				['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June.', 'July.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
				['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Augest', 'September', 'October', 'November', 'December']];
			return monthArr[this.monthType][new Date(year, month).getMonth()]
				+ ' ' + new Date(year, month).getFullYear();
		},
		generateItemTitle: function () {
			var chinese       = '<span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>';
			var english       = '<span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>';
			var chineseString = this.isSundayFirst ? ('<span>日</span>' + chinese) : (chinese + '<span>日</span>');
			var englishString = this.isSundayFirst ? ('<span>S</span>' + english) : (english + '<span>S</span>');
			return this.isChinese ?
			'<div class="calendar-item-title">' + chineseString + '</div>' :
			'<div class="calendar-item-title">' + englishString + '</div>';
		},
		generateItemBodyArr: function (year, month) {
			// 传入计算机识别的年份和月份
			var recentArr     = [];
			var dateCount     = new Date(year, month + 1, 0).getDate();
			var lastDateCount = new Date(year, month, 0).getDate();
			var firstInDay    = new Date(year, month, 1).getDay();
			var lastInDay     = new Date(year, month + 1, 0).getDay();
			var beforeCount   = this.isSundayFirst ? firstInDay : (firstInDay === 0 ? 6 : firstInDay - 1);
			var afterCount    = this.isSundayFirst ? (6 - lastInDay) : (lastInDay === 0 ? 0 : 7 - lastInDay);
			var _this         = this;
			loop(0, beforeCount, function (i) {
				if (_this.isShowNeighbor) recentArr.unshift((lastDateCount - i) + 'c');
				else recentArr.unshift('' + 'c');
			});
			loop(1, dateCount + 1, function (i) {
				recentArr.push(i);
			});
			loop(1, afterCount + 1, function (i) {
				if (_this.isShowNeighbor) recentArr.push(i + 'c');
				else recentArr.push('' + 'c');
			});
			/*console.log(' =====' + year + '年 ' + month + '月=====  ');
			 console.log(recentArr);*/
			return recentArr;
		},
		generateItemBodyDom: function (year, month) {
			var dateArr = this.generateItemBodyArr(year, month);
			var html    = this.generateItemTitle() + '<ul class="calendar-item-body">';
			loop(0, dateArr.length, function (i) {
				if (/c$/.test(dateArr[i])) {
					html += '<li class="disabled"><i>' + dateArr[i].replace('c', '') + '</i></li>';
				} else {
					html += '<li><i>' + dateArr[i] + '</i></li>';
				}
			});
			return html + '</ul>';
		},
		infinitePosition: function () {
			var _this = this;
			if (_this.distance == 0) {
				_this.box.style.transform        = 'translate3d(-' + 3 * _this.width + 'px, 0 , 0)';
				_this.box.style.webkitTransform  = 'translate3d(-' + 3 * _this.width + 'px, 0 , 0)';
				_this.box.style.transition       = 'none';
				_this.box.style.webkitTransition = 'none';
				_this.distance                   = -3 * _this.width;
			} else if (_this.distance == -4 * _this.width) {
				_this.box.style.transform        = 'translate3d(-' + _this.width + 'px, 0 , 0)';
				_this.box.style.webkitTransform  = 'translate3d(-' + _this.width + 'px, 0 , 0)';
				_this.box.style.transition       = 'none';
				_this.box.style.webkitTransition = 'none';
				_this.distance                   = -_this.width;
			}
		},
		switchItemBody: function (direct, distance ) {
			var _this                        = this;
			// direct: true 为左,direct:false为右。
			_this.currentIdx                                                 = Math.abs(distance) % 3;
			_this.currentYear                                                = doc.querySelectorAll('.calendar-item.calendar-item' + _this.currentIdx)[0].getAttribute('data-year');
			_this.currentMonth                                               = doc.querySelectorAll('.calendar-item.calendar-item' + _this.currentIdx)[0].getAttribute('data-month') - 1;
			doc.getElementsByClassName('calendar-title-center')[0].innerHTML = _this.generateTitleMonth(_this.currentYear, _this.currentMonth);
			
			var itemNum = direct ? ((Math.abs(distance) - 1) % 3 < 0 ? 2 : (Math.abs(distance) - 1) % 3) : (Math.abs(distance) + 1) % 3;
			
			doc.querySelectorAll('.calendar-item.calendar-item' + itemNum).forEach(function (obj) {
				obj.innerHTML = _this.generateItemBodyDom(_this.currentYear, direct ? _this.currentMonth - 1 : _this.currentMonth + 1);
				obj.setAttribute('data-year', new Date(_this.currentYear, direct ? _this.currentMonth - 1 : _this.currentMonth + 1).getFullYear());
				obj.setAttribute('data-month', new Date(_this.currentYear, direct ? _this.currentMonth - 1 : _this.currentMonth + 1).getMonth() + 1);
			});
		},
		touch: function () {
			var event = event || window.event;
			event.preventDefault();
			var _this = this;
			switch (event.type) {
				case "touchstart":
					_this.start.X = event.touches[0].clientX;
					_this.infinitePosition();
					break;
				case "touchend":
					_this.end.X                      = event.changedTouches[0].clientX;
					var tempDis                      = (_this.end.X - _this.start.X).toFixed(2);
					var enddis                       = _this.distance + (tempDis - 0);
					_this.box.style.transform        = 'translate3d(' + Math.round(enddis / _this.width) * _this.width + 'px, 0 , 0)';
					_this.box.style.webkitTransform  = 'translate3d(' + Math.round(enddis / _this.width) * _this.width + 'px, 0 , 0)';
					_this.box.style.transition       = 'all .5s ease-out';
					_this.box.style.webkitTransition = 'all .5s ease-out';
					if (_this.distance !== Math.round(enddis / _this.width) * _this.width) { // 确实滑动了
						_this.switchItemBody(tempDis > 0, Math.round(enddis / _this.width));
					}
					_this.distance = Math.round(enddis / _this.width) * _this.width;
					break;
				case "touchmove":
					event.preventDefault();
					_this.move.X                     = event.touches[0].clientX;
					var offset                       = (_this.move.X - _this.start.X).toFixed(2);
					var movedis                      = _this.distance + (offset - 0);
					_this.box.style.transform        = 'translate3d(' + movedis + 'px, 0 , 0)';
					_this.box.style.webkitTransform  = 'translate3d(' + movedis + 'px, 0 , 0)';
					_this.box.style.transition       = 'none';
					_this.box.style.webkitTransition = 'none';
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

