// 用法：

// $(element).inputSearch({
//   //隐藏input的name属性名
//   inputNameId: 'customNameId',
//   inputNameText: 'customNameText',
//   //搜索项的属性
//   attr: {
//     // [key标签属性]: [value后台返回属性]
//     'tid':'id', //[tid]必填不能修改
//     'tname':'name', //[tname]必填不能修改
//     'tkey':'key' //自定义属性
//   },
//   onKeyup: function(){
//     var _this = this;
//     $.ajax({
//       url: 'https://www.easy-mock.com/mock/5b1f31a3630e9c3e6b85b747/gzzx/set_tasks/project',
//       type: 'POST',
//       data: {},
//       async: true,
//       cache: false,
//       dataType: 'json',
//       success: function(res){
//         if(res.success){
//           _this.showData(res.data);
//         }
//       },
//       error: function(err){
//         console.log('搜索失败');
//       }
//     });
//   },
//   onSelect: function(){
//     var _this = this;
//   }
// });

;(function($, window, document,undefined) {

	var Input = function(ele, opt) {
    this.$element = ele;
		this.defaults = {
      data: null,
      text: '',
      inputNameId: '',
      inputNameText: '',
      attr: {},
      onKeyup: null,
      onSelect: null
    };
    this.options = $.extend(true,{},this.defaults,opt);
    this.isBindEvent = false;
		this.init();
		this.bindEvent();
	}

	Input.prototype = {
		constructor: Input,
		init: function(){
      this.$element.css('autocomplete','off');
      this.$parent = this.$element.parent();
      this.$sel = $('<div class="select-search-wrap"></div>');
      this.$id = $('<input id="'+this.options.inputNameId+'" class="input-search-id" type="hidden" name="'+this.options.inputNameId+'">');
      this.$text = $('<input id="'+this.options.inputNameText+'" class="input-search-text" type="hidden" name="'+this.options.inputNameText+'">');
      this.$parent.css('position','relative');
      this.$parent.append(this.$sel);
      this.$parent.append(this.$id);
      this.$parent.append(this.$text);
    },
    showData: function(data){
      var _this = this;
      _this.$sel.html('');
      $.each(data,function(index,item){
        var $item = $('<div class="select-search-item">'+item[_this.options.attr['tname']]+'</div>');
        $.each(_this.options.attr,function(k,v){
          $item.attr(k,item[v]);
        });
        _this.$sel.append($item);
      });
    },
    disable: function(){
      var _this = this;
      $(document).off('click.'+_this.uuid);
      _this.$element.off('click.'+_this.uuid);
      _this.$element.off('focus.'+_this.uuid);
      _this.$element.off('keyup.'+_this.uuid);
      _this.$sel.off('click.'+_this.uuid);
      _this.isBindEvent = false;
    },
    enable: function(){
      if(!this.isBindEvent) this.bindEvent();
    },
    createUUID: function(){
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    },
		bindEvent: function(){
      var _this = this;
      _this.isBindEvent = true;
      _this.uuid = _this.createUUID();
      $(document).on('click.'+_this.uuid,function(){
        _this.$sel.hide();
      });
      _this.$element.on('click.'+_this.uuid,function(e){
        e.stopPropagation();
        $('.select-search-wrap').hide();
        _this.$sel.show();
      });
      _this.$element.on('focus.'+_this.uuid,function(e){
        e.stopPropagation();
        $('.select-search-wrap').hide();
        _this.$sel.show();
      });
      _this.$element.on('keyup.'+_this.uuid,function(e){
        var val = $(this).val();
        val = val.replace(/^\s+|\s+$/,'');
        if(val != _this.options.text){
          _this.$id.val('');
          _this.$text.val('');
          if(_this.options.data){
            _this.showData(_this.options.data);
          }

          if(_this.options.onKeyup && $.isFunction(_this.options.onKeyup)){
            _this.options.onKeyup.call(_this);
          }
        }
      });
      _this.$sel.on('click.'+_this.uuid,'.select-search-item',function(e){
        var tid = $(this).attr('tid');
        var tname = $(this).attr('tname');
        _this.$id.val(tid);
        _this.$text.val(tname);
        _this.$element.val(tname);
        _this.text = tname;
        if(_this.options.onSelect && $.isFunction(_this.options.onSelect)){
          _this.options.onSelect.call(_this,$(this));
        }
      });
    }
	}

	$.fn.inputSearch = function(options) {
		return (new Input(this, options));
	}
})(jQuery, window, document);
