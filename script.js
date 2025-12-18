document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) bar.style.opacity = '0';
                    if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                }
            });
        });
    }

    // Close mobile menu when clicking on a link
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu) navMenu.classList.remove('active');
                if (navToggle) {
                    const bars = navToggle.querySelectorAll('.bar');
                    bars.forEach(bar => {
                        bar.style.transform = 'none';
                        bar.style.opacity = '1';
                    });
                }
            });
        });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header background on scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (!header) return;
        
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .product-card, .feature, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Product Carousel Logic
    const carousels = document.querySelectorAll('.product-carousel');
    
    carousels.forEach(carousel => {
        const images = carousel.querySelectorAll('.product-img');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        let currentIndex = 0;
        
        // Only initialize if there are multiple images
        if (images.length > 1) {
            const showImage = (index) => {
                images.forEach(img => img.classList.remove('active'));
                images[index].classList.add('active');

                // Update buttons with selected image
                const productCard = carousel.closest('.product-card');
                if (productCard) {
                    const newImageSrc = images[index].getAttribute('src');
                    const buyBtn = productCard.querySelector('.compare-product');
                    const cartBtn = productCard.querySelector('.add-to-cart');
                    
                    if (buyBtn) buyBtn.setAttribute('data-image', newImageSrc);
                    if (cartBtn) cartBtn.setAttribute('data-image', newImageSrc);
                }
            };
            
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent triggering card click if any
                currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
                showImage(currentIndex);
            });
            
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
                showImage(currentIndex);
            });
        } else {
            // Hide buttons if only one image or none
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
        }
    });

    // Form handling - Removed fake handler to use the real one below

    // Buy Button Logic (Redirect to compra.html)
    const buyButtons = document.querySelectorAll('.compare-product');
    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = button.getAttribute('data-product');
            const productPrice = button.getAttribute('data-price');
            const productImage = button.getAttribute('data-image');
            
            // Check for multiple images (carousel)
            const productCard = button.closest('.product-card');
            let imagesParam = '';
            let originParam = '';
            
            if (productCard) {
                // Get Product ID for return navigation
                if (productCard.id) {
                    originParam = `&origin=${encodeURIComponent(productCard.id)}`;
                }

                const carouselImages = productCard.querySelectorAll('.carousel-images .product-img');
                if (carouselImages.length > 0) {
                    const imageUrls = Array.from(carouselImages).map(img => img.getAttribute('src'));
                    imagesParam = `&images=${encodeURIComponent(imageUrls.join(','))}`;
                }
            }
            
            // Redirect to compra.html with parameters
            window.location.href = `compra.html?product=${encodeURIComponent(productName)}&price=${encodeURIComponent(productPrice)}&image=${encodeURIComponent(productImage)}${imagesParam}${originParam}`;
        });
    });

}); // End of first DOMContentLoaded block

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    // Product availability buttons
    const availabilityButtons = document.querySelectorAll('.product-card .btn-outline');
    availabilityButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = button.closest('.product-card');
            if (productCard) {
                const productNameEl = productCard.querySelector('.product-name');
                const productName = productNameEl ? productNameEl.textContent : 'Produto';
                showNotification(`Entre em contato conosco para verificar a disponibilidade do ${productName}.`, 'info');
                
                // Scroll to contact section
                setTimeout(() => {
                    const contactSection = document.querySelector('#contact');
                    const header = document.querySelector('.header');
                    
                    if (contactSection) {
                        const headerHeight = header ? header.offsetHeight : 0;
                        const targetPosition = contactSection.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 1000);
            }
        });
    });

    // WhatsApp integration
    function openWhatsApp(phone, message = '') {
        const cleanPhone = phone.replace(/\D/g, '');
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }

    // Add WhatsApp click handlers
    const whatsappContacts = document.querySelectorAll('.contact-item');
    whatsappContacts.forEach(item => {
        const icon = item.querySelector('.fa-whatsapp');
        if (icon) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                const contactDetails = item.querySelector('.contact-details p');
                if (contactDetails) {
                    const phoneText = contactDetails.textContent;
                    const phone = phoneText.split('|')[0].trim(); // Get first phone number
                    const message = 'Olá! Gostaria de saber mais sobre os serviços da Repair Apple Maceió.';
                    openWhatsApp(phone, message);
                }
            });
        }
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Form submission started');
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            console.log('Sending data:', data);
            
            try {
                // Ensure we use the full URL to avoid ambiguity
                const apiUrl = window.location.origin + '/api/contact';
                console.log('Target URL:', apiUrl);

                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                console.log('Response:', result);
                
                if (response.ok) {
                    if (typeof showNotification === 'function') {
                        showNotification(result.message || 'Mensagem enviada com sucesso!', 'success');
                    } else {
                        alert(result.message || 'Mensagem enviada com sucesso!');
                    }
                    this.reset();
                } else {
                    throw new Error(result.error || 'Erro do servidor');
                }
            } catch (error) {
                console.error('Error:', error);
                
                // Fallback inteligente para WhatsApp (caso esteja no GitHub Pages ou servidor offline)
                const isLocal = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
                
                if (!isLocal || error.message.includes('Failed to fetch')) {
                    const confirmWhatsapp = confirm('Nota: O painel administrativo funciona apenas no servidor local.\n\nDeseja enviar esta mensagem diretamente para o nosso WhatsApp?');
                    
                    if (confirmWhatsapp) {
                        const messageText = `*Novo Contato via Site*\n\n*Nome:* ${data.name}\n*Email:* ${data.email}\n*Telefone:* ${data.phone}\n*Serviço:* ${data.service}\n*Mensagem:* ${data.message}`;
                        // Número principal da loja (peguei do HTML: 82 9 9682.9318)
                        const whatsappUrl = `https://wa.me/5582996829318?text=${encodeURIComponent(messageText)}`;
                        window.open(whatsappUrl, '_blank');
                        this.reset();
                        submitBtn.textContent = originalBtnText;
                        submitBtn.disabled = false;
                        return;
                    }
                }

                const errorMsg = 'Erro: ' + error.message + '\n\nVerifique se você está acessando por http://localhost:8000';
                if (typeof showNotification === 'function') {
                    showNotification(errorMsg, 'error');
                } else {
                    alert(errorMsg);
                }
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Instagram integration
    const instagramContact = document.querySelector('.fa-instagram');
    if (instagramContact) {
        const contactItem = instagramContact.closest('.contact-item');
        if (contactItem) {
            contactItem.style.cursor = 'pointer';
            contactItem.addEventListener('click', () => {
                window.open('https://instagram.com/repairapplemaceio', '_blank');
            });
        }
    }

    // Email integration
    const emailContact = document.querySelector('.fa-envelope');
    if (emailContact) {
        const contactItem = emailContact.closest('.contact-item');
        if (contactItem) {
            contactItem.style.cursor = 'pointer';
            contactItem.addEventListener('click', () => {
                const email = 'repairapplemaceio@hotmail.com';
                const subject = 'Contato - Repair Apple Maceió';
                const body = 'Olá! Gostaria de saber mais sobre os serviços da Repair Apple Maceió.';
                window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            });
        }
    }

    // Lazy loading for images (if any are added later)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounce to scroll handler
    const debouncedScrollHandler = debounce(() => {
        const header = document.querySelector('.header');
        if (!header) return;
        
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);
});

// Shopping Cart Functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.init();
    }

    init() {
        this.cartToggle = document.getElementById('cart-toggle');
        this.cartDropdown = document.getElementById('cart-dropdown');
        this.cartCount = document.getElementById('cart-count');
        this.cartItems = document.getElementById('cart-items');
        this.cartTotal = document.getElementById('cart-total');
        this.cartCheckout = document.querySelector('.cart-checkout');

        // Debug: Check if elements are found
        console.log('Cart elements found:', {
            toggle: !!this.cartToggle,
            dropdown: !!this.cartDropdown,
            count: !!this.cartCount,
            items: !!this.cartItems,
            total: !!this.cartTotal,
            checkout: !!this.cartCheckout
        });

        this.bindEvents();
        this.updateCart();
    }

    bindEvents() {
        // Toggle cart dropdown
        this.cartToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Cart toggle clicked');
            this.toggleCart();
        });

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-cart')) {
                this.closeCart();
            }
        });

        // Prevent dropdown from closing when clicking inside it
        this.cartDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Checkout button
        this.cartCheckout.addEventListener('click', () => {
            this.checkout();
        });
    }

    toggleCart() {
        const isActive = this.cartDropdown.classList.contains('active');
        console.log('Toggle cart - currently active:', isActive);
        
        if (isActive) {
            this.closeCart();
        } else {
            this.openCart();
        }
    }

    openCart() {
        console.log('Opening cart');
        this.cartDropdown.classList.add('active');
    }

    closeCart() {
        console.log('Closing cart');
        this.cartDropdown.classList.remove('active');
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        
        this.saveCart();
        this.updateCart();
        this.showAddedAnimation();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCart();
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return;
        }
        
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCart();
        }
    }

    updateCart() {
        this.updateCartCount();
        this.updateCartItems();
        this.updateCartTotal();
        this.updateCheckoutButton();
    }

    updateCartCount() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        this.cartCount.textContent = totalItems;
        this.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    updateCartItems() {
        if (this.items.length === 0) {
            this.cartItems.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Seu carrinho está vazio</p>
                </div>
            `;
            return;
        }

        this.cartItems.innerHTML = this.items.map((item, index) => `
            <div class="cart-item" style="animation-delay: ${index * 0.1}s">
                <div class="cart-item-image">
                    <i class="fab fa-apple"></i>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-number">${item.quantity}</span>
                    <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateCartTotal() {
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.cartTotal.textContent = this.formatCurrency(total);
    }

    updateCheckoutButton() {
        this.cartCheckout.disabled = this.items.length === 0;
    }

    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }

    formatCurrency(value) {
        return value.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    showAddedAnimation() {
        this.cartCount.style.transform = 'scale(1.3)';
        this.cartCount.style.backgroundColor = '#00ff00';
        
        setTimeout(() => {
            this.cartCount.style.transform = 'scale(1)';
            this.cartCount.style.backgroundColor = '#ff4444';
        }, 300);
    }

    checkout() {
        if (this.items.length === 0) return;
        
        // Mostrar confirmação antes de finalizar
        const confirmed = confirm('Deseja finalizar sua compra? Você será redirecionado para o WhatsApp.');
        if (!confirmed) return;
        
        // Feedback visual
        this.cartCheckout.textContent = 'Finalizando...';
        this.cartCheckout.disabled = true;
        
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Lista detalhada dos itens
        const itemsList = this.items.map(item => 
            `• ${item.name}\n  Quantidade: ${item.quantity}x\n  Preço unitário: R$ ${this.formatCurrency(item.price)}\n  Subtotal: R$ ${this.formatCurrency(item.price * item.quantity)}`
        ).join('\n\n');
        
        const message = `🛒 *PEDIDO DE COMPRA*\n\n` +
                       `📱 *Produtos selecionados:*\n\n${itemsList}\n\n` +
                       `💰 *TOTAL: R$ ${this.formatCurrency(total)}*\n\n` +
                       `Gostaria de finalizar esta compra. Aguardo informações sobre forma de pagamento e entrega.`;
        
        const whatsappUrl = `https://wa.me/5582999999999?text=${encodeURIComponent(message)}`;
        
        // Simular delay para melhor UX
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            
            // Resetar botão após abrir WhatsApp
            setTimeout(() => {
                this.cartCheckout.textContent = 'Finalizar Compra';
                this.cartCheckout.disabled = false;
                
                // Opcional: limpar carrinho após checkout
                const clearCart = confirm('Deseja limpar o carrinho após finalizar a compra?');
                if (clearCart) {
                    this.clearCart();
                }
            }, 1000);
        }, 500);
    }
    
    clearCart() {
        this.items = [];
        this.saveToStorage();
        this.updateCartDisplay();
        this.updateCartTotal();
        this.updateCheckoutButton();
        this.closeCart();
    }
}

// Initialize cart
let cart;
document.addEventListener('DOMContentLoaded', () => {
    cart = new ShoppingCart();
});

// Helper function to add products to cart
function addToCart(productId, productName, productPrice) {
    const product = {
        id: productId,
        name: productName,
        price: productPrice
    };
    cart.addItem(product);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Repair Apple Maceió - Site carregado com sucesso!');
    
    // Initialize credit card functionality
    initializeCreditCard();
    
    // Add event listeners for add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    console.log('Found add to cart buttons:', addToCartButtons.length);
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImage = this.getAttribute('data-image');
            
            const product = {
                id: productName.toLowerCase().replace(/\s+/g, '-'),
                name: productName,
                price: productPrice,
                image: productImage
            };
            
            console.log('Adding product to cart:', product);
            cart.addItem(product);
            
            // Add visual feedback to button
            this.style.background = '#28a745';
            this.textContent = 'Adicionado!';
            
            // Add pulse animation to cart icon
            const cartIcon = document.querySelector('.cart-link i');
            cartIcon.classList.add('cart-pulse');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                cartIcon.classList.remove('cart-pulse');
            }, 600);
            
            // Reset button after delay
            setTimeout(() => {
                this.style.background = '';
                this.textContent = 'Adicionar ao Carrinho';
            }, 1500);
        });
    });
    
    // Add loading animation to hero section
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 200);
    }
    
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(30px)';
        heroSubtitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 400);
    }
    
    if (heroButtons) {
        heroButtons.style.opacity = '0';
        heroButtons.style.transform = 'translateY(30px)';
        heroButtons.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            heroButtons.style.opacity = '1';
            heroButtons.style.transform = 'translateY(0)';
        }, 600);
    }
});

// Credit Card Component
function initializeCreditCard() {
    const cardNumberInput = document.getElementById('card-number');
    const cardNameInput = document.getElementById('card-name');
    const cardExpiryInput = document.getElementById('card-expiry');
    const cardCvvInput = document.getElementById('card-cvv');
    const validateButton = document.getElementById('validate-card');
    
    const cardDisplayNumber = document.getElementById('card-display-number');
    const cardDisplayName = document.getElementById('card-display-name');
    const cardDisplayExpiry = document.getElementById('card-display-expiry');
    const cardDisplayCvv = document.getElementById('card-display-cvv');
    const cardSignatureName = document.getElementById('card-signature-name');
    const cardBrand = document.getElementById('card-brand');
    const creditCard = document.querySelector('.credit-card');
    
    // Check if elements exist before adding event listeners
    if (!cardNumberInput || !cardNameInput || !cardExpiryInput || !cardCvvInput) {
        console.log('Credit card elements not found on this page');
        return;
    }
    
    // Card number formatting and validation
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        
        if (formattedValue.length > 19) {
            formattedValue = formattedValue.substring(0, 19);
        }
        
        e.target.value = formattedValue;
        
        // Update card display
        const displayValue = formattedValue.padEnd(19, '#').replace(/(.{4})/g, '$1 ').trim();
        if (cardDisplayNumber) cardDisplayNumber.textContent = displayValue || '#### #### #### ####';
        
        // Detect card brand
        const brand = detectCardBrand(value);
        if (cardBrand) cardBrand.textContent = brand;
        
        // Validate card number
        validateCardNumber(value, cardNumberInput);
    });
    
    // Card name validation
    cardNameInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
        e.target.value = value;
        
        if (cardDisplayName) cardDisplayName.textContent = value || 'SEU NOME AQUI';
        if (cardSignatureName) cardSignatureName.textContent = value || 'SEU NOME AQUI';
        
        validateCardName(value, cardNameInput);
    });
    
    // Card expiry formatting and validation
    cardExpiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        e.target.value = value;
        if (cardDisplayExpiry) cardDisplayExpiry.textContent = value || 'MM/AA';
        
        validateCardExpiry(value, cardExpiryInput);
    });
    
    // CVV validation and card flip
    cardCvvInput.addEventListener('focus', function() {
        if (creditCard) creditCard.classList.add('flipped');
    });
    
    cardCvvInput.addEventListener('blur', function() {
        if (creditCard) creditCard.classList.remove('flipped');
    });
    
    cardCvvInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value;
        
        if (cardDisplayCvv) cardDisplayCvv.textContent = value || '###';
        
        validateCardCvv(value, cardCvvInput);
    });
    
    // Validate entire card
    if (validateButton) {
        validateButton.addEventListener('click', function() {
            validateEntireCard();
        });
    }
    
    // Card brand detection
    function detectCardBrand(number) {
        const patterns = {
            'VISA': /^4/,
            'MASTERCARD': /^5[1-5]/,
            'AMEX': /^3[47]/,
            'DISCOVER': /^6(?:011|5)/,
            'DINERS': /^3[0689]/,
            'JCB': /^35/
        };
        
        for (const [brand, pattern] of Object.entries(patterns)) {
            if (pattern.test(number)) {
                return brand;
            }
        }
        
        return 'CARD';
    }
    
    // Luhn algorithm for card validation
    function luhnCheck(number) {
        let sum = 0;
        let isEven = false;
        
        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number[i]);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }
    
    // Validation functions
    function validateCardNumber(number, input) {
        const validation = document.getElementById('number-validation');
        
        if (number.length === 0) {
            setValidationState(input, validation, '', '');
            return false;
        }
        
        if (number.length < 13) {
            setValidationState(input, validation, 'invalid', 'Número do cartão deve ter pelo menos 13 dígitos');
            return false;
        }
        
        if (number.length > 19) {
            setValidationState(input, validation, 'invalid', 'Número do cartão muito longo');
            return false;
        }
        
        if (!luhnCheck(number)) {
            setValidationState(input, validation, 'invalid', 'Número do cartão inválido');
            return false;
        }
        
        setValidationState(input, validation, 'valid', 'Número do cartão válido');
        return true;
    }
    
    function validateCardName(name, input) {
        const validation = document.getElementById('name-validation');
        
        if (name.length === 0) {
            setValidationState(input, validation, '', '');
            return false;
        }
        
        if (name.length < 2) {
            setValidationState(input, validation, 'invalid', 'Nome deve ter pelo menos 2 caracteres');
            return false;
        }
        
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            setValidationState(input, validation, 'invalid', 'Nome deve conter apenas letras');
            return false;
        }
        
        setValidationState(input, validation, 'valid', 'Nome válido');
        return true;
    }
    
    function validateCardExpiry(expiry, input) {
        const validation = document.getElementById('expiry-validation');
        
        if (expiry.length === 0) {
            setValidationState(input, validation, '', '');
            return false;
        }
        
        if (expiry.length !== 5) {
            setValidationState(input, validation, 'invalid', 'Formato deve ser MM/AA');
            return false;
        }
        
        const [month, year] = expiry.split('/');
        const monthNum = parseInt(month);
        const yearNum = parseInt('20' + year);
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        
        if (monthNum < 1 || monthNum > 12) {
            setValidationState(input, validation, 'invalid', 'Mês inválido');
            return false;
        }
        
        if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
            setValidationState(input, validation, 'invalid', 'Cartão expirado');
            return false;
        }
        
        setValidationState(input, validation, 'valid', 'Data válida');
        return true;
    }
    
    function validateCardCvv(cvv, input) {
        const validation = document.getElementById('cvv-validation');
        
        if (cvv.length === 0) {
            setValidationState(input, validation, '', '');
            return false;
        }
        
        if (cvv.length < 3 || cvv.length > 4) {
            setValidationState(input, validation, 'invalid', 'CVV deve ter 3 ou 4 dígitos');
            return false;
        }
        
        setValidationState(input, validation, 'valid', 'CVV válido');
        return true;
    }
    
    function setValidationState(input, validation, state, message) {
        if (!input || !validation) return;
        
        input.className = input.className.replace(/\b(valid|invalid)\b/g, '');
        validation.className = validation.className.replace(/\b(valid|invalid)\b/g, '');
        
        if (state) {
            input.classList.add(state);
            validation.classList.add(state);
        }
        
        validation.textContent = message;
    }
    
    function validateEntireCard() {
        const cardStatus = document.getElementById('card-status');
        if (!cardStatus) return;
        
        const number = cardNumberInput.value.replace(/\s/g, '');
        const name = cardNameInput.value;
        const expiry = cardExpiryInput.value;
        const cvv = cardCvvInput.value;
        
        const isNumberValid = validateCardNumber(number, cardNumberInput);
        const isNameValid = validateCardName(name, cardNameInput);
        const isExpiryValid = validateCardExpiry(expiry, cardExpiryInput);
        const isCvvValid = validateCardCvv(cvv, cardCvvInput);
        
        cardStatus.className = 'card-status';
        
        if (isNumberValid && isNameValid && isExpiryValid && isCvvValid) {
            cardStatus.classList.add('valid');
            cardStatus.textContent = '✅ Cartão válido! Todos os dados estão corretos.';
        } else {
            cardStatus.classList.add('invalid');
            cardStatus.textContent = '❌ Cartão inválido. Verifique os dados inseridos.';
        }
    }
}

// Image Zoom Functionality
function openImageModal(imageSrc, imageAlt) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    modalImage.src = imageSrc;
    modalImage.alt = imageAlt;
    modal.classList.add('active');
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside the image
document.addEventListener('DOMContentLoaded', () => {
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeImageModal();
            }
        });
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeImageModal();
    }
});

// Add click event listeners to all product images
document.addEventListener('DOMContentLoaded', function() {
    const productImages = document.querySelectorAll('.product-img');
    
    productImages.forEach(function(img) {
        img.addEventListener('click', function() {
            openImageModal(this.src, this.alt);
        });
    });
});

// Hero Carousel
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;

    if (slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // Change every 5 seconds
    }
});