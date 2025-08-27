//1.스크립트 위로 튕기는것
$(document).on('click', 'a[href="#"]', function(e){
    e.preventDefault();
});

$(function(){
	$('.animate').scrolla({
		mobile: true, //모바일버전시 활성화
		once: false //스크롤시 딱 한번만 하고싶을땐 true
	});    
}); 

$(function(){
    $('.visual .slide').slick({
        arrows: true,
        dots: true,
        fade: true,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: false,
        pauseOnFocus: false  
    });
    $('.slick-prev').text("prev");

    $('.slide2').slick({
        arrows: false,
        dots: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        Infinite: true,
        autoplaySpeed: 6000,
        pauseOnHover: false,
        pauseOnFocus: false  
    });

    $('.slide2 #slick-slide-control10').text("서울 마곡지구 업무 용지");
    $('.slide2 #slick-slide-control11').text("서울 마곡지구 대방디엠시티2차");
    $('.slide2 #slick-slide-control12').text("서울 마곡지구 대방디엠시티 더 센텀");
    $('.slide2 #slick-slide-control13').text("광주 수완 대방노블렌드6차");
});

$(function(){
    Splitting();  //대문자로쓴다!!!
});

// gnb inner 
$(function(){
    $('.gnb > li > a').on('mouseenter focus', function(){
        let gnbIndex = $('.gnb > li > a').index($(this));
        // alert(gnbIndex);
        // console.Log(gnbIndex);
        $('.gnb .inner').removeClass('on');
        $('.gnb .inner:eq('+ gnbIndex +')').addClass('on');
    })
    $('header').on('mouseleave blur', function(){
        $('.gnb .inner').removeClass('on');
    });
});

// 마우스 이벤트가 일어날때 '이벤트가 일어나는 인덱스 값을 gnbindex값에 저장해라'
// this 이벤트가 일어나는 대상, 마우스가 엔터되는 자신
// = 저장 이라는 뜻 
// alert = 경고창  (a에 마우스 대면 위에 하얗게 번호 팝업 뜸)
// eq : index 값을 가져오는 메소드 
// 호출할때 '' 따옴표로 무조건 묶지만, 변수는 묶지않음


// scroll down (스크롤 아이콘 누르면 내려가기)
$(function(){
    $('.scroll').on('click', function(){
        var scrollBtn = $('#scrollpos').offset().top;
        $('html, body').animate({scrollTop:(scrollBtn)}, 400)
    })
})
// offset = 위치값 


// 비디오 이미지 누르면 영상 나옴 
$(function(){
    $('.videobox .mask').on('click', function(){
        $(this).css({display:'none'});
    })
})