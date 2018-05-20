(function(win, doc, $) {
	function ListQuery(arrs) {
		this._init(arrs);
	}
	$.extend(ListQuery.prototype, {
		_init: function(arrs) {
			var self = this;
			self.options = {
				"权限管理": "weightManagement",
				"节点管理": "nodeManagement",
				"用户管理": "userManagement",
				"设备管理": ""
			};
			self._initEvent(arrs);
			return self;
		},
		/**
		 * 初始化事件
		 * */
		_initEvent: function(arrs) {
			var self = this;
			var opts = this.options;
			for(var i = 0; i < arrs.length; i++) {
				for(var key in opts) {
					if(arrs[i] == key) {
						self.renderEvent(key, opts[key]);
					};
				}
			}
		},
		/*渲染事件*/
		renderEvent: function(str, dataSrc) {
			var aStr = '<a href="#" data-src="' + dataSrc + '" class="left_ul_li_a2">' + str + '</a>';
			$("#admin").append(aStr);
		}
	});
	win.ListQuery = ListQuery;
})(window, document, jQuery);