// document.addEventListener('DOMContentLoaded', () => {
//     const slides = document.querySelectorAll('.slider__slide');
//     const contentInner = document.querySelector('.slider__content-inner');
//     let currentSlideIndex = 0;
//     const intervalTime = 2000; // 2000ms = 2 giây (yêu cầu)
    
//     // Hàm hiển thị slide và kích hoạt animation text
//     function showSlide(index) {
//         // 1. Tắt animation text để reset trạng thái (chuẩn bị cho lần animation tiếp theo)
//         contentInner.classList.remove('is-animating');

//         // 2. Ẩn tất cả slide
//         slides.forEach((slide) => {
//             slide.classList.remove('slider__slide--active');
//         });

//         // 3. Kích hoạt slide mới
//         const newSlide = slides[index];
        
//         // Đặt ảnh nền từ data attribute (chỉ cần làm lần đầu load hoặc nếu bạn muốn đảm bảo)
//         const bgUrl = newSlide.getAttribute('data-bg-url');
//         newSlide.style.backgroundImage = bgUrl;
        
//         newSlide.classList.add('slider__slide--active');
        
//         // 4. Kích hoạt lại animation text
//         // Cần một độ trễ nhỏ (khoảng 50ms) để trình duyệt nhận ra sự thay đổi lớp CSS (reset animation)
//         setTimeout(() => {
//             contentInner.classList.add('is-animating');
//         }, 50); 
//     }

//     // Hàm chuyển slide tiếp theo
//     function nextSlide() {
//         // Tính toán index của slide tiếp theo (quay lại 0 nếu đã hết)
//         currentSlideIndex = (currentSlideIndex + 1) % slides.length;
//         showSlide(currentSlideIndex);
//     }

//     // --- Khởi tạo ---

//     // 1. Đảm bảo slide đầu tiên được hiển thị và text được animate khi trang load
//     showSlide(currentSlideIndex);

//     // 2. Thiết lập tự động chuyển slide sau mỗi 2 giây
//     setInterval(nextSlide, intervalTime);
// });