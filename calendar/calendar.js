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
		this.container       = config.container;
		this.beginTime       = config.beginTime;
		this.endTime         = config.endTime;
		this.recentTime      = config.recentTime;
		this.isSundayFirst   = config.isSundayFirst;
		this.isShowNeighbor  = config.isShowNeighbor;
		this.isToggleBtn     = config.isToggleBtn;
		this.isChinese       = config.isChinese;
		this.monthType       = config.monthType;
		this.canViewDisabled = config.canViewDisabled;
		this.beforeRenderArr = config.beforeRenderArr;
		this.success         = config.success;
		this.switchRender    = config.switchRender;
		
		this.box          = null;
		this.currentIdx   = 2;
		this.currentYear  = new Date().getFullYear();
		this.currentMonth = new Date().getMonth();
		
		this.width    = doc.body.offsetWidth;
		this.distance = 0;
		
		this.beginStamp  = 0;
		this.endStamp    = 0;
		this.recentStamp = 0;
		this.resultArr   = [];
		
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
			index: 0,
			time: 0
		};
		
		this.initDomFuc();
		this.initReady();
		this.initBinding();
	}
	
	Calendar.prototype = {
		constructor: Calendar,
		initDomFuc: function () {
			var _this = this;
			var html = '';
			if (!_this.checkTime()) return;
			_this.currentYear  = _this.recentTime[0];
			_this.currentMonth = _this.recentTime[1] - 1;
			
			html += '<div class="calendar-block">' +
							'<div class="calendar-title">' +
							'<span id="' + _this.container + 'CalendarTitleLeft" class="calendar-title-left">&#xe64f;</span>'+
							'<span id="' + _this.container + 'CalendarTitleRight" class="calendar-title-right">&#xe64e;</span>' +
							'<b id="' + _this.container + 'TitleCenter"></b></div>' +
							' <div id="' + _this.container + 'Box" class="calendar-box">'+
							'<div class="calendar-item calendar-item0"' +
							' data-year="' + new Date(_this.currentYear, _this.currentMonth + 1).getFullYear() + '"' +
							' data-month="'+ (new Date(_this.currentYear, _this.currentMonth + 1).getMonth() + 1) + '">' +
							_this.generateItemBodyDom(_this.currentYear, _this.currentMonth + 1) + '</div>' +
							'<div class="calendar-item calendar-item1"' +
							' data-year="' + new Date(_this.currentYear, _this.currentMonth - 1).getFullYear() + '"' +
							' data-month="'+ (new Date(_this.currentYear, _this.currentMonth - 1).getMonth() + 1) + '">' +
							_this.generateItemBodyDom(_this.currentYear, _this.currentMonth - 1) + '</div>' +
							'<div class="calendar-item calendar-item2"' +
							' data-year="' + new Date(_this.currentYear, _this.currentMonth).getFullYear() + '"' +
							' data-month="'+ (new Date(_this.currentYear, _this.currentMonth).getMonth() + 1) + '">' +
							_this.generateItemBodyDom(_this.currentYear, _this.currentMonth) + '</div>' +
							'<div class="calendar-item calendar-item0"' +
							' data-year="' + new Date(_this.currentYear, _this.currentMonth + 1).getFullYear() + '"' +
							' data-month="'+ (new Date(_this.currentYear, _this.currentMonth + 1).getMonth() + 1) + '">' +
							_this.generateItemBodyDom(_this.currentYear, _this.currentMonth + 1) + '</div>' +
							'<div class="calendar-item calendar-item1"' +
							' data-year="' + new Date(_this.currentYear, _this.currentMonth - 1).getFullYear() + '"' +
							' data-month="'+ (new Date(_this.currentYear, _this.currentMonth - 1).getMonth() + 1) + '">' +
							_this.generateItemBodyDom(_this.currentYear, _this.currentMonth - 1) + '</div>' +
							' </div></div>';
			
			$id(_this.container).innerHTML = html;
			_this.box = $id(_this.container + 'Box');
			// 首次渲染绑定的样式
			_this.renderCallbackArr(_this.beforeRenderArr);
		},
		initReady: function () {
			this.box.style.transform                                         = 'translate3d(-' + this.currentIdx * this.width + 'px, 0 , 0)';
			this.box.style.webkitTransform                                   = 'translate3d(-' + this.currentIdx * this.width + 'px, 0 , 0)';
			this.box.style.transitionDuration                                = '0s';
			this.box.style.webkitTransitionDuration                          = '0s';
			this.distance                                                    = -this.currentIdx * this.width;
			$id(this.container + 'TitleCenter').innerHTML = this.generateTitleMonth(this.currentIdx,this.currentYear, this.currentMonth);
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
			on('touchstart', _this.container + 'CalendarTitleLeft', function () {
				_this.infinitePosition();
				_this.distance                   = _this.distance + _this.width;
				_this.box.style.transform        = 'translate3d(' + _this.distance + 'px, 0 , 0)';
				_this.box.style.webkitTransform  = 'translate3d(' + _this.distance + 'px, 0 , 0)';
				_this.box.style.transition       = 'none';
				_this.box.style.webkitTransition = 'none';
				_this.switchItemBody(true, _this.distance / _this.width);
			});
			on('touchstart', _this.container + 'CalendarTitleRight', function () {
				_this.infinitePosition();
				_this.distance                   = _this.distance - _this.width;
				_this.box.style.transform        = 'translate3d(' + _this.distance + 'px, 0 , 0)';
				_this.box.style.webkitTransform  = 'translate3d(' + _this.distance + 'px, 0 , 0)';
				_this.box.style.transition       = 'none';
				_this.box.style.webkitTransition = 'none';
				_this.switchItemBody(false, _this.distance / _this.width);
			});
		},
		checkTime: function () {
			var _this        = this;
			var beginLength  = _this.beginTime.length;
			var endLength    = _this.endTime.length;
			var recentLength = _this.recentTime.length;
			if (!(beginLength === 0 || beginLength === 3)) {
				console.error('beginTime不合法 : beginTime长度为 0 或 3');
				return false;
			}
			if (!(endLength === 0 || endLength === 3)) {
				console.error('endTime不合法 : endTime长度为 0 或 3');
				return false;
			}
			if (!(recentLength === 0 || recentLength === 3)) {
				console.error('recentTime不合法 : recentLength长度为 0 或 3');
				return false;
			}
			_this.beginTime   = beginLength === 3 ? _this.beginTime : [1970, 1, 1];
			_this.endTime     = endLength === 3 ? _this.endTime : [new Date().getFullYear() + 1, 12, 31];
			_this.recentTime  = recentLength === 3 ? _this.recentTime : [new Date().getFullYear(), new Date().getMonth() + 1, 1];
			_this.beginStamp  = new Date(_this.beginTime[0], _this.beginTime[1] - 1, _this.beginTime[2]).getTime();
			_this.endStamp    = new Date(_this.endTime[0], _this.endTime[1] - 1, _this.endTime[2]).getTime();
			_this.recentStamp = new Date(_this.recentTime[0], _this.recentTime[1] - 1, _this.recentTime[2]).getTime();
			_this.recentStamp < _this.beginStamp ? console.error('当前时间 recentTime 小于 开始时间 beginTime') : "";
			_this.recentStamp > _this.endStamp ? console.error('当前时间 recentTime 超过 结束时间 endTime') : "";
			return (_this.beginStamp <= _this.recentStamp && _this.recentStamp <= _this.endStamp);
		},
		checkRange: function () {
			// 用来判断生成的月份是否超过范围
			var _this = this;
			
		},
		generateTitleMonth: function (idx, year, month) {
			var monthLiLength = this.box.querySelectorAll('.calendar-item.calendar-item' + idx)[0].querySelectorAll('li').length;
			if(monthLiLength > 35) {
				$id(this.container).firstChild.classList.remove('shorter');
				$id(this.container).firstChild.classList.add('higher');
			} else if(monthLiLength <= 28) {
				$id(this.container).firstChild.classList.remove('higher');
				$id(this.container).firstChild.classList.add('shorter');
			} else $id(this.container).firstChild.classList.remove('higher', 'shorter');
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
				if (_this.isShowNeighbor) recentArr.unshift((lastDateCount - i) + 'b');
				else recentArr.unshift('' + 'b');
			});
			loop(1, dateCount + 1, function (i) {
				recentArr.push(i);
			});
			loop(1, afterCount + 1, function (i) {
				if (_this.isShowNeighbor) recentArr.push(i + 'a');
				else recentArr.push('' + 'a');
			});
			/*console.log(' =====' + year + '年 ' + month + '月=====  ');
			 console.log(recentArr);*/
			return recentArr;
		},
		generateItemBodyDom: function (year, month) {
			var dateArr   = this.generateItemBodyArr(year, month);
			var html      = this.generateItemTitle() + '<ul class="calendar-item-body">';
			var _this     = this;
			var tempStamp = '';
			loop(0, dateArr.length, function (i) {
				if (/b$/.test(dateArr[i])) {
					html += '<li class="disabled"><i>' + dateArr[i].replace('b', '') + '</i></li>';
				} else if (/a$/.test(dateArr[i])) {
					html += '<li class="disabled"><i>' + dateArr[i].replace('a', '') + '</i></li>';
				} else {
					tempStamp = new Date(year, month, dateArr[i]).getTime();
					html += '<li' + (tempStamp >= _this.beginStamp && tempStamp <= _this.endStamp ?
							'' : ' class="disabled"') +
						'><i data-stamp="' + tempStamp + '" id="' + _this.container + '-item-' + tempStamp + '">' + dateArr[i] + '</i></li>';
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
		renderCallbackArr: function (arr) {
			var _this = this;
			loop(0, arr.length, function (k)  {
				if(!$id(_this.container + '-item-' + arr[k].stamp)) {
					console.error(_this.container + '-item-' + arr[k].stamp + ' 不在范围内,请检查你的时间戳');
					return true;
				}
				$id(_this.container + '-item-' + arr[k].stamp).classList.add(arr[k].className);
			})
		},
		switchItemBody: function (direct, distance) {
			var _this                                                        = this;
			// direct: true 为左,direct:false为右。
			_this.currentIdx                                                 = Math.abs(distance) % 3;
			_this.currentYear                                                = doc.querySelectorAll('.calendar-item.calendar-item' + _this.currentIdx)[0].getAttribute('data-year');
			_this.currentMonth                                               = doc.querySelectorAll('.calendar-item.calendar-item' + _this.currentIdx)[0].getAttribute('data-month') - 1;
			$id(_this.container + 'TitleCenter').innerHTML = _this.generateTitleMonth(_this.currentIdx,_this.currentYear, _this.currentMonth);
			
			var itemNum                                                      = direct ? ((Math.abs(distance) - 1) % 3 < 0 ? 2 : (Math.abs(distance) - 1) % 3) : (Math.abs(distance) + 1) % 3;
			var applyYear = new Date(_this.currentYear, direct ? _this.currentMonth - 1 : _this.currentMonth + 1).getFullYear();
			var applyMonth =  new Date(_this.currentYear, direct ? _this.currentMonth - 1 : _this.currentMonth + 1).getMonth();
			
			_this.box.querySelectorAll('.calendar-item.calendar-item' + itemNum).forEach(function (obj) {
				obj.innerHTML = _this.generateItemBodyDom(_this.currentYear, direct ? _this.currentMonth - 1 : _this.currentMonth + 1);
				obj.setAttribute('data-year', applyYear);
				obj.setAttribute('data-month', applyMonth + 1);
			});
			
			var newMonthRenderArr = _this.switchRender(applyYear, applyMonth); // 获得回调后的数组,并执行操作
			_this.renderCallbackArr(newMonthRenderArr);
		},
		touch: function (event) {
			event = event || window.event;
			var _this = this;
			switch (event.type) {
				case "touchstart":
					_this.start.X    = event.touches[0].clientX;
					_this.start.time = new Date().getTime();
					_this.infinitePosition();
					break;
				case "touchend":
					_this.end.X    = event.changedTouches[0].clientX;
					_this.end.time = new Date().getTime();
					var tempDis    = (_this.end.X - _this.start.X).toFixed(2);
					if (_this.end.time - _this.start.time < 150 && tempDis < 5) { // 如果是tap时间的话
						if (event.target.matches('i') && event.target.id !== '') {
							var dataStamp = event.target.getAttribute('data-stamp');
							if (_this.resultArr.length === 0) _this.resultArr.push(dataStamp);
							else if (_this.resultArr.length === 1) _this.resultArr[0] < dataStamp ? _this.resultArr.push(dataStamp) : _this.resultArr.unshift(dataStamp);
							else {
								_this.resultArr.length = 0;
								_this.resultArr.push(dataStamp);
							}
							_this.success(dataStamp, _this.resultArr);
						}
					} else {
						var enddis                       = _this.distance + (tempDis - 0);
						_this.box.style.transform        = 'translate3d(' + Math.round(enddis / _this.width) * _this.width + 'px, 0 , 0)';
						_this.box.style.webkitTransform  = 'translate3d(' + Math.round(enddis / _this.width) * _this.width + 'px, 0 , 0)';
						_this.box.style.transition       = 'transform .5s ease-out';
						_this.box.style.webkitTransition = 'transform .5s ease-out';
						if (_this.distance !== Math.round(enddis / _this.width) * _this.width) { // 确实滑动了
							_this.switchItemBody(tempDis > 0, Math.round(enddis / _this.width));
						}
						_this.distance = Math.round(enddis / _this.width) * _this.width;
					}
					break;
				case "touchmove":
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

