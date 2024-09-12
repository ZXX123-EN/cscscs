// 回到底部
$('.tools-btn_back-down').on('click', function() {
  console.log('回到底部');
  $('html,body').animate({
    scrollTop: $(document).height()
  }, 900);
});

$('#OnlineConsultationBtn').on('click', function() {
  // var id = $(this).attr('data-service-id');
  // console.log('在线咨询', doyoo);
  // doyoo.util.openChat('g=' + id);
  _YUNQUE.openDialog();
  return false;
});

$('#OnlineConsultationBtn2').on('click', function() {
  _YUNQUE.openDialog();
  return false;
});


// if($('#index').length > 0) {
//   console.log('首页');
//   initRightToolsSwitch();
// } else {
//   console.log('非首页');
// }
initRightToolsSwitch();

function initRightToolsSwitch() {
  // ==========================================================================================
  // 下面的代码是v2版本的右侧工具栏切换显示隐藏的代码
  // ==========================================================================================
  // 定时隐藏
  var rightToolsTimer = setTimeout(function() {
    $('.right-tools-container').addClass('hide');
    clearTimeout(rightToolsTimer);
  }, 2000);
  
  // 手机版切换
  $('.right-tools-container').on('touchend', function(e) {
    console.log('touchend');
    e.stopPropagation();
    if($(this).hasClass('hide')) {
      $(this).removeClass('hide');
    } else {
      $(this).addClass('hide');
    }
    // var right = $('.right-tools-container').css('right');
    // console.log(right);
    // if(right == '0px') {
    //   $('.right-tools-container').css('right', function() {
    //     return $('.right-tools-container .tools-wrapper').outerWidth();
    //   });
    //   $('.right-tools-container .tools-wrapper').css('right', '0px');
    //   $('.right-tools-container .open-icon-btn').css('transform', 'rotate(180deg)');
    // } else {
    //   $('.right-tools-container').css('right', '0px');
    //   $('.right-tools-container .tools-wrapper').css('right', function() {
    //     return -$(this).outerWidth();
    //   });
    //   $('.right-tools-container .open-icon-btn').css('transform', 'rotate(0deg)');
    // }
  });
}
// ==========================================================================================
  // 下面的代码是v1版本的右侧工具栏切换显示隐藏的代码
  // ==========================================================================================
  // 定时隐藏
  // var rightToolsTimer = setTimeout(function() {
  //   $('.right-tools-wrapper').addClass('hide');
  //   clearTimeout(rightToolsTimer);
  // }, 2000);
  
  
  // // 触发显示
  // $('.right-tools-wrapper .open-icon').on('mouseover', function(e) {
  //   e.stopPropagation();
  //   if(!isPc()) {
  //     return;
  //   }
  //   $('.right-tools-wrapper').removeClass('hide');
  // });
  // $('.right-tools-wrapper .open-icon').on('mouseout', function(e) {
  //   e.stopPropagation();
  // });
  // $('.right-tools-wrapper').on('mouseover', function(e) {
  //   e.stopPropagation();
  //   $('.right-tools-wrapper').removeClass('hide');
  // });
  // $('.right-tools-wrapper .open-icon').on('click', function(e) {
  //   e.stopPropagation();
  //   $('.right-tools-wrapper').toggleClass('hide');
  // });
  
  
  // // 移出隐藏
  // $('.right-tools-wrapper').on('mouseout', function(e) {
  //   e.stopPropagation();
  //   console.log('Hide Right Tools');
  //   $('.right-tools-wrapper').addClass('hide');
  // });