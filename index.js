var swiperFullpage; // 全屏滚动Swiper
var swiperFirstScreenVideo; // 第一屏视频Swiper
var swiperAnimes; // 动画Swiper
var swiperFirstScreenVideoPlayStatus = 0; // 第一屏视频当前播放状态。0: 暂停；1: 播放；
var swiperFirstScreenVideoVolumeValue = 0; // 第一屏视频当前音量。0-1
var aniCurrent = 0; // 动画下标
var aniStatus = false; // 动画播放状态
var masterBgMusic = document.getElementById('masterBgMusic'); // 大师动画背景音乐
masterBgMusic.loop = true; // 设置大师动画背景音乐循环播放


initSwiperFullpage(); // 初始化全屏滚动Swiper
initSwiperFirstScreenVideo(); // 初始化第一屏视频Swiper
initSwiperAnimes(); // 初始化动画Swiper
monitorMouseScrolling(); // 监听鼠标的滚动
initFirstScreenVideos(); // 初始化第一屏的视频
initVideoFirstScreenCtrBtns(); // 初始化第一屏的视频按钮操作

var anisTimer = setTimeout(function() {
  initAnis(); // 初始化动画
  clearTimeout(anisTimer);
}, 4000);
// initAnis();                      // 初始化动画



// 移除内页独有的class
$('.header-inner-page').removeClass('header-inner-page');
$('.shrink').removeClass('shrink');



/**
 * ####################################################################################################
 * ### 初始化全屏滚动Swiper
 * ### 该Swiper禁用掉了拖动和滚轮切换效果，因为该页面有多处需要监听鼠标滚轮滚动事件，
 * ### 会和Swiper的事件冲突，所以禁用掉了
 * ### Swiper的切换统一在鼠标的滚轮的监听事件中进行处理
 * ####################################################################################################
 */
function initSwiperFullpage() {
  swiperFullpage = new Swiper('.swiper-container_fullpage', {
    initialSlide: 0, // 设定初始化时slide的索引
    direction: 'vertical', // 滑动方向，可设置为水平方向切换(horizontal)或垂直方向切换(vertical)
    speed: 900, // 切换速度，即slider自动滑动开始到结束的时间（单位ms）
    resistance: false, // 边缘抵抗
    resistanceRatio: 0, // 抵抗率。边缘抵抗力的大小比例。值越小抵抗越大越难将slide拖离边缘，0时完全无法拖离
    slidesPerView: 'auto', // 设置slider容器能够同时显示的slides数量(carousel模式)
    mousewheel: false,
    // 分页器
    pagination: {
      el: '.swiper-container_fullpage_pagination',
    },
    noSwipingClass: isPc() ? 'swiper-slide_fullpage_no-swiping' : 'swiper-no-swiping', // 不可拖动块的类名
    // 事件
    on: {
      // 从当前slide开始过渡到另一个slide时执行
      slideChangeTransitionStart: function() {
        console.log('Slide Start', this);
        // 进入第一屏
        if (this.activeIndex == 0) {
          // 为第一屏的Header添加单独的class
          $('.header-pc-wrapper').addClass('first-screen');
        }
      },

      // 从一个slide过渡到另一个slide结束时执行
      slideChangeTransitionEnd: function() {
        console.log('Slide Ended', this);
        // 离开第一屏
        if (this.activeIndex != 0) {
          // 移除为第一屏的Header添加单独的class
          $('.header-pc-wrapper').removeClass('first-screen');
          // 停止第一屏的视频播放
          videoFirstScreenStop();
        }

        // 离开动画屏
        if (this.activeIndex != 3) {
          // 重置动画为初始状态
          aniReset();
        }
      },
    }
  });
}



/**
 * ####################################################################################################
 * ### 初始化第一屏视频Swiper
 * ####################################################################################################
 */
function initSwiperFirstScreenVideo() {
  swiperFirstScreenVideo = new Swiper('.swiper-container_first-screen-video', {
    initialSlide: 0, // 设定初始化时slide的索引
    direction: 'horizontal', // 滑动方向，可设置为水平方向切换(horizontal)或垂直方向切换(vertical)
    speed: 900, // 切换速度，即slider自动滑动开始到结束的时间（单位ms）
    // 事件
    on: {
      // 从一个slide过渡到另一个slide结束时执行
      slideChangeTransitionEnd: function() {
        console.log('Slide Ended', this, );
        console.log('swiper', this);
        console.log('slide', this.slides[this.activeIndex]);
        console.log('activeIndex', this.activeIndex);
        console.log("swiperFirstScreenVideoPlayStatus:", swiperFirstScreenVideoPlayStatus);
        // 控制按钮组
        var ctrBtns = $('.swiper-container_first-screen-video .video-controls');
        // 延续上个视频的播放状态和声音状态
        if (this.slides && this.slides[this.activeIndex] && this.slides[this.activeIndex].videoPlayer) {
          if (swiperFirstScreenVideoPlayStatus == 1) {
            // 播放视频
            videoFirstScreenPlay();
          } else {
            // 停止视频
            videoFirstScreenStop();
          }
          // 设置音量
          this.slides[this.activeIndex].videoPlayer.volume(swiperFirstScreenVideoVolumeValue);
          // 显示视频控制按钮组
          ctrBtns.removeClass('hide');
        }
        // 停止播放视频
        else {
          // 停止视频
          videoFirstScreenStop();
          // 移除视频控制按钮组
          ctrBtns.addClass('hide');
        }
      }
    },
    navigation: { // 前进后退按钮
      nextEl: '.swiper-first-screen-video-button-next', // 设置前进按钮的css选择器或HTML元素
      prevEl: '.swiper-first-screen-video-button-prev', // 设置后退按钮的css选择器或HTML元素
      disabledClass: 'disabled',
    },
  });

  // 只有一屏的时候隐藏左右切换按钮
  if ($('.swiper-slide_first-screen-video').length <= 1) {
    $('.swiper-first-screen-video-button').hide();
  }
}



/**
 * ####################################################################################################
 * ### 初始化动画Swiper
 * ####################################################################################################
 */
function initSwiperAnimes() {
  swiperAnimes = new Swiper('.swiper-container_anis', {
    initialSlide: 0, // 设定初始化时slide的索引
    direction: 'horizontal', // 滑动方向，可设置为水平方向切换(horizontal)或垂直方向切换(vertical)
    // speed: isPc() ? 0 : 900,                // 切换速度，即slider自动滑动开始到结束的时间（单位ms）
    speed: 0, // 切换速度，即slider自动滑动开始到结束的时间（单位ms）
    resistance: false, // 边缘抵抗
    resistanceRatio: 0, // 抵抗率。边缘抵抗力的大小比例。值越小抵抗越大越难将slide拖离边缘，0时完全无法拖离
    slidesPerView: 'auto', // 设置slider容器能够同时显示的slides数量(carousel模式)
    mousewheel: false,
    noSwipingClass: isPc() ? 'swiper-slide_anis_no-swiping' : 'swiper-slide-swiping', // 不可拖动块的类名
    // 事件
    on: {
      // 从一个slide过渡到另一个slide结束时执行
      slideChangeTransitionEnd: function() {
        console.log('Slide Ended', this);
      },
    }
  });
}



/**
 * ####################################################################################################
 * ### 初始化第一屏的视频 - 这一版有BUG
 * ####################################################################################################
 */
// function initFirstScreenVideos() {
//   var videos;
//   if (isPc()) {
//     $('.swiper-slide_first-screen-video .video_pc').show();
//     $('.swiper-slide_first-screen-video .video_mo').hide();
//     videos = $('.swiper-slide_first-screen-video .video_pc');
//   } else {
//     $('.swiper-slide_first-screen-video .video_pc').hide();
//     $('.swiper-slide_first-screen-video .video_mo').show();
//     videos = $('.swiper-slide_first-screen-video .video_mo');
//   }
//   console.log('Init Videos', videos);
//   videos.each(function(index, el) {
//     console.log('slideCurrent', index);
//     var player = videojs(el, {
//       loop: true,
//       autoplay: false,
//       muted: true
//     });
//     if (swiperFirstScreenVideo && swiperFirstScreenVideo.slides && swiperFirstScreenVideo.slides[index]) {
//       swiperFirstScreenVideo.slides[index].videoPlayer = player;
//       console.log('slideCurrent', index);
//       console.log('videoPlayer', swiperFirstScreenVideo.slides[index].videoPlayer);
//     }
//   });
//   console.log('默认设置静音');
//   videoFirstScreenMute();
//   // 判断第一屏是否是视频
//   // 是视频：显示控制按钮，播放视频；否则：隐藏控制按钮；
//   var videoCurrent = swiperFirstScreenVideo.activeIndex;
//   if (swiperFirstScreenVideo && swiperFirstScreenVideo.slides && swiperFirstScreenVideo.slides[videoCurrent] && swiperFirstScreenVideo.slides[videoCurrent].videoPlayer) {
//     $('.swiper-container_first-screen-video .video-controls').removeClass('hide');
//     videoFirstScreenPlay();
//   }
// }

/**
 * ####################################################################################################
 * ### 初始化第一屏的视频
 * ####################################################################################################
 */
function initFirstScreenVideos() {
	console.log('Init Videos');
	
	if (isPc()) {
	  $('.swiper-slide_first-screen-video .video_pc').show();
	  $('.swiper-slide_first-screen-video .video_mo').hide();
	  videos = $('.swiper-slide_first-screen-video .video_pc');
	} else {
	  $('.swiper-slide_first-screen-video .video_pc').hide();
	  $('.swiper-slide_first-screen-video .video_mo').show();
	  videos = $('.swiper-slide_first-screen-video .video_mo');
	}
	
	var slides = $('.swiper-container_first-screen-video .swiper-slide');
	// console.log('slides', slides);
	
	for(var i = 0; i < slides.length; i++){
		(function(current) {
			var video = null;
			if(isPc()) {
				$('.fullscreen-image-mo').hide();
				if(slides.eq(current).children('.video_pc').length > 0) {
					video = slides.eq(current).children('.video_pc')[0];
				}
			} else {
				$('.fullscreen-image-pc').hide();
				if(slides.eq(current).children('.video_mo').length > 0) {
					video = slides.eq(current).children('.video_mo')[0];
				}
			}
			// console.log('第' + current + '个video对象 ->', video);
			if(video) {
				var player = videojs(video, {
				  loop: true,
				  autoplay: false,
				  muted: true
				});
				if (swiperFirstScreenVideo && swiperFirstScreenVideo.slides && swiperFirstScreenVideo.slides[current]) {
				  swiperFirstScreenVideo.slides[current].videoPlayer = player;
				  console.log('swiperFirstScreenVideo', swiperFirstScreenVideo);
				  console.log('slideCurrent', current);
				  console.log('videoPlayer', swiperFirstScreenVideo.slides[current].videoPlayer);
				}
			}
			console.log('默认设置静音');
			videoFirstScreenMute();
			// 判断第一屏是否是视频
			// 是视频：显示控制按钮，播放视频；否则：隐藏控制按钮；
			var videoCurrent = swiperFirstScreenVideo.activeIndex;
			if (swiperFirstScreenVideo && swiperFirstScreenVideo.slides && swiperFirstScreenVideo.slides[videoCurrent] && swiperFirstScreenVideo.slides[videoCurrent].videoPlayer) {
			  $('.swiper-container_first-screen-video .video-controls').removeClass('hide');
			  videoFirstScreenPlay();
			}
		})(i);
		
		$(window).resize(function() {
			if(isPc()) {
				$('.fullscreen-image-mo').hide();
			} else {
				$('.fullscreen-image-pc').hide();
			}
		});
	}
	
	
}



/**
 * ####################################################################################################
 * ### 初始化第一屏的视频按钮操作
 * ####################################################################################################
 */
function initVideoFirstScreenCtrBtns() {
  var ctrBtns = $('.swiper-container_first-screen-video .video-controls .control-btn');
  ctrBtns.on('click', function() {
    var btnType = $(this).attr('data-oper');
    // 播放
    if (btnType == 'play') {
      videoFirstScreenPlay();
      return;
    }

    // 暂停
    if (btnType == 'stop') {
      videoFirstScreenStop();
      return;
    }

    // 启用声音
    if (btnType == 'sound') {
      videoFirstScreenSound();
      return;
    }

    // 静音
    if (btnType == 'mute') {
      videoFirstScreenMute();
      return;
    }
  });
}



/**
 * ####################################################################################################
 * ### 播放第一屏的视频
 * ####################################################################################################
 */
function videoFirstScreenPlay() {
  console.log('Video Play');
  if (!swiperFirstScreenVideo) {
    console.log('Video Swiper Uninit');
    return;
  }
  // 获取到当前是第几个视频
  var videoCurrent = swiperFirstScreenVideo.activeIndex;
  console.log('获取到当前是第几个视频', videoCurrent)
  // 暂停其他视频，播放当前视频
  if (swiperFirstScreenVideo.slides) {
    swiperFirstScreenVideo.slides.each(function(index, el) {
      if (el.videoPlayer) {
        if (index == videoCurrent) {
          console.log('播放？', index);
          el.videoPlayer.play();
        } else {
          console.log('暂停？', index);
          el.videoPlayer.pause();
        }
      }
    });
  }
  // 更新播放状态
  swiperFirstScreenVideoPlayStatus = 1;
  // 显示暂停按钮，隐藏播放按钮
  $('.swiper-container_first-screen-video .video-controls .play-icon').removeClass('show');
  $('.swiper-container_first-screen-video .video-controls .stop-icon').addClass('show');
}



/**
 * ####################################################################################################
 * ### 暂停第一屏的视频
 * ####################################################################################################
 */
function videoFirstScreenStop() {
  console.log("Video Stop");
  if (!swiperFirstScreenVideo) {
    console.log('Video Swiper Uninit');
    return;
  }
  if (swiperFirstScreenVideo.slides) {
    swiperFirstScreenVideo.slides.each(function(index, el) {
      if (el.videoPlayer) {
        el.videoPlayer.pause();
      }
    });
  }
  // 更新播放状态
  swiperFirstScreenVideoPlayStatus = 0;
  // 显示播放按钮，隐藏暂停按钮
  $('.swiper-container_first-screen-video .video-controls .play-icon').addClass('show');
  $('.swiper-container_first-screen-video .video-controls .stop-icon').removeClass('show');
}



/**
 * ####################################################################################################
 * ### 打开第一屏的视频的声音
 * ####################################################################################################
 */
function videoFirstScreenSound() {
  console.log('Video Open Sound');
  if (!swiperFirstScreenVideo) {
    console.log('Video Swiper Uninit');
    return;
  }
  if (swiperFirstScreenVideo.slides) {
    swiperFirstScreenVideo.slides.each(function(index, el) {
      console.log('el', el);
      if (el.videoPlayer) {
        console.log('开启第'+index+'屏视频的音量');
        console.log('el.videoPlayer', el.videoPlayer);
        el.videoPlayer.muted(false);
        el.videoPlayer.volume(1);
        el.videoPlayer.el_.volume = 1;
      }
    });
  }
  // 更新音量值
  swiperFirstScreenVideoVolumeValue = 1;
  // 显示声音按钮、隐藏静音按钮
  $('.swiper-container_first-screen-video .video-controls .sound-icon').addClass('show');
  $('.swiper-container_first-screen-video .video-controls .mute-icon').removeClass('show');
}



/**
 * ####################################################################################################
 * ### 禁用第一屏的视频的声音
 * ####################################################################################################
 */
function videoFirstScreenMute() {
  console.log('Video Mute');
  if (!swiperFirstScreenVideo) {
    console.log('Video Swiper Uninit');
    return;
  }
  if (swiperFirstScreenVideo.slides) {
    swiperFirstScreenVideo.slides.each(function(index, el) {
      if (el.videoPlayer) {
        console.log('静音', index);
        el.videoPlayer.muted(true);
        el.videoPlayer.volume(0);
        el.videoPlayer.el_.volume = 0;
      }
    });
  }
  // 更新音量值
  swiperFirstScreenVideoVolumeValue = 0;
  // 隐藏声音按钮、显示静音按钮
  $('.swiper-container_first-screen-video .video-controls .sound-icon').removeClass('show');
  $('.swiper-container_first-screen-video .video-controls .mute-icon').addClass('show');
}


/**
 * 监听页面缩放
 */
$(window).resize(function() {
  console.log('页面缩放');
});


/**
 * ####################################################################################################
 * ### 监听鼠标滚动
 * ####################################################################################################
 */
function monitorMouseScrolling() {
  $(window).mousewheel(function(event) {
    if (sessionStorage['wheeling'] == 'ing') {
      return;
    }
    // deltaX：值为负的（-1），则表示滚轮向左滚动。值为正的（1），则表示滚轮向右滚动。
    // deltaY：值为负的（-1），则表示滚轮向下滚动。值为正的（1），则表示滚轮向上滚动。
    // deltaFactor：增量因子。通过 deltaFactor * deltaX 或者 deltaFactor * deltaY 可以得到浏览器实际的滚动距离。
    // 向下滚动
    if (event.deltaY == -1) {
      console.log('Mouse Down');
      // 鼠标向下滚动的处理函数
      mouseDown();
      sessionStorage['wheeling'] = 'ing';
      var timer = setTimeout(function() {
        sessionStorage['wheeling'] = '';
      }, 1500);
      return;
    }

    // 向上滚动
    if (event.deltaY == 1) {
      console.log('Mouse Up');
      // 鼠标向上滚动的处理函数
      mouseUp();
      sessionStorage['wheeling'] = 'ing';
      var timer = setTimeout(function() {
        sessionStorage['wheeling'] = '';
      }, 1500);
      return;
    }
  });
}



/**
 * ####################################################################################################
 * ### 鼠标向下滚动的处理函数
 * ####################################################################################################
 */
function mouseDown() {
  // 判断一下是否有Swiper示例，没有Swiper示例的话说明Swiper还没初始化，什么也做不了
  if (!swiperFullpage) {
    console.log('Fullpage Swiper Uninit');
    return;
  }

  // 是否正在过渡
  // 正在过渡的时候什么也不做
  if (swiperFullpage.animating) {
    console.log('Fullpage Swiper Animating');
    return;
  }

  // 正在展开或收起Header，什么也不做
  if (sessionStorage['isHeaderShrink'] == 'ing') {
    console.log('Header Shrinking');
    return;
  }

  // 如果是第一屏，并且Header为展开状态，并且是在PC端
  if (swiperFullpage.activeIndex == 0 && headerStatus()) {
    // 收起Header
    headerShrink();
    // 设个定时器，避免滑动过快
    var timer = setTimeout(function() {
      clearTimeout(timer);
      timer = null;
      sessionStorage['isHeaderShrink'] = '';
    }, 900);
    sessionStorage['isHeaderShrink'] = 'ing';
    return;
  }

  // 滑动到下一屏
  swiperFullpage.slideNext();

  // 是否是Footer屏？
  var pageCurrent = $('.swiper-container_fullpage_pagination .swiper-pagination-bullet-active').index();
  console.log('pageCurrent', pageCurrent);
  if (pageCurrent == 5) {
    $('.header-pc-wrapper').addClass('hide');
    $('.whell-down-icon-wrapper').addClass('up');
  }
}



/**
 * ####################################################################################################
 * ### 鼠标向上滚动的处理函数
 * ####################################################################################################
 */
function mouseUp() {
  // 判断一下是否有Swiper示例，没有Swiper示例的话说明Swiper还没初始化，什么也做不了
  if (!swiperFullpage) {
    console.log('Fullpage Swiper Uninit');
    return;
  }

  // 是否正在过渡
  // 正在过渡的时候什么也不做
  if (swiperFullpage.animating) {
    console.log('Fullpage Swiper Animating');
    return;
  }

  // 正在展开或收起Header，什么也不做
  if (sessionStorage['isHeaderShrink'] == 'ing') {
    console.log('Header Shrinking');
    return;
  }

  // 如果是第一屏，并且Header为收缩状态
  if (swiperFullpage.activeIndex == 0 && !headerStatus()) {
    // 展开Header
    headerExpand();
    // 设个定时器，避免滑动过快
    var timer = setTimeout(function() {
      clearTimeout(timer);
      timer = null;
      sessionStorage['isHeaderShrink'] = '';
    }, 900);
    sessionStorage['isHeaderShrink'] = 'ing';
    return;
  }

  // 滑动到上一屏
  swiperFullpage.slidePrev();

  // 是否是Footer屏？
  var pageCurrent = $('.swiper-container_fullpage_pagination .swiper-pagination-bullet-active').index();
  console.log('pageCurrent', pageCurrent);
  if (pageCurrent != 5) {
    $('.header-pc-wrapper').removeClass('hide');
    $('.whell-down-icon-wrapper').removeClass('up');
  }
}



/**
 * ####################################################################################################
 * ### 得到Header的显示状态
 * ### 正常状态返回true，收缩状态返回false
 * ####################################################################################################
 */
function headerStatus() {
  return !$('.header-pc-wrapper').hasClass('shrink');
}



/**
 * ####################################################################################################
 * ### 收缩Header
 * ####################################################################################################
 */
function headerShrink() {
  $('.header-pc-wrapper').addClass('shrink');
}



/**
 * ####################################################################################################
 * ### 展开Header
 * ####################################################################################################
 */
function headerExpand() {
  $('.header-pc-wrapper').removeClass('shrink');
}



/**
 * ####################################################################################################
 * ### 返回底部
 * ####################################################################################################
 */
$('.tools-btn_back-down').on('click', function() {
  if (swiperFullpage) {
    swiperFullpage.slideTo(4);
    headerShrink();
  }
});



/**
 * ####################################################################################################
 * ### 点击左侧分页器切换页面
 * ####################################################################################################
 */
$('.swiper-pagination-bullet').on('click', function() {
  if (swiperFullpage) {
    swiperFullpage.slideTo($(this).index());
    headerShrink();

    // 是否是Footer屏？
    var pageCurrent = $('.swiper-container_fullpage_pagination .swiper-pagination-bullet-active').index();
    console.log('pageCurrent', pageCurrent);
    if (pageCurrent == 5) {
      $('.header-pc-wrapper').addClass('hide');
      $('.whell-down-icon-wrapper').addClass('up');
    } else {
      $('.header-pc-wrapper').removeClass('hide');
      $('.whell-down-icon-wrapper').removeClass('up');
    }
  }
});



/**
 * ####################################################################################################
 * ### 动画部分
 * ####################################################################################################
 */
// 初始化动画
function initAnis() {
  console.log('Animations Init');
  console.log('swiperAnimes', swiperAnimes);
  // 1
  swiperAnimes.slides[0].anim = lottie.loadAnimation({
    container: document.getElementById('lottie_01'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    animationData: master_01_data,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    }
  });
  swiperAnimes.slides[0].anim.goToAndStop(0);
  swiperAnimes.slides[0].anim.addEventListener('complete', function() {
    console.log('Anim_01 Is Complete');
    aniStatus = false;
    aniCurrent++;
    $('.ain-item_01 .ani-item_ended').addClass('show');
    $('.ain-item_02 .ani-item_ended').removeClass('show');
    $('.ain-item_03 .ani-item_ended').removeClass('show');
  });

  // 2
  swiperAnimes.slides[1].anim = lottie.loadAnimation({
    container: document.getElementById('lottie_02'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    animationData: master_02_data,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    }
  });
  swiperAnimes.slides[1].anim.goToAndStop(0);
  swiperAnimes.slides[1].anim.addEventListener('complete', function() {
    console.log('Anim_02 Is Complete');
    aniStatus = false;
    aniCurrent++;
    $('.ain-item_01 .ani-item_ended').removeClass('show');
    $('.ain-item_02 .ani-item_ended').addClass('show');
    $('.ain-item_03 .ani-item_ended').removeClass('show');
  });

  // 3
  swiperAnimes.slides[2].anim = lottie.loadAnimation({
    container: document.getElementById('lottie_03'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    animationData: master_03_data,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    }
  });
  swiperAnimes.slides[2].anim.goToAndStop(0);
  swiperAnimes.slides[2].anim.addEventListener('complete', function() {
    console.log('Anim_03 Is Complete');
    aniStatus = false;
    aniCurrent = 0;
    $('.ain-item_01 .ani-item_ended').removeClass('show');
    $('.ain-item_02 .ani-item_ended').removeClass('show');
    $('.ain-item_03 .ani-item_ended').addClass('show');
  });
}


/**
 * ####################################################################################################
 * ### 播放第1个动画
 * ####################################################################################################
 */
function playAni_01() {
  console.log('Play Ani_01');
  if (swiperAnimes && swiperAnimes.slides && swiperAnimes.slides[0] && swiperAnimes.slides[0].anim) {
    aniStatus = true;
    $('.ain-item_01 .ani-item_start').addClass('hide');
    swiperAnimes.slides[0].anim.play();
    if (!$('.master-bg-music-icon').hasClass('stop')) {
      masterBgMusic && masterBgMusic.play();
    }
    swiperAnimes.slides[1].anim.goToAndStop(0);
    swiperAnimes.slides[2].anim.goToAndStop(0);
    var timer = setTimeout(function() {
      $('.ain-item_01 .ani-item_ended').addClass('show');
      $('.ain-item_02 .ani-item_ended').removeClass('show');
      $('.ain-item_03 .ani-item_ended').removeClass('show');
      clearTimeout(timer);
    }, 9000);
  }
}



/**
 * ####################################################################################################
 * ### 播放第2个动画
 * ####################################################################################################
 */
function playAni_02() {
  console.log('Play Ani_02');
  if (swiperAnimes && swiperAnimes.slides && swiperAnimes.slides[1] && swiperAnimes.slides[1].anim) {
    aniStatus = true;
    swiperAnimes.slides[1].anim.play();
    if (!$('.master-bg-music-icon').hasClass('stop')) {
      masterBgMusic && masterBgMusic.play();
    }
    swiperAnimes.slides[0].anim.goToAndStop(0);
    swiperAnimes.slides[2].anim.goToAndStop(0);
    var timer = setTimeout(function() {
      $('.ain-item_01 .ani-item_ended').removeClass('show');
      $('.ain-item_02 .ani-item_ended').addClass('show');
      $('.ain-item_03 .ani-item_ended').removeClass('show');
      clearTimeout(timer);
    }, 9000);
  }
}



/**
 * ####################################################################################################
 * ### 播放第3个动画
 * ####################################################################################################
 */
function playAni_03() {
  console.log('Play Ani_03');
  if (swiperAnimes && swiperAnimes.slides && swiperAnimes.slides[2] && swiperAnimes.slides[2].anim) {
    aniStatus = true;
    swiperAnimes.slides[2].anim.play();
    if (!$('.master-bg-music-icon').hasClass('stop')) {
      masterBgMusic && masterBgMusic.play();
    }
    swiperAnimes.slides[0].anim.goToAndStop(0);
    swiperAnimes.slides[1].anim.goToAndStop(0);
    var timer = setTimeout(function() {
      $('.ain-item_01 .ani-item_ended').removeClass('show');
      $('.ain-item_02 .ani-item_ended').removeClass('show');
      $('.ain-item_03 .ani-item_ended').addClass('show');
      clearTimeout(timer);
    }, 9000);
  }
}



/**
 * ####################################################################################################
 * ### 播放按钮点击事件
 * ####################################################################################################
 */
$('.swiper-slide_fullpage_fourth-screen .play-btn').on('click', function() {
  console.log('Click Animation Play Icon Btn', aniCurrent);

  if (isPc()) {
    // 正在播放动画？
    if (aniStatus) {
      console.log('Animation Is Playing');
      return;
    }
    swiperAnimes.slideTo(aniCurrent);
    // 播放
    if (aniCurrent == 0) {
      playAni_01();
    } else if (aniCurrent == 1) {
      playAni_02();
    } else if (aniCurrent == 2) {
      playAni_03();
    }
  } else {
    console.log('Change', aniCurrent);
    aniCurrent++;
    if (aniCurrent == 3) {
      aniCurrent = 0;
    }
    swiperAnimes.slideTo(aniCurrent, 900);
    console.log('ActiveIndex', swiperAnimes.activeIndex);
  }
});



/**
 * ####################################################################################################
 * ### 重置动画为初始状态
 * ####################################################################################################
 */
function aniReset() {
  aniCurrent = 0;
  aniStatus = false;
  $('.ain-item_01 .ani-item_start').removeClass('hide');
  $('.ain-item_01 .ani-item_ended').removeClass('show');
  $('.ain-item_02 .ani-item_ended').removeClass('show');
  $('.ain-item_03 .ani-item_ended').removeClass('show');
  if (swiperAnimes) {
    swiperAnimes.slideTo(aniCurrent);
    swiperAnimes.slides[0].anim.goToAndStop(0);
    swiperAnimes.slides[1].anim.goToAndStop(0);
    swiperAnimes.slides[2].anim.goToAndStop(0);
  }
  if (masterBgMusic) {
    masterBgMusic.currentTime = 0;
    masterBgMusic.pause();
    $('.master-bg-music-icon').addClass('stop');
  }
}


/**
 * ####################################################################################################
 * ### 切换大师动画背景音乐
 * ####################################################################################################
 */
$('.master-bg-music-icon').on('click', function() {
  if ($(this).hasClass('stop')) {
    masterBgMusic.play();
    $('.master-bg-music-icon').removeClass('stop');
  } else {
    masterBgMusic.pause();
    $('.master-bg-music-icon').addClass('stop');
  }
});


// 向下滑动指示按钮的点击事件
$('.whell-down-icon-wrapper').on('click', mouseDown);
