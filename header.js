// Pc 
headerPcRearrange();           // 页面初始化后重新布局
stopChildNavEvent();           // 阻止子菜单的事件冒泡
initItemFirst();               // 初始化一级菜单
initChildNavs();               // 初始化子导航菜单

// Mo
initMoMenusEvents();           // 初始化菜单按钮的点击事件
initMoCloseEvents();           // 初始化关闭按钮的点击事件
listenMoItemFirstEvent();      // 监听一级菜单事件
listenMoItemSecondEvent();     // 监听二级菜单事件
listenMoItemThirdEvent();      // 监听三级菜单事件






/**
 * ####################################################################################################
 * ### Pc
 * ### 该项目的菜单数量为偶数和奇数时的布局不一样，
 * ### 所以要重新布局在页面初始化后重新布局
 * ####################################################################################################
 */
function headerPcRearrange() {
  // 判断一级菜单的数量是奇数还是偶数
  if($('.header-pc-wrapper .item-first').length % 2 == 0) {
    // 为Header添加一个用于区分奇偶的class
    $('.header-pc-wrapper').addClass('even');  
    // 偶数版布局
    headerPcLayoutEven();         
  } else {
    // 为Header添加一个用于区分奇偶的class
    $('.header-pc-wrapper').addClass('odd'); 
    // 奇数版布局
    headerPcLayoutOdd();          
  }
  var timer = setTimeout(function() {
    $('#header').show();
    clearTimeout(timer);
  }, 600);
}



/**
 * ####################################################################################################
 * ### Pc
 * ### 偶数版布局
 * ####################################################################################################
 */
function headerPcLayoutEven() {
  var navWrap = $('.header-pc-wrapper .nav-wrap-first');           // 子导航菜单最外层盒子DOM
  var navList = navWrap.find('.nav-list-first');                   // 列表盒子DOM
  var firstItems = navList.find('.item-first');                    // 一级菜单DOM
  var middleNumber = parseInt(firstItems.length / 2);              // 计算平分中间值    
  var navListLeft = navList.clone(true);                           // 克隆一个列表作为左侧列表
  var navListRight = navList.clone(true);                          // 克隆一个列表作为右侧列表
  
  // 为左右列表添加用以区分的class
  navListLeft.addClass('nav-list-first_left');
  navListRight.addClass('nav-list-first_right');
  
  // 删除原列表
  $(navList).remove();
  
  // 删除左侧列表多余的子元素
  navListLeft.find('.item-first').each(function(index, el) {
    if(index >= middleNumber) {
      $(el).remove();
    }
  });
  // 删除右侧列表多余的子元素
  navListRight.find('.item-first').each(function(index, el) {
    if(index < middleNumber) {
      $(el).remove();
    }
  });
  
  // 将左右列表添加到盒子中
  navWrap.append(navListLeft);
  navWrap.append(navListRight);
}
    
    
    
/**
 * ####################################################################################################
 * ### Pc
 * ### 奇数版布局
 * ####################################################################################################
 */
function headerPcLayoutOdd() {
  var navWrap = $('.header-pc-wrapper .nav-wrap-first');           // 子导航菜单最外层盒子DOM
  var navList = navWrap.find('.nav-list-first');                   // 列表盒子DOM
  var logoLink = $('.header-pc-wrapper .logo-link');               // LogoLink DOM
  var logoLinkClone = logoLink.clone(true);                        // 克隆一个LogoLink
  var li = $('</li><li>');                                         // 创建一个li子节点
  li.addClass('item-first item-first_logo-item');                  // 添加class
  logoLinkClone.addClass('logo-link-clone');                       // 添加一个用以区分的class
  logoLinkClone.removeClass('logo-link-fixed');                    // 删除重复的用以区分的class
  li.append(logoLinkClone);                                        // 将克隆的添加到li
  navList.prepend(li);                                             // 将li添加到列表第一项
}
    
    
    
/**
 * ####################################################################################################
 * ### Pc
 * ### 阻止子菜单的事件冒泡
 * ####################################################################################################
 */ 
function stopChildNavEvent() {
  $('.header-pc-wrapper .child-nav-wrap').on('click', function(e) {
    e.stopPropagation();
  });
}
    
    
    
/**
 * ####################################################################################################
 * ### Pc
 * ### 初始化一级菜单
 * ####################################################################################################
 */ 
function initItemFirst() {
  // 将一级菜单的图片添加到右侧图片组
  $('.header-pc-wrapper .item-first').each(function(index, el) {
    addFirstImgToRightImgs(el, index);
  });
  
  // 添加鼠标悬浮事件
  $('.header-pc-wrapper .item-first').each(function (index, el) {
    $(el).on('mouseover', function (e) {
      // e.stopPropagation();
      // 更新菜单图
      if(e.target == this){ //判断是否是当前绑定事件的元素元素触发的该事件
        changePcRightImg(el);
      }
      // 显示子菜单
      var childNavWrap = $(el).find('.child-nav-wrap');
      $('.header-pc-wrapper .child-nav-wrap').removeClass('show');
      $(childNavWrap).addClass('show');
    });
    $(el).on('mouseout', function(e) {
      e.stopPropagation();
      // 隐藏子导航菜单
      $('.header-pc-wrapper .child-nav-wrap').removeClass('show'); 
    });
  });
}



/**
 * ####################################################################################################
 * ### Pc
 * ### 初始化子导航菜单
 * ####################################################################################################
 */ 
function initChildNavs() {
  var secondItems = $('.header-pc-wrapper .item-second');   // 二级菜单
  var thirdItems = $('.header-pc-wrapper .item-third');     // 三级菜单
  
  // 循环处理二级菜单
  secondItems.each(function(index, el) {
    // 将二级菜单的图片添加到右侧图片组
    addSecondImgToRightImgs(el, index);
    // 添加悬浮事件
    $(el).on('mouseover', function(e) {
      e.stopPropagation();
      $(this).parents('.child-nav-wrap').addClass('show');  // 解决二级菜单鼠标悬浮子菜单会消失的问题
      // 切换class
      secondItems.removeClass('active');
      $(el).addClass('active');
      // 更新右侧图片
      changePcRightImg(el);
    });
  });
  
  // 循环处理三级菜单
  thirdItems.each(function(index, el) {
    // 将三级菜单的图片添加到右侧图片组
    addThirdImgToRightImgs(el, index);
    // 添加悬浮事件
    $(el).on('mouseover', function(e) {
      e.stopPropagation();
      $(this).parents('.child-nav-wrap').addClass('show');  // 解决三级菜单鼠标悬浮子菜单会消失的问题
      thirdItems.removeClass('active');
      $(el).addClass('active');
      // 更新右侧图片
      changePcRightImg(el);
    });
  });
}



/**
 * ####################################################################################################
 * ### Pc
 * ### 将一级菜单的图片添加到右侧图片组
 * ####################################################################################################
 */
function addFirstImgToRightImgs(el, index) {
  // 添加用于切换右侧图片的唯一key
  $(el).attr('data-right-img-unique', 'data-right-first-img-unique-'+index);
  // 创建Img并添加到右侧
  var img = $('<img/>');
  img.addClass('img').addClass('data-right-first-img-unique-'+index);
  var imgUrl = $(el).attr('data-img-url');
  img.attr('src', imgUrl);
  if(imgUrl) {
    $('.header-pc-wrapper .img-inner').append(img);
  }
}



/**
 * ####################################################################################################
 * ### Pc
 * ### 将二级菜单的图片添加到右侧图片组
 * ####################################################################################################
 */
function addSecondImgToRightImgs(el, index) {
  // 添加用于切换右侧图片的唯一key
  $(el).attr('data-right-img-unique', 'data-right-second-img-unique-'+index);
  // 创建Img并添加到右侧
  var img = $('<img/>');
  img.addClass('img').addClass('data-right-second-img-unique-'+index);
  var imgUrl = $(el).attr('data-img-url');
  img.attr('src', imgUrl);
  if(imgUrl) {
    $('.header-pc-wrapper .img-inner').append(img);
  }
}



/**
 * ####################################################################################################
 * ### Pc
 * ### 将三级菜单的图片添加到右侧图片组
 * ####################################################################################################
 */
function addThirdImgToRightImgs(el, index) {
  // 添加用于切换右侧图片的唯一key
  $(el).attr('data-right-img-unique', 'data-right-third-img-unique-'+index);
  // 创建Img并添加到右侧
  var img = $('<img/>');
  img.addClass('img').addClass('data-right-third-img-unique-'+index);
  var imgUrl = $(el).attr('data-img-url');
  img.attr('src', imgUrl);
  if(imgUrl) {
    $('.header-pc-wrapper .img-inner').append(img);
  }
}



/**
 * ####################################################################################################
 * ### Pc
 * ### 切换右侧图片
 * ### el - 触发DOM
 * ####################################################################################################
 */
function changePcRightImg(el) {
  // 得到要显示的图片的class
  var classname = '.' + $(el).attr('data-right-img-unique');
  // 菜单图URL
  var itemImgUrl = $(el).attr('data-img-url');
  
  // 是否有菜单图
  // 有菜单图
  if(itemImgUrl) {
    // 直接更新菜单图
    $('.header-pc-wrapper .img').removeClass('show');
    $(classname).addClass('show');
  } 
  
  // 没有菜单图
  else {
    // 如果是三级菜单
    if($(el).hasClass('item-third')) {
      // 查找是否有二级菜单图
      // 有二级菜单图
      if($(el).parent('.item-second').attr('data-img-url')) {
        // 显示二级菜单图
        $('.header-pc-wrapper .img').removeClass('show');
        var classname = '.' + $(el).parents('.item-second').attr('data-right-img-unique');
        $(classname).addClass('show');
      }
      // 没有二级菜单图
      else {
        // 直接显示一级菜单图
        $('.header-pc-wrapper .img').removeClass('show');
        var classname = '.' + $(el).parents('.item-first').attr('data-right-img-unique');
        $(classname).addClass('show');
      }
    }
    // 如果是二级菜单
    else if($(el).hasClass('item-second')) {
      // 直接显示一级菜单图
      $('.header-pc-wrapper .img').removeClass('show');
      var classname = '.' + $(el).parents('.item-first').attr('data-right-img-unique');
      $(classname).addClass('show');
    }
  }
}



/**
 * ####################################################################################################
 * ### Mo
 * ### 初始化菜单按钮的点击事件
 * ####################################################################################################
 */
function initMoMenusEvents() {
  $('.header-mo-wrapper .menus-icon').on('click', function() {
    $('.header-mo-content').addClass('show');
  });
}


/**
 * ####################################################################################################
 * ### Mo
 * ### 初始化关闭按钮的点击事件
 * ####################################################################################################
 */
function initMoCloseEvents() {
  $('.header-mo-wrapper .close-icon').on('click', function() {
    $('.header-mo-content').addClass('hidden');
    var timer = setTimeout(function() {
      $('.header-mo-content').removeClass('show').removeClass('hidden');
      clearTimeout(timer);
    }, 900);
  });
}



/**
 * ####################################################################################################
 * ### Mo
 * ### 监听一级菜单事件
 * ####################################################################################################
 */
function listenMoItemFirstEvent() {
  $('.header-mo-wrapper .item-first').on('click', function(e) {
    e.stopPropagation();
    // 移除所有active
    $('.header-mo-wrapper .item-first').removeClass('active');
    $('.header-mo-wrapper .item-second').removeClass('active');
    $('.header-mo-wrapper .item-third').removeClass('active');
    // 二级菜单DOM
    var navWrapSecond = $(this).find('.nav-wrap-second');   
    // 判断是否有二级菜单
    if(navWrapSecond) {      
      // 二级菜单的高度
      var navWrapSecondHeight = navWrapSecond.height();         
      console.log('click', navWrapSecondHeight);
      // 通过判断二级菜单的高度来判断是否已打开
      if(navWrapSecondHeight > 0) {
        // 关闭二级菜单
        navWrapSecond.height(0);
        // 有三级菜单的话关闭二级菜单下的三级菜单
        var navWrapThird = navWrapSecond.find('.nav-wrap-third');
        if(navWrapThird) {
          navWrapThird.height(0);
        }
      } else {
        // 打开二级菜单
        console.log('打开二级菜单');
        // 关闭其它的二级菜单
        $('.header-mo-wrapper .nav-wrap-second').height(0);
        // 二级菜单列表DOM
        var navListSecond = navWrapSecond.find('.nav-list-second');   
        // 二级菜单列表的高度
        var navListSecondHeight = navListSecond.outerHeight();
        console.log('列表高度', navListSecondHeight);
        // 打开就是将二级菜单容器的高度设置成列表的高度
        navWrapSecond.height(navListSecondHeight);
        // 添加一级菜单的active
        $(this).addClass('active');
      }
    }
  });
}



/**
 * ####################################################################################################
 * ### Mo
 * ### 监听二级菜单事件
 * ####################################################################################################
 */
function listenMoItemSecondEvent() {
  $('.header-mo-wrapper .item-second').on('click', function(e) {
    e.stopPropagation();
    // 移除所有active
    $('.header-mo-wrapper .item-second').removeClass('active');
    $('.header-mo-wrapper .item-third').removeClass('active');
    // 三级菜单DOM
    var navWrapThird = $(this).find('.nav-wrap-third');   
    // 判断是否有三级菜单
    if(navWrapThird) {      
      // 三级菜单的高度
      var navWrapThirdHeight = navWrapThird.height();         
      // 通过判断三级菜单的高度来判断是否已打开
      if(navWrapThirdHeight > 0) {
        // 关闭三级菜单
        navWrapThird.height(0);
        // 更新二级菜单的高度
        // 二级菜单DOM
        var navWrapSecond = $(this).parents('.nav-wrap-second');
        // 更新高度
        navWrapSecond.height(navWrapSecond.height() - navWrapThirdHeight);
      } else {
        // 打开三级菜单
        console.log('打开三级菜单');
        // 关闭其它的三级菜单
        $('.header-mo-wrapper .nav-wrap-third').height(0);
        // 三级菜单列表DOM
        var navListThird = navWrapThird.find('.nav-list-third');   
        // 三级菜单列表的高度
        var navListThirdHeight = navListThird.outerHeight();
        console.log('列表高度', navListThirdHeight);
        // 打开就是将三级菜单容器的高度设置成列表的高度
        navWrapThird.height(navListThirdHeight);
        // 添加二级菜单的active
        $(this).addClass('active');
        // 更新二级菜单的高度
        // 二级菜单DOM
        var navWrapSecond = $(this).parents('.nav-wrap-second');
        // 更新高度
        navWrapSecond.height(navWrapSecond.height() + navListThirdHeight);
      }
    }
  });
}



/**
 * ####################################################################################################
 * ### Mo
 * ### 监听三级菜单事件
 * ####################################################################################################
 */
function listenMoItemThirdEvent() {
  $('.header-mo-wrapper .item-third').on('click', function(e) {
    e.stopPropagation();
    $('.header-mo-wrapper .item-third').removeClass('active');
    if(!$(this).hasClass('active')) {
      $(this).addClass('active');
    }
  });
}
