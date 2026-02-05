$(function () {
    /* Lenis */
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 600);
    });
    gsap.ticker.lagSmoothing(0);

    // 스크롤 제어 함수 정의
    function disableScroll() {
        document.body.classList.add('no-scroll');
        document.documentElement.classList.add('no-scroll');
    }

    function enableScroll() {
        document.body.classList.remove('no-scroll');
        document.documentElement.classList.remove('no-scroll');
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.left = '';
        document.body.style.top = '';
        document.body.style.touchAction = '';
    }

    // 초기 실행 시 스크롤 잠금
    disableScroll();

    // 섹션 01 완료 후 스크롤 잠금 해제 함수
    function unlockScrollAfterSection01() {
        enableScroll();
        if (typeof lenis !== 'undefined' && lenis) {
            lenis.stop();
            setTimeout(() => {
                lenis.start();
            }, 10);
        }
    }

    /* 01. 텍스트 분할 처리 (인트로 타이포그래피) */
    document.querySelectorAll(".br-name").forEach(el => {
        const text = el.textContent.trim();
        el.innerHTML = text
            .split("")
            .map(char => `<span>${char === " " ? "&nbsp;" : char}</span>`)
            .join("");
    });

    /* 02. 메인 인트로 타임라인 (카드 등장 및 3D 변형) */
    let intro = gsap.timeline({
        defaults: { ease: "power3.out" }
    });

    intro.add("intro", 0);
    intro.add("lastCard", "intro+=0.56");
    intro.add("oneCard", "lastCard+=1");

    // [Step 1] 카드 순차 등장 애니메이션
    intro.to(".start-animation .animation-card:not(:nth-child(1))", { "--s": 1, stagger: 0.08 }, "intro");
    intro.to(".start-animation .animation-card:nth-child(1)", { "--s": 1 }, "lastCard");
    intro.to(".start-animation .animation-card:not(:nth-child(1))", { "--s": 0, stagger: 0.08 });

    // [Step 2] 메인 카드 3D 플립 및 레이아웃 확장
    intro.to(".card-stage .flex-card_list", { opacity: 1 }, "oneCard")
        .to(".start-animation .animation-card:nth-child(1)", { opacity: 0 }, "oneCard");

    intro.to(".flex-card_item:nth-child(3) .flex-card", { rotateY: -80, duration: 1 }, "oneCard")
        .to(".flex-card_item:nth-child(3) .flex-card", { rotateY: 180, duration: 1.5, ease: "back.out(1.7)" }, "oneCard+=0.4")
        .to(".flex-card_item:nth-child(3) .flex-card_scale", { scale: 1.3, duration: 1.2, ease: "back.out(1.7)" }, "oneCard+=0.4");

    intro.to(".card-stage .flex-card_item:not(:nth-child(3))", { opacity: 1, scale: 1.3 }, "oneCard+=0.6");
    intro.to(".flex-card_item", {
        x: (i) => (i - 2) * 300 + "px",
        y: 100,
        duration: 1
    }, "oneCard+=0.6");

    // [Step 3] 하단 브랜드 네임 등장 애니메이션
    intro.to(".br-wrap:nth-child(1) .br-name span", { y: "0%", stagger: { each: 0.08, from: "start" } }, "intro");
    intro.to(".br-wrap:nth-child(2) .br-name span", { y: "0%", stagger: { each: 0.08, from: "center" } }, "intro");
    intro.to(".br-wrap:nth-child(3) .br-name span", { y: "0%", stagger: { each: 0.08, from: "end" } }, "intro");

    // 애니메이션 완료 시점 스크롤 해제 콜백
    intro.call(unlockScrollAfterSection01, null, 'onComplete');

    /* 03. 인트로 이후 요소 변형 (헤더 및 로고 확장) */
    intro.add("after", "oneCard+=1.5");
    intro.to("#header", { y: 0 }, "after");

    intro.to(".br-wrap:nth-child(1)", { width: "0" }, "after")
        .to(".br-wrap:nth-child(1) .br-name", { scale: 0 }, "after");

    intro.to(".br-wrap:nth-child(2) .br-name", { fontSize: "150px" }, "after");

    intro.to(".br-wrap:nth-child(3)", { width: "0" }, "after")
        .to(".br-wrap:nth-child(3) .br-name", { scale: 0 }, "after");

    intro.to(".intro-top_title, .intro-sub_title", { y: 0 }, "after");

    // 스크롤 연동 패럴랙스 (로고 및 타이틀 하강)
    const scrollTl = gsap.timeline({
        scrollTrigger: { trigger: ".start-animation", start: "top top", end: "+=1000", scrub: true }
    });
    scrollTl.to(".start-animation .br-area .br-wrap:nth-child(2)", { y: 600 }, 0)
        .to("#section01 .sub-wrap", { y: 600 }, 0);

    /* 04. 섹션 01 카드 깊이감 스크롤 애니메이션 */
    const cardScrollTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#section01", start: "top top",
            end: "100% 0%",
            scrub: true,
        }
    });

    cardScrollTl.to(".flex-card_item:nth-child(1), .flex-card_item:nth-child(5)", { y: 100, scale: 1.8 }, 0);
    cardScrollTl.to(".flex-card_item:nth-child(2), .flex-card_item:nth-child(4)", { y: 250, scale: 1.8 }, 0);
    cardScrollTl.to(".flex-card_item:nth-child(3)", { y: 400, scale: 1.5 }, 0);
    cardScrollTl.to(".card-stage .flex-card_list", { opacity: 0 });

    /* 05. 섹션 02 텍스트 및 애플페이 배경 애니메이션 */
    // 텍스트 순차 등장
    gsap.to("#section02 .about-paragraph, #section02 .about-headline span, #section02 .about-hidden", {
        scrollTrigger: {
            trigger: '#section02',
            start: "0% 50%",
            end: "30% 50%",
            scrub: 1
        },
        y: 0,
        opacity: 1,
        stagger: 0.1
    });

    // 배경색 전환 트리거
    ScrollTrigger.create({
        trigger: '.pay-animation',
        start: "top 70%",
        onEnter: () => document.querySelector('.pay-animation').classList.add('bg'),
        onLeaveBack: () => document.querySelector('.pay-animation').classList.remove('bg'),
    });

    /* 06. 애플페이 카드 고정(Pin) 및 등장 애니메이션 */
    let payTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.pay-animation',
            start: "top top",
            end: "+=1000",
            pin: true,
            scrub: 1,
            markers: false
        }
    });

    payTimeline.to(".payment-visual__card", {
        opacity: 1,
        duration: 2,
        ease: "power2.out"
    });
    payTimeline.to({}, { duration: 0.5 });

    /* 07. 섹션 04 그리드 타이틀 및 카드 호버/스크롤 인터랙션 */
    let sect04 = gsap.timeline({
        scrollTrigger: { trigger: '#section04', start: "0% 50%" }
    });
    sect04.to("#section04 .pos-wrap .title span", { y: 0, opacity: 1, stagger: 0.1 });

    // 카드 이미지 시퀀스 설정
    const cardImages = [
        "card_front03.png", "card_front04.png", "card_front05.png", "card_front06.png",
        "card_front07.png", "card_front08.png", "card_front09.png", "card_front10.png",
        "card_front11.png", "card_front12.png"
    ];

    const card = document.querySelector('.center-card_box .card');
    const cards = document.querySelectorAll('.center-card_box .card img');
    let hoverIndex = 0;
    let hoverInterval = null;

    // 스크롤 위치에 따른 카드 이미지 변경
    const cardST = ScrollTrigger.create({
        trigger: ".center-card_box",
        start: "top 100%",
        end: "bottom 0%",
        scrub: 0,
        onUpdate(self) {
            if (hoverInterval) return;
            const idx = Math.floor(self.progress * (cardImages.length - 1) + 0.5);
            cards.forEach(img => {
                if (img.dataset.lastIndex != idx) {
                    img.src = './assets/imgs/' + cardImages[idx];
                    img.dataset.lastIndex = idx;
                }
            });
        }
    });

    // 카드 호버 시 이미지 시퀀스 자동 재생
    card.addEventListener('mouseenter', () => {
        cardST.disable();
        hoverIndex = 0;
        hoverInterval = setInterval(() => {
            const cardImg = card.querySelector('img');
            cardImg.src = './assets/imgs/' + cardImages[hoverIndex];
            hoverIndex = (hoverIndex + 1) % cardImages.length;
        }, 120);
    });

    card.addEventListener('mouseleave', () => {
        clearInterval(hoverInterval);
        hoverInterval = null;
        cardST.enable();
        ScrollTrigger.refresh();
    });

    // 그리드 카드 활성화 클래스 토글
    $('.grid-card_front').each(function (a, b) {
        ScrollTrigger.create({
            trigger: b,
            start: "top 80%",
            end: "bottom 0%",
            toggleClass: { targets: b, className: "active" },
            once: true,
        });
    });

    /* 08. 제로 영역(Zero Area) 3D 입체 레이어 및 카드 플립 */
    let large = gsap.timeline({
        scrollTrigger: { trigger: '.display-large', start: "0% 50%", scrub: true }
    });
    large.to('.display-large .layer:nth-child(2)', { yPercent: 15 }, 'a')
        .to('.display-large .layer:nth-child(3)', { yPercent: 23 }, 'a');

    const centerCard = document.querySelector('.zero-card .center');
    const flipTl = gsap.timeline({ paused: true });
    flipTl.to(centerCard.querySelector('.card-box_front'), { rotateY: -180 }, 0)
        .to(centerCard.querySelector('.card-box_back'), { rotateY: 0 }, 0);

    centerCard.addEventListener('mouseenter', () => flipTl.play());
    centerCard.addEventListener('mouseleave', () => flipTl.reverse());

    // 스크롤 시 양옆 카드 벌어지는 효과
    gsap.timeline({
        scrollTrigger: { trigger: ".inner", start: "0% 40%", end: "100% 100%", scrub: 1 }
    }).to(".zero-card .left", { x: -300, scale: 0.8 }, 0)
        .to(".zero-card .right", { x: 300, scale: 0.8 }, 0);

    /* 09. 브랜드 휠 슬라이더 (원형 로테이션 배치) */
    gsap.to('.overflow_wrap span', {
        y: 0, opacity: 1, stagger: 0.3,
        scrollTrigger: { trigger: '.champion-brand_title', start: "0% 100%", end: "100% 70%", scrub: true }
    });

    const slider = document.querySelector(".wheel-list");
    const images = gsap.utils.toArray(".wheel-item");

    function sliderCircle() {
        let radius = slider.offsetWidth / 2;
        let center = slider.offsetWidth / 2;
        let slice = (2 * Math.PI) / images.length;

        images.forEach((item, i) => {
            let radian = i * slice;
            let x = radius * Math.sin(radian) + center;
            let y = -radius * Math.cos(radian) + center;
            gsap.set(item, { rotation: radian + "rad", xPercent: -50, yPercent: -50, x: x, y: y });
        });
    }

    sliderCircle();
    window.addEventListener("resize", sliderCircle);

    gsap.to(".wheel-list", {
        rotate: -100,
        ease: "none",
        scrollTrigger: { trigger: ".wheel-sect", start: "top bottom", end: "100% 0%", scrub: 0.5, }
    });

    /* 10. 푸터(Footer) 및 컬처(Culture) 섹션 애니메이션 */
    let dive = gsap.timeline({
        scrollTrigger: { trigger: '.dive-area', start: "0% 60%", end: "100% 50%", scrub: true }
    });

    dive.to('.sub-title', { y: 0, opacity: 1 })
        .to('#footer .main-title span', { y: 0, opacity: 1, stagger: 0.3 });

    let culture = gsap.timeline({
        scrollTrigger: { trigger: '.culture', start: "0% 50%", end: "100% 70%", scrub: true }
    });
    culture.to('.left .culture-title, .left .culture-list', { y: 0, opacity: 1, stagger: 0.1 })
        .to('.right .culture-title, .right .culture-list', { y: 0, opacity: 1, stagger: 0.1 }, "<");
});

/* 11. 공통 카드 이미지 랜덤 셔플 호버 (상단 영역) */
document.addEventListener('DOMContentLoaded', () => {
    const imageArray = [
        "./assets/imgs/card_front31.png", "./assets/imgs/card_front32.png",
        "./assets/imgs/card_front33.png", "./assets/imgs/card_front26.png",
        "./assets/imgs/card_front34.png"
    ];

    function shuffle(arr) {
        return arr.map(v => ({ v, r: Math.random() })).sort((a, b) => a.r - b.r).map(o => o.v);
    }

    document.querySelectorAll('.flex-top_item').forEach((item) => {
        const img = item.querySelector('img');
        if (!img) return;

        const originalSrc = img.src;
        let intervalId = null;
        let shuffled = [];
        let idx = 0;
        let isPlaying = false;

        item.addEventListener('mouseenter', () => {
            if (isPlaying) return;
            isPlaying = true;
            shuffled = shuffle(imageArray);
            idx = 0;
            intervalId = setInterval(() => {
                img.src = shuffled[idx];
                idx++;
                if (idx >= shuffled.length) {
                    clearInterval(intervalId);
                    intervalId = null;
                    isPlaying = false;
                }
            }, 180);
        });

        item.addEventListener('mouseleave', () => {
            clearInterval(intervalId);
            intervalId = null;
            isPlaying = false;
            img.src = originalSrc;
        });
    });
});

/* 12. 공통 카드 이미지 랜덤 셔플 호버 (하단 영역) */
document.addEventListener('DOMContentLoaded', () => {
    const imageArray = [
        "./assets/imgs/card_front30.png", "./assets/imgs/card_front18.png",
        "./assets/imgs/card_front24.png", "./assets/imgs/card_front22.png",
        "./assets/imgs/card_front38.png"
    ];

    function shuffle(arr) {
        return arr.map(v => ({ v, r: Math.random() })).sort((a, b) => a.r - b.r).map(o => o.v);
    }

    document.querySelectorAll('.flex-bottom_item').forEach((item) => {
        const img = item.querySelector('.img-wrap img');
        if (!img) return;

        const originalSrc = img.src;
        let intervalId = null;
        let shuffled = [];
        let idx = 0;
        let isPlaying = false;

        item.addEventListener('mouseenter', () => {
            if (isPlaying) return;
            isPlaying = true;
            shuffled = shuffle(imageArray);
            idx = 0;
            intervalId = setInterval(() => {
                img.src = shuffled[idx];
                idx++;
                if (idx >= shuffled.length) {
                    clearInterval(intervalId);
                    intervalId = null;
                    isPlaying = false;
                }
            }, 180);
        });

        item.addEventListener('mouseleave', () => {
            clearInterval(intervalId);
            intervalId = null;
            isPlaying = false;
            img.src = originalSrc;
        });
    });
});