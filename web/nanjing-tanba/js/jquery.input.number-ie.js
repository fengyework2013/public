/*
 * 只能输入正整数,不能有小数点
 *
 */
onlyIntegerKeyUp = function(e) {
	if(e === undefined) {
		e = window.event;
	}
	var obj = e.srcElement ? e.srcElement : e.target;
	var pattern = /[^\d]/ig;
	var val = obj.value;
	if(pattern.test(val)) {
		var i = getCursortPosition(e);
		obj.value = val.replace(pattern, '');
		setCaretPosition(e, i);
	}
};
/************************************************
 * 获取光标位置
 *
 * @param ctrl
 * @returns {Number}
 */
getCursortPosition = function(event) { // 获取光标位置函数
	if(event === undefined || event === null) {
		event = arguments.callee.caller.arguments[0] || window.event;
	}
	var obj = event.srcElement ? event.srcElement : event.target;
	var CaretPos = 0; // IE Support
	if(document.selection) {
		obj.focus();
		var Sel = document.selection.createRange();
		Sel.moveStart('character', -obj.value.length);
		CaretPos = Sel.text.length;
	} else if(obj.selectionStart || obj.selectionStart == '0') {
		// Firefox support
		CaretPos = obj.selectionStart;
	}

	return(CaretPos);
};

/**********************************************
 * 设置光标位置
 *
 * @param ctrl
 * @returns {Number}
 */
setCaretPosition = function(event, pos) { // 设置光标位置函数
	if(event === undefined || event === null) {
		event = arguments.callee.caller.arguments[0] || window.event;
	}
	var obj = event.srcElement ? event.srcElement : event.target;
	if(pos > 0) {
		pos = pos - 1; //因为把不匹配的字符删除之后,光标会往后移动一个位置
	}
	if(obj.setSelectionRange) {
		obj.focus();
		obj.setSelectionRange(pos, pos);
	} else if(obj.createTextRange) {
		var range = obj.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
};
/***
 * [0-9]<br>
 *     12:ok;1.2:error
 * @param event
 * @returns {boolean}
 */
onlyIntegerKeyPress = function onlyIntegerKeyPress(event) {
	event = event || window.event || arguments.callee.caller.arguments[0];
	//console.log(event);
	var charCode2;
	if('charCode' in event) { //IE7 and IE8 no charCode
		charCode2 = event.charCode;
	} else {
		//console.log('no charCode');
		charCode2 = event.keyCode;
	}
	//console.log(charCode2);
	if(event.keyCode === 8 /*back*/ || event.keyCode === 13 /*Enter*/ || event.keyCode === 9 /*Tab*/ || event.keyCode === 37 /*<- */ || event.keyCode === 39 /* ->*/ ) {
		return true;
	} else if(charCode2 < 48 || charCode2 > 57) { /*0-9*/
		event.returnValue = false;
		return false;
	} else {
		return true;
	}
};