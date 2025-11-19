const products = [
    { id: 1, name: 'Coca-Cola Original', price: 2.99, image: '🥤', emoji: '🥤' },
    { id: 2, name: 'Diet Coke', price: 2.99, image: '🥤', emoji: '🥤' },
    { id: 3, name: 'Sprite', price: 2.49, image: '🧃', emoji: '🧃' },
    { id: 4, name: 'Fanta', price: 2.49, image: '🍊', emoji: '🍊' },
    { id: 5, name: 'Thums Up', price: 2.79, image: '🥤', emoji: '🥤' },
    { id: 6, name: 'Limca', price: 2.49, image: '🍋', emoji: '🍋' }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let isLoginMode = true;

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
    }, 2500);

    renderProducts();
    updateCartCount();
    setupEventListeners();
    setupScrollAnimations();
    setupNavbarScroll();
});

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.style.animationDelay = `${index * 0.1}s`;

        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        `;

        productsGrid.appendChild(productCard);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Added!';
    btn.classList.add('added');

    setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('added');
    }, 1500);
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p>Your cart is empty</p>
            </div>
        `;
        document.getElementById('cartTotal').textContent = '0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.emoji}</div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = total.toFixed(2);
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            renderCart();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function openCart() {
    renderCart();
    document.getElementById('cartModal').classList.add('active');
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
}

function openCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    closeCart();

    const checkoutItems = document.getElementById('checkoutItems');
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('checkoutTotal').textContent = total.toFixed(2);

    document.getElementById('checkoutModal').classList.add('active');
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
}

function proceedCheckout() {
    alert('Order placed successfully! Thank you for your purchase.');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    closeCheckout();
}

function openLogin() {
    document.getElementById('loginModal').classList.add('active');
}

function closeLogin() {
    document.getElementById('loginModal').classList.remove('active');
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const authTitle = document.getElementById('authTitle');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const authSwitchText = document.getElementById('authSwitchText');
    const usernameGroup = document.getElementById('usernameGroup');

    if (isLoginMode) {
        authTitle.textContent = 'Login';
        authSubmitBtn.textContent = 'Login';
        authSwitchText.innerHTML = 'Don\'t have an account? <span id="authSwitchLink">Register</span>';
        usernameGroup.style.display = 'none';
    } else {
        authTitle.textContent = 'Register';
        authSubmitBtn.textContent = 'Register';
        authSwitchText.innerHTML = 'Already have an account? <span id="authSwitchLink">Login</span>';
        usernameGroup.style.display = 'block';
    }

    document.getElementById('authSwitchLink').addEventListener('click', toggleAuthMode);
}

function handleAuth(e) {
    e.preventDefault();

    const email = document.getElementById('authEmail').value;
    const username = document.getElementById('authUsername').value;
    const password = document.getElementById('authPassword').value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    if (!isLoginMode && username.trim() === '') {
        alert('Please enter a username');
        return;
    }

    const message = isLoginMode ? 'Login successful!' : 'Registration successful!';

    const modalBody = document.querySelector('#loginModal .modal-body');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    modalBody.insertBefore(successDiv, modalBody.firstChild);

    setTimeout(() => {
        successDiv.remove();
        closeLogin();
        document.getElementById('authForm').reset();
    }, 2000);
}

function handleContact(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name.trim() && email.trim() && message.trim()) {
        alert(`Thank you for your message, ${name}! We'll get back to you soon.`);
        document.getElementById('contactForm').reset();
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

function setupEventListeners() {
    document.getElementById('cartBtn').addEventListener('click', openCart);
    document.getElementById('closeCart').addEventListener('click', closeCart);
    document.getElementById('closeCartBtn').addEventListener('click', closeCart);
    document.getElementById('checkoutBtn').addEventListener('click', openCheckout);

    document.getElementById('closeCheckout').addEventListener('click', closeCheckout);
    document.getElementById('cancelCheckout').addEventListener('click', closeCheckout);
    document.getElementById('proceedCheckout').addEventListener('click', proceedCheckout);

    document.getElementById('loginBtn').addEventListener('click', openLogin);
    document.getElementById('closeLogin').addEventListener('click', closeLogin);
    document.getElementById('authSwitchLink').addEventListener('click', toggleAuthMode);

    document.getElementById('authForm').addEventListener('submit', handleAuth);
    document.getElementById('contactForm').addEventListener('submit', handleContact);

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    document.querySelector('.logo').addEventListener('click', () => {
        scrollToSection('home');
    });
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });

    document.querySelector('.about-image') && observer.observe(document.querySelector('.about-image'));
    document.querySelector('.about-text') && observer.observe(document.querySelector('.about-text'));
    document.querySelector('.contact-form') && observer.observe(document.querySelector('.contact-form'));
}

function setupNavbarScroll() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

window.scrollToSection = scrollToSection;
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
