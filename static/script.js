/* script.js - AURELIA Luxury Fashion Redesign */

// --- Header Scroll Effect ---
const header = document.getElementById('main-header');
if (header && !header.classList.contains('scrolled')) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// --- Global Cart Logic ---
let cart = JSON.parse(localStorage.getItem('aurelia_cart')) || [];

function saveCart() {
    localStorage.setItem('aurelia_cart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    
    // Auto open drawer on add
    const drawer = document.getElementById('cart-drawer');
    if(drawer) drawer.classList.add('open');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    // Update checkout page if we are on it
    if(document.getElementById('checkout-items')) {
        renderCheckout();
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartUI() {
    // Update count bubble
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countEl.textContent = `(${totalItems})`;
    }

    // Update Drawer items
    const drawerItemsEl = document.getElementById('drawer-items');
    if (drawerItemsEl) {
        drawerItemsEl.innerHTML = '';
        if (cart.length === 0) {
            drawerItemsEl.innerHTML = '<p style="color:#ccc; font-style:italic;">Your selection is currently empty.</p>';
        } else {
            cart.forEach(item => {
                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} &nbsp;&times;&nbsp; ${item.quantity}</p>
                    </div>
                    <div>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                `;
                drawerItemsEl.appendChild(div);
            });
        }
    }

    // Update Drawer Total
    const drawerTotalEl = document.getElementById('drawer-total');
    if (drawerTotalEl) {
        drawerTotalEl.textContent = `$${getCartTotal().toFixed(2)}`;
    }
}

// --- UI Interactions ---

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Cart UI
    updateCartUI();

    // Cart Drawer Toggle
    const cartIcon = document.getElementById('cart-icon');
    const closeCart = document.getElementById('close-cart');
    const cartDrawer = document.getElementById('cart-drawer');

    if (cartIcon && cartDrawer) {
        cartIcon.addEventListener('click', () => {
            cartDrawer.classList.add('open');
        });
    }

    if (closeCart && cartDrawer) {
        closeCart.addEventListener('click', () => {
            cartDrawer.classList.remove('open');
        });
    }

    // Chat Widget Toggle
    const chatBtn = document.getElementById('chat-btn');
    const chatPopup = document.getElementById('chat-popup');
    const closeChat = document.getElementById('close-chat');

    if (chatBtn && chatPopup) {
        chatBtn.addEventListener('click', () => {
            chatPopup.classList.toggle('open');
        });
    }

    if (closeChat && chatPopup) {
        closeChat.addEventListener('click', () => {
            chatPopup.classList.remove('open');
        });
    }

    // Chat Functionality
    const chatSend = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (chatSend && chatInput) {
        chatSend.addEventListener('click', async () => {
            const msg = chatInput.value.trim();
            if (!msg) return;

            // Add user message
            addChatMessage(msg, 'user');
            chatInput.value = '';

            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: msg })
                });
                const data = await response.json();
                addChatMessage(data.reply, 'bot');
            } catch (error) {
                addChatMessage("Connection error. Please try again.", 'bot');
            }
        });
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                chatSend.click();
            }
        });
    }

    function addChatMessage(text, sender) {
        if (!chatMessages) return;
        const div = document.createElement('div');
        div.className = `msg msg-${sender}`;
        div.textContent = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in, .product-card').forEach(el => {
        observer.observe(el);
    });

    // Page Specific Initializations
    if (document.getElementById('products-container')) {
        loadProducts();
    }

    if (document.getElementById('checkout-items')) {
        renderCheckout();
        setupCheckoutForm();
    }

    if (document.getElementById('contact-form')) {
        setupContactForm();
    }
});

// --- Page Specific Logic ---

async function loadProducts() {
    try {
        const response = await fetch('/products');
        const products = await response.json();
        const container = document.getElementById('products-container');
        
        products.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card fade-in'; 
            // Stagger animation delay slightly for grid items
            card.style.transitionDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                </div>
                <div class="product-info" style="width: 100%;">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <button class="btn btn-outline" style="width: 100%; padding: 0.8rem; margin-top: 0.5rem;" onclick='addToCart(${JSON.stringify(product)})'>Add to Selection</button>
                </div>
            `;
            container.appendChild(card);
            
            // Re-observe the dynamically added element for fade-in
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(card);
        });
    } catch (error) {
        console.error("Failed to load products", error);
    }
}

function renderCheckout() {
    const container = document.getElementById('checkout-items');
    const totalEl = document.getElementById('checkout-total');
    const btn = document.getElementById('checkout-btn');
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="color:#ccc; margin-bottom:1rem;">Your selection is empty.</p><a href="/" class="btn-text" style="color:var(--champagne-gold);">Return to Collection</a>';
        if(btn) btn.disabled = true;
    } else {
        container.innerHTML = '';
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'checkout-summary-item';
            div.innerHTML = `
                <span style="font-family:var(--font-sans); text-transform:uppercase; font-size:0.85rem; letter-spacing:0.05em;">${item.name} &times; ${item.quantity}</span>
                <span style="font-family:var(--font-sans); color:#ccc;">$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            container.appendChild(div);
        });
        if(btn) btn.disabled = false;
    }
    totalEl.textContent = `$${getCartTotal().toFixed(2)}`;
}

function setupCheckoutForm() {
    const btn = document.getElementById('checkout-btn');
    if (!btn) return;
    
    btn.addEventListener('click', async () => {
        // Basic validation check
        const form = document.getElementById('payment-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        btn.textContent = 'Authorizing...';
        btn.disabled = true;
        
        try {
            const response = await fetch('/process-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    total: getCartTotal()
                })
            });
            const data = await response.json();
            
            if (data.status === 'success') {
                alert('Authorization Successful. Your luxury selection is being prepared.');
                cart = [];
                saveCart();
                window.location.href = '/';
            }
        } catch (error) {
            alert('Authorization failed. Please try again or contact our concierge.');
            btn.textContent = 'Authorize Payment';
            btn.disabled = false;
        }
    });
}

function setupContactForm() {
    const form = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status');

    if(!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch('/contact-submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            
            statusMsg.textContent = data.message;
            statusMsg.style.color = 'var(--champagne-gold)';
            form.reset();
        } catch (error) {
            statusMsg.textContent = "Error submitting request. Please try again.";
            statusMsg.style.color = "red";
        }
    });
}
