$(document).on('click', 'a[href="#"]', function(e){
    e.preventDefault();
});

// svg길이 구하기
$(function(){
    $('.svgAni').find('path').each(function(i, path){
        const length = path.getTotalLength();
        // alert(length);
    })
});

// 모션 효과 스크립트
$(function() {
	$('.animate').scrolla({
		mobile: true, //모바일버전시 활성화
		once: false //스크롤시 딱 한번만 하고싶을땐 true
	});    
})

// menuwrap 클릭시 메뉴 오픈 되는거 스크립트
$(function(){
    $('.menuopen button.open').on('click', function(){
        $('.menuopen .menuwrap').addClass('on');
    })
    $('.menuopen .menuwrap .close').on('click', function(){
        $('.menuopen .menuwrap').removeClass('on');
    })
})

// 브라우저 중간에 스크롤 내리면 배경색 바꾸기 스크립트
$(window).on('scroll resize', function(){
    let scrollPos = $(document).scrollTop();
    console.log(scrollPos);
    bgColor();
    
    function bgColor(){
        if(scrollPos > 1400){$('body').addClass('on')}
        else{$('body').removeClass('on')}
        if(scrollPos > 2700){$('body').removeClass('on')}
    }
})