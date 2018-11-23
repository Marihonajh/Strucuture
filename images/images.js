var query = document.getElementById('searchQuery').className;

var page = 0;
var lastObject = null;
var initialized = false;
var remSpinner = function () {
    $('.spinner-holder').remove();
}
var addSpinner = function () {
    remSpinner();
    $('body').append('<div class="spinner-holder"><div class="spinner"></div></div>');
}

var showImageData = function (elem) {
    lastObject = elem;
    var elemTop = 0;
    if ($(elem).parent())
        elemTop = $(elem).parent().position().top;
    var nextObj = null;
    $('#images .item').each(function (e) {
        var eTop = $(this).position().top;
        if (eTop > elemTop) {
            nextObj = $(this);
            return false;
        }
    });
    if (nextObj != null) {
        //nextObj.append('<div style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; z-index: 20; background: rgba(0,0,0,.5);"></div>');

        $('.itemSelect').remove();
        var oldTop = -1;
        var newTop = -100;
        if ($('.objDisplay').length > 0) {
            oldTop = $('.objDisplay').position().top;
        }
        $('.objDisplay').remove();

        elem.parent().append('<div class="itemSelect"></div>')
        var objDisplay = nextObj.before('<div class="objDisplay"></div>');

        /*img.setAttribute('data-title', data[i].title);
                    img.setAttribute('data-url', data[i].url);
                    img.setAttribute('data-site', data[i].destination);*/

        var title = elem.attr('data-title');
        var url = elem.attr('data-url');
        var site = elem.attr('data-site');

        var html = ('<div class="row"><div class="col-md-3"><img style="max-width: 100%; max-height: 350px;" src="' + url + '" /></div>')
        html += ('<div class="col-md-9"><p><a  target="_blank" href="' + site + '">' + title + '</a></p><p><cite>' + site + '</cite></p>')
        html += ('<div class=row"><div class="col-xs-12"><a class="btn btn-primary" href="' + url + '" target="_blank">View Image</a>&nbsp;&nbsp;<a target="_blank" href="' + site + '" class="btn btn-default">View Page</a></div></div></div></div>');
        $('.objDisplay').append(html);
        if ($('.objDisplay').length > 0) {
            newTop = $('.objDisplay').position().top;
        }
        var heightToAnimateTo = $('.objDisplay .row:first-child').height();
        focusLastObject();
    }
}

var focusLastObject = function () {
    var el = $('.objDisplay');
    var elOffset = el.offset().top;
    var elHeight = el.height();
    var windowHeight = $(window).height();
    var offset;

    if (elHeight < windowHeight) {
        offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
    }
    else {
        offset = elOffset;
    }
    $('html, body').animate({
        scrollTop: offset //$(".objDisplay").offset().top
    }, 500);
};

$(document).ready(function () {
    addSpinner();
    loadData = function () {
        page++;
        if (page < 7) {
            addSpinner();
            $.getJSON('/images/page?page=' + page + '&q=' + query + '&safeSearch=' + window.isSafeSearch, function (data) {
                var parentObj = document.getElementById('images');
                for (var i = 0; i < data.length; i++) {
                    var div = document.createElement('div');
                    div.className = 'item';
                    div.setAttribute('data-w', data[i].width);
                    div.setAttribute('data-h', data[i].height);
                    var img = document.createElement('img');
                    img.src = data[i].thumbUrl;
                    img.setAttribute('data-title', data[i].title);
                    img.setAttribute('data-url', data[i].imageUrl);
                    img.setAttribute('data-site', data[i].destination);
                    div.appendChild(img);
                    parentObj.appendChild(div);
                    //$('#images').append(
                    //    '<div class="item"><a href="' + data[i].destination + '" target="_blank"><img src="' + data[i].thumbUrl + '" alt="' + data[i].title + '" /></a></div>'
                    //);
                }
                if (!initialized) {
                    $('#images').flexImages({rowHeight: 180});
                    initialized = true;
                } else {
                    $('#images').flexImages({ rowHeight: 180 });
                }
                $('#images img').unbind('click');
                $('#images img').bind('click', function (e) {
                    showImageData($(this));
                })
                remSpinner();
            }).fail(function () {
                remSpinner();
            });
        }
        
    }



    $(window).resize(function () {
        setTimeout(function () {
            $('#images').flexImages({ rowHeight: 180 });
            $('.objDisplay').remove();
            showImageData(lastObject);
            focusLastObject();
        }, 10);
    });

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            loadData();
        }
    });    
    loadData();

    
});