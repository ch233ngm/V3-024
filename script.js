$(document).ready(function() {
    // 移动端菜单切换
    $('#mobile-menu-button').click(function() {
        $('#mobile-menu').slideToggle(300);
    });

    // 滚动时导航栏效果
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('nav').addClass('scrolled shadow-md');
        } else {
            $('nav').removeClass('scrolled shadow-md');
        }
    });

    // 滚动显示元素
    function revealOnScroll() {
        var windowHeight = $(window).height();
        var windowTop = $(window).scrollTop();
        
        $('.scroll-reveal').each(function() {
            var elementTop = $(this).offset().top;
            
            if (elementTop < windowTop + windowHeight - 100) {
                $(this).addClass('revealed');
            }
        });
    }
    
    // 初始检查并在滚动时检查
    revealOnScroll();
    $(window).on('scroll', revealOnScroll);

    // 平滑滚动到锚点
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        
        var target = $(this.hash);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 500);
            
            // 如果是移动端，点击后关闭菜单
            if ($('#mobile-menu').is(':visible')) {
                $('#mobile-menu').slideUp(300);
            }
        }
    });

    // 添加打字机效果
    function typeWriter(element, text, speed, delay) {
        setTimeout(function() {
            var i = 0;
            element.html('');
            
            function type() {
                if (i < text.length) {
                    element.html(element.html() + text.charAt(i));
                    i++;
                    setTimeout(type, speed);
                }
            }
            
            type();
        }, delay);
    }

    // 为标题添加打字机效果
    typeWriter($('h1'), $('h1').text(), 50, 500);

    // 图片和元素的视差效果
    $(window).scroll(function() {
        var scrollTop = $(window).scrollTop();
        
        $('.parallax').each(function() {
            var speed = $(this).data('speed') || 0.5;
            $(this).css('transform', 'translateY(' + (scrollTop * speed) + 'px)');
        });
    });

    // 添加计数器动画
    $('.counter').each(function() {
        var $this = $(this);
        var countTo = $this.attr('data-count');
        
        $({ countNum: 0 }).animate({
            countNum: countTo
        }, {
            duration: 2000,
            easing: 'swing',
            step: function() {
                $this.text(Math.floor(this.countNum));
            },
            complete: function() {
                $this.text(this.countNum);
            }
        });
    });

    // 添加悬停效果到按钮
    $('.btn-hover-effect').hover(
        function() {
            $(this).addClass('transform -translate-y-1 shadow-lg');
        },
        function() {
            $(this).removeClass('transform -translate-y-1 shadow-lg');
        }
    );

    // 添加卡片悬停效果
    $('.card-hover').hover(
        function() {
            $(this).addClass('transform -translate-y-2 shadow-xl');
        },
        function() {
            $(this).removeClass('transform -translate-y-2 shadow-xl');
        }
    );

    // 动态调整iframe高度
    function adjustIframeHeight() {
        const iframe = document.getElementById('deepseekFrame');
        if (!iframe) return;
        
        // 设置初始高度
        const viewportHeight = window.innerHeight;
        const navHeight = document.querySelector('nav').offsetHeight;
        const textContentHeight = document.querySelector('.max-w-2xl').offsetHeight;
        const footerHeight = 100; // 预留底部空间
        
        // 计算可用高度 (视口高度 - 导航高度 - 文字内容高度 - 底部预留)
        const availableHeight = viewportHeight - navHeight - textContentHeight - footerHeight;
        
        // 设置最小高度
        const minHeight = 550;
        const newHeight = Math.max(availableHeight, minHeight);
        
        // 根据屏幕尺寸设置不同的高度
        if (window.innerWidth >= 1024) { // 大屏幕
            iframe.style.height = `${Math.max(newHeight, 850)}px`;
        } else if (window.innerWidth >= 768) { // 中等屏幕
            iframe.style.height = `${Math.max(newHeight, 750)}px`;
        } else { // 小屏幕
            iframe.style.height = `${Math.max(newHeight, 550)}px`;
        }
    }

    // 初始调整和窗口大小变化时调整
    adjustIframeHeight();
    $(window).on('resize', adjustIframeHeight);

    // 尝试监听iframe内容变化（注意：由于跨域限制，这可能不起作用）
    try {
        const iframe = document.getElementById('deepseekFrame');
        if (iframe && iframe.contentWindow) {
            iframe.addEventListener('load', function() {
                adjustIframeHeight();
                
                // 尝试监听iframe内容变化
                const iframeContent = iframe.contentDocument || iframe.contentWindow.document;
                const observer = new MutationObserver(adjustIframeHeight);
                
                observer.observe(iframeContent.body, {
                    childList: true,
                    subtree: true
                });
            });
        }
    } catch (e) {
        console.log("无法监听iframe内容变化，可能是由于跨域限制");
    }
}); 