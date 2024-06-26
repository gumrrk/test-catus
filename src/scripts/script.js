const products = [
  {
    id: 1,
    img: "/src/assets/products/product-1.svg",
    imgflipped: "/src/assets/products/product-1-flipped.svg",
    name: "Cadeira Vermelha Conforto",
    totalPrice: 750,
    price: 299.99,
    discount: 20,
    installments: 6,
    interest: 1.5,
  },
  {
    id: 2,
    img: "/src/assets/products/product-2.svg",
    imgflipped: "/src/assets/products/product-2-flipped.svg",
    name: "Relógio de Parede Decorativo",
    totalPrice: 420,
    price: 199.99,
    discount: 10,
    installments: 3,
    interest: 0,
  },
  {
    id: 3,
    img: "/src/assets/products/product-3.svg",
    imgflipped: "/src/assets/products/product-3-flipped.svg",
    name: "Escova Rústica de Madeira",
    totalPrice: 320,
    price: 149.99,
    installments: 4,
    interest: 0,
  },
  {
    id: 4,
    img: "/src/assets/products/product-4.svg",
    imgflipped: "/src/assets/products/product-4-flipped.svg",
    name: "Cadeira Conforto Ergonômica",
    totalPrice: 850,
    price: 399.99,
    discount: 15,
    installments: 8,
    interest: 1.2,
  },
];

let cartItems = [];

function calculateInstallments(price, installments, interest = 0) {
  const valueWithInterest = price * (1 + interest / 100);
  const installmentValue = valueWithInterest / installments;
  return installmentValue.toFixed(2);
}

function createProductElement(product) {
  const li = document.createElement("li");
  const discountHTML = product.discount
    ? `<div class="discount-badge"><p class="discont-value">${product.discount}%</p>Off</div>`
    : "";
  const installmentsHTML = `<p><b>${
    product.installments
  }x</b> de <b>R$ ${calculateInstallments(
    product.price,
    product.installments,
    product.interest
  )}</b> ${product.interest ? "com juros" : "sem juros"}</p>`;

  li.innerHTML = `
    <div class="product-li">
      <div class="box_product">
        <img class="image_product" src="${product.img}" data-flipped-src="${
    product.imgflipped
  }" alt="${product.name}")">
        ${discountHTML}
      </div>
      <div class="product-details">
        <h3>${product.name}</h3>
        <div class="product-value">
          <span><s>de R$ ${product.totalPrice.toFixed(2)}</s></span>
          <h2>R$ ${product.price.toFixed(2)}</h2>
          ${installmentsHTML}
        </div>
      </div>
      <button class="add-to-cart-button" data-id="${
        product.id
      }">Adicionar ao Carrinho</button>
    </div>
  `;

  return li;
}

function renderProductList() {
  const productList = document.getElementById("list_products");
  productList.innerHTML = "";
  products.forEach((product) => {
    const li = createProductElement(product);
    productList.appendChild(li);
  });

  const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart);
  });
}

function filterProducts(searchText) {
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );
  renderFilteredProductList(filteredProducts);
}

function renderFilteredProductList(filteredProducts) {
  const productList = document.getElementById("list_products");
  productList.innerHTML = "";
  filteredProducts.forEach((product) => {
    const li = createProductElement(product);
    productList.appendChild(li);
  });

  const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProductList();
  loadCartFromLocalStorage();
  updateCartCounter();

  const productItems = document.querySelectorAll(
    ".product-li .box_product img"
  );

  productItems.forEach((item) => {
    const originalSrc = item.src;
    const flippedSrc = item.getAttribute("data-flipped-src");

    item.addEventListener("mouseenter", () => {
      item.style.transition = "opacity 0.3s ease-in-out";
      item.style.opacity = "0.3";
      setTimeout(() => {
        item.src = flippedSrc;
        item.style.opacity = "1";
      }, 300);
    });

    item.addEventListener("mouseleave", () => {
      item.style.transition = "opacity 0.3s ease-in-out";
      item.style.opacity = "0.3";
      setTimeout(() => {
        item.src = originalSrc;
        item.style.opacity = "1";
      }, 300);
    });
  });

  const inputSearch = document.querySelector(".input_search");
  const searchButton = document.querySelector(".search_button");
  const productList = document.getElementById("list_products");
  const items = productList.querySelectorAll("li");

  if (items.length > 4) {
    productList.classList.add("flex-start");
  }

  inputSearch.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      filterProducts(inputSearch.value);
    }
  });

  searchButton.addEventListener("click", () => {
    filterProducts(inputSearch.value);
  });

  function updatePlaceholder() {
    if (window.innerWidth <= 768) {
      inputSearch.placeholder = "Pesquisar";
    } else {
      inputSearch.placeholder = "Digite aqui sua busca";
    }
  }

  updatePlaceholder();

  window.addEventListener("resize", updatePlaceholder);
});

function renderCartItems() {
  const cartItemsList = document.getElementById("cartItems");
  const checkoutButton = document.getElementById("checkoutButton");
  if (cartItems.length === 0) {
    cartItemsList.innerHTML =
      "<p class=empty-cart-message>O seu carrinho está vazio :/</p>";
    checkoutButton.disabled = true;
    const totalValueDisplay = document.getElementById("cartTotalValue");
    totalValueDisplay.textContent = "Total: R$ 0.00";
    return;
  }
  cartItemsList.innerHTML = "";
  cartItems.forEach((item) => {
    const li = document.createElement("li");
    const totalPrice = (item.price * item.quantity).toFixed(2);
    li.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="cart-item-img">
      <h2>${item.name}</h2>
      <div class="price-quantity-div">
        <p>R$ ${totalPrice}</p>
        <div class="quantity-remove-div">
          <select class="quantity-select" data-id="${item.id}">
            ${Array.from(
              { length: Math.max(item.quantity + 1, 10) },
              (_, i) =>
                `<option value="${i}" ${
                  i === item.quantity ? "selected" : ""
                }>${i}</option>`
            ).join("")}
          </select>
          <button class="remove-from-cart-button" data-id="${
            item.id
          }">Remover</button>
        </div>
      </div>`;
    cartItemsList.appendChild(li);
  });

  const quantitySelects = document.querySelectorAll(".quantity-select");
  quantitySelects.forEach((select) => {
    select.addEventListener("change", updateCartQuantity);
  });

  const removeFromCartButtons = document.querySelectorAll(
    ".remove-from-cart-button"
  );
  removeFromCartButtons.forEach((button) => {
    button.addEventListener("click", removeFromCart);
  });

  updateCartTotalValue();
  checkoutButton.disabled = false;
}

function saveCartToLocalStorage() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function loadCartFromLocalStorage() {
  const storedCartItems = localStorage.getItem("cartItems");
  if (storedCartItems) {
    cartItems = JSON.parse(storedCartItems);
  }
}

function updateCartQuantity() {
  const productId = parseInt(this.getAttribute("data-id"));
  const newQuantity = parseInt(this.value);
  const cartItemIndex = cartItems.findIndex((item) => item.id === productId);

  if (cartItemIndex !== -1) {
    if (newQuantity === 0) {
      cartItems.splice(cartItemIndex, 1);
    } else {
      cartItems[cartItemIndex].quantity = newQuantity;
    }
  }

  updateCartCounter();
  updateCartTotal();
  saveCartToLocalStorage();
  renderCartItems();
}

function updateCartCounter() {
  const cartCounter = document.querySelector(".cart-counter");
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  if (totalItems > 0) {
    cartCounter.textContent = totalItems;
    cartCounter.style.display = "flex";
  } else {
    cartCounter.style.display = "none";
  }
}

function updateCartTotal() {
  const totalValue = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalDisplay = document.getElementById("cartTotal");
  if (totalDisplay) {
    totalDisplay.textContent = `Total: R$ ${totalValue.toFixed(2)}`;
  }
}

function showCartModal() {
  const modal = document.getElementById("cartModal");
  renderCartItems();
  modal.style.display = "block";
  document.body.classList.add("modal-open");
}

function updateCartTotalValue() {
  const totalValue = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalValueDisplay = document.getElementById("cartTotalValue");
  if (totalValueDisplay) {
    totalValueDisplay.textContent = `Total: R$ ${totalValue.toFixed(2)}`;
  }
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
    console.log("mostrou");
  }, 100);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(notification);
      console.log("sumiu");
    }, 500);
  }, 3000);
}

function addToCart() {
  const productId = this.getAttribute("data-id");
  const product = products.find((item) => item.id === parseInt(productId));
  const cartItem = cartItems.find((item) => item.id === product.id);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }

  updateCartCounter();
  updateCartTotal();
  saveCartToLocalStorage();
  showNotification("Item adicionado ao carrinho!");
}
function closeCartModal() {
  const modal = document.getElementById("cartModal");
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
}

function removeFromCart() {
  const productId = this.getAttribute("data-id");
  const cartItemIndex = cartItems.findIndex(
    (item) => item.id === parseInt(productId)
  );

  if (cartItemIndex !== -1) {
    cartItems.splice(cartItemIndex, 1);
  }

  updateCartCounter();
  updateCartTotal();
  saveCartToLocalStorage();
  renderCartItems();
}

function moveLeft() {
  const productList = document.getElementById("list_products");
  const firstElement = productList.firstElementChild;
  productList.removeChild(firstElement);
  productList.appendChild(firstElement);
}

function moveRight() {
  const productList = document.getElementById("list_products");
  const lastElement = productList.lastElementChild;
  productList.removeChild(lastElement);
  productList.insertBefore(lastElement, productList.firstChild);
}

function toggleMenu() {
  const menuContainer = document.querySelector(".menu_container");
  menuContainer.classList.toggle("active");
}

function toggleContentMobile(contentId) {
  var content = document.getElementById(contentId);
  var allContent = document.querySelectorAll(".content");
  for (var i = 0; i < allContent.length; i++) {
    if (allContent[i] !== content) {
      allContent[i].style.display = "none";
    }
  }
  content.style.display = content.style.display === "none" ? "block" : "none";
}

document.getElementById("checkoutButton").addEventListener("click", function() {
  cartItems = [];
  saveCartToLocalStorage();
  location.reload();
});


window.onload = function () {
  if (window.innerWidth <= 768) {
    var titles = document.querySelectorAll(".h2-div_footer");
    for (var i = 0; i < titles.length; i++) {
      titles[i].addEventListener("click", function () {
        var contentId = this.nextElementSibling.id;
        toggleContentMobile(contentId);
      });
    }
  }
};
