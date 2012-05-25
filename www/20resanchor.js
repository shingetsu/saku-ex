/* Popup Res Anchor.
 * Copyright (C) 2005-2012 shinGETsu Project.
 */

shingetsu.plugins.popupAnchor = function (e, aid) {
    var dtHtml = $('#r' + aid).html();
    var ddHtml = $('#b' + aid).html();

    dtHtml = dtHtml.replace(new RegExp('</?(input|a)[^<>]*>', 'ig'), '');
    ddHtml = ddHtml.replace( new RegExp('(<br[^<>]*>\\s*)*$', 'i'), '');

    var coordinate = new shingetsu.plugins.Coordinate(e);
    var dl = $('<dl>');
    dl.html('<dt>' + dtHtml + '</dt><dd>' + ddHtml + '</dd>');
    shingetsu.plugins.showPopup(coordinate, dl.get());
}

shingetsu.initialize(function () {
    function tryJump(event, id) {
        if (! document.getElementById('r' + id)) {
            return;
        }
        event.preventDefault();
        $('body').animate({scrollTop: $('#r' + id).offset().top}, 'fast'); 
        location.hash = '#r' + id;
    }

    $('a').each(function (i, anchor) {
        if (anchor.className != 'innerlink') {
            return;
        }
        if (anchor.href.search(/([0-9a-f]{8})/) <= 0) {
            return;
        }
        var id = RegExp.$1;
        $(anchor).mouseover(function (e) { shingetsu.plugins.popupAnchor(e, id) })
                 .mouseout(function (e) { shingetsu.plugins.hidePopup() })
                 .click(function (e) { tryJump(e, id) });
    });
});
