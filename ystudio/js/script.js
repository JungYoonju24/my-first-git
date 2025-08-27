// slick
$(function(){
    $('.visual .slide').slick({
        arrow: true,
        dots: false,
        fade: true,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: false,
        pauseOnFocus: false
    })
})

// splitting
$(function(){
    Splitting();  //대문자로쓴다!!!
});


//   scrolla
$(function() {
	$('.animate').scrolla({
		mobile: true, //모바일버전시 활성화
		once: false //스크롤시 딱 한번만 하고싶을땐 true
	});    
});




//fixHeader
var scrollTop = 0;
//console.log(scrollTop);
scrollTop = $(document).scrollTop();
fixHeader();

$(window).on('scroll resize', function() {
    scrollTop = $(document).scrollTop();
    fixHeader();
})

function fixHeader() {
    if(scrollTop > 150) {
        $('header').addClass('on');
    }
    else {
        $('header').removeClass('on');
    }
}