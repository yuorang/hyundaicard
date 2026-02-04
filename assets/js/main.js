$(function () {
    /**
     * 00. 초기 설정 및 부드러운 스크롤 (Lenis)
     */
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 600);
    });
    gsap.ticker.lagSmoothing(0);




    // 섹션01(.section01)이 끝나면 스크롤 해제

    // 스크롤 막는 함수
    function disableScroll() {
        document.body.classList.add('no-scroll');
        document.documentElement.classList.add('no-scroll');
    }

    // 스크롤 허용 함수
    function enableScroll() {
        document.body.classList.remove('no-scroll');
        document.documentElement.classList.remove('no-scroll');
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.left = '';
        document.body.style.top = '';
        document.body.style.touchAction = '';
    }

    // 섹션01이 끝날 때까지 스크롤 잠금
    disableScroll();

    // 섹션01 애니메이션이 모두 끝나면 스크롤 허용 (section02로 이동하지 않음)
    function unlockScrollAfterSection01() {
        enableScroll();
        if (typeof lenis !== 'undefined' && lenis) {
            lenis.stop();
            setTimeout(() => {
                lenis.start();
            }, 10);
        }
        // 섹션02로 이동하지 않고 현재 위치 유지
    }












    /**
     * 01. 인트로 텍스트 전처리 (글자 단위 분할)
     * .br-name 내부의 텍스트를 한 글자씩 <span>으로 감싸 Stagger 효과 준비
     */
    document.querySelectorAll(".br-name").forEach(el => {
        const text = el.textContent.trim();
        el.innerHTML = text
            .split("")
            .map(char => `<span>${char === " " ? "&nbsp;" : char}</span>`)
            .join("");
    });


    /**
     * 02. 메인 인트로 애니메이션 (Timeline)
     * 카드 등장 -> 교체 -> 3D 플립 -> 타이포그래피 등장 순서
     */
    let intro = gsap.timeline({
        defaults: { ease: "power3.out" }
    });

    // 타임라인 라벨 설정 (애니메이션 타이밍 동기화용)
    intro.add("intro", 0);                     // 시작점
    intro.add("lastCard", "intro+=0.56");      // 1번 카드 등장 시점
    intro.add("oneCard", "lastCard+=1");       // 메인 카드 변형 시작 시점

    // [Step 1] 카드 순차 등장 및 사라짐
    intro.to(".start-animation .animation-card:not(:nth-child(1))", { "--s": 1, stagger: 0.08 }, "intro");
    intro.to(".start-animation .animation-card:nth-child(1)", { "--s": 1 }, "lastCard");
    intro.to(".start-animation .animation-card:not(:nth-child(1))", { "--s": 0, stagger: 0.08 });

    // [Step 2] 카드 리스트 교체 및 메인 카드(3번) 강조 효과
    intro.to(".card-stage .flex-card_list", { opacity: 1 }, "oneCard")
        .to(".start-animation .animation-card:nth-child(1)", { opacity: 0 }, "oneCard");

    // 3번 카드 3D 회전 및 스케일 업 (Anticipation)
    intro.to(".flex-card_item:nth-child(3) .flex-card", { rotateY: -80, duration: 1 }, "oneCard")
        .to(".flex-card_item:nth-child(3) .flex-card", { rotateY: 180, duration: 1.5, ease: "back.out(1.7)" }, "oneCard+=0.4")
        .to(".flex-card_item:nth-child(3) .flex-card_scale", { scale: 1.3, duration: 1.2, ease: "back.out(1.7)" }, "oneCard+=0.4");

    // 나머지 카드들 퍼지며 정렬
    intro.to(".card-stage .flex-card_item:not(:nth-child(3))", { opacity: 1, scale: 1.3 }, "oneCard+=0.6");
    intro.to(".flex-card_item", {
        x: (i) => (i - 2) * 20 + "vw", // 중앙 기준 좌우 대칭 이동
        y: 100,
        duration: 1
    }, "oneCard+=0.6");

    // [Step 3] 하단 현대타드 글자 방향별 등장
    intro.to(".br-wrap:nth-child(1) .br-name span", { y: "0%", stagger: { each: 0.08, from: "start" } }, "intro");
    intro.to(".br-wrap:nth-child(2) .br-name span", { y: "0%", stagger: { each: 0.08, from: "center" } }, "intro");
    intro.to(".br-wrap:nth-child(3) .br-name span", { y: "0%", stagger: { each: 0.08, from: "end" } }, "intro");
    // ?
    intro.call(unlockScrollAfterSection01, null, 'onComplete');
    /**
     * 03. 인트로 이후 스크롤 인터랙션 (After-Intro)
     * 헤더 등장 및 로고 확장
     */
    intro.add("after", "oneCard+=1.5");
    intro.to("#header", { y: 0 }, "after");

    // 중앙 로고 확장 및 양옆 요소 제거
    intro.to(".br-wrap:nth-child(1)", {
        width: "0"
    }, "after")
        .to(".br-wrap:nth-child(1) .br-name", {
            scale: 0
        }, "after");

    intro.to(".br-wrap:nth-child(2) .br-name", {
        fontSize: "10vw"
    }, "after");

    intro.to(".br-wrap:nth-child(3)", {
        width: "0"
    }, "after")
        .to(".br-wrap:nth-child(3) .br-name", {
            scale: 0
        }, "after");

    // 타이틀 등장
    intro.to(".intro-top_title, .intro-sub_title", { y: 0 }, "after");


    // 스크롤 시 로고 및 타이틀 하강 (Parallax)
    const scrollTl = gsap.timeline({
        scrollTrigger: { trigger: ".start-animation", start: "top top", end: "+=1000", scrub: true }
    });
    scrollTl.to(".start-animation .br-area .br-wrap:nth-child(2)", { y: 600 }, 0)
        .to("#section01 .sub-wrap", { y: 600 }, 0);


    /**
     * 04. 카드 깊이감 및 iPhone 안착 애니메이션
     */
    const cardScrollTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#section01", start: "top top",
            end: "100% 0%",
            scrub: true,
            // markers: true
        }
    });

    // 거리차를 이용한 입체감 (1,5번 / 2,4번 / 3번 순)
    cardScrollTl.to(".flex-card_item:nth-child(1), .flex-card_item:nth-child(5)", {
        y: 100,
        scale: 1.8,
    }, 0);
    cardScrollTl.to(".flex-card_item:nth-child(2), .flex-card_item:nth-child(4)", {
        y: 250,
        scale: 1.8,
    }, 0);
    cardScrollTl.to(".flex-card_item:nth-child(3)", {
        y: 400,
        scale: 1.5,
    }, 0);
    cardScrollTl.to(".card-stage .flex-card_list", {
        opacity: 0
    },);


    /**
     * 06. Section 02 & 03 애니메이션
     */
    let sect02 = gsap.timeline({
        scrollTrigger: { trigger: '#section02', start: "0% 50%", end: "100% 100%" }
    });
    sect02.to("#section02 .about-paragraph, #section02 .about-headline span, #section02 .about-hidden", {
        y: 0, opacity: 1, stagger: 0.1
    });

    const containers = document.querySelectorAll(
        "#section02 .payment-visual__container"
    );

    // 🔧 여기만 조절하면 됨
    const STEP = Math.min(window.innerWidth * 0.22, 320);

    gsap.set(containers, (i) => ({
        x: 0,
        opacity: i === 2 ? 1 : 0,
        scale: i === 2 ? 1.05 : 0.95
    }));

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#section02 .payment-visual",
            start: "top top",
            end: "+=3000",
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // markers: true
        }
    });

    tl.to(containers, {
        x: (i) => {
            if (i === 2) return 0;
            return (i - 2) * STEP;
        },
        opacity: 1,
        duration: 6,
        rotationY: (i) => (i - 2) * 6,
        ease: "power3.out"
    }, "+=1");

    /* ① 카드 나타남 */
    tl.to(".payment-visual__card", {
        opacity: 1,
        duration: 3,
    }, "+=1");

    /* ② 카드 플립 (앞면 공개) */
    tl.to(".payment-visual__card", {
        rotationY: 180,
        duration: 3,
        ease: "power2.inOut",
    }, 'a');

    /* ③ 카드 90도로 세워짐 */
    tl.to(".payment-visual__card", {
        rotation: 90,
        duration: 3,
        transformOrigin: "center center",
        xPercent: 80,
        // yPercent: -50,
        ease: "power2.in"
    }, 'b');

    /* ④ 아래로 내려가면서 퇴장 */
    const moveTopMap = ["+=65%", "+=45%", "+=20%", "+=45%", "+=65%"];

    tl.to(".payment-visual__card", {
        top: (i) => moveTopMap[i],
        // rotation: 90,
        duration: 10,
        ease: "power3.in"
    });
    tl.to({}, { duration: 5 });










    /**
     * 07. Section 04 그리드 카드 및 호버 인터랙션
     */
    let sect04 = gsap.timeline({
        scrollTrigger: { trigger: '#section04', start: "0% 50%" }
    });
    sect04.to("#section04 .pos-wrap .title span", { y: 0, opacity: 1, stagger: 0.1 })



    // 이미지 배열 10
    const cardImages = [
        "card_front03.png",
        "card_front04.png",
        "card_front05.png",
        "card_front06.png",
        "card_front07.png",
        "card_front08.png",
        "card_front09.png",
        "card_front10.png",
        "card_front11.png",
        "card_front12.png"
    ];

    const card = document.querySelector('.center-card_box .card');
    const cardImg = card.querySelector('img');
    const cards = document.querySelectorAll('.center-card_box .card img');

    let hoverIndex = 0;
    let hoverInterval = null;

    const cardST = ScrollTrigger.create({
        trigger: ".center-card_box",
        start: "top 100%",
        end: "bottom 0%",
        scrub: 0,
        // markers: true,
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

    // 호버
    card.addEventListener('mouseenter', () => {
        cardST.disable();

        hoverIndex = 0;
        hoverInterval = setInterval(() => {
            cardImg.src = './assets/imgs/' + cardImages[hoverIndex];
            hoverIndex = (hoverIndex + 1) % cardImages.length;
        }, 120);
    });

    // 호버아웃
    card.addEventListener('mouseleave', () => {
        clearInterval(hoverInterval);
        hoverInterval = null;

        cardST.enable();
        ScrollTrigger.refresh();
    });

    $('.grid-card_front').each(function (a, b) {
        console.log(a);
        console.log(b);
        ScrollTrigger.create({
            trigger: b,
            start: "top 80%",
            end: "bottom 0%",
            toggleClass: {
                targets: b,
                className: "active"
            },
            once: true,
            // markers: true,
        });
    });




    /**
     * 08. Display Large & Zero Area (입체감 및 중앙 카드)
     */
    let large = gsap.timeline({
        scrollTrigger: { trigger: '.display-large', start: "0% 50%", scrub: true }
    });
    large.to('.display-large .layer:nth-child(2)', { yPercent: 15 }, 'a')
        .to('.display-large .layer:nth-child(3)', { yPercent: 23 }, 'a');

    // Zero Area 중앙 카드 플립 및 양옆 카드 벌어지기
    const centerCard = document.querySelector('.zero-card .center');
    const flipTl = gsap.timeline({ paused: true });
    flipTl.to(centerCard.querySelector('.card-box_front'), { rotateY: -180 }, 0)
        .to(centerCard.querySelector('.card-box_back'), { rotateY: 0 }, 0);

    centerCard.addEventListener('mouseenter', () => flipTl.play());
    centerCard.addEventListener('mouseleave', () => flipTl.reverse());

    gsap.timeline({
        scrollTrigger: { trigger: ".inner", start: "0% 40%", end: "100% 100%", scrub: 1 }
    }).to(".zero-card .left", { x: -300, scale: 0.8 }, 0)
        .to(".zero-card .right", { x: 300, scale: 0.8 }, 0);


    /**
     * 09. Hero Typography & Wheel Slider (원형 로테이션)
     */
    gsap.to('.overflow_wrap span', {
        y: 0, opacity: 1, stagger: 0.3,
        scrollTrigger: { trigger: '.champion-brand_title', start: "0% 100%", end: "100% 70%", scrub: true }
    });

    const slider = document.querySelector(".wheel-list");
    const images = gsap.utils.toArray(".wheel-item");

    // 이미지 원형 배치 함수
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


    /**
     * 10. Footer 애니메이션
     */
    let dive = gsap.timeline({
        scrollTrigger: {
            trigger: '.dive-area',
            start: "0% 60%",
            end: "100% 50%",
            scrub: true,
            // markers:true 
        }
    });

    dive.to('.sub-title', {
        y: 0,
        opacity: 1
    })
        .to('#footer .main-title span', {
            y: 0,
            opacity: 1,
            stagger: 0.3
        })

    let culture = gsap.timeline({
        scrollTrigger: {
            trigger: '.culture',
            start: "0% 50%",
            end: "100% 70%",
            scrub: true,
            // markers:true 
        }
    });
    culture.to('.left .culture-title, .left .culture-list', {
        y: 0,
        opacity: 1,
        stagger: 0.1
    })
        .to('.right .culture-title, .right .culture-list', {
            y: 0,
            opacity: 1,
            stagger: 0.1
        }, "<");
});


// 카드 애니메이션
document.addEventListener('DOMContentLoaded', () => {

    const imageArray = [
        "./assets/imgs/card_front31.png",
        "./assets/imgs/card_front32.png",
        "./assets/imgs/card_front33.png",
        "./assets/imgs/card_front26.png",
        "./assets/imgs/card_front34.png"
    ];

    // 배열 셔플 함수 (중복 없이 랜덤)
    function shuffle(arr) {
        return arr
            .map(v => ({ v, r: Math.random() }))
            .sort((a, b) => a.r - b.r)
            .map(o => o.v);
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
                    isPlaying = false; // 다시 hover 가능
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

// 카드애니메이션
document.addEventListener('DOMContentLoaded', () => {

    const imageArray = [
        "./assets/imgs/card_front30.png",
        "./assets/imgs/card_front18.png",
        "./assets/imgs/card_front24.png",
        "./assets/imgs/card_front22.png",
        "./assets/imgs/card_front38.png"
    ];

    //  중복 없는 랜덤 셔플
    function shuffle(arr) {
        return arr
            .map(v => ({ v, r: Math.random() }))
            .sort((a, b) => a.r - b.r)
            .map(o => o.v);
    }

    document.querySelectorAll('.flex-bottom_item').forEach((item) => {
        const img = item.querySelector('.img-wrap img');
        if (!img) return; // hidden-card 자동 제외

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
            }, 180); // 속도 조절
        });

        item.addEventListener('mouseleave', () => {
            clearInterval(intervalId);
            intervalId = null;
            isPlaying = false;
            img.src = originalSrc;
        });
    });

});


