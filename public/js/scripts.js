(function($) {
    'use strict'; // Start of use strict

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
        if(location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name='+this.hash.slice(1)+']');
            if(target.length) {
                $('html, body').animate({
                    scrollTop: (target.offset().top-40)
                }, 1000, 'easeInOutExpo');
                return false;
            }
        }
    });

    // Closes responsive menu when a scroll trigger link is clicked
    $('.js-scroll-trigger').click(function() {
        $('.navbar-collapse').collapse('hide');
    });

    $('.navbar-toggler').click(function() {
        $('#nav-icon3').toggleClass('open');
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $('body').scrollspy({
        target: '#mainNav',
        offset: 48
    });

    // Collapse Navbar
    var navbarCollapse = function() {
        if($('#mainNav').offset().top > 100) {
            $('#mainNav').addClass('navbar-shrink');
        }
        else {
            $('#mainNav').removeClass('navbar-shrink');
        }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);

    //Scroll Reveal
    window.sr = ScrollReveal();
    sr.reveal('.animation-1', {duration: 1000});
    sr.reveal('.animation-2', {duration: 2000}, 250);
    sr.reveal('.animation-from-right', {
        duration: 1000,
        origin: 'right'
    });
    sr.reveal('.animation-from-left', {
        duration: 1000,
        origin: 'left'
    });
    sr.reveal('.animation-5', {delay: 1400});
    sr.reveal('.animation-6', {delay: 1700});
    sr.reveal('.animation-7', {delay: 2000});
    sr.reveal('.animation-8', {delay: 2300});

    if($('.js-lazyYT').length) {
        $('.js-lazyYT').lazyYT();
    }

    //Photo gallery
    if($('.popup-gallery').length) {
        $('.popup-gallery').magnificPopup({
            delegate: 'a',
            type: 'image',
            closeOnContentClick: false,
            closeBtnInside: false,
            mainClass: 'mfp-with-zoom mfp-img-mobile',
            image: {
                verticalFit: true
            },
            gallery: {
                enabled: true
            },
            zoom: {
                enabled: true,
                duration: 300, // don't foget to change the duration also in CSS
                opener: function(element) {
                    return element.find('img');
                }
            }
        });
    }
})(jQuery);
