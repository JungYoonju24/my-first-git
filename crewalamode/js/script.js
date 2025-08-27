$(function() {
    $('.animate').scrolla({
       mobile: true,
       once: false
    });    
 });
 
 
 $(function(){
    Splitting();
 });
 
 // a클릭시 위로 튕김현상 제거 , 기본 속성 막기
 $(document).on('click', 'a[href="#"]', function(e) {
    e.preventDefault();
 })
 
 // 스크롤 이벤트
 $(window).on('scroll resize', function(){
    var scrollPos = 0;
    scrollPos = $(document).scrollTop();
    console.log(scrollPos);
    fixHeader();
    fix();
    fixlist();
 
    function fixHeader() {
       if(scrollPos > 80){$('header').addClass('on');}
       else{$('header').removeClass('on')}
    }
    function fix(){
       if(scrollPos > 1250){$('.fix .text').addClass('on')}
       else{$('.fix .text').removeClass('on')}
       if(scrollPos > 2700){$('.fix .text').removeClass('on')}
    }
 
 //화면에서 안보이다가 그부분에 스크롤 할때 생기고 사라지기 -> 먼저 remove 를 해놨다가 add class 주기 , eq는 나올 순서 지정해놓은거
    function fixlist(){
       if(scrollPos > 1250){
          $('.approach .inner .list li a').removeClass('on')
          $('.approach .inner .list li:eq(0) a').addClass('on')}
       if(scrollPos > 1650){
          $('.approach .inner .list li a').removeClass('on')
          $('.approach .inner .list li:eq(1) a').addClass('on')}
       if(scrollPos > 2050){
          $('.approach .inner .list li a').removeClass('on')
          $('.approach .inner .list li:eq(2) a').addClass('on')}
       if(scrollPos > 2550){
          $('.approach .inner .list li a').removeClass('on')
          $('.approach .inner .list li:eq(3) a').addClass('on')}
    }
 })
 // eq : 인덱스 값을 사용해 원하는 위치의 요소를 선택허여 가져올 수 있는 선택자 메소드
 
 // 메뉴버튼 누르면 안에 메뉴 카테고리 나오게하기
 $(function(){
    $('.gnbbtn').on('click', function(){
       $('nav.gnb').toggleClass('on');
    })
 })