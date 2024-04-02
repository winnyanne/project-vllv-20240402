const selectWraps = document.querySelectorAll(".mySelect-wrap");
selectWraps.forEach((e) => {
    const select = e.querySelector(".mySelect");
    const option1 = select.children[0];
    const arrowUp = "\uf0d8",
        arrowDown = "\uf0d7",
        loading = "\uf110";
    function loadfin() {
        e.dataset.status = arrowDown;
        select.disabled = false;
        option1.textContent = "請選擇";
    } //調用來停止loading狀態
    e.loadfin = loadfin;
    select.addEventListener("click", () => {
        if (e.dataset.status == arrowUp) {
            select.classList.remove('active');
            e.dataset.status = arrowDown;
        }
        else {
            select.classList.add('active');
            e.dataset.status = arrowUp;
        }
    });
    select.addEventListener("blur", () => {
        e.dataset.status = arrowDown;
        select.classList.remove('active');
    });
});
