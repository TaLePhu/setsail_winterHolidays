// Slider Animation Script
(function() {
    // Lấy các phần tử cần thiết
    const slides = document.querySelectorAll('.slider__slide');
    const btnLeft = document.querySelector('.slider__btn-left');
    const btnRight = document.querySelector('.slider__btn-right');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;
    let isAnimating = false;

    // Data content cho mỗi slide
    const slideContents = [
        {
            title: "From Alps",
            subtitle: "Snow Adventure",
            text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis Theme"
        },
        {
            title: "Enjoy your",
            subtitle: "Winter Vacations",
            text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis Theme"
        }
    ];

    // Khởi tạo: Set background-image từ data-bg-url
    slides.forEach(slide => {
        const bgUrl = slide.getAttribute('data-bg-url');
        if (bgUrl) {
            slide.style.backgroundImage = bgUrl;
        }
    });

    // Hàm cập nhật content
    function updateContent(slideIndex) {
        const content = slideContents[slideIndex];
        const contentInner = document.querySelector('.slider__content-inner');
        
        // Fade out content cũ
        contentInner.classList.remove('slider__content--show');
        
        // Sau khi fade out, cập nhật nội dung mới
        setTimeout(() => {
            document.querySelector('.slider__content-title').textContent = content.title;
            document.querySelector('.slider__content-subtitle').textContent = content.subtitle;
            document.querySelector('.slider__content-text').textContent = content.text;
            
            // Fade in content mới
            setTimeout(() => {
                contentInner.classList.add('slider__content--show');
            }, 50);
        }, 400);
    }

    // Hàm chuyển slide
    function goToSlide(slideIndex) {
        if (isAnimating) return;
        isAnimating = true;

        // Reset tất cả slides
        slides.forEach((slide, index) => {
            slide.classList.remove('slider__slide--active', 'slider__slide--zoom');
            
            if (index === slideIndex) {
                // Slide mới: hiện lên và zoom
                slide.classList.add('slider__slide--active');
                // Delay nhỏ để trigger animation
                setTimeout(() => {
                    slide.classList.add('slider__slide--zoom');
                }, 50);
            }
        });

        // Cập nhật content
        updateContent(slideIndex);

        currentSlide = slideIndex;

        // Cho phép animation tiếp theo sau 1s
        setTimeout(() => {
            isAnimating = false;
        }, 3000);
    }

    // Hàm next slide
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        goToSlide(next);
    }

    // Hàm previous slide
    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prev);
    }

    // Auto play
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 3000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Event listeners cho buttons
    btnLeft.addEventListener('click', () => {
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
    });

    btnRight.addEventListener('click', () => {
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
    });

    // Khởi động slider
    function initSlider() {
        // Hiển thị slide đầu tiên
        slides[currentSlide].classList.add('slider__slide--zoom');
        contentInner.classList.add('slider__content--show');
        
        // Bắt đầu auto play
        startAutoPlay();
    }

    // Dừng auto play khi hover vào slider
    const slider = document.getElementById('slider');
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    // Khởi chạy
    initSlider();
})();