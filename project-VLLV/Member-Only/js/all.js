document.addEventListener("touchstart", function () { }, true);//解決延遲
document.addEventListener('DOMContentLoaded', () => {

});
const navtogglers = document.querySelectorAll('.navbar-toggler');
navtogglers.forEach(toggler => {
  toggler.addEventListener('click', (e) => {
    const target = e.target.dataset.target;
    document.querySelector(target).classList.toggle('show');
  });
  toggler.addEventListener('blur', (e) => {
    const target = e.target.dataset.target;
    document.querySelector(target).classList.toggle('show');

  });
});

//faq page
const faq = document.querySelector('.faqPage');
if (faq) {
  const qaList = faq.querySelector('#qaList');
  // const faqURL = '/bakery/fakedata/faq.json';//上線版
  const faqURL = 'fakedata/faq.json';//Live Serve版
  let faqTemplate = '';
  let ans = '';
  fetch(faqURL)
    .then((response) => {
      return response.json();
    })
    .then((jsonData) => {
      const fadein = ['animate__fadeInTopLeft', 'animate__fadeInTopRight'];
      jsonData.forEach((data, index) => {
        ans = data.A.replace(/\n/g, '<br/>');
        faqTemplate = faqTemplate + `<li class='animate__animated ${fadein[index % 2]} animate__delay-${index}s'>
                                        <label><input type="checkbox" class="d-none collapse-toggler"><p class='fs-2 m-0'>Q${index + 1}.${data.Q}</p></label>
                                        <div class="my-collapse"><p class='fs-3 m-0'>${ans}</p></div>
                                    </li>
                                    `;
      });
      qaList.innerHTML = faqTemplate;
    })
    .catch((err) => {
      console.log(err);
    });
}

//購物清單

const shopList = document.querySelector('#shopList');
const shopListOffcanvas = document.querySelector('#shopListOffcanvas');
//購物清單更新
function shopListUpdate() {
  const template = cartList.length === 0 ? "" : cartList.map((item, index) => {
    return `<li class='border-bottom border-1 mb-2'>
          <div class="row mb-2">
            <div class="col-2 p-0"><img src="https://fakeimg.pl/600x600/282828/EAE0D0/?text=bread" data-index="0"></div>
            <div class="col-8 d-flex flex-column justify-content-evenly pe-0">
              <h2 class="fs-6 fw-normal">${item.product.category}</h2>
              <h2 class="fs-6 fw-normal">${item.product.Name}</h2>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-2 p-0"></div>
            <div class="col-8 d-flex justify-content-between pe-0">
              <h2 class='d-flex align-items-end fs-6 fw-normal'>${item.orderQuantity} x NT$298</h2>
              <button type="button" class="fa-solid fa-trash-can" onclick='delProduct(${index})'></button>
            </div>
          </div>
        </li>
    `
  }).join('');
  shopList.innerHTML = template;
  const shopCanva = document.querySelector('#shopListOffcanvas');
  if (shopList.textContent === '' && shopCanva.classList.contains('show')) {
    bootstrap.Offcanvas.getInstance(shopCanva).hide();
  }
}

//購物車
//採用localStroge模擬資料庫
//如果localStroge沒有 Cart資料 ?建立 :讀取資料並顯示購物車按鈕
const cartList = JSON.parse(window.localStorage.getItem('cartList')) || [];
const cart = document.createElement('button');
cart.type = 'button';
cart.dataset.bsToggle = 'offcanvas';
cart.dataset.bsTarget = '#shopListOffcanvas';

cart.setAttribute('aria-controls', 'shopListOffcanvas');
cart.ariaLabel = '購物清單';
cart.classList.add('cart', 'animate__animated', 'animate__tada', 'fa-solid', 'fa-cart-shopping', 'fs-1');
//循環動畫 間隔2.5s
cart.addEventListener('animationend', e => {
  setTimeout(function () {
    e.target.getAnimations()[0].play();
  }, 2500);
});
//立即函示 初始化購物車
(function () {
  document.body.append(cart);
  checkCart();
})();

//確認購物車有無東西
function checkCart() {
  cart.classList.toggle('d-none', cartList.length === 0);//當購物車陣列為空 隱藏購物車元件
  cart.dataset.cartqty = cartList.length;
  shopListUpdate();
}

//加入購物車 
function addProductToCart(order) {
  cartList.push(order);
  window.localStorage.setItem('cartList', JSON.stringify(cartList));
  checkCart();
}
//刪除購物車
function delProduct(i) {
  cartList.splice(i, 1);
  window.localStorage.setItem('cartList', JSON.stringify(cartList));
  checkCart();
}
//product page
const produt = document.querySelector('.productPage');
if (produt) {
  let bakeryData = {};
  let pages = [];//分頁
  const show = 6;//每頁顯示筆數

  const breadcrumb = document.querySelector('.breadcrumb');
  const category = document.querySelector('.product-categories');
  const list = document.querySelector('.product-list');
  const pagination = document.querySelector('.my-pagination');
  //獲取所有分類產品數總合
  function getTotal() {
    const categories = Object.keys(bakeryData);
    return categories.reduce((accumulator, category) => {
      return accumulator + bakeryData[category].length;
    }, 0);
  }
  function generateCategoryTemplate() {
    const total = getTotal();
    const categories = Object.keys(bakeryData);
    const categoryItems = categories.map(category => {
      return `<li><label data-amount='${bakeryData[category].length}' class='user-select-none'><input type="radio" name="category" class="d-none">${category}</label></li>`;
    }).join("");
    return `<li><label data-amount="${total}" class='user-select-none'><input type="radio" name="category" class="d-none">全部</label></li>${categoryItems}`;
  }
  function updateProductList(products) {
    list.innerHTML = products.map((product, index) =>
      `
          <li class='col-md-4 col-sm-6 mb-3 user-select-none animate__animated animate__bounceIn'>
            <div class='card text-center'>
              <div class='imgWrap position-relative'><img src='${product.ImgURL}' data-index='${index}'></div>
              <h2 class='fs-4'>${product.Name}</h2>
              <h2 class='fs-5'>${product.Price}</h2>
              <div class='ps-2 pb-2 pe-2'><button type='button' class='shopBtn myBtn d-block w-100' data-index='${index}'>加入購物車</button></div>              
            </div>
          </li>
        `
    ).join("");
    // 產品細節視窗
    [...list.children].forEach(item => {
      item.addEventListener('click', e => {
        if (e.target.nodeName === "IMG" || e.target.classList.contains('shopBtn')) {
          const info = products[e.target.dataset.index];
          (async () => {
            const { value: formValues } = await Swal.fire({
              title: "產品細節",
              width: '90vw',
              html: `
                <div class='row row-gap-5 w-100 justify-content-center'>
                  <div class='col-lg-4'>
                    <img class='mb-3' src='${info.ImgURL}'>
                    <ul class='m-0 ms-auto me-auto row flex-nowrap overflow-auto' style='max-width:600px;'>
                      <li class='col-4'><img src='${info.ImgURL}'></li>
                      <li class='col-4'><img src='${info.ImgURL}'></li>
                      <li class='col-4'><img src='${info.ImgURL}'></li>
                      <li class='col-4'><img src='${info.ImgURL}'></li>
                    </ul>
                  </div>
                  <div class='col-lg-8 col-xl-6 text-start'>
                    <h2>${info.Name}</h2>
                    <h3 class='fs-2'>${info.Price}</h3>
                    <h3 class='fs-5'>${info.Intro}</h3>                   
                    <div class='d-flex mb-3'>
                      <h3 class='fs-5 flex-shrink-0 pe-2'>重量:</h3>
                      <h3 class='fs-5'>${info.weight}</h3>
                    </div> 
                    <div class='d-flex mb-3'>
                      <h3 class='fs-5 flex-shrink-0 pe-2'>熱量:</h3>
                      <h3 class='fs-5'>${info.kcal}</h3>
                    </div>
                    <div class='d-flex flex-direction-column flex-wrap gap-3'>
                      <div class='d-flex w-100'>
                        <span id='decQuantity' class='fa-solid fa-minus user-select-none cursor-pointer d-flex flex-center p-0 color-bg-fifth rounded-start border border-1 border-dark-subtle fs-5'></span>
                        <input id='quantityInput' value='0' type="number" name="number" min="0" class='p-2 border border-1 border-dark-subtle border-start-0 border-end-0 fs-4'>
                        <span id='incQuantity' class='fa-solid fa-plus user-select-none cursor-pointer d-flex flex-center p-0 color-bg-fifth rounded-end border border-1 border-dark-subtle fs-5'></span>
                      </div>
                      <button disabled type="button" class="swal2-confirm myBtn d-block w-100" aria-label="加入購物車">加入購物車</button>
                    </div>
                  </div>
                </div>
              `,
              showCloseButton: true,
              showConfirmButton: false,
              showCancelButton: false,
              //didOpen(modalElement){}當sweet aleart 彈出時執行的函式 參數是該視窗的DOM
              didOpen(modalElement) {
                //取消close(x)按鈕的焦點
                modalElement.querySelector('.swal2-close').blur();

                //input type=number 禁用 e + - . 字元輸入
                quantityInput.addEventListener('keydown', e => {
                  if (['e', '+', '-', '.'].includes(e.key)) e.preventDefault();
                });
                //去除開頭0、調整購物車按鈕狀態
                quantityInput.addEventListener('input', e => {
                  e.target.value = e.target.value == 0 ? 0 : e.target.value.replace(/^0+/, '');
                  confirm.disabled = e.target.value == 0;
                })

                // 處理自定義input type=number 的加減btn
                const [decbtn, incbtn] = [modalElement.querySelector('#decQuantity'), modalElement.querySelector('#incQuantity')];
                function changeQuantity(e) {
                  switch (this.id) {
                    case 'decQuantity':
                      quantityInput.value == 0 ? 0 : quantityInput.value--;
                      break;
                    case 'incQuantity':
                      quantityInput.value++;
                      break;
                  }
                  //創建了一個新的 input 事件，手動觸發quantityInpu 的 input 事件
                  const event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                  });
                  quantityInput.dispatchEvent(event);

                }
                decbtn.addEventListener('click', changeQuantity);
                incbtn.addEventListener('click', changeQuantity);
                //加入購物車按鈕
                const confirm = modalElement.querySelector('.swal2-confirm');
                confirm.addEventListener('click', () => {
                  Swal.clickConfirm();
                });
              },

              preConfirm: () => {
                return {
                  'orderQuantity': document.getElementById("quantityInput").value,
                  'product': info
                };
              }
            });
            if (formValues) {
              addProductToCart(formValues);
              //Swal.fire(JSON.stringify(formValues));
            }
          })()
        }
      })
    });
  }
  function pageChange(index) {
    updateProductList(pages[index]);
  }
  function generatePagnation(category) {
    pages = [];
    let index = 0;
    if (category === '全部') {
      const categories = Object.keys(bakeryData);
      categories.forEach(category => {
        bakeryData[category].forEach(product => {
          product.category = category;
          if (pages[index] === undefined) {
            pages[index] = [product];
          }
          else {
            if (pages[index].length < show) {
              pages[index].push(product);
            }
            else {
              pages.push([product]);
              index++;
            }
          }
        });
      });
    }
    else {
      bakeryData[category].forEach(product => {
        if (pages[index] === undefined) {
          pages[index] = [product];
        }
        else {
          if (pages[index].length < show) {
            pages[index].push(product);
          }
          else {
            pages.push([product]);
            index++;
          }
        }
      });
    }
    pagination.setPages(pages.length, 1);
    pagination.onchange = pageChange;
  }

  function categoryClick(e) {
    if (e.target.nodeName === "LABEL") {
      generatePagnation(e.target.textContent);
      updateProductList(pages[0]);
      breadcrumb.innerHTML = e.target.textContent !== '全部' ? `<li class="breadcrumb-item user-select-none"><button type='button' onclick="choose()" class='btn border-0 p-0 d-block text-info'">全部</button></li><li class="breadcrumb-item active user-select-none" aria-current="page">${e.target.textContent}</li>` : '<li class="breadcrumb-item active user-select-none" aria-current="page">全部</li>';
    }
  }

  function choose() {
    breadcrumb.innerHTML = '<li class="breadcrumb-item active user-select-none" aria-current="page">全部</li>';
    category.innerHTML = generateCategoryTemplate();
    generatePagnation('全部');
    updateProductList(pages[0]);
    pagination.classList.remove('d-none');
    category.querySelector('li label input').checked = true;
  }

  async function fetchData() {
    try {
      // const breadURL='/bakery/fakedata/bread.json'//上線版
      const breadURL='fakedata/bread.json'//Live Server版
      const response = await fetch(breadURL);
      bakeryData = await response.json();
      choose();
      category.addEventListener('click', categoryClick);
    } catch (err) {
      console.log(err);
    }
  }
  fetchData();
}
//news page
const news = document.querySelector('.newsPage');
let showData = [];
if (news) {  
  function updateNewsList() {
    newsList.innerHTML = showData.map((data, index) =>
    `
    <li class="p-3 d-flex align-items-center gap-2 animate__animated animate__flipInX animate__delay-${index}s animate__fast">
    <h2 class="flex-shrink-0 m-0 px-3 py-2 fs-5 rounded-pill color-bg-main pill-bg text-light">${data.title}</h2>
    <a href="#" class="link-dark"><h3 class="m-0 fs-5">${data.content}</h3></a>          
    </li>
    `
    ).join("");
  }

  const newsList = news.querySelector('.newsList');
  // const url = '/bakery/fakedata/news.json';//上線版
  const url = 'fakedata/news.json';//Live Server版
  
  fetch(url)
    .then(res => res.json())
    .then(newsData => {
      //過濾出要顯示的部分
      showData = newsData.filter(data => data.show);
      updateNewsList();
    })
    .catch(err => {
      console.log(err);
    });
}
//wow.js 動畫效果

//home page
const homePage = document.querySelector('.homePage');

if (homePage) {
  //productCarousel Start
  // const url='/bakery/fakedata/bread.json';//上線版
  const BreadURL='fakedata/bread.json';//Live Server版
  fetch(BreadURL)
    .then(res => res.json())
    .then(productData => {
      const productCarousel=document.querySelector('#productCarousel');
      const [indicators,inner]=[
        productCarousel.children[0],
        productCarousel.children[1]
      ];
      const categories = Object.keys(productData);      
      indicators.innerHTML=categories.map((c,index)=>
      index==0?`<button type="button" data-bs-target="#productCarousel" data-bs-slide-to="${index}"
      class="active" aria-current="true" aria-label="Slide ${index+1}"></button>`
              :`<button type="button" data-bs-target="#productCarousel" data-bs-slide-to="${index}"
              aria-label="Slide ${index+1}"></button>`
      ).join('');
      inner.innerHTML=categories.map((c,index)=>
        index==0?`<div class="carousel-item active" data-name='${c}'>
                    <a href='./product.html'>
                      <img src="https://fakeimg.pl/600x600/282828/EAE0D0" class="d-block w-100" alt="...">
                    </a>
                  </div>`
                :`<div class="carousel-item" data-name='${c}'>
                    <a href='./product.html'>
                      <img src="https://fakeimg.pl/600x600/282828/EAE0D0" class="d-block w-100" alt="...">
                    </a>
                  </div>`
      ).join('');

    })
    .then(err => console.log(err));
  //productCarousel End
  
  //newsSlider Start
  const newsSlider = document.querySelector('#newsSlider');
  let newsSlideupAnimate, newsSliderItems;
  newsSlider.addEventListener("animationend", (e) => {
    setTimeout(function () {
      newsSlideupAnimate.play();
    }, 3000);
    [...newsSliderItems].forEach((item, index, arr) => {
      item.style.order =
        item.style.order == 0 ? arr.length - 1 : parseInt(item.style.order) - 1;
    });
  });
  newsSlider.addEventListener('mouseover', e => {
    newsSlideupAnimate.pause();
  });
  newsSlider.addEventListener('mouseout', e => {
    newsSlideupAnimate.play();
  });
  
  // const newsURL='/bakery/fakedata/news.json';//上線版
  const newsURL='fakedata/news.json';//Live Sever版
  fetch(newsURL)
    .then(res => res.json())
    .then(newsData => {
      const template = newsData.filter(data => data.show).map(news => `
                                                                  <li class='slider__items'><h2 class='user-select-none pEvent-none'>${news.title}</h2><h3 class='fs-4 user-select-none pEvent-none'>${news.content}</h3></li>
                                                                `
      ).join("");
      newsSlider.innerHTML = template;
      newsSliderItems = newsSlider.children;
      [...newsSliderItems].forEach((item, index) => {
        item.style.order = index;
      });
      newsSlider.classList.add('slideup');
      newsSlideupAnimate = newsSlider.getAnimations()[0];
    })
    .catch(err => console.log(err));
  //newsSlider End
  
  //分店資訊 Start
  let branchesData = [];
  const branchesList = document.querySelector('#branchesList');
  console.log('branchesList='+branchesList);
  if(branchesList){
    const branchInfo = document.querySelector('#branchInfo');
    function createBranchInfoTemplate(value) {
      return `<h2>${branchesData[value].name}</h2>
            <ul class="list-style-position-inside list-style-type-disc">
            <li class="mb-2"><h3>地址：${branchesData[value].address}</h3></li>
            <li class="mb-2"><h3>電話：<a href="tel:+${branchesData[value].phone.replace(/\D/g, '')}">${branchesData[value].phone}</a></h3></li>
            <li class="mb-2"><h3>營業時間：${branchesData[value].business_hours}</h3></li>
            </ul>`;
    }
    branchesList.querySelector('select').addEventListener('change', e => {
      const target = e.target;
      const value = target.options[target.selectedIndex].value;
      branchInfo.innerHTML = createBranchInfoTemplate(value);
    });
    // const branchesURL='/bakery/fakedata/branches.json';//上線版
    const branchesURL='fakedata/branches.json';//Live Server版
    fetch(branchesURL)
      .then(res => res.json())
      .then(branches => {
        branchesData = branches;
        const template = branches.map((branch, index) => `<option value="${index}">${branch.name}</option>`).join("");
        branchesList.querySelector('select').innerHTML = template;
        branchesList.loadfin();
        branchInfo.innerHTML = createBranchInfoTemplate(0);
      })
      .catch(err => {
        console.log(err);
      });
  }
  //分店資訊 End
  
  //(odometer 計數器效果 & tips 動畫效果 )Start
  const counterWrap = document.querySelector('#counterWrap');
  const counters = counterWrap.querySelectorAll('.odometer');
  const odometers = [...counters].map(item => {
    const odometer = new Odometer({
      el: item,
      value: 0, // 設定初始值
      format: 'd', // 設定格式，'d'表示整數
      duration: 1500
    });
    return odometer;
  });
  // 定義觀察器設定
  const observerConfig = {
    root: null, // 使用預設的根元素，即 viewport
    threshold: [0] // 定義閾值，當目標元素X%可見時觸發回調函數
  };

  // 創建 Intersection Observer 實例
  const intersectionObserver = new IntersectionObserver(function (entries) {
    // entries 是觀察的元素的集合
    entries.forEach(function (entry) {
      // 如果元素進入視口
      if (entry.isIntersecting) {
        switch (entry.target.id) {
          case 'tipsList':
            entry.target.querySelectorAll('div .card').forEach(card => {
              card.classList.remove('invisible');
              card.classList.add('animate__fadeInDown');
            });
            break;
          case 'counterWrap':
            // 設定計數器的最終值
            odometers[0].update(45);
            odometers[1].update(1200);
            odometers[2].update(20);
            break;
        }
      }
      else {
        switch (entry.target.id) {
          case 'tipsList':
            entry.target.querySelectorAll('div .card').forEach(card => {
              card.classList.remove('animate__fadeInDown');
              card.classList.add('invisible');
            });
            break;
          case 'counterWrap':
            //歸零
            odometers.forEach(odometer => odometer.update(0));
            break;
        }
      }
    });
  }, observerConfig);

  // 開始觀察目標元素
  intersectionObserver.observe(document.querySelector('#tipsList'));
  intersectionObserver.observe(counterWrap);
  //(odometer 計數器效果 & tips 動畫效果 )End
}  