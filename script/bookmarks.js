let bookmarks = document.querySelectorAll(".bookmark");
for(let bookmark of bookmarks) {
    bookmark.addEventListener("click", jumpToBookmark);
    document.addEventListener("turnToPage", turnedToPage.bind(bookmark));
}

function jumpToBookmark(_event){
    let page = Number(_event.target.dataset.page);
    turnToPage(page);
}

function turnedToPage(_event){
    let from = Number(this.dataset.page);
    let to = Number(this.dataset.pageTo);
    let newPage = Number(_event.detail.page);

    if(newPage >= from && newPage <= to){
        this.classList.add("active");
    } else {
        this.classList.remove("active");
    }
}