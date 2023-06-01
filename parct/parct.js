const carouselWrapper = document.querySelector('.carousel-wrapper');
const carouselSlide = document.querySelector('.carousel-slide');
const blocks = document.querySelectorAll('.block');
const prevArrow = document.querySelector('.prev');
const nextArrow = document.querySelector('.next');
const blockWidth = blocks[0].offsetWidth + parseInt(getComputedStyle(blocks[0]).marginRight) + parseInt(getComputedStyle(blocks[0]).marginLeft);

let currentIndex = 0;
let startX = 0;
let diffX = 0;
let isDragging = false;

function goToIndex(index) {
  currentIndex = index;
  const slidePosition = -currentIndex * blockWidth * 2;
  if (slidePosition <= -(carouselSlide.offsetWidth - carouselWrapper.offsetWidth)) {
    carouselSlide.style.transform = `translateX(${-carouselSlide.offsetWidth + carouselWrapper.offsetWidth}px)`;
  } else if (slidePosition >= 0) {
    carouselSlide.style.transform = 'translateX(0)';
  } else {
    carouselSlide.style.transform = `translateX(${slidePosition}px)`;
  }
}

function goToPrev() {
  if (currentIndex > 0) {
    goToIndex(currentIndex - 1);
  }
}

function goToNext() {
  if (currentIndex < Math.ceil(blocks.length / 2) - 1) {
    goToIndex(currentIndex + 1);
  }
}

prevArrow.addEventListener('click', goToPrev);
nextArrow.addEventListener('click', goToNext);

carouselSlide.addEventListener('mousedown', (event) => {
  isDragging = true;
  startX = event.pageX;
});

carouselSlide.addEventListener('mousemove', (event) => {
  if (isDragging) {
    const currentX = event.pageX;
    diffX = startX - currentX;
    const slidePosition = -currentIndex * blockWidth * 2;
    if (slidePosition - diffX <= -(carouselSlide.offsetWidth - carouselWrapper.offsetWidth)) {
      carouselSlide.style.transform = `translateX(${-carouselSlide.offsetWidth + carouselWrapper.offsetWidth}px)`;
    } else if (slidePosition - diffX >= 0) {
      carouselSlide.style.transform = 'translateX(0)';
    } else {
      carouselSlide.style.transform = `translateX(${slidePosition - diffX}px)`;
    }
  }
});

carouselSlide.addEventListener('mouseup', (event) => {
  isDragging = false;
  const threshold = blockWidth / 2;
  if (diffX > threshold && currentIndex < Math.ceil(blocks.length / 2) - 1) {
    goToNext();
  } else if (diffX < -threshold && currentIndex > 0) {
    goToPrev();
  } else {
    goToIndex(currentIndex);
  }
  diffX = 0;
});

carouselSlide.addEventListener('mouseleave', (event) => {
  isDragging = false;
  goToIndex(currentIndex);
  diffX = 0;
});

window.addEventListener('resize', () => {
  const containerWidth = carouselWrapper.offsetWidth;
  const slideWidth = blockWidth * blocks.length / 2;
  carouselSlide.style.width = `${slideWidth}px`;
  if (slideWidth > containerWidth) {
    nextArrow.style.display = 'block';
    prevArrow.style.display = 'block';
  } else {
    nextArrow.style.display = 'none';
    prevArrow.style.display = 'none';
  }
  goToIndex(currentIndex);
});

window.dispatchEvent(new Event('resize'));


const today = new Date();
const day = today.getDay();
const daylist = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
console.log("Today is:" + daylist[day] + ".");
const hour = today.getHours();
const minute = today.getMinutes();
const second = today.getSeconds();
const prepand = (hour >= 12) ? hour - 12: hour;
if(hour === 0 && prepand === 'PM'){
  if(minute === 0 && second === 0){
    hour = 12; 
    prepand = 'Noon';
  }
  else{
    hour = 12;
    prepand = 'PM';
  }
}
if(hour === 0 && prepand ==='AM'){
  if(minute === 0 && second === 0){
    hour = 12;
    prepand = 'AM';
  }
}
console.log("Current Time: " + hour  + ":" + minute + ":" + second);

// Get elements
const cartIcon = document.querySelector('.cart-icon');
const cartCount = document.querySelector('.cart-count');
const cartWindow = document.querySelector('.cart-window');
const cartItems = document.querySelector('.cart-items');
const totalAmount = document.querySelector('.total-amount');

// Cart data
let cart = [];

// Load cart data from local storage
if (localStorage.getItem('cart')) {
  cart = JSON.parse(localStorage.getItem('cart'));
  updateCartCount();
  renderCartItems();
}

// Update cart count
function updateCartCount() {
  let count = 0;
  cart.forEach(item => {
    count += item.quantity;
  });
  cartCount.textContent = count;
}

// Render cart items
function renderCartItems() {
  cartItems.innerHTML = '';
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    const image = document.createElement('img');
    image.src = item.image;
    cartItem.appendChild(image);

    const info = document.createElement('div');
    info.classList.add('cart-item-info');
    cartItem.appendChild(info);

    const title = document.createElement('div');
    title.classList.add('cart-item-title');
    title.textContent = item.title;
    info.appendChild(title);

    const price = document.createElement('div');
    price.classList.add('cart-item-price');
    price.textContent = `$${item.price.toFixed(2)}`;
    info.appendChild(price);

    const quantity = document.createElement('div');
    quantity.classList.add('cart-item-quantity');
    info.appendChild(quantity);

    const decreaseButton = document.createElement('button');
    decreaseButton.textContent = '-';
    decreaseButton.addEventListener('click', () => {
      if (item.quantity > 1) {
        item.quantity--;
        renderCartItems();
        saveCart();
      }
    });
    quantity.appendChild(decreaseButton);

    const quantityLabel = document.createElement('span');
    quantityLabel.textContent = item.quantity;
    quantity.appendChild(quantityLabel);

    const increaseButton = document.createElement('button');
    increaseButton.textContent = '+';
    increaseButton.addEventListener('click', () => {
      item.quantity++;
      renderCartItems();
      saveCart();
    });
    quantity.appendChild(increaseButton);

    cartItems.appendChild(cartItem);
  });
  updateCartTotal();
}

// Update cart total
function updateCartTotal() {
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
  });
  totalAmount.textContent = `$${total.toFixed(2)}`;
}

// Add item to cart
function addItemToCart(item) {
  const existingItem = cart.find(cartItem => cartItem.id === item.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    item.quantity = 1;
    cart.push(item);
  }
  updateCartCount();
  saveCart();
}

// Remove item from cart
function removeItemFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  updateCartCount();
  renderCartItems();
  saveCart();
}

// Save cart to local storage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Show/hide cart window
cartIcon.addEventListener('click', () => {
  cartWindow.classList.toggle('visible');
});

// Initialize
updateCartCount();

// Export functions
export { addItemToCart, removeItemFromCart };