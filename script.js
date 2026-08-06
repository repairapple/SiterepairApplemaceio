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
        if (this.cartToggle) {
            this.cartToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.cartDropdown.classList.toggle('active');
            });
        }

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (this.cartDropdown && 
                this.cartDropdown.classList.contains('active') && 
                !this.cartDropdown.contains(e.target) && 
                !this.cartToggle.contains(e.target)) {
                this.cartDropdown.classList.remove('active');
            }
        });

        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const product = {
                    name: btn.dataset.product,
                    price: parseFloat(btn.dataset.price),
                    image: btn.dataset.image
                };
                this.addItem(product);
                
                // Show feedback
                const originalText = btn.textContent;
                btn.textContent = 'Adicionado!';
                btn.style.backgroundColor = '#28a745';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                }, 2000);
            });
        });

        // Quantity buttons delegated event
        if (this.cartItems) {
            this.cartItems.addEventListener('click', (e) => {
                const btn = e.target.closest('.quantity-btn');
                if (!btn) return;

                const index = parseInt(btn.dataset.index);
                if (btn.classList.contains('minus')) {
                    this.updateQuantity(index, -1);
                } else if (btn.classList.contains('plus')) {
                    this.updateQuantity(index, 1);
                }
            });
        }

        // Checkout button
        if (this.cartCheckout) {
            this.cartCheckout.addEventListener('click', () => {
                this.checkout();
            });
        }
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.name === product.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCart();
        
        // Add pulse animation to cart icon
        if (this.cartToggle) {
            this.cartToggle.classList.add('cart-pulse');
            setTimeout(() => this.cartToggle.classList.remove('cart-pulse'), 600);
        }
    }

    updateQuantity(index, change) {
        if (this.items[index]) {
            this.items[index].quantity += change;
            if (this.items[index].quantity <= 0) {
                this.items.splice(index, 1);
            }
            this.saveCart();
            this.updateCart();
        }
    }

    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }

    updateCart() {
        // Update count
        const totalCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
        if (this.cartCount) {
            this.cartCount.textContent = totalCount;
            this.cartCount.style.display = totalCount > 0 ? 'block' : 'none';
        }

        // Update items list
        if (this.cartItems) {
            if (this.items.length === 0) {
                this.cartItems.innerHTML = `
                    <div class="cart-empty">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Seu carrinho está vazio</p>
                    </div>
                `;
            } else {
                this.cartItems.innerHTML = this.items.map((item, index) => `
                    <div class="cart-item">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        </div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-index="${index}">-</button>
                            <span class="quantity-number">${item.quantity}</span>
                            <button class="quantity-btn plus" data-index="${index}">+</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Update total
        if (this.cartTotal) {
            const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            this.cartTotal.textContent = `Total: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        }

        // Enable/disable checkout button
        if (this.cartCheckout) {
            this.cartCheckout.disabled = this.items.length === 0;
        }
    }

    checkout() {
        if (this.items.length === 0) return;

        // Close cart dropdown
        if (this.cartDropdown) {
            this.cartDropdown.classList.remove('active');
        }

        // Redirect to checkout page
        window.location.href = 'checkout.html';
    }
}

// Initialize Cart
document.addEventListener('DOMContentLoaded', () => {
    new ShoppingCart();
});

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }));
    }
});

// Compare Button Logic
document.addEventListener('DOMContentLoaded', () => {
    const compareButtons = document.querySelectorAll('.compare-product');
    
    compareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const card = button.closest('.product-card');
            const originId = card ? card.id : 'products';
            const images = card
                ? Array.from(card.querySelectorAll('.carousel-images img')).map(img => img.getAttribute('src')).filter(Boolean)
                : [];

            const productData = {
                name: button.dataset.product,
                price: button.dataset.price,
                image: button.dataset.image,
                images: images.length ? images : undefined
            };

            localStorage.setItem('selectedProduct', JSON.stringify(productData));

            const params = new URLSearchParams();
            params.set('product', productData.name || '');
            params.set('price', productData.price || '');
            params.set('image', productData.image || '');
            params.set('origin', originId);
            if (images.length > 1) {
                params.set('images', images.join(','));
            }

            window.location.href = `compra.html?${params.toString()}`;
        });
    });
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Form Validation
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ff4444';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });
            
            if (isValid) {
                // Here you would typically send the form data to a server
                alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                form.reset();
            } else {
                alert('Por favor, preencha todos os campos obrigatórios.');
            }
        });
    });
});

// Carousel Logic for Product Images
document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.product-carousel');
    
    carousels.forEach(carousel => {
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        const images = carousel.querySelectorAll('.product-img');
        let currentIndex = 0;
        
        // Show first image initially
        if (images.length > 0) {
            images[0].classList.add('active');
        }
        
        function showImage(index) {
            images.forEach(img => img.classList.remove('active'));
            images[index].classList.add('active');
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent modal opening
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                showImage(currentIndex);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent modal opening
                currentIndex = (currentIndex + 1) % images.length;
                showImage(currentIndex);
            });
        }
    });
});

// Image Modal Logic
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeBtn = document.querySelector('.close-modal');

function openImageModal(imageSrc, imageAlt) {
    if (!modal || !modalImage) return;
    
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

// Certificate Modal and Carousel
document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById("certificate-modal");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    var span = document.getElementsByClassName("close-modal")[0];

    // Carousel Logic
    let certIndex = 0;
    const certImages = document.querySelectorAll('.cert-img');
    const prevBtn = document.querySelector('.cert-prev');
    const nextBtn = document.querySelector('.cert-next');

    function showCert(n) {
        if (certImages.length === 0) return;
        
        certImages.forEach(img => img.classList.remove('active'));
        
        certIndex = n;
        if (certIndex >= certImages.length) certIndex = 0;
        if (certIndex < 0) certIndex = certImages.length - 1;
        
        certImages[certIndex].classList.add('active');
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => showCert(certIndex - 1));
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => showCert(certIndex + 1));
    }

    // Modal Logic for Carousel Images
    // Removed click-to-zoom functionality as requested.
    
    if (span) {
        span.onclick = function() { 
            modal.style.display = "none";
        }
    }
});

// Product Pagination
document.addEventListener('DOMContentLoaded', function() {
    const itemsPerPage = 5;
    const productGrid = document.querySelector('#products .products-grid');
    if (!productGrid) return;
    
    const products = Array.from(productGrid.querySelectorAll('.product-card'));
    const prevBtn = document.getElementById('prev-products');
            const nextBtn = document.getElementById('next-products');
            const pageIndicator = document.getElementById('page-indicator');
            
            if (!products.length || !prevBtn || !nextBtn) return;
            
            // Retrieve stored page or default to 1
            let currentPage = parseInt(sessionStorage.getItem('productsPage')) || 1;
            const totalPages = Math.ceil(products.length / itemsPerPage);
            
            // Validate stored page
            if (currentPage > totalPages) currentPage = 1;
            
            function showPage(page, autoScroll = true) {
                // Save current page
                sessionStorage.setItem('productsPage', page);
        
                const start = (page - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                
                products.forEach((product, index) => {
                    if (index >= start && index < end) {
                        // Reset display property to allow grid layout to handle it
                        product.style.display = ''; 
                        // Ensure it's visible if hidden by previous logic
                        if (window.getComputedStyle(product).display === 'none') {
                             product.style.display = 'block'; // Fallback
                        }
                    } else {
                        product.style.display = 'none';
                    }
                });
                
                // Update buttons
                prevBtn.style.display = page > 1 ? 'inline-block' : 'none';
                nextBtn.style.display = page < totalPages ? 'inline-block' : 'none';
                
                // Update Page Indicator
                if (pageIndicator) {
                    pageIndicator.textContent = `Página ${page} de ${totalPages}`;
                }

                // Scroll to top of products section smoothly
                if (autoScroll && page > 1) {
                    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
                }
            }
    
    // Initial load
    showPage(currentPage, false);
    
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
        }
    });
});
