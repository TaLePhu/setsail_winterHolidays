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

// 2. logic tour-section
// ============================================
// TOUR CAROUSEL SCRIPT
// ============================================

class TourCarousel {
    constructor() {
        this.tourList = document.querySelector('.tour-list');
        this.tourListWrapper = document.querySelector('.tour-list-wrapper');
        this.dots = document.querySelectorAll('.dot');
        this.tourItems = document.querySelectorAll('.tour-item');
        
        // Cấu hình
        this.itemWidth = 288; // min-width của tour-item
        this.visibleItems = 5; // Số item hiển thị
        this.totalItems = this.tourItems.length; // 6 items
        this.autoPlayDelay = 3000; // 3 giây
        
        // Trạng thái
        this.currentPosition = 0;
        this.maxPosition = -(this.itemWidth * (this.totalItems - this.visibleItems));
        this.autoPlayTimer = null;
        this.isAutoPlayActive = true;
        
        // Kéo chuột
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.dragStartPosition = 0;
        
        this.init();
    }
    
    init() {
        this.cloneItems();
        this.setupDotNavigation();
        this.setupDragFunctionality();
        this.startAutoPlay();
    }
    
    // Clone items cho infinite loop khi kéo chuột
    cloneItems() {
        const itemsToClone = Array.from(this.tourItems);
        
        // Clone và thêm vào đầu
        itemsToClone.reverse().forEach(item => {
            const clone = item.cloneNode(true);
            clone.classList.add('cloned');
            this.tourList.insertBefore(clone, this.tourList.firstChild);
        });
        
        // Clone và thêm vào cuối
        itemsToClone.reverse().forEach(item => {
            const clone = item.cloneNode(true);
            clone.classList.add('cloned');
            this.tourList.appendChild(clone);
        });
        
        // Đặt vị trí ban đầu về giữa (sau các clone đầu)
        this.currentPosition = -(this.itemWidth * this.totalItems);
        this.updateTransform(false);
    }
    
    // Auto-play: di chuyển từ trái sang phải
    startAutoPlay() {
        if (!this.isAutoPlayActive) return;
        
        this.autoPlayTimer = setInterval(() => {
            // Tính vị trí tiếp theo dựa trên dots
            const currentSlide = this.getCurrentSlide();
            
            if (currentSlide === 0) {
                // Đang ở slide 1, chuyển sang slide 2
                this.moveToSlide(1);
            } else {
                // Đã ở slide 2, dừng auto-play
                this.stopAutoPlay();
            }
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
            this.isAutoPlayActive = false;
        }
    }
    
    // Xác định slide hiện tại dựa vào position
    getCurrentSlide() {
        const realPosition = this.currentPosition + (this.itemWidth * this.totalItems);
        
        if (realPosition >= -(this.itemWidth * 0.5)) {
            return 0; // Slide 1
        } else {
            return 1; // Slide 2
        }
    }
    
    // Di chuyển đến slide cụ thể (cho dots)
    moveToSlide(slideIndex) {
        const realPosition = -(this.itemWidth * this.totalItems);
        
        if (slideIndex === 0) {
            // Slide 1: vị trí ban đầu
            this.currentPosition = realPosition;
        } else {
            // Slide 2: di chuyển sang phải để lộ item cuối
            this.currentPosition = realPosition + this.maxPosition;
        }
        
        this.updateTransform(true);
        this.updateDots();
    }
    
    // Cập nhật trạng thái dots
    updateDots() {
        const currentSlide = this.getCurrentSlide();
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Setup navigation dots
    setupDotNavigation() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.stopAutoPlay();
                this.moveToSlide(index);
            });
        });
    }
    
    // Setup kéo chuột
    setupDragFunctionality() {
        // Mouse events
        this.tourList.addEventListener('mousedown', (e) => this.dragStart(e));
        document.addEventListener('mousemove', (e) => this.dragMove(e));
        document.addEventListener('mouseup', () => this.dragEnd());
        
        // Touch events
        this.tourList.addEventListener('touchstart', (e) => this.dragStart(e));
        document.addEventListener('touchmove', (e) => this.dragMove(e));
        document.addEventListener('touchend', () => this.dragEnd());
        
        // Ngăn chặn click khi đang kéo
        this.tourList.addEventListener('click', (e) => {
            if (this.isDragging) {
                e.preventDefault();
            }
        }, true);
    }
    
    dragStart(e) {
        this.stopAutoPlay();
        this.isDragging = true;
        this.tourList.classList.add('is-dragging');
        
        this.startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        this.dragStartPosition = this.currentPosition;
        
        // Dừng transition trong khi kéo
        this.tourList.style.transition = 'none';
    }
    
    dragMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        const diff = this.currentX - this.startX;
        
        this.currentPosition = this.dragStartPosition + diff;
        this.updateTransform(false);
    }
    
    dragEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.tourList.classList.remove('is-dragging');
        this.tourList.style.transition = '';
        
        // Kiểm tra vị trí và reset nếu cần (infinite loop)
        this.checkAndResetPosition();
        this.updateDots();
    }
    
    // Kiểm tra và reset vị trí cho infinite loop
    checkAndResetPosition() {
        const cloneThreshold = this.itemWidth * this.totalItems;
        const centerPosition = -cloneThreshold;
        
        // Nếu kéo quá sang phải (về phía clone đầu)
        if (this.currentPosition > centerPosition) {
            const offset = this.currentPosition - centerPosition;
            this.currentPosition = centerPosition - (cloneThreshold - offset);
            this.updateTransform(false);
        }
        
        // Nếu kéo quá sang trái (về phía clone cuối)
        if (this.currentPosition < centerPosition - cloneThreshold) {
            const offset = centerPosition - cloneThreshold - this.currentPosition;
            this.currentPosition = centerPosition + offset;
            this.updateTransform(false);
        }
        
        // Snap to nearest item
        const nearestPosition = Math.round(this.currentPosition / this.itemWidth) * this.itemWidth;
        this.currentPosition = nearestPosition;
        this.updateTransform(true);
    }
    
    // Cập nhật transform
    updateTransform(withTransition) {
        if (withTransition) {
            this.tourList.style.transition = 'transform 0.5s ease-in-out';
        }
        this.tourList.style.transform = `translateX(${this.currentPosition}px)`;
    }
}

// Khởi tạo khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    new TourCarousel();
});