const myslider = document.querySelector(".slider");
const mysliderItems = myslider.children;
[...mysliderItems].forEach((item, index) => {
    item.style.order = index;
});
const slideupAnimate = myslider.getAnimations()[0];
myslider.addEventListener("animationend", (e) => {
    setTimeout(function () {
        slideupAnimate.play();
    }, 2500);
    [...mysliderItems].forEach((item, index, arr) => {
        item.style.order =
            item.style.order == 0 ? arr.length - 1 : parseInt(item.style.order) - 1;
    });
});
myslider.addEventListener('mouseenter', e => {
    slideupAnimate.pause();
});
myslider.addEventListener('mouseout', e => {
    slideupAnimate.play();
});
