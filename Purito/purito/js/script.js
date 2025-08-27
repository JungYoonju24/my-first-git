// motion
$(function(){
   $('.animate').scrolla({
      mobile:true,
      once:false
   })
})

// a클릭시 위로 튕김현상 제거 , 기본 속성 막기
$(document).on('click', 'a[href="#"]', function(e) {
   e.preventDefault();
})

// best 섹션 slick
$(document).ready(function(){
   $('.best ul.list').slick({
      slidesToShow : 3,
      slidesToScroll : 1,
      arrow : true,
      infinite : true,
      dots : false,
      prevArrow : '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
      nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
      responsive: [
         {
            breakpoint: 768,
            settings: {
               slidesToShow: 2,
               slidesToScroll: 1
            }
         },
         {
            breakpoint: 500,
            settings: {
               slidesToShow: 1,
               slidesToScroll: 1
            }
         }
      ]
   })
})

// touch 섹션 slick
$(window).on('load', function(){
   $('.touch ul').slick({
      slidesToShow : 1,
      slidesToScroll : 1,
      arrows : false,
      infinite : true,
      dots : true,
   });
   $('.touch ul').on('click', function(){
      $(this).slick('slickNext');
   });

// touch 마우스커서 
   let mouseX = 0;
   let mouseY = 0;
   let arrowX = 0;
   let arrowY = 0;
   let isInTouch = false;
   
   const arrow = document.querySelector('.arrow');
   
   function animateArrow() {
      if (!isInTouch) return; // 밖에 있으면 멈춤
   
// 마우스 부드럽게 따라가는 효과
      arrowX += (mouseX - arrowX) * 0.07;
      arrowY += (mouseY - arrowY) * 0.07;
   
      arrow.style.left = arrowX + 'px';
      arrow.style.top = arrowY + 'px';
   
      requestAnimationFrame(animateArrow);
   }
   
   document.querySelector('.touch').addEventListener('mouseenter', () => {
      isInTouch = true;
      arrow.style.transform = 'translate(-50%, -50%) scale(1)';
      animateArrow();
      document.body.style.cursor = 'none'; // 기본 커서 숨기기
   });
   
   document.querySelector('.touch').addEventListener('mouseleave', () => {
      isInTouch = false;
      arrow.style.transform = 'translate(-50%, -50%) scale(0)';
      document.body.style.cursor = 'default'; // 기본 커서 복구
   });
   
   document.querySelector('.touch').addEventListener('mousemove', (e) => {
      mouseX = e.pageX;
      mouseY = e.pageY;
   });
   
   
   $('touch').on('click', function(){
      $('.touch ul').slick('slickNext');
   });
});


// gnb tnb inner
$(function(){
   $('.gnb > li > a.product').on('mouseenter focusin', function(){
      let gnbIndex = $('.gnb > li > a.product').index($(this));
      $('.gnb .gnbinner').removeClass('on');
      $('.gnb > li > a.product').removeClass('active');
      $(this).parent('li').addClass('active'); 
      $('.gnb .gnbinner:eq('+ gnbIndex +')').addClass('on');
   })

   $('.gnb > li > a.product').on('mouseleave focusout', function(){
      $('.gnb > li > a.product').removeClass('on');
   })
   
    // gnbinner에서도 마우스가 나가면 메뉴 닫기
   $('.gnbinner').on('mouseleave', function(){
      $(this).removeClass('on');
      $('.gnb > li > a.product').removeClass('active');
   });


   $('.tnb > li').on('mouseenter focusin', function(){
      $(this).find('.tnbinner').addClass('on');
    })
    .on('mouseleave focusout', function(){
      $(this).find('.tnbinner').removeClass('on');
    });
})


// 메뉴버튼 누르면 안에 메뉴 카테고리 나오게하기
$(function(){
   $('.mob .fa-bars').on('click', function(){
      $('nav.mobmenu').toggleClass('on');
   })

   $('.mobmenu .icon').on('click', function(e){
      e.preventDefault(); // a 태그의 기본 동작(상단 이동) 막기
      $('nav.mobmenu').removeClass('on'); 
   });
})



// 탑버튼
$(window).scroll(function () {
   let scrollTop = $(window).scrollTop();
   let visualTop = $('.best').offset().top;
   let infoTop = $('.info').offset().top;
   let windowHeight = $(window).height();
   let btnHeight = $('.topbtn').outerHeight();
 
   // best 지나면 나타나기
   if (scrollTop > visualTop) {
     $('.topbtn').addClass('active');
   } else {
     $('.topbtn').removeClass('active');
   }
 
   // info 도착하면 멈추기
   if (scrollTop + windowHeight - btnHeight > infoTop) {
     $('.topbtn').addClass('stop');
     $('.topbtn').css('top', infoTop - btnHeight + 130 + 'px'); // 멈출 위치
   } else {
     $('.topbtn').removeClass('stop');
     $('.topbtn').css('top', 'auto'); // 다시 fixed
   }
 });

 // 탑버튼 상단으로 이동
$(function(){
   $('.topbtn').on('click', function(){
      const top = $('body').offset().top;
   //    offset()함수는 원하는 선택지의 위치값을 .top .left...등등 형식으로 반환
   $('html, body').animate({scrollTop :(top)},600);
   })
})

// 탑버튼 이미지 두개 교차
$(document).ready(function() {
   let currentIcon = 2; // 2번 아이콘부터 시작
   $('.icon2').fadeIn(0);  // 처음 브라우저 들어가면 아이콘2로 먼저 등장

   setInterval(function() {
       // 두 번째와 세 번째 아이콘만 교차
       if (currentIcon === 2) {
           $('.icon2').fadeIn(500);  // 2번 아이콘 표시
           $('.icon3').fadeOut(500);  // 3번 아이콘 숨기기
           currentIcon = 3;      // 다음은 3번 아이콘
       } else if (currentIcon === 3) {
           $('.icon3').fadeIn(500);  // 2번 아이콘 표시
           $('.icon2').fadeOut(500);  // 2번 아이콘 숨기기
           currentIcon = 2;      // 다음은 2번 아이콘
       }
   }, 5000); // 5초 간격으로 교체
});

