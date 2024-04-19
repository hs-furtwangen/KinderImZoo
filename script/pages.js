
let currentPage = 0;
const [prev, next] = document.querySelectorAll(".page-turner");
prev.addEventListener("click", () => turnPage(-1));
next.addEventListener("click", () => turnPage(1));

const pages = document.querySelectorAll(".page");
const main = document.getElementById("main");

function turnPage(direction) {
    turnToPage(currentPage + direction);
}

let isTurningAPage = false;
function turnToPage(nextPage) {
    if (isTurningAPage) return;
    nextPage = Math.max(0, Math.min(nextPage, pages.length - 1));
    if (nextPage === currentPage) return;
    isTurningAPage = true;

    let cloneNext = pages[nextPage].cloneNode(true);
    let cloneCurrent = pages[currentPage].cloneNode(true);
    pages[nextPage].classList.add("turn", nextPage > currentPage ? "right-to-left" : "left-to-right");
    cloneNext.classList.add("turn-overlay", nextPage > currentPage ? "right-to-left" : "left-to-right");
    cloneCurrent.classList.add("turn-underlay", nextPage > currentPage ? "right-to-left" : "left-to-right");
    main.appendChild(cloneNext);
    main.appendChild(cloneCurrent);

    let curr = currentPage;
    setTimeout(() => {
        pages[curr].classList.remove("active");
        pages[nextPage].classList.add("active");
        pages[nextPage].classList.remove("turn", "right-to-left", "left-to-right");
        main.removeChild(cloneNext);
        main.removeChild(cloneCurrent);
        isTurningAPage = false;
    }, 1500);

    currentPage = nextPage;
}