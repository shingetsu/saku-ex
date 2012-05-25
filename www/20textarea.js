/* -*- coding: utf-8 -*-
 * Text Area Conttoller.
 * Copyright (C) 2006-2010 shinGETsu Project.
 */

shingetsu.addInitializer(function () {
    var msg_spread = 'Spread';
    var msg_reduce = 'Reduce';
    var msg_preview = 'Preview';
    var msg_edit = 'Edit';
    if (shingetsu.uiLang == 'ja') {
        msg_spread = '拡大';
        msg_reduce = '縮小';
        msg_preview = 'プレビュー';
        msg_edit = '編集再開';
    }

    var textArea = $('#body');
    var textAreaContainer = textArea.parent();
    var buttonContainer = $('<span>');
    textArea.after(buttonContainer);

    function TextAreaController(textArea, button) {
        this._textArea = textArea;
        this._button = button;
        this._isBigSize = false;
    }

    TextAreaController.prototype.toggle = function (event) {
        event.preventDefault();
        if (this._isBigSize) {
            this._reduce();
        } else {
            this._spread();
        }
    };

    TextAreaController.prototype._spread = function () {
        this._textArea.attr('rows', 30).css('width', '90%');
        this._button.text(msg_reduce);
        this._isBigSize = true;
    };

    TextAreaController.prototype._reduce = function () {
        this._textArea.attr('rows', 7).attr('cols', '70').css('width', '');
        this._button.text(msg_spread);
        this._isBigSize = false;
    };

    var spreadReduceButton = $('<button>');
    buttonContainer.append(spreadReduceButton);
    spreadReduceButton.text(msg_spread);

    var textAreaController = new TextAreaController(textArea, spreadReduceButton);
    spreadReduceButton.click(function (e) { textAreaController.toggle(e) } );

    function html_format(message) {
        var e = document.all? 'null': 'event';
        message = message.replace(/&/g, '&amp;');
        message = message.replace(/</g, '&lt;');
        message = message.replace(/>/g, '&gt;');
        message = message.replace(/&gt;&gt;([0-9a-f]{8})/g,
            '<a href="#r$1"' +
            ' onmouseover="shingetsu.plugins.popupAnchor(' + e +', \'$1\');"' +
            ' onmouseout="shingetsu.plugins.hidePopup();"' +
            '>&gt;&gt;$1</a>');
        message = message.replace(
            /(https?:..[^\x00-\x20"'()<>\[\]\x7F-\xFF]*)/g,
            '<a href="$1">$1</a>');
        message = message.replace(
            /\[\[([^/<>\[\]]+)\]\]/g,
            function ($0, $1) {
                return '<a href="/thread.cgi/' + encodeURIComponent($1) +
                       '">[[' + $1 + ']]</a>';
            });
        message = message.replace(
            /\[\[([^/<>\[\]]+)\/([0-9a-f]{8})\]\]/g,
            function ($0, $1, $2) {
                return '<a href="/thread.cgi/' + encodeURIComponent($1) +
                       '/' + $2 +
                       '">[[' + $1 + '/' + $2 + ']]</a>';
            });
        return message;
    }


    function PreviewController(textArea, button) {
        this._textArea = textArea;
        this._button = button;
        this._isPreview = false;
    }

    PreviewController.prototype.toggle = function (event) {
        event.preventDefault();
        if (this._isPreview) {
            this._hide();
        } else {
            this._show();
        }
    };

    PreviewController.prototype._show = function () {
        spreadReduceButton.hide();
    };
    return;


    function showPreview() {
        var a = document.getElementById('previewctrl');
        var area = document.getElementById('preview');
        var message = form.body.value;
        var ref = document.getElementById('resreferrer');
        message = html_format(message);
        form.body.style.display = 'none';
        textsize.style.display = 'none';
        if (ref) {
            ref.style.display = 'none';
        }
        if (document.all) {
            area.innerHTML = '<pre>' + message + '</pre>'
        } else {
            area.innerHTML = '<p>' + message + '</p>'
        }
        area.style.display = 'block';
        a.innerHTML = '[' + msg_edit + ']';
        removeEvent(a, showPreview);
        addEvent(a, hidePreview);
    }

    function hidePreview() {
        var a = document.getElementById('previewctrl');
        var area = document.getElementById('preview');
        var textsize = document.getElementById('textsize');
        var ref = document.getElementById('resreferrer');
        area.style.display = 'none';
        form.body.style.display = 'inline';
        textsize.style.display = 'inline';
        if (ref) {
            ref.style.display = 'inline';
        }
        a.innerHTML = '[' + msg_preview + ']';
        removeEvent(a, hidePreview);
        addEvent(a, showPreview);
    }

    var p = form.getElementsByTagName('p')[0];
    var br = p.getElementsByTagName('br')[2];

    // Preview
    var span = document.createElement('span');
    span.innerHTML = ' <a href="" id="previewctrl" name="previewctrl"' +
                     ' onclick="return false;" onkeypress="return false;">[' +
                     msg_preview  + ']</a>'
    p.insertBefore(span, br);
    var preview = document.createElement('div');
    preview.id = 'preview';
    preview.style.display = 'none';
    form.appendChild(preview);
    var a = document.getElementById('previewctrl');
    addEvent(a, showPreview);

    // Text area size
    span = document.createElement('span');
    span.innerHTML = ' <a href="" id="textsize" name="textsize"' +
                     ' onclick="return false;" onkeypress="return false;">[' +
                     msg_spread  + ']</a>'
    p.insertBefore(span, br);
    a = document.getElementById('textsize');
    addEvent(a, spreadMsg);
});
