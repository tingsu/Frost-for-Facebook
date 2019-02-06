"use strict";
(function () {
    var longClick = false;
    var _frostCopyPost = function (e, target) {
        if (target.tagName != 'A') {
            return false;
        }
        var parent1 = target.parentElement;
        if (!parent1 || parent1.tagName != 'DIV') {
            return false;
        }
        var parent2 = parent1.parentElement;
        if (!parent2 || !parent2.classList.contains('story_body_container')) {
            return false;
        }
        var url = target.getAttribute('href');
        var text = parent1.innerText;
        Frost.contextMenu(url, text);
        return true;
    };
    var _frostImage = function (e, target) {
        var element = target;
        for (var i = 0; i < 2; i++) {
            if (element.tagName != 'A') {
                element = element.parentElement;
            }
        }
        if (element.tagName != 'A') {
            return false;
        }
        var url = element.getAttribute('href');
        if (!url || url == '#') {
            return false;
        }
        var text = element.parentElement.innerText;
        var image = element.querySelector("[style*=\"background-image: url(\"]");
        if (!image) {
            image = element.parentElement.querySelector("[style*=\"background-image: url(\"]");
        }
        if (image) {
            var imageUrl = window.getComputedStyle(image, null).backgroundImage.trim().slice(4, -1);
            console.log("Context image: " + imageUrl);
            Frost.loadImage(imageUrl, text);
            return true;
        }
        var img = element.querySelector("img[src*=scontent]");
        if (img instanceof HTMLMediaElement) {
            var imgUrl = img.src;
            console.log("Context img: " + imgUrl);
            Frost.loadImage(imgUrl, text);
            return true;
        }
        console.log("Context content " + url + " " + text);
        Frost.contextMenu(url, text);
        return true;
    };
    var handlers = [_frostCopyPost, _frostImage];
    var _frostAContext = function (e) {
        Frost.longClick(true);
        longClick = true;
        var target = e.target || e.currentTarget || e.srcElement;
        if (!(target instanceof Element)) {
            console.log("No element found");
            return;
        }
        for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
            var h = handlers_1[_i];
            if (h(e, target)) {
                e.stopPropagation();
                e.preventDefault();
                return;
            }
        }
    };
    document.addEventListener('contextmenu', _frostAContext, true);
    document.addEventListener('touchend', function () {
        if (longClick) {
            Frost.longClick(false);
            longClick = false;
        }
    }, true);
}).call(undefined);
