function generateItems(pages, now) {
  const items = [];
  const loop = Math.min(pages, 7);
  for (let i = 0; i < loop; i++) {
    items.push(`<li class="pageItem pageItem${i + 1}">${i + 1}</li>`);
  }
  if (pages > 7) items[6] = `<li class="pageItem pageItem7">${pages}</li>`;

  this.innerHTML = `<button type="button" class="preBtn" data-preicon="&#xf104">上一頁</button>
    <ul class="pageList">
      <li class="nowpage"></li>
      ${items.join("")}
    </ul>
    <button type="button" class="nextBtn" data-nexticon="&#xf105">下一頁</button>`;
  this.addEventListener("click", changePage);
  this.now = now;
  this.pages = pages;
}
function updatePage(pagination) {
  pagination
    .querySelector(".preBtn")
    .classList.toggle("disabled", pagination.now === 1);
  pagination
    .querySelector(".nextBtn")
    .classList.toggle("disabled", pagination.now === pagination.pages);

  pagination.querySelector(".nowpage").dataset.nowpage = pagination.now;

  if (pagination.pages > 7) {
    changeDot(pagination);
    const [pageItem2, pageItem6] = [
      pagination.querySelector(".pageItem2"),
      pagination.querySelector(".pageItem6")
    ];
    pageItem2.classList.toggle("disabled", pageItem2.textContent === "...");
    pageItem6.classList.toggle("disabled", pageItem6.textContent === "...");
  } else {
    pagination
      .querySelector(".nowpage")
      .attributeStyleMap.set("--nowpage", pagination.now);
  }

  if (pagination.onchange !== undefined) {
    pagination.onchange(pagination.now - 1);
  }
}
function changeDot(pagination) {
  const dot1 = pagination.querySelector(".pageItem2");
  const dot2 = pagination.querySelector(".pageItem6");
  let seat = Math.min(
    Math.max(
      pagination.pages - pagination.now,
      pagination.now + 7 - pagination.pages
    ),
    pagination.now
  );

  dot1.textContent = pagination.now > 4 ? "..." : 2;
  dot2.textContent =
    pagination.now < pagination.pages - 3 ? "..." : pagination.pages - 1;
  const [left, center, right] = [3, 4, 5].map((i) =>
    pagination.querySelector(`.pageItem${i}`)
  );

  if (dot1.textContent !== "...") {
    [left.textContent, center.textContent, right.textContent] = [3, 4, 5];
  } else if (dot2.textContent !== "...") {
    [left.textContent, center.textContent, right.textContent] = [
      pagination.pages - 4,
      pagination.pages - 3,
      pagination.pages - 2
    ];
  } else {
    [left.textContent, center.textContent, right.textContent] = [
      pagination.now - 1,
      pagination.now,
      pagination.now + 1
    ];
    seat = 4;
  }

  pagination.querySelector(".nowpage").attributeStyleMap.set("--nowpage", seat);
}
function changePage(event) {
  if (event.target.nodeName != "NAV") {
    const target = event.target;
    const classList = target.classList;
    if (classList.contains("preBtn")) {
      this.now--;
    } else if (classList.contains("nextBtn")) {
      this.now++;
    } else if (classList.contains("pageItem")) {
      this.now = parseInt(target.textContent);
    }
    updatePage(this);
  }
}
const paginations = document.querySelectorAll(".my-pagination");
if (paginations.length > 0) {
  paginations.forEach((pagination) => {
    Object.defineProperties(pagination, {
      pages: {
        get() {
          return this._pages;
        },
        set(value) {
          this._pages = value;
          updatePage(this);
        }
      },
      now: {
        get() {
          return this._now;
        },
        set(value) {
          this._now = value;
        }
      },
      onchange: {
        get() {
          return this._onchange;
        },
        set(value) {
          this._onchange = value;
        }
      },
      setPages: { value: generateItems },
      setButtonText: {
        value(prev, next) {
          this.querySelector(".preBtn").textContent = prev;
          this.querySelector(".nextBtn").textContent = next;
        }
      },
      setButtonIcon: {
        value(prev, next) {
          this.querySelector(".preBtn").dataset.preicon = prev;
          this.querySelector(".nextBtn").dataset.nexticon = next;
        }
      }
    });
  });
}

// paginations[0].setPages(15, 1);

//設定btn的文字 prev,next
// paginations[0].setButtonText("","");

//設定btn的icon prev,next
// paginations[0].setButtonIcon('v','v');

//讓主要的程式可以將當頁數改變時要執行的function綁定過來
// function change(now){
//   console.log(now);
// }
//  paginations[0].onchange=change;