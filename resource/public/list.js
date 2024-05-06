document.addEventListener('DOMContentLoaded', function() {
    function downloadHtml(html, getCSS=true){
        var result=`<head></head>`;
        if(getCSS){
            /* 获取当前页面 css */
            const css = Array.from(document.styleSheets)
            .reduce((prev, styleSheet) => {
                try {
                    return prev.concat(Array.from(styleSheet.cssRules));
                } catch(e) {
                    console.log('Access to stylesheet denied.');
                    return prev;
                }
            }, [])
            .map(rule => rule.cssText)
            .join("\n");
            result=`<head><style>\n${css}\n</style></head>`;
        }
        result+='<body>'+html+'</body>';
        var fileName = document.title;
        var today = new Date();
        var month = (today.getMonth() + 1).toString().padStart(2, '0');
        var day = today.getDate().toString().padStart(2, '0');
        fileName = `${fileName}-${month}${day}.html`;
        const file = new File([result], fileName, { type: "text/html" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
    }
    var copyScript =`var cs = document.querySelectorAll('.bg-black > div > button');
    for (let i = 0; i < cs.length; i++) {
        /* 为按钮元素添加点击事件监听器 */
        cs[i].addEventListener('click', function() {
            /* 获取需要复制的文本内容 */
            let text = cs[i].parentNode.parentNode.querySelector('div.p-4 > code').innerText;

            /* 将文本内容复制到剪贴板 */
            navigator.clipboard.writeText(text).then(function() {
                /* 复制成功 */
                /* alert('文本已复制到剪贴板！'); */

                /* 更新按钮文字，提示复制成功 */
                cs[i].innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg>Copied!';

                /* 设置定时器，延迟两秒钟恢复按钮的原状 */
                setTimeout(function() {
                    cs[i].innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>Copy code';
                }, 2000);
            }, function() {
                /* 复制失败 */
                /* alert('文本复制失败！'); */
            });
        });
    }`;
    /* 作用：保存ai对话记录，可弹窗询问要保存的文件名，默认为false */
    function savaAiRecording(askFileName=false){
        /* askFileName为true时弹窗询问文件名 */
        var fileName = document.title;
        var today = new Date();
        var month = (today.getMonth() + 1).toString().padStart(2, '0');
        var day = today.getDate().toString().padStart(2, '0');
        fileName = `${fileName}-${month}${day}.html`;
        fileName=askFileName?prompt('输入要保存的文件名：', fileName):fileName;
        var body=document.createElement('body');
        body.innerHTML=document.body.innerHTML;
        /* 删除所有script标签 */
        var ps = body.querySelectorAll('script');
        for (var i = 0; i < ps.length; i++) {
            ps[i].parentNode.removeChild(ps[i]);
        }
        /* 删除所有style标签，因为downloadHtml会自动再获取一次 */
        var ps = body.querySelectorAll('style');
        for (var i = 0; i < ps.length; i++) {
            ps[i].parentNode.removeChild(ps[i]);
        }
        /* 删除下边框 */
        var element=body.querySelector('#__next > div > div > main > div.absolute');
        element && element.remove();
        /* 删除侧边框 */
        var element=body.querySelector('#__next > div > div.hidden');
        element && element.remove();
        /* 删除侧边框间隔 */
        var element=body.querySelector('#__next > div > div');
        if(element){element.className='';}
        /* 添加script标签，用于修复一键复制 */
        var script=document.createElement('script');
        script.innerHTML=copyScript;
        body.appendChild(script);
        downloadHtml(body.innerHTML, fileName);
    }
    // 创建一个 div 元素
    var floatWindow = document.createElement('div');

    // 设置 div 的属性
    floatWindow.id = 'AI-save-window';

    // 设置 div 的内容
    floatWindow.innerHTML = '对话保存';

    // 设置 div 的样式
    floatWindow.style.cssText = 'position: fixed; top: 50px; right: 10px; padding: 5px 10px; background-color: #007bff; color: #fff; cursor: pointer; border-radius: 10px; z-index: 99999;';

    var isDragging = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;
    var cursorX;
    var vursorY;

    floatWindow.addEventListener("mousedown", function(e) {
        if (!isDragging) {
            cursorX = e.clientX;
            cursorY = e.clientY;
            initialX = cursorX - xOffset;
            initialY = cursorY - yOffset;
            isDragging = true;
        }
    });
    floatWindow.addEventListener("mousemove", function(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, floatWindow);
        }
    });
    floatWindow.addEventListener("mouseup", function(e) {
        initialX = currentX;
        initialY = currentY;

        isDragging = false;
        // 如果点击时鼠标的位置没有改变，就认为是真正的点击
        if (cursorX === e.clientX && cursorY === e.clientY) {
            execCode();
        }
    });

    // 为悬浮窗添加事件处理程序，用来监听触摸开始和触摸移动事件
    // 这些事件处理程序的实现方式与上面的鼠标事件处理程序类似
    floatWindow.addEventListener('touchstart', (event) => {
        if (!isDragging) {
            cursorX = event.touches[0].clientX;
            cursorY = event.touches[0].clientY;
            initialX = cursorX - xOffset;
            initialY = cursorY - yOffset;
            isDragging = true;
        }
    });
    floatWindow.addEventListener('touchmove', (event) => {
        if (isDragging) {
            currentX = event.touches[0].clientX - initialX;
            currentY = event.touches[0].clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, floatWindow);
        }
    });

    // 为悬浮窗添加事件处理程序，用来监听触摸结束事件
    // 这个事件处理程序的实现方式与上面的鼠标事件处理程序类似
    floatWindow.addEventListener('touchend', () => {
        initialX = currentX;
        initialY = currentY;

        isDragging = false;
        // 如果点击时鼠标的位置没有改变，就认为是真正的点击
        if (cursorX === event.touches[0].clientX && cursorY === event.touches[0].clientY) {
            execCode();
        }
    });

    function setTranslate(xPos, yPos, el) {
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }

    // 想要执行的代码放到此函数中：
    function execCode() {
        // 执行你想要执行的代码
        //alert('执行代码');
        savaAiRecording('',true);
    }

    // 将悬浮窗添加到 body 元素中
    document.body.appendChild(floatWindow);
});