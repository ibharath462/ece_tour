function parallax(){
    var totalTime = 399;
    var itemsLoadedBeforeIntro = 400;   // MICHIEL: was 300
    var chapters = [[0,9,'Discovery',0],
                    [20,31,'Education',0],
                    [33,60,'True to life',0],
                    [61,35,'High-tech<br/>research',0],
                    [95,133,'Design',0],
                    [168,227,'Entrepreneurship',0],
                    [232,259,'Culture',0],
                    [257,293,'Organisation',0],
                    [315,333,'Living',0],
                    [342,364,'Sports',0],
                    [372,399,'Student life',0]];
    var content = [ {'time': 10,   'speed':'0.8'    ,'type':'poi',     'id':'hs_welkom',    'title':'Welkom'},
                    {'time': 19,   'speed':'0.8'    ,'type':'facts',   'id':'hs_algemeen',  'title':'Algemeen'},
                    {'time': 32,   'speed':'0.8'    ,'type':'poi',     'id':'hs_ectm',    'title':'ECTM'},
                    {'time': 50,   'speed':'0.9'    ,'type':'facts',   'id':'hs_atlas',    'title':'Atlas'},
                    {'time': 43,   'speed':'0.8'    ,'type':'facts',   'id':'hs_mensa',    'title':'Mensa'},
                    {'time': 60,   'speed':'0.8'    ,'type':'poi',     'id':'hs_nano',    'title':'Nano'},
                    {'time': 70,   'speed':'0.8'    ,'type':'facts',   'id':'hs_koelkast',    'title':'Koelkast'},
                    {'time': 95,   'speed':'0.8'    ,'type':'poi',     'id':'hs_virlab',    'title':'Virlab'},
                    {'time': 105,  'speed':'0.8'    ,'type':'facts',   'id':'hs_twizy',    'title':'Twizy'},
                    {'time': 118,  'speed':'0.8'    ,'type':'facts',   'id':'hs_enschede',    'title':'Enschede'},
                    {'time': 147.7,  'speed':'0.8'    ,'type':'facts',   'id':'hs_wifi',    'title':'Wifi'},
                    {'time': 168.4,'speed':'0.8'    ,'type':'poi',     'id':'hs_venture',    'title':'Venture'},
                    {'time': 190,  'speed':'0.8'    ,'type':'poi',     'id':'hs_game',    'title':'Game'},
                    {'time': 216,  'speed':'0.8'    ,'type':'facts',   'id':'hs_hotel',    'title':'Hotel'},
                    {'time': 245,  'speed':'0.8'    ,'type':'facts',   'id':'hs_cult_centrum',    'title':'Cult Centrum'},
                    {'time': 234,  'speed':'0.8'    ,'type':'facts',   'id':'hs_torentje',    'title':'Torentje'},
                    {'time': 258,  'speed':'0.8'    ,'type':'poi',     'id':'hs_bata',    'title':'Batavieren race'},
                    {'time': 288,  'speed':'0.8'    ,'type':'poi',     'id':'hs_klimwand',    'title':'Klimwand'},
                    {'time': 296,  'speed':'1'    ,'type':'poi',       'id':'hs_sportcentrum',    'title':'Sportcentrum'},
                    {'time': 318,  'speed':'0.8'    ,'type':'facts',   'id':'hs_wonen',    'title':'Wonen'},
                    {'time': 345,  'speed':'0.8'    ,'type':'facts',   'id':'hs_sport_spel',    'title':'Sport'},
                    {'time': 376,  'speed':'0.8'    ,'type':'facts',   'id':'hs_student',    'title':'Student'}];


    // =========================================================================
    // set Variables
    // =========================================================================
    var $doc = $(document);
    var $win = $(window);
    var doRich      = true;
    var isMobile    = /Android|webOS|BlackBerry|iPhone|iPod/i.test(navigator.userAgent);
    var isTouch     = 'ontouchstart' in window;
    var isChrome    = false;    //navigator.userAgent.indexOf('Chrome') > 0;    // MICHIEL: Test to find why Chrome doesn't work well. With this forced to false, it runs better in my version of Chrome. Older versions need testing
    var siteParam   = getParameterByName('site');
    var mainHeight  = $('#main').height();
    var windowWidth     = 0;
    var windowHeight    = 0;
    var fullHeight      = 0;
    var scrollHeight    = 0;
    var currentPosition = 0;
    var targetPosition = currentPosition;
    var bgImgWidth  = 480;
    var bgImgHeight = 270;
    var time        = 0;
    var intro_done  = false;
    var start_intro = false;
    var in_screen   = false;
    var lockTrack   = false;
    var currHotspot = -1;
    var intro_text_start_pos    = (0 - ($win.width() / 2 + 400)) + 'px';
    var intro_text_end_pos      = $('#intro .intro_text').css('left');
    var intro_girl_start_pos    = (0 - ($win.width() / 2 + 1000)) + 'px';
    var intro_girl_end_pos      = $('#intro_girl').css('right');
    var $videoImage = $('.street-view > img');
    var $allNavAnchors = $('#main .navigation a');
    var $timeElements = $('[data-position]');
    var timeElements = [];
    var hotspots = {};
    var scrollActivateTimeout, highresTimeout, currentSrc;
    var currScrollTop = -1;

    // =========================================================================
    // set View type
    // =========================================================================
    if(isAncientIE == true){
        doRich = false;
        $('body').addClass('poor');
        $('body *').remove();
        $('body').append('<div class="ie6_message"><div class="inner">This website is not suitable for Internet Explorer 6 or older. You can update the browser <a href="http://windows.microsoft.com/en-US/internet-explorer/products/ie/home" target="_blank">via</a> this page.</div></div>');
    }

    if(isMobile == true){
        $('#meta_viewport').attr('content','initial-scale=.6, maximum-scale=1, user-scalable=no');
        $('body').css('overflow','scroll');
        doRich = false;
    }

    if(doRich == true && $win.width() <= 750){
        doRich = false;
    }

    if(doRich == false && isAncientIE == false){
        $('body').addClass('poor');
        $('#main').css('height','auto');
        $('#main').append('<div class="mobile_message"><div class="inner"><span class="blue">Please note, this is the mobile version!</span><br>View this page on a tablet, laptop or desktop PC for an optimal experience.</div></div>');
        $('#utlogo').fadeIn();
    }

    // =========================================================================
    // uniform requestAnimFrame
    // =========================================================================
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
                };
    })();


    // =========================================================================
    // init Actions
    // =========================================================================
    $('#ribbon').focus();
    $('#ribbon').blur();
    $('#intro .intro_text').css('left', intro_text_start_pos);
    $('#intro_girl').css('right', intro_girl_start_pos);
    $('div.street-view').fadeIn();

    // MICHIEL: Reset position
    $(document).ready(function(){
        $doc.scrollTop(0);
        $win.scrollTop(0);
        $('#main').scrollTop(0);
        currentPosition = 0;
        targetPosition = 0;
    });

    if(parent.hideTakeOver != undefined){
        $('#close_frame').fadeIn();
        $('#toHomepage').attr('target','_top');
    }

    if(doRich == true){
        $.each(content,function(index,element){
            $('#' + element.id).attr('data-position', element.time / totalTime).attr('data-speed', element.speed);
        });
        $timeElements.each(function(){
                var $view   = $(this);
                var id      = $view.attr('id');
                var elem    = new TimeElement(this);
                timeElements.push( elem );
                if ( id ) hotspots[id] = elem;
                var offset = $view.offset();
                $view.css({position: 'fixed' , top: offset.top});
        });

        var uiImages = new Array(   'images/block_background.jpg',
                                    'images/touch_sprite.png',
                                    'images/touch_girl.png',
                                    'images/chalkboard.png');
        $.each(uiImages,function(index,element){
            var thisImg = new Image();
            thisImg.src = element;
            $(thisImg).load();
        });


        if(getScrollTop() > 0){
            currentPosition = getScrollTop() / scrollHeight;
            //alert(currentPosition);
        }

    }

    if(isTouch){
        $('body').removeClass('withAnimations');
    }

    if(isChrome){
        $('body').addClass('isChrome');
    }


    // =========================================================================
    // config Urls
    // =========================================================================
    $('#meta_og_url').attr('content', URL_landing);
    $('#meta_og_image').attr('content', URL_image);
    $('div.street-view img').attr('src', URL_image);
    $('#ribbon').attr('href', URL_sign_up);
    $('#cta').attr('href', URL_sign_up);
    $('a.cta_button_black').attr('href', URL_touch);
    if(siteParam != ''){
        $.each($('[data-fancybox-type]'),function(index,element){
            $(element).attr('href', element.href + '?site='+siteParam);
        });

    }




    // =========================================================================
    // preload Video images
    // =========================================================================
    if(doRich == true){
        var imageSeqLoader = new ProgressiveImageSequence( URL_cdn + "low_0{index}.jpg" , 2759 , {
                indexSize: 4,
                initialStep: (isIe7Or8||isTouch) ? 64 : 2,       // MICHIEL: WAS 64. Gebruik conditionele IE tag in index om de isIe7Or8 te laten werken. Moet op 64 blijven voor oudere IE's wegens bug in de image class
                onProgress: function() {
                    setPreloader();
                },
                onComplete: function() {setPreloader();$('#chapters a').removeClass('disabled');},
                stopAt: isSlowBrowser() ? (isTouch?6:8) : 1
        } );
        //stopAt: isSlowBrowser() ? (isTouch?4:8) : 1
        var loadCounterForIE = 0; // there seems to be a problem with ie calling the callback several times
        imageSeqLoader.loadPosition(currentPosition,function(){
                loadCounterForIE++;
                if ( loadCounterForIE == 1 ) {
                        showImage(currentPosition);
                        imageSeqLoader.load();
                        imageSeqLoader.load();
                        imageSeqLoader.load();    // MICHIEL: TEST MINDER PARALLEL CHANNELS
                        imageSeqLoader.load();
                        //imageSeqLoader.load();  // Additional channels test
                        //imageSeqLoader.load();
                }
        });
    }


    // =========================================================================
    // init Functions
    // =========================================================================
    if(doRich == true){
        calculateDimensions();
        setMenu();
        setChapters();
        animloop();
        handleResize();
    }
    // =========================================================================
    // init Events
    // =========================================================================


    // MICHIEL: Moved some method calls to event handler (async)

    $doc.on("animUpdate",function(e,data){
        customAnimation(data.curPos);
    });

    $doc.on("animUpdate",function(e,data){
        trackHotspot(data.targetPos);
    });

    $('#close_frame').click(function(){
        if(parent.hideTakeOver != undefined){
            parent.hideTakeOver();
        }
        return false;
    });

    $('a.facebook,a#end_share_facebook').click(function(){
            popup('https://www.facebook.com/sharer.php?u=' + URL_landing + '&t=' + document.title);
            return false;
    });

    $('a.twitter,a#end_share_twitter').click(function(){
            popup('http://twitter.com/intent/tweet?source=sharethiscom&text=Discover the campus of the University of Twente!&hashtags=utwente&url=' + URL_landing);
            return false;
    });

    $('#help').click(function(e){
        if($('#help_cloud').css('display') == 'none'){
            $('#help_cloud').fadeIn();
        }
        else{
            $('#help_cloud').fadeOut();
        }
        return false;
    });

    $('#help_cloud .close').click(function(e){
        $('#help_cloud').fadeOut();
        return false;
    });

    $('a[href^="#"]').click(function(event){
        event.preventDefault();
        var target = $(this).attr('href').substr(1);
        var hotspot = hotspots[target];
        if ( hotspot ) {
            var pos = hotspot.getPosition();
            setScrollTop( pos * scrollHeight );
        }
    });

    if(doRich == true){

        $(".fancybox").fancybox({
            fitToView       : true,
            autoSize        : true,
            closeClick      : false,
            scrolling       : 'no',
            scrollOutside   : false,
            padding         : 0,
            height          : 445,
            width           : 1000,
            autoHeight      : true,
            minHeight       : 445,
            beforeLoad      : function(e){
                if(currScrollTop == -1){
                    currScrollTop = $('html').scrollTop();
                }
                $('html').css('overflow','hidden');

            },
            beforeClose     : function(e){
                $('html').css('overflow','auto');
                $('html').scrollTop(currScrollTop);
                currScrollTop = -1;
            },
            onCancel        : function(e){
                $('html').css('overflow','auto');
                $('html').scrollTop(currScrollTop);
                currScrollTop = -1;
            },
            tpl             : {iframe: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" allowtransparency="true"></iframe>'}
        });
        $(".fancybox_text").fancybox({
            fitToView       : true,
            autoSize        : true,
            closeClick      : false,
            scrolling       : 'no',
            scrollOutside   : false,
            padding         : 0,
            height          : 445,
            width           : 800,
            autoHeight      : true,
            minHeight       : 445,
            beforeLoad      : function(e){
                if(currScrollTop == -1){
                    currScrollTop = $('html').scrollTop();
                }
                $('html').css('overflow','hidden');

            },
            beforeClose     : function(e){
                $('html').css('overflow','auto');
                $('html').scrollTop(currScrollTop);
                currScrollTop = -1;
            },
            onCancel        : function(e){
                $('html').css('overflow','auto');
                $('html').scrollTop(currScrollTop);
                currScrollTop = -1;
            },
            tpl             : {iframe: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" allowtransparency="true"></iframe>'}
        });
        $(".fancybox_image").fancybox({
            fitToView       : true,
            autoSize        : true,
            closeClick      : false,
            scrolling       : 'no',
            scrollOutside   : false,
            padding     : ["0","0"],
            maxHeight   : 800,
            beforeLoad      : function(e){
                if(currScrollTop == -1){
                    currScrollTop = $('html').scrollTop();
                }
                $('html').css('overflow','hidden');

            },
            beforeClose     : function(e){
                $('html').css('overflow','auto');
                $('html').scrollTop(currScrollTop);
                currScrollTop = -1;
            },
            onCancel        : function(e){
                $('html').css('overflow','auto');
                $('html').scrollTop(currScrollTop);
                currScrollTop = -1;
            }
        });
    }

    $('ul#chapters li a').click(function(e){
        var tar     = e.currentTarget;
        if(!$(tar).hasClass('disabled')){
            var chapter = tar.id.split('chapter_');
            var id      = parseInt(chapter[1]);
            setScrollTop(mainHeight * (chapters[id][0] / totalTime));
            trackEvent('Click', chapters[id][2].split('<br>').join(' '));
        }
        return false;
    });

    $doc.keydown(function(e){
        var speed = 30;                                // MICHIEL: was 200, 30 seems natural for scrolling
        if($('body.fancybox-lock').length == 0){
            if(e.keyCode == 40 || e.keyCode == 65){ // DOWN
                setScrollTop(getScrollTop() - speed);
                return false;
            }
            if(e.keyCode == 38 || e.keyCode == 81){ // UP
                setScrollTop(getScrollTop() + speed);
                return false;
            }
        }

    });

    if(doRich == true){
        $win.resize( handleResize );
        $win.scroll( handleScroll );
    }




    // =========================================================================
    // functions
    // =========================================================================
    function animloop(){
        requestAnimFrame(animloop);
        animElements();

    }

    function trackHotspot(pos){
        var _trackEvent = trackEvent;
        var targetTime = pos * totalTime;
        var range = 5;

        $.each(content,function(index,element){
            var thisMin = element.time;
            var thisMax = element.time + (range / 2);
            if(targetTime >= thisMin &&
                targetTime <= thisMax){
                    if(index != currHotspot){
                        currHotspot = index;
                        _trackEvent('Scroll', element.title)
                    }
                }
        });

    }

    function trackEvent(action,label){
        _gaq.push(['_trackEvent', 'Chapters', action, label]);
    }

    function setChapters(){
        $.each(chapters,function(index,element){
            var chapter = $('#chapter_' +index);
            if(chapter.length == 0){
                $('#chapters').append('<li><a href="#" id="chapter_' + index + '" class="disabled">' + element[2] + '</a></li>');
                chapter = $('#chapter_' +index);
            }
            chapters[index][3] = chapter.parent().position().left + ($('#chapter_' + index).width() / 2);
        });
    }

    function setScrollTop(value) {
        $win.scrollTop(value);
    }

    function getScrollTop() {
        return $win.scrollTop() || (document.documentElement && document.documentElement.scrollTop);
    }

    function calculateDimensions() {
        windowWidth = $win.width();
        windowHeight = $win.height();
        fullHeight = $('#main').height();
        scrollHeight = fullHeight - windowHeight;
    }

    function setTargetPosition( position , immediate ) {
        targetPosition = position;
        if ( immediate ) currentPosition = targetPosition;
        time = totalTime * targetPosition;
        setMenu();
    }

    function handleResize() {
            calculateDimensions();
            setChapters();
            renderBackgroundImage();
            renderTimeline( currentPosition );
            handleScroll();

            if(start_intro == false){
                var _preloader = $('#preloader');
                _preloader.css('left',((windowWidth - _preloader.width()) / 2));
                _preloader.css('top',((windowHeight - _preloader.height()) / 2));
                _preloader.fadeIn();
            }
    }

    function handleScroll() {
        if(!isTouch){
            setTargetPosition( getScrollTop() / scrollHeight );
            animElements();
        }
    }

    function animElements(){
        if ( Math.floor(currentPosition*5000) != Math.floor(targetPosition*5000) ) {
            var deaccelerate = Math.max( Math.min( Math.abs(targetPosition-currentPosition)*5000 , 10 ) , 2 );
            currentPosition += (targetPosition - currentPosition) / deaccelerate;

            // MICHIEL: Multiple changes here

            renderTimeline(currentPosition);

            $doc.trigger("animUpdate", {"curPos":currentPosition,"targetPos":targetPosition});

            // Now handled by event handler
            //trackHotspot(targetPosition); // MICHIEL: Disabled for now (pretty heavy call)
            //customAnimation(currentPosition);
        }
    }

    function renderTimeline( position ) {
        var _positionElement = positionElement;
        var _setElementActive = setElementActive;
        var _activateElement = activateElement;

        var minY = -500, maxY = windowHeight + 500;
        // element position
        $.each(timeElements,function(index,element){
                var elemPosition = element.getPosition();
                var elemY = windowHeight/2 + element.speed * (elemPosition-position) * scrollHeight;
                var active = false;
                if ( elemY < minY || elemY > maxY ) {
                        element.view.css({'display': 'none','visiblity':'none', top: '-1000px','webkitTransform':'none'});

                } else {
                        element.view.css({'display':'block', 'visiblity':'visible'});
                        _positionElement(element.view,null,elemY);
                        active = Math.abs(windowHeight/2 - elemY) < Math.max(windowHeight/5,100);
                }
                if ( getElementActive(element.view) != active ) {
                        clearTimeout( element.scrollActivateTimeout );
                        _setElementActive(element.view,active);
                        function doit() {
                                activateElement( element.view , active );
                        }
                        if ( active ) {
                                element.scrollActivateTimeout = setTimeout( doit , 1000 );
                        } else {
                                doit();
                        }
                        _activateElement( element.anchor , active );
                }
        });

        // video
        showImage( currentPosition );
    }

    function positionElement( elem , x , y ) {
        if ( Modernizr.csstransforms ) {
            var xpos = ( x === null ? $.data(elem,'x') : x ) || 0;
            var ypos = ( y === null ? $.data(elem,'y') : y ) || 0;
            $.data(elem,'x',xpos);
            $.data(elem,'y',ypos);
        }

        if ( $.browser.safari && !isTouch && !isChrome ) {
            elem.css({top:-1000,webkitTransform:'translate3d('+(xpos)+'px,'+(ypos+1000)+'px,0px)'});
        } else
        if ( Modernizr.csstransforms ) {
            var transform = 'translate('+(xpos)+'px,'+(ypos+1000)+'px)';
            elem.css({
                    top: -1000,
                    '-webkit-transform':transform,
                    '-moz-transform':transform,
                    '-o-transform':transform,
                    '-ms-transform':transform
            });
        } else{
            if ( x !== null ) {
                    elem.css('left',x);
            }
            if ( y !== null ) {
                    elem.css('top',y);
            }
        }
    }

    function activateElement( elem , active ) {
            $.data( elem , 'active' , active );
            active ? elem.addClass('active') : elem.removeClass('active');
    }
    function setElementActive( elem , active ) {
            $.data( elem , 'active' , active );
    }
    function getElementActive( elem ) {
            return $.data( elem , 'active' );
    }

    function renderBackgroundImage(){
        // get image container size
        var scale = Math.max( windowHeight/bgImgHeight , windowWidth/bgImgWidth );
        var width = scale * bgImgWidth , height = scale * bgImgHeight;
        var left = (windowWidth-width)/2, top = (windowHeight-height)/2;
        if ( ($.browser.safari || isTouch) && !isChrome ) {
                var transform = 'translate3d('+[-bgImgWidth/2,-bgImgHeight/2,0].join('px,')+'px) scale3d('+scale+','+scale+',1) translate3d('+[windowWidth/2/scale,windowHeight/2/scale,0].join('px,')+')';
                $videoImage
                        .width(bgImgWidth).height(bgImgHeight)
                        .css('-webkit-transform',transform)
                            .css({'position':'fixed', top: 0, left: 0});
        } else
        if ( Modernizr.csstransforms ) {
                var transform = 'translate('+[-bgImgWidth/2,-bgImgHeight/2].join('px,')+'px) scale('+scale+') translate('+[windowWidth/2/scale,windowHeight/2/scale].join('px,')+'px)';
                $videoImage
                        .width(bgImgWidth).height(bgImgHeight)
                        .css({
                                '-webkit-transform':transform,
                                '-moz-transform':transform,
                                '-o-transform':transform,
                                '-ms-transform':transform
                        })
                            .css({'position':'fixed', top: 0, left: 0});
        } else {
                $videoImage
                            .width(width).height(height)
                            .css('position','fixed')
                            .css('left',left+'px')
                            .css('top',top+'px');
        }
    }

    function showImage(position) {
        var index = Math.round( currentPosition * (imageSeqLoader.length-1) );
        var img = imageSeqLoader.getNearest( index );
        var nearestIndex = imageSeqLoader.nearestIndex;
        if ( nearestIndex < 0 ) nearestIndex = 0;
        var $img = $(img);
        var src;
        if ( !!img ) {
            src = img.src;
            if ( src != currentSrc ) {
                    $videoImage[0].src = src;
                    currentSrc = src;
            }
        }
        clearTimeout(highresTimeout);
        highresTimeout = setTimeout(function(){
                if ( !!src ) {
                        var highSrc = src.split('/Low/').join('/High/').split('low').join('high');
                        loadHighres(highSrc);
                }
        },isSlowBrowser()?500:150);
    }

    function loadHighres(src) {
            var videoImage = $videoImage[0];
            videoImage.src = src;
    }
    function setPreloader(){
        var loaded = imageSeqLoader.getNumLoaded();
        var loadedTime = imageSeqLoader.getLoadProgress() * totalTime;
        var curr = -1;

        $.each(chapters, function(index, value) {
            if(value[0] <= loadedTime){
                $('#chapter_' + index).removeClass('disabled');
                curr = index;
            }
        });

        var item = chapters[curr];
        var next = chapters[curr+1];
        var timelineWidth = item[3];
        if(next == undefined || next == null){
            timelineWidth += ((item[3] +  $('#chapter_' + curr).parent().width()) - item[3])/(item[1] - item[0]) * (loadedTime - item[0]);

        }
        else{
            timelineWidth += (next[3] - item[3])/(next[0] - item[0]) * (loadedTime - item[0]);
        }

        if(!isIe7Or8 && !isTouch){
            $('#line_loaded').width(timelineWidth);
        }

        if(loaded <= itemsLoadedBeforeIntro){
            $('div#preloader div.bar').css('width', ((loaded/itemsLoadedBeforeIntro) * 100 ) + '%');
        }
        else{
            if(start_intro == false){
                start_intro = true;
                intro();
            }
        }
    }

    function TimeElement( view , options ) {
        options = options || {};
        var $view = $(view);
        this.id = $view.attr('id');
        this.view = $view;
        this.anchor = $allNavAnchors.filter('[href="#'+$view.attr('id')+'"]');
        this.anchor = this.anchor.closest('li');
        this.getPosition = function() {return this.position;};
        this.position = options.position || Number( $view.attr('data-position') );
        this.speed = options.speed || Number( $view.attr('data-speed') ) || 1;
        this.align = options.align || $view.attr('data-align') || 'left';
    }

    function isSlowBrowser() {
            return isTouch || ($.browser.msie && Number($.browser.version) <= 8) ? true : false;
    }

    function setMenu(){
        var timelineWidth = 0;
        var position = getScrollTop() / mainHeight;
        time = position * totalTime;

        var next = null;
        $.each(chapters, function(index, value) {
            var chapter = $('#chapter_' + index);
            chapter.removeClass('active current');

            if(time + 1 >= value[0]){
                chapter.addClass('active current');
                next = chapters[index+1];
                timelineWidth = value[3];
                if(next == undefined || next == null){
                    timelineWidth += ((value[3] +  chapter.parent().width()) - value[3])/(value[1] - value[0]) * (time - value[0]);

                }
                else{
                    if(time + 1 >= next[0]){
                        chapter.removeClass('current');
                    }
                    timelineWidth += (next[3] - value[3])/(next[0] - value[0]) * (time - value[0]);
                }

            }
            else{
                chapter.removeClass('active');
            }


        });
        $('#line_on').css('width', timelineWidth + 'px');
    }

    function intro(){
        setMenu();
        $('#utlogo').fadeIn();
        $('#timeline_wrapper').fadeIn();

        setTimeout(function(){
            handleResize();
            setMenu();
        },100)

        if(getScrollTop() < 10){
            $('#preloader').fadeOut();

            $('#intro .intro_text').show();
            $('#intro .intro_text').animate({left: intro_text_end_pos}, 700, 'easeOutQuart');
            $('#intro_girl').show();
            $('#intro_girl').animate({right: intro_girl_end_pos}, 700, 'easeOutQuart');
            $('#timeline_wrapper').animate({bottom: '0px'}, 700, 'easeOutQuart', function(){
                intro_done = true;
                $('html,body').css('overflow','auto');
                $('.hotspots').show();
            });
        }
        else{
            intro_done = true;
            $('#preloader').fadeOut();
            $('#overlay').fadeOut();
            $('.hotspots').show();
            $('#timeline_wrapper').animate({bottom: '0px'});
            $('#intro .intro_text').show();
            $('#intro_girl').show();
        }
    }

    function customAnimation(val){
        var perc = val * 100;
        var end_perc = 100 - perc;

        // intro animation
        if(intro_done == true){
            var intro_perc   = (100 / 1) * perc;
            if(intro_perc > 100){
                intro_perc = 100;
            }
            if(intro_perc < 0){
                intro_perc = 0;
            }
            //console.log(intro_perc);
            var text_start  = parseInt(intro_text_start_pos.split('px')[0]);
            var text_end    = parseInt(intro_text_end_pos.split('px')[0]);
            var text_diff   = text_start - text_end;
            var text_val    = text_end + (text_diff / 100 * intro_perc);
            $('#intro .intro_text').css('left', text_val + 'px');

            var girl_start  = parseInt(intro_girl_start_pos.split('px')[0]);
            var girl_end    = parseInt(intro_girl_end_pos.split('px')[0]);
            var girl_diff   = girl_start - girl_end;
            var girl_val    = girl_end + (girl_diff / 100 * intro_perc);
            $('#intro_girl').css('right', girl_val + 'px');
            $('#overlay').css('opacity', (1- (intro_perc/100)));

            if(intro_perc == 100){
                $('#overlay').hide();
            }
            else{
                $('#overlay').show();
            }

            if(end_perc <= 2){
                var outro_perc = 1 - (end_perc / 2);
                if(outro_perc > 1){
                    outro_perc = 1;
                }
                if(outro_perc < 0){
                    outro_perc = 0;
                }
                $('#outro').css('top', (outro_perc * 100) - 50 + '%');

                if(currHotspot != 99){
                    currHotspot = 99;
                    trackEvent('Scroll', 'Eindscherm');
                }

            }
            else{
                $('#outro').css('top', '-50%');
            }


        }
    }

    // =========================================================================
    // touch functions
    // =========================================================================
    if ( isTouch && doRich) {

        (function(){

                $('#main').css('height',1);

                var scrollPos = 0;
                var MAXSCROLL = 70000;

                var oldCalculateDimensions = calculateDimensions;
                calculateDimensions = function() {
                        oldCalculateDimensions();
                        scrollHeight = MAXSCROLL - windowHeight;
                };

                var oldGetScrollTop = getScrollTop;
                getScrollTop = function() {
                        return scrollPos;
                };

                var oldSetScrollTop = setScrollTop;
                setScrollTop = function(value) {
                        scrollPos = value;
                        dispatchScroll();
                };

                function dispatchScroll() {
                        targetPosition = scrollPos / scrollHeight;
                        time = totalTime * targetPosition;
                        setMenu();
                        //customAnimation(targetPosition);
                }

                var d = document;
                var touchMoved, touchDown, touchBeginPosition, isLinkTouch;

                function onTouchStart(event) {
                        var isNavigation = $(event.target).filter('a');
                        if ( isNavigation.length ) {
                                isNavigation = isNavigation.parents('.navigation').length >= 1;
                                return;
                        }
                        if ( $(event.target).parents('a').length == 0 ) {
                                event.preventDefault();
                        }
                        touchDown = true;
                        var touch = event.touches[0];
                        touchX = touch.clientX;
                        touchY = touch.clientY;
                        touchBeginPosition = {x: touchX , y: touchY , scroll: scrollPos};
                        d.addEventListener('touchmove', onTouchMove, false);
                        d.addEventListener('touchend', onTouchEnd, false);
                }
                function onTouchMove(event) {
                    event.preventDefault();
                        var touch = event.touches[0];
                        touchX = touch.clientX;
                        touchY = touch.clientY;
                        var dy = (touchY-touchBeginPosition.y);
                        if ( Math.abs(dy) > 3 ) {
                    touchMoved = true;
                        }
                        scrollPos = touchBeginPosition.scroll - dy * 2;
                        scrollPos = Math.min( MAXSCROLL , Math.max( 0 , scrollPos ) );
                        dispatchScroll();
                }
                function onTouchEnd(event) {
                        if ( touchMoved ) {
                                event.preventDefault();
                        }

                        d.removeEventListener('touchmove', onTouchMove, false);
                        d.removeEventListener('touchend', onTouchEnd, false);
                        touchDown = false;
                }

                d.addEventListener('touchstart', onTouchStart, false);
//					d.getElementsByClassName('street-view')[0].addEventListener('touchstart', onTouchStart, false);
        })();

}


}


// =========================================================================
// utils
// =========================================================================
function popup(url){
    window.open(url, '', 'toolbar=0,scrollbars=1,location=0,statusbar=1,menubar=0,resizable=0,width=655,height=450,left = 420,top = 225')
    this.blur();
    return false;
}

function easeCos(t) {
        return Math.cos( (x*Math.PI+Math.PI)+1 ) / 2;
}

function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}
