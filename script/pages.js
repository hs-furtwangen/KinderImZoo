let pageTurnerLeft = document.getElementById("page-turner-left");
let pageTurnerRight = document.getElementById("page-turner-right");
let totalPages = document.querySelectorAll(".page").length;

document.addEventListener("keydown", keyDown);
document.addEventListener("turnToPage", checkHiddenPageTurner);

let currentPage = 0;
document.dispatchEvent(new CustomEvent("turnToPage", { detail: { page: currentPage } }));

const [prev, next] = document.querySelectorAll(".page-turner");
prev.addEventListener("click", () => turnPage(-1));
next.addEventListener("click", () => turnPage(1));

const pages = document.querySelectorAll(".page");
const pageWrapper = document.getElementById("page-wrapper");
const swipeOverlay = document.getElementById("page-swiper");
swipeOverlay.addEventListener("swiped", swipeHandler);

let isTurningInDirection = 0;
let zIndexUnderlay = 99;
let zIndexOverlay = 100;
let zIndexNextPage = 10;
function turnPage(direction) {
    direction = Math.sign(direction);
    if (isTurningInDirection !== 0 && Math.sign(isTurningInDirection) !== direction) return;

    let nextPage = Math.max(0, Math.min(currentPage + direction, pages.length - 1));
    if (nextPage === currentPage) return;

    isTurningInDirection += direction;

    speechbubble(pages[nextPage])

    let cloneNext = pages[nextPage].cloneNode(true);
    let cloneCurrent = pages[currentPage].cloneNode(true);
    pages[nextPage].classList.add("turn", nextPage > currentPage ? "right-to-left" : "left-to-right");
    pages[nextPage].style.zIndex = zIndexNextPage++;
    cloneNext.classList.add("turn-overlay", nextPage > currentPage ? "right-to-left" : "left-to-right");
    cloneCurrent.classList.add("turn-underlay", nextPage > currentPage ? "right-to-left" : "left-to-right");
    cloneNext.style.zIndex = zIndexOverlay++;
    cloneCurrent.style.zIndex = zIndexUnderlay--;
    pageWrapper.appendChild(cloneNext);
    pageWrapper.appendChild(cloneCurrent);

    let curr = currentPage;
    setTimeout(() => {
        pages[curr].classList.remove("active");
        pages[nextPage].style.zIndex = "";
        pages[nextPage].classList.add("active");
        pages[nextPage].classList.remove("turn", "right-to-left", "left-to-right");
        pageWrapper.removeChild(cloneNext);
        pageWrapper.removeChild(cloneCurrent);
        isTurningInDirection -= direction;

        if (isTurningInDirection === 0) {
            zIndexUnderlay = 99;
            zIndexOverlay = 100;
            zIndexNextPage = 10;
        }
    }, window.matchMedia("(pointer: coarse)").matches ? 500 : 1000);

    currentPage = nextPage;
    document.dispatchEvent(new CustomEvent("turnToPage", { detail: { page: currentPage } }));
}

function turnToPage(nextPage) {
    if (isNaN(nextPage)) return;
    nextPage = Math.max(0, Math.min(nextPage, pages.length - 1));
    if (nextPage === currentPage) return;

    let direction = Math.sign(nextPage - currentPage);
    let counter = 0;
    for (let page = currentPage; page !== nextPage; page += direction) {
        setTimeout(() => {
            turnPage(direction);
        }, 100 * counter++);
    }
}

function swipeHandler(_event) {
    if (_event.detail.dir === "left") {
        turnPage(1);
    }
    else if (_event.detail.dir === "right") {
        turnPage(-1);
    }
}

function keyDown(_event) {
    if (_event.keyCode === 39) {
        // -> 
        turnPage(1);
    } else if (_event.keyCode === 37) {
        // <- 
        turnPage(-1);
    }
}


function checkHiddenPageTurner(_event) {
    pageTurnerLeft.classList.remove("hidden");
    pageTurnerRight.classList.remove("hidden");
    if (_event.detail.page === 0) {
        pageTurnerLeft.classList.add("hidden");
    } else if (_event.detail.page === totalPages - 1) {
        pageTurnerRight.classList.add("hidden");
    }
}

let bubbles = ["assets/img/sprechblase_einsam.png", "assets/img/sprechblase_spielen.png", "assets/img/sprechblase_gelangweilt.png"]

function speechbubble(element) {
    if (!element) return;
    let speechbubble = element.querySelector(".speechbubble")
    if (!speechbubble) return
    speechbubble.src = bubbles[Math.floor(Math.random() * bubbles.length)];
}