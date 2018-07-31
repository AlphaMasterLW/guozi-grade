;(function($, window, document,undefined) {

	var Calendar = function(ele, opt) {
    var minYear = 1500;
    var maxYear = 2500;
    opt.minYear = isNaN(parseInt(opt.minYear)) ? minYear : parseInt(opt.minYear);
    opt.maxYear = isNaN(parseInt(opt.maxYear)) ? maxYear : parseInt(opt.maxYear);
		this.$element = ele;
		this.defaults = {
      data: [],
      showSelYear: false,
      showSelMonth: false,
      activeDate: '',
      onClickToday: null,
      onClickDate: null,
      onChangeMonth: null,
      onChangeYear: null
    };
    this.options = $.extend({}, this.defaults, opt);

		var d = new Date();
		var year = d.getFullYear();
		var month = d.getMonth();
		var date = d.getDate();
		this.dateObj = d;
		this.today = year+'-'+this.addZero((month+1))+'-'+this.addZero(date);
		this.year = year;
		this.month = month;
		this.date = date;
    var ad = this.options.activeDate.split('-');
    var ad_year = parseInt(ad[0]);
    var ad_month = parseInt(ad[1]);
    var ad_date = parseInt(ad[2]);
    this.curYear = isNaN(ad_year) ? year : (ad_year <= this.options.minYear ? this.options.minYear : (ad_year >= this.options.maxYear ? this.options.maxYear : ad_year));
		this.curMonth = isNaN(ad_month) ? month : (ad_month <= 0 ? 0 : (ad_month >= 12 ? 11 : (ad_month-1)));
    this.curDate = isNaN(ad_date) ? date : (ad_date <= 1 ? 1 : (ad_date >= 31 ? 31 : ad_date));
    this.temHeader = '';
    this.temWeek = '';

		this.init();
    this.createDate();
    this.selCurDate();
    this.showCurYM();
		this.bindEvent();
	}

	Calendar.prototype = {
		constructor: Calendar,
		init: function(){
			this.temHeader += '<div class="cc-header clearfix" onselectstart="return false;">';
      this.temHeader += '<div class="cc-sel-wrap pull-left">';
      if(this.options.showSelYear){
        this.temHeader += '<select class="cc-sel cc-sel-year">';
        this.temHeader += this.createYear();
        this.temHeader += '</select>';
      }
      if(this.options.showSelMonth){
        this.temHeader += '<select class="cc-sel cc-sel-month">';
        this.temHeader += this.createMonth();
        this.temHeader += '</select>';
      }
      this.temHeader += '<div class="btn-group">';
      this.temHeader += '<button class="btn btn-default cc-prev-year" type="button">上一年</button>';
      this.temHeader += '<button class="btn btn-default cc-prev-month" type="button">上一月</button>';
      this.temHeader += '<button class="btn btn-default cc-next-month" type="button">下一月</button>';
      this.temHeader += '<button class="btn btn-default cc-next-year" type="button">下一年</button>';
      this.temHeader += '</div>';
      this.temHeader += '</div>';
      this.temHeader += '<div class="cc-today-btn pull-right"><button class="btn btn-default cc-back-today" type="button">返回今天</button></div>';
      this.temHeader += '</div>';
      this.temHeader += '<div class="cc-date-header"></div>';
      this.temWeek += '<thead><tr><th>周日</th><th>周一</th><th>周二</th><th>周三</th><th>周四</th><th>周五</th><th>周六</th></tr></thead>';
    },
    showCurYM: function(){
      this.$element.find('.cc-date-header').html(this.curYear+'年'+(this.curMonth+1)+'月');
    },
    createYear: function(){
      var str = '';
      for(var i=this.options.minYear; i<=this.options.maxYear; i++){
        str += '<option value="'+i+'">'+i+'年</option>';
      }
      return str;
    },
    createMonth: function(){
      var str = '';
      for(var i=1; i<=12; i++){
        str += '<option value="'+i+'">'+i+'月</option>';
      }
      return str;
    },
		createDate: function(){
			//当前月总天数
			var totalDay = this.getDaysInMonth(this.curYear,this.curMonth);
			//当前月第一天星期几
			var firstDayWeek = new Date(this.curYear,this.curMonth,1).getDay();
			//总行数
			var rows = Math.ceil( ( firstDayWeek + totalDay ) / 7 );
			//总单元格
			var totalCells = rows * 7;
      var str = '';
      var tem_sch = this.curYear+'-'+this.addZero((this.curMonth+1))+'-'+this.addZero(this.curDate);
			str += this.temHeader;
			str += '<table class="table table-bordered cc-table-date">';
			str += this.temWeek;
			str += '<tbody>';
			for(var i=0; i<totalCells; i++){
				if(i%7 == 0){
					str += '<tr>';
				}

				var v = i - firstDayWeek + 1;
				if ( v < 1 || v > totalDay ) {
					str += '<td></td>';
				}else{
          var tem = this.curYear+'-'+this.addZero((this.curMonth+1))+'-'+this.addZero(v);
          var clazzName = 'cc-date';
          if(tem == this.today){
            clazzName += ' cc-today';
          }
          if(tem == this.options.activeDate){
            clazzName += ' cc-active';
          }
          $.each(this.options.data,function(a,b){
            if(tem == b) clazzName += ' cc-sch';
          });
          str += '<td class="'+clazzName+'" year="'+this.curYear+'" month="'+this.addZero((this.curMonth+1))+'" date="'+this.addZero(v)+'">'+this.addZero(v)+'</td>';
				}

				if(i%7 == 6){
					str += '</tr>';
				}
			}
			str += '</tbody>';
			str += '</table>';

			this.$element.html(str);
    },
    selCurDate: function(){
      this.$element.find('.cc-sel-year').val(this.curYear);
      this.$element.find('.cc-sel-month').val((this.curMonth+1));
    },
		updateDate: function(year,month){
      this.curYear = year ? year : this.$element.find('.cc-sel-year').val();
      this.curMonth = month>=0 ? month : this.$element.find('.cc-sel-month').val()-1;
      this.createDate();
      this.selCurDate();
		},
		bindEvent: function(){
      var _this = this;
      this.$element.on('click','.cc-sel-year',function(e){
        e.stopPropagation();
      });
      this.$element.on('change','.cc-sel-year',function(e){
        e.stopPropagation();
				_this.updateDate();
      });
      this.$element.on('click','.cc-sel-month',function(e){
        e.stopPropagation();
      });
      this.$element.on('change','.cc-sel-month',function(e){
        e.stopPropagation();
				_this.updateDate();
      });
      this.$element.on('click','.cc-prev-month',function(e){
        e.stopPropagation();
        _this.curMonth--;
        if(_this.curMonth <0 && _this.curYear <= _this.options.minYear){
          _this.curMonth = 0;
          return;
        }
        if(_this.curMonth < 0){
          _this.curMonth = 11;
          _this.curYear--;
        }
        _this.updateDate(_this.curYear,_this.curMonth);
        _this.showCurYM();
        if(_this.options.onChangeMonth && $.isFunction(_this.options.onChangeMonth)){
          _this.options.onChangeMonth.call(_this,(''+_this.curYear),_this.addZero((_this.curMonth+1)),_this.addZero(_this.date));
        }
      });
      this.$element.on('click','.cc-next-month',function(e){
        e.stopPropagation();
        _this.curMonth++;
        if(_this.curMonth > 11 && _this.curYear >= _this.options.maxYear){
          _this.curMonth = 11;
          return;
        }
        if(_this.curMonth > 11){
          _this.curMonth = 0;
          _this.curYear++;
        }
        _this.updateDate(_this.curYear,_this.curMonth);
        _this.showCurYM();

        if(_this.options.onChangeMonth && $.isFunction(_this.options.onChangeMonth)){
          _this.options.onChangeMonth.call(_this,(''+_this.curYear),_this.addZero((_this.curMonth+1)),_this.addZero(_this.date));
        }
      });
      this.$element.on('click','.cc-prev-year',function(e){
        e.stopPropagation();
        _this.curYear--;
        if(_this.curYear < _this.options.minYear){
          _this.curYear = _this.options.minYear;
        }
        _this.updateDate(_this.curYear,_this.curMonth);
        _this.showCurYM();

        if(_this.options.onChangeYear && $.isFunction(_this.options.onChangeYear)){
          _this.options.onChangeYear.call(_this,(''+_this.curYear),_this.addZero((_this.curMonth+1)),_this.addZero(_this.date));
        }
      });
      this.$element.on('click','.cc-next-year',function(e){
        e.stopPropagation();
				_this.curYear++;
        if(_this.curYear > _this.options.maxYear){
          _this.curYear = _this.options.maxYear;
        }
        _this.updateDate(_this.curYear,_this.curMonth);
        _this.showCurYM();

        if(_this.options.onChangeYear && $.isFunction(_this.options.onChangeYear)){
          _this.options.onChangeYear.call(_this,(''+_this.curYear),_this.addZero((_this.curMonth+1)),_this.addZero(_this.date));
        }
      });
      this.$element.on('click','.cc-back-today',function(e){
        e.stopPropagation();
        _this.updateDate(_this.year,_this.month);
        _this.showCurYM();

        if(_this.options.onClickToday && $.isFunction(_this.options.onClickToday)){
          _this.options.onClickToday.call(_this,(''+_this.curYear),_this.addZero((_this.curMonth+1)),_this.addZero(_this.date));
        }
      });
      this.$element.on('click','.cc-date',function(){
        _this.$element.find('.cc-date').removeClass('cc-active');
        $(this).addClass('cc-active');
        var year = $(this).attr('year');
        var month = $(this).attr('month');
        var date = $(this).attr('date');
        _this.options.activeDate = year+'-'+month+'-'+date;
        if(_this.options.onClickDate && $.isFunction(_this.options.onClickDate)){
          _this.options.onClickDate(year,month,date);
        }
      });
    },
    updateShow: function(arr){
      this.options.data = arr;
      this.updateDate(this.curYear,this.curMonth);
      this.showCurYM();
    },
		addZero: function(n){
			return n < 10 ? '0'+n : ''+n;
		},
		isToday: function(d1,d2){
			return d1 == d2;
		},
		isLeapYear: function(year){
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
		},
		getDaysInMonth: function(year,month){
			return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
		}
	}

	$.fn.CustomCalendar = function(options) {
    //this.calendar = new Calendar(this, options);
		return (new Calendar(this, options));
	}
})(jQuery, window, document);
