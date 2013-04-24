(function($){
//$.fn
$.fn.extend({
	/*******************************************************************************************************
	*	baiing View : $().cgCommonText()	输入框，浏览器不支持placeholder模拟placeholder效果
	*	@param [options:fontClass]	 模拟placeholder的字体颜色样式
	*	@param [options:focusParent]	 改变text获得焦点时的样式 取dom的data-focus属性值
	********************************************************************************************************/
	cgCommonText : function(options){
		var option = {
			fontClass : "font-ccc",
			focusParent : ""
		};
		$.extend(option, options);
		var _support = (function() {
	        return 'placeholder' in document.createElement('input');
	    })();
	    return this.each(function(){
	    	var $text = $(this),
	    		focusClass = "";
	    	if ( option.focusParent != "" ) {
				focusClass = $(this).closest(option.focusParent).attr("data-focus");
			} else{
				focusClass = $(this).attr("data-focus");
			}
		    if ( !_support ) {
		    	var _strText = $text.attr("placeholder"),
		    		$clone = $("<input type='text' />");
		    	if ( !$text.is(":password") ) {
		    		if ( $text.val() == "" ) {
		    			$text.addClass(option.fontClass).val(_strText);
		    		}else if ( $text.val() == _strText ) {
						$text.addClass(option.fontClass)
		    		}
		    		$text.focus(function(){
		    			if ( $.trim( $text.val() ) == _strText ) {
		    				$text.removeClass(option.fontClass).val("");
		    			}else{
		    				$text.select();
		    			}
		    		}).blur(function(){
		    			if ( $.trim( $text.val() ) == "" ) {
		    				$text.addClass(option.fontClass).val(_strText);
		    			}
		    		});
		    	}
		    	// not input:password
		    	else{
		    		if ( $text.val() == "" ) {
		    			$text.hide().after($clone);
			    		$clone.attr("class", $text.attr("class")).addClass(option.fontClass).val(_strText);
		    		}
		    		$clone.focus(function(){
		    			$clone.hide();
		    			$text.show().focus();
		    		});
		    		$text.blur(function(){
		    			if ( $.trim( $text.val() ) == "" ) {
		    				$clone.show();
		    				$text.hide();
		    			}
		    		});
		    	}
		    }
		    $text.focus(function(){
				if ( option.focusParent != "" ) {
					$text.closest(option.focusParent).addClass(focusClass);
				}else{
					$text.addClass(focusClass);
				}
			}).blur(function(){
				if ( option.focusParent != "" ) {
					$text.closest(option.focusParent).removeClass(focusClass);
				}else{
					$text.removeClass(focusClass);
				}
			});
	    });
	}
});

//$
/*******************************************************************************************************
*	baiing View : $.getFromTemplate()	替换模板
*	@param [options:template($dom)]		template jquery dom 
*	@param [options:model(obj)]			{ name : value }	  
********************************************************************************************************/
$.getFromTemplate = function( template, model ){
	// Get the raw HTML from the template.
	var templateData = template.html();
	// Replace any data place holders with model data.
	templateData = templateData.replace(
		new RegExp( "\\#\\{([^\\}]+)\\}", "gi" ),
		function( $0, $1 ){
			// Check to see if the place holder corresponds to a model property.
			// If it does, replace it in.
			if ($1 in model){
				// Replace with model property.
				return( model[ $1 ] );
			} else {
				// Model property not found - just return what was already there.
				return( $0 )
			}
		}
	);

	// Create the new node, store the model data internall, and return 
	// the new node.
	return( $( templateData ).data( "model", model ) );
};
/*******************************************************************************************************
*	baiing View : $.cgTag()	选项卡点击型
*	@param [options:tagList(jquery dom)]		tag list's jquery dom	 
*	@param [options:tagItem(dom)]				tag list's child dom class	 
*	@param [options:conList(jquery dom)]		con list's jquery dom 	 
*	@param [options:conItem(dom)]				con list's child dom class	 
*	@param [options:curClass(class)]			tag cur class	 
*	@param [options:callback(function)]			callback function	 
********************************************************************************************************/
$.cgTag = function(options){
	var option = $.extend({
			tagList : $(".tag-list"),
			tagItem : ".tag",
			conList: $(".con-list"),
			conItem: ".con",
			curClass : "",
			callback : null
		}, options);
	option.tagList.on("click", option.tagItem, function(){
		var $this = $(this),
			nIndex = $this.index();
		if ( !$this.hasClass(option.curClass) ) {
			option.tagList.find(option.tagItem).removeClass(option.curClass);
			$this.addClass(option.curClass);
			option.conList.children().hide().eq(nIndex).show();
			if ( typeof(option.callback) == "function" ) {
				option.callback(option);
			}
		}
	});
};
/*******************************************************************************************************
*	baiing View : $.cgAllSelect()	checkbox all select
*	@param [options:wrap($obj)]							wrap's jquery dom
*	@param [options:main(dom's class)]					all select checkbox	 
*	@param [options:items(dom's class)]					checkboxs 
*	@param [options:on(function){checked dom}]			checked function 
*	@param [options:off(function){unchecked dom}]		unchecked function 
********************************************************************************************************/
$.cgAllSelect = function( options ) {
	var option = $.extend({
			wrap : $(".wrap"),
			main : ".main",
			items : ".items",
			on : null,
			off : null
		}, options);
	// console.log(option);
	// bind if main checked all items checked or not
	option.wrap.on("change", option.main, function(){
		// console.log("do js success!!");
		var $this = $(this);
		if ( $this.prop("checked") ) {
			option.wrap.find(option.items).prop("checked", true);
			if( typeof(option.on) == "function" ){
				option.on(option.wrap.find(option.items));
			}
		} else{
			option.wrap.find(option.items).prop("checked", false);
			if( typeof(option.off) == "function" ){
				option.off(option.wrap.find(option.items));
			}
		}
	});
	// bind if items all checked main checked or not
	option.wrap.on("change", option.items, function(){
		// console.log("do js success!!");
		var $this = $(this);
		if ( $this.prop("checked") ) {
			if ( option.wrap.find(option.items).not(":checked").length ) {
				option.wrap.find(option.main).prop("checked", false);
			} else{
				option.wrap.find(option.main).prop("checked", true);
			}
			if( typeof(option.on) == "function" ){
				option.on($this);
			}
		} else{
			option.wrap.find(option.main).prop("checked", false);
			if( typeof(option.off) == "function" ){
				option.off($this);
			}
		}
	});
};
/*******************************************************************************************************
*	baiing View : $.cgTree()	level tree
*	@param [options:wrap($obj)]							wrap's jquery dom
*	@param [options:main(dom's class)]					all select checkbox	 
*	@param [options:items(dom's class)]					checkboxs 
*	@param [options:on(function){checked dom}]			checked function 
*	@param [options:off(function){unchecked dom}]		unchecked function 
********************************************************************************************************/
$.cgTree = function( options ) {
	var option = $.extend({
			wrap : $(".tree-list"),
			treeData : [],
			nodeFun : null,
			writeFun : null,
			callback : null
		}, options);
	// console.log(option.treeData);
	$.extend(option, {
		addItem : function(data){
			// console.log(data);
			data.padding = data.lv * 20;
			var $li = $.getFromTemplate( $("#Js-cgTree-item-template"), data ); 
			option.wrap.append( $li );
			return $li;
		}
	});
	var arrMain = [], arrRemove = [], parseData = [];
	var _getChildren = function(parent){
		var nodeList = [];
		// console.log( option.treeData );
		$.each(option.treeData, function(index, items){
			if ( items != undefined ) {
				if( parent.id == items.pId ){
					items.lv = Math.floor(parent.lv) + 1;
					nodeList.push(items);
					arrRemove.push(index);
				}
			}
		});
		_parseArr();
		if (nodeList.length) {
			parent.hasChild = true;
		}else{
			parent.hasChild = false;
		}
		return { parent : parent, nodeList : nodeList };
	};
	var _parseArr = function(){
		if (arrRemove) {
			for( var i = 0; i < arrRemove.length; i++ ){
				option.treeData.splice(arrRemove[i] - i, 1);
			}
		}
		arrRemove = [];
	};
	var _doAllData = function(parent){
		var arrList = _getChildren(parent);
		parent = arrList.parent;
		var arrChildren = arrList.nodeList;
		parent.status = parent.hasChild ? "off" : "last";
		var $parent = option.addItem(parent);
		if (parent.hasChild) {
			$.each(arrChildren, function(i, child){
				_doAllData(child);
			});
		}else{
			$parent.append("<em class='Js-tree-write' data-id='" + parent.id + "'><a href='" + parent.link + "'>采编</a></em>")
		}
	};
	$.each(option.treeData, function(index, item){
		if(item.open != undefined && item.open ){
			item.lv = 0;
			arrMain.push(item);
			arrRemove.push(index);
		}
	});
	_parseArr();
	// console.log(arrMain);
	$.each(arrMain, function(index, item){
		_doAllData(item);
	});
	// bind click fun
	// option.wrap.on("click", ".Js-tree-link", function(event){
	// 	if ( typeof(option.nodeFun) == "function" ) {
	// 		option.nodeFun($(this));
	// 	}
	// });
	option.wrap.on("click", ".Js-tree-item", function(event){
		if ( !$(event.target).hasClass("Js-tree-link") && !$(event.target).hasClass("Js-tree-write")  ) {
			var $this = $(this),
				lv = $this.attr("data-lv");
			if ( $this.hasClass("on") ) {
				$this.nextUntil("[data-lv=" + lv + "]").filter("[data-lv='" + (Math.floor(lv) + 1) + "']").show();
				$this.nextUntil("[data-lv=" + lv + "]").filter(".off").removeClass("off").addClass("on");
				$this.removeClass("on").addClass("off");
			}else if($this.hasClass("off")){
				$this.nextUntil("[data-lv=" + lv + "]").each(function(){
					if ( Math.floor($(this).attr("data-lv")) > lv ) {
						$(this).hide();
					}
				});
				$this.removeClass("off").addClass("on");
			}
		}else if ( $(event.target).hasClass("Js-tree-link") ){
			if ( typeof(option.nodeFun) == "function" ) {
				option.nodeFun($(this));
			}
		}else if ( $(event.target).hasClass("Js-tree-write") ){
			if ( typeof(option.writeFun) == "function" ) {
				option.writeFun($(this));
			}
		}
	});
	if ( typeof(option.callback) == "function" ) {
		option.callback();
	}

};
/*******************************************************************************************************
*	baiing View : $.cgConfirm()	弹出框
*	@param [options:title(str)]			title text	 
*	@param [options:message(str)]		message text	 
*	@param [options:doneBtn(obj)]		fun : "btn function" 	 
*	@param [options:cancelBtn(obj)]		has : "is has cancel button" 	 
*	@param [options:cancelBtn(obj)]		fun : "btn function" 	 
*	@param [options:isLayer(bool)]		if true, add mask layer	 
********************************************************************************************************/
$.cgConfirm = function( options ) {
	var option = $.extend({
			title: "提示",
			message: "",
			doneBtn: {
				fun: function( events ){
					// alert("OK");
				}
			},
			cancelBtn: {
				has : false,
				fun : function( events ) {
					// alert("Cancel");
				}
			},
			isLayer : true
		}, options),
		$popup = $('<div class="module-popup">'+
				  '<div class="popup-wrap fn-clear Js-popup-wrap">'+
				  	'<a href="javascript:void(0)" class="popup-close Js-popup-close"></a> '+
				    '<h6 class="fn-clear popup-tit Js-popup-title">' + option.title + '</h6>'+
				    '<div class="popup-con Js-popup-con">'+
				      '<p class="confirm-msg Js-popup-msg">' + option.message + '</p>'+
				    '</div>'+
				    '<div class="btn-wrap">'+
				      '<a href="javascript:void(0);" class="popup-btn btn-new Js-popup-done"><span class="btn-text">确定</span></a>'+
				      '<a href="javascript:void(0);" class="popup-btn btn-new Js-popup-cancel"><span class="btn-text">取消</span></a>'+
				    '</div>'+
				  '</div>'+
				'</div>');
	if ( option.isLayer ) {
		var $layer = $("<div class='module-popup-layer'></div>");
		$("body").append($layer);
	}
	$("body").append( $popup );
	// console.log(option);
	var	$confirm = $popup.find(".Js-popup-wrap"),
		$confirmTitle = $confirm.find('.Js-popup-title').hide(),
		$confirmMessage = $confirm.find('.Js-popup-msg'),
		$confirmDone = $confirm.find('.Js-popup-done'),
		$confirmCancel = $confirm.find('.Js-popup-cancel').hide(),
		$confirmClose = $confirm.find('.Js-popup-close'),
		openConfirm = function() {
			// bind title
			if(option.title){
				$confirmTitle.show();
			}
			// bind message
			if(option.message){
				$confirmMessage.text( option.message ).show();
			}
			// bind done button
			if(option.doneBtn.fun && $.isFunction(option.doneBtn.fun)){
				$confirmDone.one("click", function( event ) {
					option.doneBtn.fun( event );
					closeConfirm();
				});
			}
			// bind close button
			$confirmClose.one("click", function(){
				closeConfirm();
			});
			// bind cancel button
			if ( option.cancelBtn.has ) {
				$confirmCancel.show();
				if(option.cancelBtn.fun && $.isFunction(option.cancelBtn.fun)){
					$confirmCancel.one("click", function( event ) {
						option.cancelBtn.fun( event );
						closeConfirm();
					});
				}
				// reset bind close button
				$confirmClose.off("click").one("click", function(){
					$confirmCancel.click();
				});
			}
			// bind wrap position
			positionCenter();
			$(window).resize(function(){
				positionCenter();
		    });
			$popup.show();
		},
		positionCenter = function(){
	        var objWidht = $popup.width(),
	        	objHeight = $popup.height();
	        $popup.css( { "margin-left" : "-" + objWidht / 2 + "px" } );
		},
		closeConfirm = function() {
			$popup.remove();
			if ( option.isLayer ) {
				$layer.remove();
			}
		};
		openConfirm();
};
/*******************************************************************************************************
*	baiing View : $.cgPopup()	弹出框 * 为必填
*	@param [options:title(str)]			*title text	 
*	@param [options:template(html)]		*content html	 
*	@param [options:addClass(str)]		popup new class 
*	@param [options:isLayer(bool)]		if true, add mask layer	 
*	@param [options:hasBtn(bool)]		if false, all button hide without close button
*	@param [options:hasCancel(bool)]	if false, cancel button hide
*	@param [options:content(fun)]		content function 
*	@param [options:done(fun)]			*done function
*	@param [options:cancel(fun)]		cancel function
********************************************************************************************************
*	@param [out:oBtnWrap($dom)]			dom : popup wrap 
*	@param [out:oBtnDone($dom)]			dom : popup done button
*	@param [out:oBtnCancel($dom)]		dom : popup cancel button
*	@param [out:oBtnClose($dom)]		dom : popup close button
*	@param [out:oCon($dom)]				dom : popup content
*	@param [out:close(fun)]				action : close popup
********************************************************************************************************/
$.cgPopup = function(options){
	var option = $.extend({
		title: "提示",
		template : "",
		addClass : "",
		isLayer : true,
		hasBtn : true,
		hasCancel : true,
		content : function(option){},
		done : function(option){},
		cancel : function(option){}
	}, options);
	if ( option.template == "" ) {
		return false;
	}
	var $popup = $('<div class="module-popup Js-popup-wrap">'+
				  '<div class="popup-wrap fn-clear">'+
				  	'<a href="javascript:void(0)" class="popup-close Js-popup-close"></a> '+
				    '<h6 class="fn-clear popup-tit Js-popup-title">' + option.title + '</h6>'+
				    '<div class="popup-con Js-popup-con"></div>'+
				    '<div class="btn-wrap Js-popup-btn-wrap">'+
				      '<a href="javascript:void(0);" class="popup-btn btn-new Js-popup-done"><span class="btn-text">确定</span></a>'+
				      '<a href="javascript:void(0);" class="popup-btn btn-new Js-popup-cancel"><span class="btn-text">取消</span></a>'+
				    '</div>'+
				  '</div>'+
				'</div>');
	if ( option.isLayer ) {
		var $layer = $("<div class='module-popup-layer'></div>");
		$("body").append($layer);
	}
	$("body").append( $popup );
	// add new class
	if ( option.addClass ) {
		$popup.addClass(option.addClass);
	}
	var $btnWrap = $popup.find(".Js-popup-btn-wrap"),
		$btnDone = $btnWrap.find(".Js-popup-done"),
		$btnCancel = $btnWrap.find(".Js-popup-cancel"),
		$btnClose = $popup.find(".Js-popup-close"),
		$con = $popup.find(".Js-popup-con"),
		positionCenter = function(){
	        var objWidht = $popup.width(),
	        	objHeight = $popup.height();
	        $popup.css( { "margin-left" : "-" + objWidht / 2 + "px" } );
		};
	// out param
	$.extend(option, {
		oBtnWrap : $btnWrap,
		oBtnDone : $btnDone,
		oBtnCancel : $btnCancel,
		oBtnClose : $btnClose,
		oCon : $con,
		close : function(){
			$popup.remove();
			if ( option.isLayer ) {
				$layer.remove();
			}
		}
	});
	// append content template
	$con.append(option.template);
	
	if ( option.hasBtn ) {
		$btnDone.on("click", function(){
			if ( typeof(option.done) == "function" ) {
				option.done(option);
			}
		});
		if ( option.hasCancel ) {
			$btnCancel.on("click", function(){
				if ( typeof(option.cancel) == "function" ) {
					option.cancel(option);
				}
				option.close();
			});
			$btnClose.on("click", function(){
				$btnCancel.click();
			});
		} else{
			$btnCancel.remove();
			$btnClose.on("click", function(){
				option.close();
			});
		}
	}else{
		$btnWrap.remove();
		$btnClose.on("click", function(){
			if ( typeof(option.done) == "function" ) {
				option.done(option);
			}
			option.close();
		});
	}
	
	// bind wrap position
	positionCenter();
	$(window).resize(function(){
		positionCenter();
    });
	$popup.show();
	// bind popup init function
	if ( typeof(option.content) ) {
		option.content(option);
	}
};

/*******************************************************************************************************
*	baiing View : $.cgVerification()	验证
*	@param [options:title(str)]			title text	 
*	@param [options:message(str)]		message text	 
*	@param [options:doneBtn(obj)]		fun : "btn function" 	 
*	@param [options:cancelBtn(obj)]		has : "is has cancel button" 	 
*	@param [options:cancelBtn(obj)]		fun : "btn function" 	 
********************************************************************************************************/
$.cgVerification = function( options ) {
	var option = $.extend({
			wrap : $(".wrap"),
			hookDom: ".Js-verification",
			map : "",
			btn : $("Js-btn"),
			init : function(){},
			error : function(){},
			success : function(){}
		}, options);
	if ( option.map == "" ) {
		var map = {
			"notNull" : {
				msg : "{name}不能为空",
				reg : /./
			},
			"onlyNumLastTwo" : {
				msg : "{name}只能是数字,最多2位小数",
				reg : /^\d+(\.\d{1,2})?$/
			},
			"onlyNum" : {
				msg : "{name}只能是数字",
				reg : /^[0-9 ]+$/
			},
			"notSpecialChar" : {
				msg : "{name}不能包含数字、英文字母和汉字以外的字符",
				reg : /^[_0-9a-zA-Z\u4E00-\u9FA5]+$/
			}
		};
		option.map = {};
		$.extend( option.map, map );
	}
	var flag = true, errorDom;
	// parse Verification condition
	var _parseVer = function(str){
		var arrCondition = str.split(":"),
			parseData = { name : arrCondition[0], condition : arrCondition[1].split("/") };
		return parseData;
	};
	// thrown error
	var _thrown = function(data){
		data.dom.nextAll(".Js-verification-state").remove();
		var str = option.map[data.ver].msg.replace("{name}", data.name);
		var temp = '<a href="javascript:javascript:void(0);" class="state error Js-verification-state">' + str + '</a>';
		data.dom.after(temp);
		errorDom = data.dom;
	};
	// verified
	var _verified = function(data){
		data.dom.nextAll(".Js-verification-state").remove();
		var temp = '<a href="javascript:javascript:void(0);" class="state right Js-verification-state">&nbsp;</a>';
		data.dom.after(temp);
	};
	// bind input function
	option.wrap.on("focus", option.hookDom, function(){
		
	}).on("blur", option.hookDom, function(){
		var $this = $(this),
			condition = _parseVer( $(this).attr("data-ver") );
		if ( $this.attr("data-type") == "notText" ) {
			var checkedLength = $this.find("input:checked").length;
			if( $.inArray("notNull", condition.condition) != -1 && checkedLength == 0 ) {
				flag = false;
				_thrown({
					dom : $this.find("input").last(),
					ver : "notNull",
					name : condition.name
				});
			}else{
				_verified({ dom : $this.find("input").last() });
			}
		} else{
			var val = $.trim( $this.val() );
		
			if ( val == "" ) {
				if( $.inArray("notNull", condition.condition) != -1 ) {
					flag = false;
					_thrown({
						dom : $this,
						ver : "notNull",
						name : condition.name
					});
				}else{
					_verified({ dom : $this });
				}
			}else{
				for( var i = 0; i < condition.condition.length; i++ ){
					if ( option.map[condition.condition[i]].reg.test(val) ) {
						_verified({ dom : $this });
					} else{
						flag = false;
						_thrown({
							dom : $this,
							ver : condition.condition[i],
							name : condition.name
						});
						break;
					}
				}
			}
		}
	});
	// bind btn function
	option.btn.on("click", function(){
		if ( typeof(option.init) == "function" ) {
				option.init();
			}
		flag = true;
		if ( option.wrap.find(option.hookDom).length != 0 ) {
			option.wrap.find(option.hookDom).each(function(){
				$(this).blur();
				if ( !flag ) {
					return false;
				}
			});
		}
		
		if ( flag ) {
			if ( typeof(option.success) == "function" ) {
				option.success(option.btn);
			}
		} else{
			if ( typeof(option.error) == "function" ) {
				option.error(errorDom);
			}
		}
	});
};
/*******************************************************************************************************
* cgAutoComplete : 自动完成
********************************************************************************************************/
	
$.cgAutoComplete = function(options){
	var option = {
			frameBox : $(".Js-auto-frame"),
			autoList : ".Js-auto-list",
			autoItem : ".Js-auto-item",
			autoText : ".Js-auto-text",
			autoBtn : $(".Js-auto-btn"),
			hoverClass : "selected",
			titleClass : "",
			isSearch : false,
			init : function(){},
			action : function(option, val){},
			createSearchList : function(option, val){}
		};
	$.extend(option, options);
	// 添加外部调用函数（受保护）
	$.extend(option, {
		_returnText : function(value){
			option.text.val( value );
		},
		addItem : function($temp, data){
			option.list.append( $.getFromTemplate( $temp, data ) );
		},
		showList : function(){
			option.list.show();
			$(document).one("click", function(){
				option.list.hide();
			});
		}
	});
	var keys = {
			back: 8,
			enter:  13,
			escape: 27,
			up:     38,
			down:   40,
			array:  [13, 27, 38, 40]
		},keyDate = [], chooseData = [];

	var $list = option.frameBox.find(option.autoList),
		$text = option.frameBox.find(option.autoText);
	$.extend(option, { list : $list, text : $text });
	$list.on("mouseenter", option.autoItem, function(){
		$(this).addClass(option.hoverClass);
		option._returnText( $(this).children().attr("title") );
	}).on("mouseleave", option.autoItem,function(){
		$(this).removeClass(option.hoverClass);
	});

	$list.on("click", option.autoItem, function(){
		option._returnText( $(this).children().attr("title") );
	    $list.hide();
	    if ( typeof( option.action ) == "function" ) {
	    	option.action(option, $.trim( $text.val() ) );
	    }
	});

	$text.off("keyup").on("keyup", function(event){
		var keyCode = event.keyCode;
		keyDate.push((new Date()).getTime());
		var thisTime = keyDate[(keyDate.length - 1)];
		var val = "";
		// 需要检索列表
		if (option.isSearch) {
			if($.inArray(keyCode, keys.array) !=-1){
				if( $list.is(":visible") ){
					var $item = $list.children(option.autoItem),
						$cur = $item.filter("." + option.hoverClass);
					switch (keyCode){
						case keys.up:
							if ( $cur.length ){
								$item.removeClass(option.hoverClass);
								if ( $cur.index() == 1 ) {
									$item.last().addClass(option.hoverClass);
								} else{
									if ( $cur.prev().hasClass(option.titleClass) ) {
										$cur.prev().prev().addClass(option.hoverClass);
									} else{
										$cur.prev().addClass(option.hoverClass);
									}
								}
							}else{
								$item.last().addClass(option.hoverClass);
							}
							option._returnText( $item.filter("." + option.hoverClass).children().attr("title") );
						break;
						case keys.down:
							if ( $cur.length ){
								$item.removeClass(option.hoverClass);
								if ( $cur.index() == $item.length ) {
									$item.first().addClass(option.hoverClass);
								} else{
									if ( $cur.next().hasClass(option.titleClass) ) {
										$cur.next().next().addClass(option.hoverClass);
									} else{
										$cur.next().addClass(option.hoverClass);
									}
								}
							}else{
								$item.first().addClass(option.hoverClass);
							}
							option._returnText( $item.filter("." + option.hoverClass).children().attr("title") );
						break;
						case keys.enter:
							$list.hide();
							if ( typeof( option.action ) == "function" ) {
								option.action(option, $.trim( $text.val() ) );
							}
						break;
						default :
						break;
					}
				}else{
					if( keyCode == keys.enter ){
						if ( typeof( option.action ) == "function" ) {
							option.action(option, $.trim( $text.val() ) );
						}
					}
				}
			}else{
				// 延时显示searchlist 减少多余查询
				setTimeout(function(){
					val = $text.val();
					if( thisTime == keyDate[(keyDate.length - 1)] && val != "" ) {
						option.createSearchList(option, val);
					}else if ( val == "" ){
						option.list.hide();
					}
				}, 300);
			}
		// 不需要检索列表
		} else{
			val = $(this).val();
			if (val != "") {
				if (keyCode == keys.enter) {
						console.log("enter");
					// option.createChosen($(this), val);
					return false;
				}
			}
		};
	});

	$text.off("keydown").on("keydown", function(event){
		var keyCode = event.keyCode;
		if (keyCode == keys.back) {
			if( $.trim( $(this).val() ) === ""){
				if($list.is(":visible")){ $list.hide(); }
			}
		}
	});

	option.autoBtn.on("click", function(){
		$list.hide();
		if ( typeof( option.action ) == "function" ) {
			option.action(option, $.trim( $text.val() ) );
		}
	});
}


}(jQuery));