var template = [
    '<div class="modal fade" tabindex="-1" role="dialog">',
    '<div class="modal-dialog" role="document">',
      '<div class="modal-content">',
        '<div class="modal-header">',
          '<button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>',
          '<h4 class="modal-title">{$title}</h4>',
        '</div>',
        '<div class="modal-body" style="padding:0;">',
        '{$content}',
        '</div>',
        '<div class="modal-footer">',
          '<button type="button" class="btn btn-primary btn-block">确定</button>',
        '</div>',
      '</div>',
    '</div>',
  '</div>'].join(' ');
var SelectDialog = function (elementInstance, option) {
    option = this._option = $.extend({}, SelectDialog.defaults, option);
    var data = option.data || [];
    this._selectedValues = option.selectedValues 
        || (data[0] && data[0][option.valueField] && [data[0][option.valueField]] || []); //没有设置初始值，使用第一个
    this._selectedItems = this._setSelectedItemsByValues(this._selectedValues);
    this._elementInstance = elementInstance;
    this._init();
};
SelectDialog.defaults = {
    title: '选择',
    mode: 'single',
    onSelect: null,
    onCancel: null,
    valueField: 'value',
    nameField: 'name'
};
SelectDialog.prototype.getSelectedItems = function () {
    return this._selectedItems;
};
SelectDialog.prototype.getSelectedValues = function () {
    return this._selectedValues;
};
SelectDialog.prototype._init = function () {
    var self = this;
    self._elementInstance.on('click', function () {
        self.show();
    });
};
SelectDialog.prototype._selectFinish = function (dialog) {
    var self = this;
    var option = self._option;
    var data = option.data;
    var activeInstacnes = dialog.find('li.list-group-item.active');
    if (activeInstacnes.length === 0) {
        return;
    }
    var selectedValues = [];
    var selectedItems = [];
    activeInstacnes.each(function () {
        var index = $(this).index();
        var item = data[index];
        selectedValues.push(item[option.valueField]);
        selectedItems.push(item);
    });
    this._selectedValues = selectedValues;
    this._selectedItems = selectedItems;
    if ($.isFunction(option.onSelect)) {
        option.onSelect(selectedItems);
    }
    dialog.modal('hide');
};
SelectDialog.prototype._setSelectedItemsByValues = function (values) {
    var self = this;
    var option = self._option;
    var data = option.data;
    var selectedItems = [];
    $.each(data, function (i, item) {
        if ($.inArray(item[option.valueField], values) > -1) {
            selectedItems.push(item);
        }
    });
    return selectedItems;
};
SelectDialog.prototype.setData = function (data, extra) {
    var self = this;
    var option = self._option;
    data = data || [];
    extra = extra || {};
    option.data = data;
    self._selectedValues = extra.selectedValues 
        || (data[0] && data[0][option.valueField] && [data[0][option.valueField]] || []); 
    self._selectedItems = self._setSelectedItemsByValues(self._selectedValues);
    // console.log(self._selectedValues, self._selectedItems);
};
SelectDialog.prototype.show = function (option) {
    var self = this;
    $.extend(self._option, option);
    option = self._option;
    var html = [
    '<div class="modal fade" tabindex="-1" role="dialog" id="xxx">',
        '<div class="modal-dialog" role="document">',
          '<div class="modal-content">',
            '<div class="modal-header">',
              '<button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>',
              '<h4 class="modal-title">' + option.title + '</h4>',
            '</div>',
            '<div class="modal-body" style="padding:0;">'
    ].join(' ');
    
    var data = option.data || [];
    var dataHtml = '<ul class="list-group">';
    $.each(data, function (i, item) {
        var className = 'list-group-item ';
        if ($.inArray(item[option.valueField], self._selectedValues) > -1) {
            className += 'active ';
        }
        console.log(self._selectedValues);
        var liHtml = '<li class="' + className + '">';
        liHtml += ('<span class="glyphicon glyphicon-ok-circle"></span> ' + item[option.nameField]);
        liHtml += '</li>';
        dataHtml += liHtml;
    });
    html += dataHtml;
    html += '</ul>';
    html += '</div>';
    
    if (option.mode === 'multi') {
        html += [
        '<div class="modal-footer">',
            '<button type="button" class="btn btn-primary btn-block" data-name="select">确定</button>',
        '</div>',
       ].join(' ');
    }
    html += [ 
            '</div>',
        '</div>',
    '</div>'].join(' ');
    var instance = $(html);
    instance.on('hidden.bs.modal', function () {
        $(this).remove();
    });
    
    if (option.mode === 'multi') {
        instance.on('click', 'li.list-group-item', function (e) {
            $(this).toggleClass('active');
        }).on('click', 'button[data-name=select]', function (e) {
            self._selectFinish(instance);
        });
    } else {
        instance.on('click', 'li.list-group-item', function (e) {
            $(this).addClass('active').siblings().removeClass('active');
            self._selectFinish(instance);
        })
    }
    
    instance.modal('show');
};
module.exports = SelectDialog;