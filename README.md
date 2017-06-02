# Calendar - A  Flexible Calendar for Mobile
## **Intro**
Calendar was born for `several product requirements` in the mobile.  It’s free, cute and customized.  

The Calendar was builded by **protogenic JavaScript**. So you can use it with jQuery，Vue, React, and so on.

>  中文文档在后面~

![gif0.](https://github.com/AppianZ/calendar/blob/master/calendar.gif) 


## Special Feature

- [x] User-defined time ranges. You can set any date with the precision of a date
- [x] Two kinds of layout --  “Popup Layout” & “Normal Layout” 
- [x] User-defined “Chinese or English,  "the Sequence of Sunday" and "Switch button display"
- [x] Controll the style of every day
- [x] Choose "a time point" or "a time range"
- [x] Controll the sensibility of user touches

Look at a demo：⬇️⬇️⬇️

## Demo & NPM
* [Calendar Demo](https://appianz.github.io/calendar/index.html)
* [Calendar NPM](https://www.npmjs.com/package/mob-calendar)

## How To Use
**1. html中：**
```html
<body>
    <!-- You'll need  it in "Popup Layout".  The #target can be any other dom for your convenient-->
    <div id="target">Click me!Click me!Click me!</div>
    <!-- The #container must be the outermost dom below body --> 
    <div id="container"></div>
</body>
```

**2. js中：**
```js
// mode 1
<script src="calendar.js"></script>
// mode 2
import Calendar from 'mob-calendar';
```


```js
<script> 
    new Calendar({
		clickTarget: 'target',
		container: 'container',
		angle: 0,
		isMask: true, 
		beginTime: [2017, 1, 1],
		endTime: [2018, 1, 13],
		recentTime: [2018, 1, 2],
		isSundayFirst: true, 
		isShowNeighbor: true, 
		isToggleBtn: true, 
		isChinese: true,
		monthType: 3, 
		canViewDisabled: false, 
		beforeRenderArr: [{
			stamp: 1512057600000,
			className: 'able',
		}],
		success: function (item, arr, cal) {
			console.log(item, arr);
			cal.hideBackground();
		},
		switchRender: function (year, month, cal) {
			var data = [{
				'stamp': 1507737600000,
				'className': 'able1',
			}];
			cal.renderCallbackArr(data);
		}
	});
</script>
```

How to generate a new instance，look at the arguments list：⬇️⬇️⬇️

## Arguments List

|Name|Mean|Type|Value|Must|
|:---:|:---:|:---:|:---:|:---:|
|clickTarget | the id of the dom you touch | {String}| - | × |
|container| the id of the container you ready to append dom| {String}| - | √ |
|angle| fix the sensibility of user touches by angle | {Number}|  had better set it between  **5** and **20** | × |
|isMask| set layout | {Boolean} | true:“**popup layout**”, false:“**normal layout**”  | √ |
|beginTime| user-defined begin time points.  | {Array(Number)} |an empty array means` [1970, 1, 1]`. every position sequent meas “**year**”, "**month**" and "**date**".  | √ |
|endTime| user-defined end time points. | {Array(Number)}| the same to beginTime. an empty array means `[nextYear, 12, 31] `| √ |
|recentTime| user-defined current time points. | {Array(Number)} | the same to beginTime. an empty array means `[currentYear, currentMonth, 1]`  | √ |
|isSundayFirst| the Sequence of Sunday | {Boolean}| true:Sunday at the **first** column, false:Sunday at the **last** column | √ |
|isShowNeighbor| controll the display of the adjacent months| {Boolean} |true: show the adjacent months, false: hide the adjacent months | √ |
|isToggleBtn| controll the display of the switch button| {Boolean}| true:show the switch button, false:hide the switch button| √ |
|isChinese| controll the language of week |  {Boolean} |true:show Chinese week like ‘六’，false: show English week like ‘S’ | √ |
|monthType| controll the type of month  | {Number 0-3}| 0: 1月, 1:一月, 2:Jan, 3: January | √ |
|canViewDisabled| controll the display of the out-range months |  {Boolean} |true: show the out-range months，false:hide the out-range months| √ |
|beforeRenderArr| rend the style of the specified date |   {unordered Array(Object)} | every item of this array has two arguments:  the specified date  `stamp{Number}` & the specified classname `className {String}`, see below for details | √ |
|success| the callback of  tap events|   {Fuction(item, array,cal)}| there are 3 arguments，`item`: the time stamp of the target，`array` :the two targets after two tap events ,`cal` : the instance| √ |
|switchRender| the callback of  switch events |   {Fuction(year, month, cal)} |  there are 3 arguments，`year` : the generating year，`month`: the generating month (from zero), `cal` : the instance| √ |

**js中：**
```js
// the JSON example of the beforeRenderArr
beforeRenderArr: [{
	stamp: 1512057600000, // the specified date
	className: 'disable', // the specified classname map the STAMP
}]
```

**html中：**
```html
<!--  'li'  is a rectangle，'i'  is a circular -->
<li class="container-item-1512057600000 disable" data-stamp="1512057600000">
    <i data-stamp="1512057600000">2</i>
</li>
```

|Proptype Function|Effection|Example|
|:---:|:----:|:---:|
|renderCallbackArr| render an arry `data` for rending  the specified style map the specified date.  the data JSON is same to `beforeRenderArr`|cal.**renderCallbackArr(data)**|
|prevent|prevent default events.|cal.**prevent()**|
|hideBackground| in "popup layout"，this function will help you to hide the popup.|cal.**hideBackground()**|

## **Logs**
### 2017.5.8(add)
> * New Project -- Calendar,  First Publish .

## **Authors**
>  For questions and issues please use  [THIS WAY](https://github.com/AppianZ/calendar/issues/new)

>  I am Appian. 


---

# Calendar - 用户自定义日历
## **Calendar - 自我介绍**
Calendar是为了满足移动端对`各种场景`的需求而生的，兼容性强，灵活度高。

原生插件，可以与任何框架配合使用。

## 特色功能

- [x] 限制时间范围，精确到【日期】
- [x] 有【直接布局】和【弹层显示】两种不同调用样式
- [x] 自由设置【月份和星期的中英文显示】、【星期天的排序位置】和【切换操作】
- [x] 利用回调控制【每一个日期】的不同样式
- [x] 可以【选中】时间点，或【时间范围】
- [x] 可以根据实际需要，【调整预判手势的灵敏度】

亲自体验一下demo：⬇️⬇️⬇️

## Demo & NPM
* [Calendar Demo](https://appianz.github.io/calendar/index.html)
* [Calendar NPM](https://www.npmjs.com/package/mob-calendar)

## How To Use
**1. html中：**
```html
<body>
    <!-- 在弹层模式中会需要一个元素触发弹层，target 可以是任意html标签。-->
    <div id="target">我是一个点击区域,大家快来点我</div>
    <!-- 插入日历的容器 --> 
    <div id="container"></div>
</body>
```

**2. js中：**
```js
// 方式一, 直接引用
<script src="calendar.js"></script>
// 方式二, 引入npm包
import Calendar from 'mob-calendar';
```


```js
<script> 
	// 实例化一个日历插件，具体参数意义可以看下文中的参数列表
    new Calendar({
		clickTarget: 'target',
		container: 'container',
		angle: 0,
		isMask: true, // 是否需要弹层
		beginTime: [2017, 1, 1],//如空数组默认设置成1970年1月1日开始,数组的每一位分别是年月日。
		endTime: [2018, 1, 13],//如空数组默认设置成次年12月31日,数组的每一位分别是年月日。
		recentTime: [2018, 1, 2],//如空数组默认设置成当月1日,数组的每一位分别是年月日。
		isSundayFirst: true, // 周日是否要放在第一列
		isShowNeighbor: true, // 是否展示相邻月份的月尾和月头
		isToggleBtn: true, // 是否展示左右切换按钮
		isChinese: true, // 是否是中文
		monthType: 3, // 0:1月, 1:一月, 2:Jan, 3: April
		canViewDisabled: false, // 是否可以阅读不在范围内的月份
		beforeRenderArr: [{
			stamp: 1512057600000,
			className: 'able',
		}],
		success: function (item, arr, cal) {
			console.log(item, arr);
			cal.hideBackground();
		},
		switchRender: function (year, month, cal) {
			console.log('计算机识别的 - 年份: ' + year + ' 月份: ' + month);
			var data = [{
				'stamp': 1507737600000,
				'className': 'able1',
			}];
			cal.renderCallbackArr(data);
		}
	});
</script>
```

如何正确生成实例，请看参数列表：⬇️⬇️⬇️

## 参数列表

|参数名称|作用|类型|取值|是否必须|
|:---:|:---:|:---:|:---:|:---:|
|clickTarget| 触发弹层的dom元素ID| {String} | - | × |
|container| 日历容器的dom元素ID| {String} | - |√ |
|angle| 调整预判手势的灵敏度 | {Number} | 建议5-20 | × |
|isMask| 布局是否使用弹层样式 | {Boolean} | true:弹层显示, false:正常布局  | √ |
|beginTime|开始时间点| {Array(Number)} |数组的每一位分别是年月日，空数组默认1970年1月1日 | √ |
|endTime|结束时间点 | {Array(Number)} |数组的每一位分别是年月日，空数组默认次年12月31日 | √ |
|recentTime| 当前时间点 | {Array(Number)} |数组的每一位分别是年月日，空数组默认当前月1日 | √ |
|isSundayFirst| 星期天是否要放在第一列 | {Boolean} |true:星期日在第一列, false:星期日在最后一列 | √ |
|isShowNeighbor| 是否展示相邻月份的月尾和月头 | {Boolean} |true:显示相邻月份的月尾和月头, false:不显示 | √ |
|isToggleBtn| 是否展示左右切换按钮 | {Boolean}| true:显示左右切换按钮， false:不显示| √ |
|isChinese| 是否展示中文星期 |  {Boolean} |true:显示中文星期简写，false:显示英文星期简写 | √ |
|monthType| 月份的展示字符 | {Number 0-3} |0:1月, 1:一月, 2:Jan, 3: January | √ |
|canViewDisabled| 是否可以阅读不在范围内的月份 |  {Boolean}| true:无限滑动，false:只查看时间范围内的月份| √ |
|beforeRenderArr| 初次渲染时给特殊日期指定样式 |   {无序Array(Object)}| 数组元素有两个参数 `指定时间戳stamp{Number}` 和 `指定样式名字className {String}`，详见下文| √ |
|success| 点击某个日期的回调 |   {Fuction(item, array,cal)} |返回3个自带参数，`item`表示当前点击的时间戳，`array`表示连续两次点击的两个时间戳,`cal` 指向实例| √ |
|switchRender| 日历切换后的回调 |   {Fuction(year, month, cal)} |返回3个自带参数，`year`表示新生成的年份，`month`表示新生成的月份(从0开始), `cal` 指向实例| √ |

**js中：**
```js
// 渲染时给特殊日期指定样式的数据格式
beforeRenderArr: [{
	stamp: 1512057600000, // 指定某个时间戳
	className: 'disable', //指定该时间戳渲染的样式
}]
```

**html中：**
```html
// 渲染后的效果如下
// li 是一个矩形，i 是圆形
<li class="container-item-1512057600000 disable" data-stamp="1512057600000">
    <i data-stamp="1512057600000">2</i>
</li>
```

|原型链暴露的函数|作用|示例|
|:---:|:----:|:---:|
|renderCallbackArr|渲染传入的**数组data**，用于指定特定日期的特定样式, **数组data**和 `beforeRenderArr` 的数据格式一致|cal.**renderCallbackArr(data)**|
|prevent|方便在回调中阻止默认事件|cal.**prevent()**|
|hideBackground|在弹窗模式中，可能需要用到的隐藏弹层的函数|cal.**hideBackground()**|

## **Logs**
### 2017.5.8(add)
> * 正式发布第一版日历

## **Authors**
>  如果你遇到了什么神bug，请发起[ISSUE](https://github.com/AppianZ/calendar/issues/new)联系我 ~
>
>  很快,我会就日历的开发过程写一篇详细解说,尽请期待
>
>  我是嘉宝Appian，一个卖萌出家的算法妹纸。