// ====== CONFIG ======
const tourList = document.querySelector('.tour-list');
const wrapper = document.querySelector('.tour-list-wrapper');
const dots = document.querySelectorAll('.dot');

let isDragging = false;
let startX = 0;
let currentX = 0;
let deltaX = 0;
let itemWidth = 0;

// ====== UTILS ======
function getItemWidth() {
    return tourList.querySelector('.tour-item').offsetWidth;
}

function setTransition(value) {
    tourList.style.transition = value;
}

// ====== DOT LOGIC (KHÔNG LOOP) ======
dots.forEach(dot => {
    dot.addEventListener('click', () => {
        if (dot.classList.contains('active')) return;

        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');

        const index = Number(dot.dataset.slideTo);
        itemWidth = getItemWidth();

        // index = 0 → vị trí ban đầu
        // index = 1 → trượt sang trái 1 item
        tourList.style.transition = 'transform 0.4s ease';
        tourList.style.transform = `translateX(${-index * itemWidth}px)`;
    });
});

// ====== DRAG START ======
function dragStart(x) {
    isDragging = true;
    startX = x;
    setTransition('none');
}

// ====== DRAG MOVE ======
function dragMove(x) {
    if (!isDragging) return;
    deltaX = x - startX;
    tourList.style.transform = `translateX(${deltaX}px)`;
}

// ====== DRAG END ======
function dragEnd() {
    if (!isDragging) return;
    isDragging = false;

    itemWidth = getItemWidth();

    // swipe left
    if (deltaX < -itemWidth / 4) {
        slideNext();
    }
    // swipe right
    else if (deltaX > itemWidth / 4) {
        slidePrev();
    }
    // snap back
    else {
        setTransition('transform 0.3s ease');
        tourList.style.transform = 'translateX(0)';
    }

    deltaX = 0;
}

// ====== SLIDE NEXT (VÒNG TRÒN) ======
function slideNext() {
    setTransition('transform 0.3s ease');
    tourList.style.transform = `translateX(${-itemWidth}px)`;

    tourList.addEventListener('transitionend', function handler() {
        tourList.appendChild(tourList.firstElementChild);
        setTransition('none');
        tourList.style.transform = 'translateX(0)';
        tourList.removeEventListener('transitionend', handler);
    });
}

// ====== SLIDE PREV (VÒNG TRÒN) ======
function slidePrev() {
    setTransition('none');
    tourList.prepend(tourList.lastElementChild);
    tourList.style.transform = `translateX(${-itemWidth}px)`;

    requestAnimationFrame(() => {
        setTransition('transform 0.3s ease');
        tourList.style.transform = 'translateX(0)';
    });
}

// ====== MOUSE EVENTS ======
tourList.addEventListener('mousedown', e => dragStart(e.clientX));
window.addEventListener('mousemove', e => dragMove(e.clientX));
window.addEventListener('mouseup', dragEnd);

// ====== TOUCH EVENTS ======
tourList.addEventListener('touchstart', e => dragStart(e.touches[0].clientX));
tourList.addEventListener('touchmove', e => dragMove(e.touches[0].clientX));
tourList.addEventListener('touchend', dragEnd);
