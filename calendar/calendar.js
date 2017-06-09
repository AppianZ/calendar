/**
 * Created by appian on 2017/4/14.
 */

(function (wid, dcm) {
	var win = wid;
	var doc = dcm;
	
	function $id(id) {
		return doc.getElementById(id);
	}
	
	function $class(name) {
		return doc.getElementsByClassName(name);
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
	
	function transformFormat(target, distance, time) {
		target.style.transform        = 'translate3d(' + distance + 'px, 0 , 0)';
		target.style.webkitTransform  = 'translate3d(' + distance + 'px, 0 , 0)';
		target.style.transition       = time ? 'transform ' + time + 's ease' : 'none';
		target.style.webkitTransition = time ? 'transform ' + time + 's ease' : 'none';
	}
	
	function checkTime(cal) {
		var beginLength  = cal.beginTime.length;
		var endLength    = cal.endTime.length;
		var recentLength = cal.recentTime.length;
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
		cal.beginTime   = beginLength === 3 ? cal.beginTime : [1970, 1, 1];
		cal.endTime     = endLength === 3 ? cal.endTime : [new Date().getFullYear() + 1, 12, 31];
		cal.recentTime  = recentLength === 3 ? cal.recentTime : [new Date().getFullYear(), new Date().getMonth() + 1, 1];
		cal.beginStamp  = new Date(cal.beginTime[0], cal.beginTime[1] - 1, cal.beginTime[2]).getTime();
		cal.endStamp    = new Date(cal.endTime[0], cal.endTime[1] - 1, cal.endTime[2]).getTime();
		cal.recentStamp = new Date(cal.recentTime[0], cal.recentTime[1] - 1, cal.recentTime[2]).getTime();
		cal.recentStamp < cal.beginStamp ? console.error('当前时间 recentTime 小于 开始时间 beginTime') : "";
		cal.recentStamp > cal.endStamp ? console.error('当前时间 recentTime 超过 结束时间 endTime') : "";
		return (cal.beginStamp <= cal.recentStamp && cal.recentStamp <= cal.endStamp);
	}
	
	function checkRange(year, month, cal) {
		// 用来判断生成的月份是否超过范围
		if (!cal.isToggleBtn) return;
		$id(cal.container + 'CalendarTitleLeft').style.display  = 'inline-block';
		$id(cal.container + 'CalendarTitleRight').style.display = 'inline-block';
		if (cal.canViewDisabled) return;
		if (new Date(year, month).getTime() >= new Date(cal.endTime[0], cal.endTime[1] - 1).getTime())
			$id(cal.container + 'CalendarTitleRight').style.display = 'none';
		if (new Date(year, month).getTime() <= new Date(cal.beginTime[0], cal.beginTime[1] - 1).getTime())
			$id(cal.container + 'CalendarTitleLeft').style.display = 'none';
	}
	
	function generateTitleMonth(idx, year, month, cal) {
		var monthLiLength = cal.box.querySelectorAll('.calendar-item.calendar-item' + idx)[0].querySelectorAll('li').length;
		if (monthLiLength > 35) {
			$id(cal.container).getElementsByClassName('calendar-block')[0].classList.remove('shorter');
			$id(cal.container).getElementsByClassName('calendar-block')[0].classList.add('higher');
		} else if (monthLiLength <= 28) {
			$id(cal.container).getElementsByClassName('calendar-block')[0].classList.remove('higher');
			$id(cal.container).getElementsByClassName('calendar-block')[0].classList.add('shorter');
		} else $id(cal.container).getElementsByClassName('calendar-block')[0].classList.remove('higher', 'shorter');
		var monthArr = [['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
			['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June.', 'July.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
			['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']];
		return monthArr[cal.monthType][new Date(year, month).getMonth()]
			+ ' ' + new Date(year, month).getFullYear();
	}
	
	function generateItemTitle(cal) {
		var chinese       = '<span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>';
		var english       = '<span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>';
		var chineseString = cal.isSundayFirst ? ('<span>日</span>' + chinese) : (chinese + '<span>日</span>');
		var englishString = cal.isSundayFirst ? ('<span>S</span>' + english) : (english + '<span>S</span>');
		return cal.isChinese ?
		'<div class="calendar-item-title">' + chineseString + '</div>' :
		'<div class="calendar-item-title">' + englishString + '</div>';
	}
	
	function generateItemBodyArr(year, month, cal) {
		// 传入计算机识别的年份和月份
		var recentArr     = [];
		var dateCount     = new Date(year, month + 1, 0).getDate();
		var lastDateCount = new Date(year, month, 0).getDate();
		var firstInDay    = new Date(year, month, 1).getDay();
		var lastInDay     = new Date(year, month + 1, 0).getDay();
		var beforeCount   = cal.isSundayFirst ? firstInDay : (firstInDay === 0 ? 6 : firstInDay - 1);
		var afterCount    = cal.isSundayFirst ? (6 - lastInDay) : (lastInDay === 0 ? 0 : 7 - lastInDay);
		loop(0, beforeCount, function (i) {
			if (cal.isShowNeighbor) recentArr.unshift((lastDateCount - i) + 'b');
			else recentArr.unshift('' + 'b');
		});
		loop(1, dateCount + 1, function (i) {
			recentArr.push(i);
		});
		loop(1, afterCount + 1, function (i) {
			if (cal.isShowNeighbor) recentArr.push(i + 'a');
			else recentArr.push('' + 'a');
		});
		return recentArr;
	}
	
	function generateItemBodyDom(year, month, cal) {
		var dateArr   = generateItemBodyArr(year, month, cal);
		var html      = generateItemTitle(cal) + '<ul class="calendar-item-body">';
		var tempStamp = '';
		loop(0, dateArr.length, function (i) {
			if (/b$/.test(dateArr[i])) {
				html += '<li class="calendar-disabled"><i>' + dateArr[i].replace('b', '') + '</i></li>';
			} else if (/a$/.test(dateArr[i])) {
				html += '<li class="calendar-disabled"><i>' + dateArr[i].replace('a', '') + '</i></li>';
			} else {
				tempStamp = new Date(year, month, dateArr[i]).getTime();
				html += '<li' + (tempStamp >= cal.beginStamp && tempStamp <= cal.endStamp ?
					' class="' + cal.container + '-item-' + tempStamp + '" data-stamp="' + tempStamp + '"' : ' class="calendar-disabled"') +
					'><i data-stamp="' + tempStamp + '">' + dateArr[i] + '</i></li>';
			}
		});
		return html + '</ul>';
	}
	
	function infinitePosition(cal) {
		if (cal.distance == 0) {
			transformFormat(cal.box, (-3) * cal.width);
			cal.distance = -3 * cal.width;
		} else if (cal.distance == -4 * cal.width) {
			transformFormat(cal.box, (-1) * cal.width);
			cal.distance = -cal.width;
		}
	}
	
	function switchItemBody(direct, distance, cal) {
		// direct: true 为左,direct:false为右。
		var block                                    = $id('calendar-block-' + cal.container);
		cal.currentIdx                               = Math.abs(distance) % 3;
		cal.currentYear                              = block.querySelectorAll('.calendar-item.calendar-item' + cal.currentIdx)[0].getAttribute('data-year');
		cal.currentMonth                             = block.querySelectorAll('.calendar-item.calendar-item' + cal.currentIdx)[0].getAttribute('data-month') - 1;
		$id(cal.container + 'TitleCenter').innerHTML = generateTitleMonth(cal.currentIdx, cal.currentYear, cal.currentMonth, cal);
		
		var itemNum    = direct ? ((Math.abs(distance) - 1) % 3 < 0 ? 2 : (Math.abs(distance) - 1) % 3) : (Math.abs(distance) + 1) % 3;
		var applyYear  = new Date(cal.currentYear, direct ? cal.currentMonth - 1 : cal.currentMonth + 1).getFullYear();
		var applyMonth = new Date(cal.currentYear, direct ? cal.currentMonth - 1 : cal.currentMonth + 1).getMonth();
		
		cal.box.querySelectorAll('.calendar-item.calendar-item' + itemNum).forEach(function (obj) {
			obj.innerHTML = generateItemBodyDom(cal.currentYear, direct ? cal.currentMonth - 1 : cal.currentMonth + 1, cal);
			obj.setAttribute('data-year', applyYear);
			obj.setAttribute('data-month', applyMonth + 1);
		});
		
		cal.switchRender(applyYear, applyMonth, cal);
	}
	
	function touchStart(event, cal) {
		$id('calendar-block-' + cal.container).classList.remove('calendar-block-mask-transition');
		cal.start.X    = event.touches[0].clientX;
		cal.start.Y    = event.touches[0].clientY;
		cal.start.time = new Date().getTime();
		infinitePosition(cal);
	}
	
	function touchMove(event, cal) {
		cal.move.Y = event.touches[0].clientY;
		var offset = (cal.move.X - cal.start.X).toFixed(2);
		
		cal.move.increaseX = cal.move.isFirst ? event.touches[0].clientX - cal.start.X : cal.move.X - cal.start.X;
		cal.move.increaseY = Math.abs(cal.move.Y - cal.start.Y);
		cal.move.S += cal.move.increaseX * cal.move.increaseY;
		cal.move.standardS += cal.move.increaseX * cal.move.increaseX * cal.move.standard;
		cal.move.X         = event.touches[0].clientX;
		cal.move.isFirst = false;
		
		if (Math.abs(cal.move.S) >= Math.abs(cal.move.standardS) && !cal.isMask) {
			doc.body.removeEventListener('touchmove', cal.prevent, true);
			transformFormat(cal.box, cal.distance, .3);
		} else {
			doc.body.addEventListener('touchmove', cal.prevent, true);
			if (cal.canViewDisabled) {
				cal.isRangeChecked = false;
				var movedis        = cal.distance + (offset - 0);
				transformFormat(cal.box, movedis);
			} else if (offset < 0 && new Date(cal.currentYear, cal.currentMonth + 1).getTime() >= new Date(cal.endTime[0], cal.endTime[1]).getTime()) {
				// 右滑到了临界点,
				cal.isRangeChecked = true;
				if (cal.isToggleBtn) $id(cal.container + 'CalendarTitleRight').style.display = 'none';
			} else if (offset > 0 && new Date(cal.currentYear, cal.currentMonth - 1).getTime() <= new Date(cal.beginTime[0], cal.beginTime[1] - 2).getTime()) {
				// 左滑到了零界点
				cal.isRangeChecked = true;
				if (cal.isToggleBtn) $id(cal.container + 'CalendarTitleLeft').style.display = 'none';
			} else {
				cal.isRangeChecked = false;
				var movedis        = cal.distance + (offset - 0);
				transformFormat(cal.box, movedis);
			}
		}
	}
	
	function touchEnd(event, cal) {
		cal.end.X    = event.changedTouches[0].clientX;
		cal.end.time = new Date().getTime();
		var tempDis  = (cal.end.X - cal.start.X).toFixed(2);
		if (cal.end.time - cal.start.time < 200 && Math.abs(tempDis) < 10) {
			if (event.target.matches('li') && event.target.className !== 'calendar-disabled' || event.target.matches('i') && event.target.parentNode.className !== 'calendar-disabled') {
				var dataStamp = event.target.getAttribute('data-stamp');
				if (cal.resultArr.length === 0) cal.resultArr.push(dataStamp);
				else if (cal.resultArr.length === 1) cal.resultArr[0] < dataStamp ? cal.resultArr.push(dataStamp) : cal.resultArr.unshift(dataStamp);
				else {
					cal.resultArr.length = 0;
					cal.resultArr.push(dataStamp);
				}
				cal.success(dataStamp, cal.resultArr, cal);
			}
			transformFormat(cal.box, cal.distance, 0.5);
		} else if (Math.abs(cal.move.S) >= Math.abs(cal.move.standardS) && !cal.isMask) {
		} else if (!cal.isRangeChecked) {
			var enddis = cal.distance + (tempDis - 0);
			enddis     = (cal.end.X * 2 >= cal.width && Math.abs(tempDis) * 5 >= cal.width) ?
				Math.ceil(enddis / cal.width) : Math.floor(enddis / cal.width);
			transformFormat(cal.box, enddis * cal.width, 0.5);
			if (cal.distance !== enddis * cal.width) {
				switchItemBody(tempDis > 0, enddis, cal);
			}
			cal.distance = enddis * cal.width;
			checkRange(cal.currentYear, cal.currentMonth, cal);
		}
		cal.move.X = cal.move.Y = cal.move.S = cal.move.standardS = 0;
		cal.move.isFirst = true;
		doc.body.removeEventListener('touchmove', cal.prevent, true);
	}
	
	function touch(event, cal) {
		event = event || window.event;
		switch (event.type) {
			case "touchstart":
				touchStart(event, cal);
				break;
			case "touchend":
				touchEnd(event, cal);
				break;
			case "touchmove":
				touchMove(event, cal);
				break;
		}
	}
	
	function Calendar(config) {
		this.clickTarget     = config.clickTarget || '';
		this.container       = config.container;
		this.angle           = config.angle || 14;
		this.isMask          = config.isMask || false;
		this.beginTime       = config.beginTime;
		this.endTime         = config.endTime;
		this.recentTime      = config.recentTime;
		this.isSundayFirst   = config.isSundayFirst || false;
		this.isShowNeighbor  = config.isShowNeighbor || false;
		this.isToggleBtn     = config.isToggleBtn || false;
		this.isChinese       = config.isChinese || true;
		this.monthType       = config.monthType || 0;
		this.canViewDisabled = config.canViewDisabled || false;
		this.beforeRenderArr = config.beforeRenderArr || [];
		this.success         = config.success;
		this.switchRender    = config.switchRender;
		
		this.box          = null;
		this.currentIdx   = 2;
		this.currentYear  = new Date().getFullYear();
		this.currentMonth = new Date().getMonth();
		
		this.width    = doc.body.offsetWidth;
		this.distance = 0;
		
		this.beginStamp     = 0;
		this.endStamp       = 0;
		this.recentStamp    = 0;
		this.isRangeChecked = false;
		this.resultArr      = [];
		
		this.start = {
			X: 0,
			Y: 0,
			time: 0
		};
		this.move  = {
			X: 0,
			Y: 0,
			increaseX: 0,
			increaseY: 0,
			isFirst: true,
			S: 0,
			standard: Math.tan(this.angle / 180 * Math.PI),
			standardS: 0
		};
		this.end   = {
			X: 0,
			Y: 0,
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
			var html  = '';
			if (!checkTime(_this)) return;
			_this.currentYear  = _this.recentTime[0];
			_this.currentMonth = _this.recentTime[1] - 1;
			
			html += _this.isMask ? '<div class="calendar-bg" id="calendar-bg-' + _this.container + '">' : '';
			
			html += '<div class="calendar-block' + (_this.isMask ? ' calendar-block-mask' : '') + '" id="calendar-block-' + _this.container + '">' +
				'<div class="calendar-title">';
			
			html += _this.isToggleBtn ? '<span id="' + _this.container + 'CalendarTitleLeft" class="calendar-title-left">&#xe64f;</span>' +
			'<span id="' + _this.container + 'CalendarTitleRight" class="calendar-title-right">&#xe64e;</span>' : '';
			
			html += '<b id="' + _this.container + 'TitleCenter"></b></div>' +
				' <div id="' + _this.container + 'Box" class="calendar-box">' +
				'<div class="calendar-item calendar-item0"' +
				' data-year="' + new Date(_this.currentYear, _this.currentMonth + 1).getFullYear() + '"' +
				' data-month="' + (new Date(_this.currentYear, _this.currentMonth + 1).getMonth() + 1) + '">' +
				generateItemBodyDom(_this.currentYear, _this.currentMonth + 1, _this) + '</div>' +
				'<div class="calendar-item calendar-item1"' +
				' data-year="' + new Date(_this.currentYear, _this.currentMonth - 1).getFullYear() + '"' +
				' data-month="' + (new Date(_this.currentYear, _this.currentMonth - 1).getMonth() + 1) + '">' +
				generateItemBodyDom(_this.currentYear, _this.currentMonth - 1, _this) + '</div>' +
				'<div class="calendar-item calendar-item2"' +
				' data-year="' + new Date(_this.currentYear, _this.currentMonth).getFullYear() + '"' +
				' data-month="' + (new Date(_this.currentYear, _this.currentMonth).getMonth() + 1) + '">' +
				generateItemBodyDom(_this.currentYear, _this.currentMonth, _this) + '</div>' +
				'<div class="calendar-item calendar-item0"' +
				' data-year="' + new Date(_this.currentYear, _this.currentMonth + 1).getFullYear() + '"' +
				' data-month="' + (new Date(_this.currentYear, _this.currentMonth + 1).getMonth() + 1) + '">' +
				generateItemBodyDom(_this.currentYear, _this.currentMonth + 1, _this) + '</div>' +
				'<div class="calendar-item calendar-item1"' +
				' data-year="' + new Date(_this.currentYear, _this.currentMonth - 1).getFullYear() + '"' +
				' data-month="' + (new Date(_this.currentYear, _this.currentMonth - 1).getMonth() + 1) + '">' +
				generateItemBodyDom(_this.currentYear, _this.currentMonth - 1, _this) + '</div>' +
				' </div></div>';
			
			html += _this.isMask ? '</div>' : '';
			
			$id(_this.container).innerHTML = html;
			_this.box                      = $id(_this.container + 'Box');
			_this.renderCallbackArr(_this.beforeRenderArr);
		},
		initReady: function () {
			this.box.style.transform                      = 'translate3d(-' + this.currentIdx * this.width + 'px, 0 , 0)';
			this.box.style.webkitTransform                = 'translate3d(-' + this.currentIdx * this.width + 'px, 0 , 0)';
			this.box.style.transitionDuration             = '0s';
			this.box.style.webkitTransitionDuration       = '0s';
			this.distance                                 = -this.currentIdx * this.width;
			$id(this.container + 'TitleCenter').innerHTML = generateTitleMonth(this.currentIdx, this.currentYear, this.currentMonth, this);
			checkRange(this.currentYear, this.currentMonth, this);
		},
		initBinding: function () {
			var _this = this;
			if (_this.isMask) {
				var bg    = $id('calendar-bg-' + _this.container);
				var block = $id('calendar-block-' + _this.container);
				var body  = doc.body;
				on('touchstart', _this.clickTarget, function () {
					bg.classList.add('calendar-bg-up', 'calendar-bg-delay');
					block.classList.add('calendar-block-mask-up', 'calendar-block-mask-transition', 'calendar-block-action-none');
					body.classList.add('calendar-locked');
					body.addEventListener('touchmove', _this.prevent);
				}, false);
				
				on('touchstart', 'calendar-bg-' + _this.container, function () {
					bg.classList.remove('calendar-bg-up');
					block.classList.remove('calendar-block-mask-up', 'calendar-block-action-none');
					body.classList.remove('calendar-locked');
					setTimeout(function () {
						bg.classList.remove('calendar-bg-delay');
					}, 300);
					body.removeEventListener('touchmove', _this.prevent);
				}, false);
			}
			this.box.addEventListener('touchstart', function (e) {
				touch(e, _this);
			}, false);
			this.box.addEventListener('touchmove', function (e) {
				touch(e, _this);
			}, false);
			this.box.addEventListener('touchend', function (e) {
				touch(e, _this);
			}, true);
			if (_this.isToggleBtn) {
				on('touchstart', _this.container + 'CalendarTitleLeft', function () {
					infinitePosition(_this);
					setTimeout(function () {
						_this.distance = _this.distance + _this.width;
						transformFormat(_this.box, _this.distance, .3);
						switchItemBody(true, _this.distance / _this.width, _this);
						checkRange(_this.currentYear, _this.currentMonth, _this);
					}, 100);
					
				});
				on('touchstart', _this.container + 'CalendarTitleRight', function () {
					infinitePosition(_this);
					setTimeout(function () {
						_this.distance = _this.distance - _this.width;
						transformFormat(_this.box, _this.distance, .3);
						switchItemBody(false, _this.distance / _this.width, _this);
						checkRange(_this.currentYear, _this.currentMonth, _this);
					}, 100);
				});
			}
		},
		renderCallbackArr: function (arr) {
			var _this = this;
			loop(0, arr.length, function (k) {
				if (!$class(_this.container + '-item-' + arr[k].stamp)[0]) {
					console.error(_this.container + '-item-' + arr[k].stamp + ' 不在范围内,请检查你的时间戳');
					return true;
				}
				loop(0, $class(_this.container + '-item-' + arr[k].stamp).length, function (j) {
					$class(_this.container + '-item-' + arr[k].stamp)[j].classList.add(arr[k].className);
				})
			})
		},
		prevent: function (e) {
			e.preventDefault();
		},
		hideBackground: function () {
			if (!this.isMask) return;
			var _this = this;
			var bg    = $id('calendar-bg-' + _this.container);
			var block = $id('calendar-block-' + _this.container);
			var body  = doc.body;
			bg.classList.remove('calendar-bg-up');
			block.classList.remove('calendar-block-mask-up', 'calendar-block-action-none');
			body.classList.remove('calendar-locked');
			setTimeout(function () {
				bg.classList.remove('calendar-bg-delay');
			}, 300);
			body.removeEventListener('touchmove', _this.prevent);
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
