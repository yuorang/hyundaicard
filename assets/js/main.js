$(function () {
    /* 00. 초기 설정 및 스크롤 제어 */
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 600); });
    gsap.ticker.lagSmoothing(0);

    function disableScroll() {
        document.body.classList.add('no-scroll');
        document.documentElement.classList.add('no-scroll');
    }

    function enableScroll() {
        document.body.classList.remove('no-scroll');
        document.documentElement.classList.remove('no-scroll');
        document.body.style.cssText = ''; // 스타일 일괄 초기화
    }

    function unlockScrollAfterSection01() {
        enableScroll();
        if (typeof lenis !== 'undefined' && lenis) {
            lenis.stop();
            setTimeout(() => { lenis.start(); }, 10);
        }
    }

    disableScroll();

    /* 01. 텍스트 분할 (인트로 타이포) */
    document.querySelectorAll(".br-name").forEach(el => {
        const text = el.textContent.trim();
        el.innerHTML = text.split("").map(char =>
            `<span>${char === " " ? "&nbsp;" : char}</span>`
        ).join("");
    });

    /* 02. 메인 인트로 타임라인 */
    let intro = gsap.timeline({ defaults: { ease: "power3.out" } });

    intro.add("intro", 0)
        .add("lastCard", "intro+=0.56")
        .add("oneCard", "lastCard+=1");

    // [Step 1] 카드 순차 등장
    intro.to(".start-animation .animation-card:not(:nth-child(1))", { "--s": 1, stagger: 0.08 }, "intro")
        .to(".start-animation .animation-card:nth-child(1)", { "--s": 1 }, "lastCard")
        .to(".start-animation .animation-card:not(:nth-child(1))", { "--s": 0, stagger: 0.08 });

    // [Step 2] 3D 플립 및 확장
    intro.to(".card-stage .flex-card_list", { opacity: 1 }, "oneCard")
        .to(".start-animation .animation-card:nth-child(1)", { opacity: 0 }, "oneCard")
        .to(".flex-card_item:nth-child(3) .flex-card", { rotateY: -80, duration: 1 }, "oneCard")
        .to(".flex-card_item:nth-child(3) .flex-card", { rotateY: 180, duration: 1.5, ease: "back.out(1.7)" }, "oneCard+=0.4")
        .to(".flex-card_item:nth-child(3) .flex-card_scale", { scale: 1.3, duration: 1.2, ease: "back.out(1.7)" }, "oneCard+=0.4")
        .to(".card-stage .flex-card_item:not(:nth-child(3))", { opacity: 1, scale: 1.3 }, "oneCard+=0.6")
        .to(".flex-card_item", { x: (i) => (i - 2) * 300 + "px", y: 100, duration: 1 }, "oneCard+=0.6");

    // [Step 3] 브랜드 네임 등장
    intro.to(".br-wrap:nth-child(1) .br-name span", { y: "0%", stagger: { each: 0.08, from: "start" } }, "intro")
        .to(".br-wrap:nth-child(2) .br-name span", { y: "0%", stagger: { each: 0.08, from: "center" } }, "intro")
        .to(".br-wrap:nth-child(3) .br-name span", { y: "0%", stagger: { each: 0.08, from: "end" } }, "intro");

    intro.call(unlockScrollAfterSection01, null, 'onComplete');

    /* 03. 인트로 이후 변형 */
    intro.add("after", "oneCard+=1.5");
    intro.to("#header", { y: 0 }, "after")
        .to(".br-wrap:nth-child(1)", { width: "0" }, "after")
        .to(".br-wrap:nth-child(1) .br-name", { scale: 0 }, "after")
        .to(".br-wrap:nth-child(2) .br-name", { fontSize: "150px" }, "after")
        .to(".br-wrap:nth-child(3)", { width: "0" }, "after")
        .to(".br-wrap:nth-child(3) .br-name", { scale: 0 }, "after")
        .to(".intro-top_title, .intro-sub_title", { y: 0 }, "after");

    // 패럴랙스
    gsap.timeline({ scrollTrigger: { trigger: ".start-animation", start: "top top", end: "+=1000", scrub: true } })
        .to(".start-animation .br-area .br-wrap:nth-child(2)", { y: 600 }, 0)
        .to("#section01 .sub-wrap", { y: 600 }, 0);

    /* 04. 섹션 01 카드 깊이감 */
    const cardScrollTl = gsap.timeline({
        scrollTrigger: { trigger: "#section01", start: "top top", end: "100% 0%", scrub: true }
    });
    cardScrollTl.to(".flex-card_item:nth-child(1), .flex-card_item:nth-child(5)", { y: 100, scale: 1.8 }, 0)
        .to(".flex-card_item:nth-child(2), .flex-card_item:nth-child(4)", { y: 250, scale: 1.8 }, 0)
        .to(".flex-card_item:nth-child(3)", { y: 400, scale: 1.5 }, 0)
        .to(".card-stage .flex-card_list", { opacity: 0 });

    /* 05. 섹션 02 텍스트 및 배경 */
    gsap.to("#section02 .about-paragraph, #section02 .about-headline span, #section02 .about-hidden", {
        scrollTrigger: { trigger: '#section02', start: "0% 50%", end: "30% 50%", scrub: 1 },
        y: 0, opacity: 1, stagger: 0.1
    });

    ScrollTrigger.create({
        trigger: '.pay-animation', start: "top 70%",
        onEnter: () => document.querySelector('.pay-animation').classList.add('bg'),
        onLeaveBack: () => document.querySelector('.pay-animation').classList.remove('bg'),
    });

    /* 06. 애플페이 Pin */
    let payTimeline = gsap.timeline({
        scrollTrigger: { trigger: '.pay-animation', start: "top top", end: "+=1000", pin: true, scrub: 1 }
    });
    payTimeline.to(".payment-visual__card", { opacity: 1, duration: 2, ease: "power2.out" })
        .to({}, { duration: 0.5 });

    /* 07. 섹션 04 카드 시퀀스 및 인터랙션 */
    gsap.to("#section04 .pos-wrap .title span", {
        scrollTrigger: { trigger: '#section04', start: "0% 50%" },
        y: 0, opacity: 1, stagger: 0.1
    });

    const cardImages = ["03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(n => `card_front${n}.png`);
    const cardBox = document.querySelector('.center-card_box .card');
    const cardImgEl = cardBox.querySelector('img');
    let hoverInterval = null;

    const cardST = ScrollTrigger.create({
        trigger: ".center-card_box", start: "top 100%", end: "bottom 0%", scrub: 0,
        onUpdate(self) {
            if (hoverInterval) return;
            const idx = Math.floor(self.progress * (cardImages.length - 1) + 0.5);
            if (cardImgEl.dataset.lastIndex != idx) {
                cardImgEl.src = './assets/imgs/' + cardImages[idx];
                cardImgEl.dataset.lastIndex = idx;
            }
        }
    });

    cardBox.addEventListener('mouseenter', () => {
        cardST.disable();
        let hoverIdx = 0;
        hoverInterval = setInterval(() => {
            cardImgEl.src = './assets/imgs/' + cardImages[hoverIdx];
            hoverIdx = (hoverIdx + 1) % cardImages.length;
        }, 120);
    });

    cardBox.addEventListener('mouseleave', () => {
        clearInterval(hoverInterval);
        hoverInterval = null;
        cardST.enable();
        ScrollTrigger.refresh();
    });

    $('.grid-card_front').each(function (i, el) {
        ScrollTrigger.create({
            trigger: el, start: "top 80%", end: "bottom 0%",
            toggleClass: { targets: el, className: "active" }, once: true
        });
    });

    /* 08. 제로 영역 3D 및 플립 */
    gsap.timeline({ scrollTrigger: { trigger: '.display-large', start: "0% 50%", scrub: true } })
        .to('.display-large .layer:nth-child(2)', { yPercent: 15 }, 'a')
        .to('.display-large .layer:nth-child(3)', { yPercent: 23 }, 'a');

    const centerCard = document.querySelector('.zero-card .center');
    const flipTl = gsap.timeline({ paused: true })
        .to(centerCard.querySelector('.card-box_front'), { rotateY: -180 }, 0)
        .to(centerCard.querySelector('.card-box_back'), { rotateY: 0 }, 0);

    centerCard.addEventListener('mouseenter', () => flipTl.play());
    centerCard.addEventListener('mouseleave', () => flipTl.reverse());

    gsap.timeline({ scrollTrigger: { trigger: ".inner", start: "0% 40%", end: "100% 100%", scrub: 1 } })
        .to(".zero-card .left", { x: -300, scale: 0.8 }, 0)
        .to(".zero-card .right", { x: 300, scale: 0.8 }, 0);

    /* 09. 브랜드 휠 슬라이더 */
    gsap.to('.overflow_wrap span', {
        y: 0, opacity: 1, stagger: 0.3,
        scrollTrigger: { trigger: '.champion-brand_title', start: "0% 100%", end: "100% 70%", scrub: true }
    });

    const slider = document.querySelector(".wheel-list");
    const wheelItems = gsap.utils.toArray(".wheel-item");

    function sliderCircle() {
        let radius = slider.offsetWidth / 2;
        let slice = (2 * Math.PI) / wheelItems.length;
        wheelItems.forEach((item, i) => {
            let radian = i * slice;
            let x = radius * Math.sin(radian) + radius;
            let y = -radius * Math.cos(radian) + radius;
            gsap.set(item, { rotation: radian + "rad", xPercent: -50, yPercent: -50, x: x, y: y });
        });
    }
    sliderCircle();
    window.addEventListener("resize", sliderCircle);

    gsap.to(".wheel-list", {
        rotate: -100, ease: "none",
        scrollTrigger: { trigger: ".wheel-sect", start: "top bottom", end: "100% 0%", scrub: 0.5 }
    });

    /* 10. 푸터 애니메이션 */
    gsap.timeline({ scrollTrigger: { trigger: '.dive-area', start: "0% 60%", end: "100% 50%", scrub: true } })
        .to('.sub-title', { y: 0, opacity: 1 })
        .to('#footer .main-title span', { y: 0, opacity: 1, stagger: 0.3 });

    gsap.timeline({ scrollTrigger: { trigger: '.culture', start: "0% 50%", end: "100% 70%", scrub: true } })
        .to('.left .culture-title, .left .culture-list', { y: 0, opacity: 1, stagger: 0.1 })
        .to('.right .culture-title, .right .culture-list', { y: 0, opacity: 1, stagger: 0.1 }, "<");
});

/* 11 & 12. 공통 카드 셔플 로직 */
document.addEventListener('DOMContentLoaded', () => {
    const setupShuffle = (selector, imgs) => {
        const shuffleArr = (arr) => arr.map(v => ({ v, r: Math.random() })).sort((a, b) => a.r - b.r).map(o => o.v);

        document.querySelectorAll(selector).forEach((item) => {
            const img = item.querySelector('img');
            if (!img) return;
            const originalSrc = img.src;
            let intervalId = null, isPlaying = false;

            item.addEventListener('mouseenter', () => {
                if (isPlaying) return;
                isPlaying = true;
                let shuffled = shuffleArr(imgs), idx = 0;
                intervalId = setInterval(() => {
                    img.src = shuffled[idx++];
                    if (idx >= shuffled.length) {
                        clearInterval(intervalId);
                        isPlaying = false;
                    }
                }, 180);
            });

            item.addEventListener('mouseleave', () => {
                clearInterval(intervalId);
                isPlaying = false;
                img.src = originalSrc;
            });
        });
    };

    setupShuffle('.flex-top_item', [
        "./assets/imgs/card_front31.png", "./assets/imgs/card_front32.png",
        "./assets/imgs/card_front33.png", "./assets/imgs/card_front26.png",
        "./assets/imgs/card_front34.png"
    ]);

    setupShuffle('.flex-bottom_item', [
        "./assets/imgs/card_front30.png", "./assets/imgs/card_front18.png",
        "./assets/imgs/card_front24.png", "./assets/imgs/card_front22.png",
        "./assets/imgs/card_front38.png"
    ]);
});