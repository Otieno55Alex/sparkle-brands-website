// ===========================
// MOBILE MENU TOGGLE
// ===========================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ===========================
// FAQ ACCORDION
// ===========================

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        
        // Close all other items
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
            }
        });
        
        // Toggle current item
        faqItem.classList.toggle('active');
    });
});

// ===========================
// CONTACT FORM
// ===========================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: contactForm.querySelector('input[type="text"]').value,
            email: contactForm.querySelector('input[type="email"]').value,
            projectTitle: contactForm.querySelector('input[type="text"]:nth-of-type(2)').value,
            message: contactForm.querySelector('textarea').value
        };
        
        // Here you would typically send this data to a server
        console.log('Form submitted:', formData);
        
        // Show success message
        const button = contactForm.querySelector('button');
        const originalText = button.textContent;
        button.textContent = '✓ Message Sent!';
        button.style.background = '#d4af37';
        
        // Reset form
        contactForm.reset();
        
        // Restore button after 3 seconds
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 3000);
    });
}

// ===========================
// SHOP & CART
// ===========================

const shopProducts = [
    {
        id: 'shirt',
        name: 'Branded T-Shirt',
        price: 24.99,
        image: 'assets/images/portfolio1.jpg',
        description: 'Premium custom shirt printing to showcase your brand in every event.'
    },
    {
        id: 'mug',
        name: 'Branded Mug',
        price: 14.99,
        image: 'assets/images/portfolio2.jpg',
        description: 'Personalized mug printing ideal for gifts, campaigns, and retail.'
    },
    {
        id: 'cap',
        name: 'Branded Cap',
        price: 19.99,
        image: 'assets/images/portfolio3.jpg',
        description: 'Quality cap printing with your logo for brand visibility on the go.'
    },
    {
        id: 'umbrella',
        name: 'Branded Umbrella',
        price: 29.99,
        image: 'assets/images/portfolio6.jpg',
        description: 'Durable umbrella branding that works for events, gifts, and promotions.'
    },
    {
        id: 'custom',
        name: 'Custom Branding Order',
        price: null,
        image: 'assets/images/portfolio4.jpg',
        description: 'Talk directly with our designers for a tailored branding order and premium packaging solutions.',
        contact: {
            whatsapp: 'https://wa.me/1234567890?text=Hello%20Sparkle%20Brands%20Solutions%2C%20I%20need%20a%20custom%20branding%20order',
            email: 'mailto:info@sparklebrands.com?subject=Custom%20Branding%20Order'
        }
    }
];

const shopGrid = document.querySelector('.shop-grid');
const cartOverlay = document.getElementById('cartOverlay');
const cartPanel = document.getElementById('cartPanel');
const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const cartTotalEl = document.querySelector('.cart-total');
const cartEmpty = document.querySelector('.cart-empty');
const clearCartButton = document.getElementById('clearCartButton');
const checkoutToggle = document.getElementById('checkoutToggle');
const checkoutFormWrapper = document.getElementById('checkoutFormWrapper');
const orderConfirmation = document.getElementById('orderConfirmation');
const checkoutForm = document.getElementById('checkoutForm');

let cart = JSON.parse(localStorage.getItem('cart') || '{}');

const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const getCartItems = () => {
    return Object.keys(cart).map((productId) => {
        const product = shopProducts.find((item) => item.id === productId);
        return {
            ...product,
            quantity: cart[productId]
        };
    });
};

const calculateTotal = () => {
    return getCartItems().reduce((total, item) => total + item.price * item.quantity, 0);
};

const renderCart = () => {
    const items = getCartItems();
    cartItemsContainer.innerHTML = '';
    cartCount.textContent = items.reduce((sum, item) => sum + item.quantity, 0);
    cartTotalEl.textContent = calculateTotal().toFixed(2);

    if (items.length === 0) {
        cartEmpty.classList.remove('hidden');
        clearCartButton.disabled = true;
        checkoutFormWrapper.classList.add('hidden');
        orderConfirmation.classList.add('hidden');
        return;
    }

    cartEmpty.classList.add('hidden');
    clearCartButton.disabled = false;

    items.forEach((item) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image" style="background-image: url('${item.image}');"></div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div class="cart-item-qty">
                    <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartItemsContainer.querySelectorAll('.quantity-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.id;
            const delta = button.dataset.action === 'increase' ? 1 : -1;
            updateQuantity(productId, delta);
        });
    });

    cartItemsContainer.querySelectorAll('.cart-item-remove').forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.id;
            removeFromCart(productId);
        });
    });
};

const renderShop = () => {
    if (!shopGrid) {
        return;
    }

    shopGrid.innerHTML = shopProducts.map((product) => {
        const priceLabel = product.price !== null ? `$${product.price.toFixed(2)}` : 'Custom Pricing';
        const actionMarkup = product.contact
            ? `<div class="shop-card-footer contact-action-group">
                    <a href="${product.contact.whatsapp}" target="_blank" class="btn contact-designer-btn">WhatsApp Designer</a>
                    <a href="${product.contact.email}" class="btn contact-email-btn">Email Us</a>
               </div>`
            : `<div class="shop-card-footer">
                    <span class="shop-card-price">${priceLabel}</span>
                    <button class="add-cart-btn" data-product-id="${product.id}">Add to Cart</button>
               </div>`;
        return `
        <div class="shop-card">
            <div class="shop-card-img" style="background-image: url('${product.image}');"></div>
            <div class="shop-card-content">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                ${actionMarkup}
            </div>
        </div>
    `;
    }).join('');

    shopGrid.querySelectorAll('.add-cart-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            addToCart(productId);
        });
    });
};

const openCart = () => {
    cartOverlay.classList.remove('hidden');
    cartPanel.classList.remove('hidden');
    cartOverlay.classList.add('visible');
    cartPanel.classList.add('visible');
};

const closeCart = () => {
    cartOverlay.classList.remove('visible');
    cartPanel.classList.remove('visible');
    cartOverlay.classList.add('hidden');
    cartPanel.classList.add('hidden');
    checkoutFormWrapper.classList.add('hidden');
    orderConfirmation.classList.add('hidden');
};

const addToCart = (productId) => {
    cart[productId] = (cart[productId] || 0) + 1;
    saveCart();
    renderCart();
    openCart();
};

const removeFromCart = (productId) => {
    delete cart[productId];
    saveCart();
    renderCart();
};

const updateQuantity = (productId, delta) => {
    const current = cart[productId] || 0;
    const next = current + delta;

    if (next <= 0) {
        removeFromCart(productId);
        return;
    }

    cart[productId] = next;
    saveCart();
    renderCart();
};

if (cartToggle) {
    cartToggle.addEventListener('click', openCart);
}

if (cartClose) {
    cartClose.addEventListener('click', closeCart);
}

if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
}

if (clearCartButton) {
    clearCartButton.addEventListener('click', () => {
        cart = {};
        saveCart();
        renderCart();
    });
}

if (checkoutToggle) {
    checkoutToggle.addEventListener('click', () => {
        checkoutFormWrapper.classList.toggle('hidden');
        orderConfirmation.classList.add('hidden');
        mpesaInstructions.classList.add('hidden');
        checkoutForm.style.display = 'block';
        checkoutForm.reset();
    });
}

if (checkoutForm) {
    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (Object.keys(cart).length === 0) {
            return;
        }

        const formData = new FormData(checkoutForm);
        const order = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            notes: formData.get('notes'),
            items: getCartItems(),
            total: calculateTotal().toFixed(2)
        };

        // Generate unique order number for account reference
        const orderNumber = 'ORD' + Date.now().toString().slice(-6);
        const totalAmount = calculateTotal();

        // Update M-Pesa instructions with order details
        document.getElementById('accountNumber').textContent = orderNumber;
        document.getElementById('paymentAmount').textContent = 'KSh ' + totalAmount.toFixed(2);

        // Show M-Pesa instructions
        document.getElementById('mpesaInstructions').classList.remove('hidden');
        document.getElementById('orderConfirmation').classList.remove('hidden');

        // Hide the form
        checkoutForm.style.display = 'none';

        // Log order for business reference
        console.log('Order submitted:', order);

        // Optional: Send order data to business email or server
        // You can add email sending logic here later
    });
}

renderShop();
renderCart();

// ===========================
// SMOOTH SCROLLING
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===========================
// NAVIGATION HIGHLIGHT
// ===========================

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===========================
// ADD ACTIVE CLASS TO NAV
// ===========================

const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// ===========================
// SCROLL TO TOP BUTTON
// ===========================

const scrollTopButton = document.createElement('button');
scrollTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopButton.className = 'scroll-to-top';
scrollTopButton.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #d4af37;
    color: #1a1a1a;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    z-index: 999;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

document.body.appendChild(scrollTopButton);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopButton.style.display = 'flex';
    } else {
        scrollTopButton.style.display = 'none';
    }
});

scrollTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopButton.addEventListener('mouseover', () => {
    scrollTopButton.style.backgroundColor = '#c9a227';
    scrollTopButton.style.transform = 'translateY(-5px)';
});

scrollTopButton.addEventListener('mouseout', () => {
    scrollTopButton.style.backgroundColor = '#d4af37';
    scrollTopButton.style.transform = 'translateY(0)';
});

// ===========================
// LAZY LOADING ANIMATION
// ===========================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add animation class to elements
const fadeElements = document.querySelectorAll(
    '.service-card, .portfolio-item, .testimonial-card, .pricing-card, .stat'
);

fadeElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.animationDelay = `${index * 0.1}s`;
    observer.observe(el);
});

// Add fade-in-up animation
const animation = document.createElement('style');
animation.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(animation);

// ===========================
// COUNTER ANIMATION
// ===========================

const animateCounters = () => {
    const stats = document.querySelectorAll('.stat h3');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // ~60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target + '+';
            }
        };
        
        const observerForCounter = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observerForCounter.unobserve(entries[0].target);
            }
        });
        
        observerForCounter.observe(stat.parentElement);
    });
};

// Call after page load
window.addEventListener('load', animateCounters);

// ===========================
// FORM VALIDATION
// ===========================

if (contactForm) {
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                input.style.borderBottom = '2px solid #d4af37';
            } else {
                input.style.borderBottom = '2px solid #28a745';
            }
        });
        
        input.addEventListener('focus', () => {
            input.style.borderBottom = '2px solid #d4af37';
        });
    });
}

// ===========================
// DARK MODE TOGGLE (Optional)
// ===========================

const darkModeToggle = () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
};

// You can add a button to toggle dark mode if desired
// darkModeToggle();

console.log('Sparkle Brands Solutions - Website Loaded Successfully ✨');
