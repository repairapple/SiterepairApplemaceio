// =============================================
// AVAILABILITY QUERY MODAL LOGIC
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('availabilityModal');
    const modalClose = modal?.querySelector('.availability-modal-close');
    const productNameEl = document.getElementById('availabilityProductName');
    const whatsappBtn = document.getElementById('availabilityWhatsappBtn');
    const formBtn = document.getElementById('availabilityFormBtn');

    // WhatsApp numbers from the site footer
    const whatsappNumber = '5582996829318';

    let currentProductName = '';

    // Open modal when clicking "Consultar Disponibilidade" buttons
    document.querySelectorAll('.btn-outline').forEach(button => {
        // Only target the "Consultar Disponibilidade" buttons inside product cards
        const productCard = button.closest('.product-card');
        if (!productCard) return;

        button.addEventListener('click', (e) => {
            e.preventDefault();

            // Get product name from the card
            const nameEl = productCard.querySelector('.product-name');
            currentProductName = nameEl ? nameEl.textContent.trim() : 'Este produto';

            // Update modal
            if (productNameEl) {
                productNameEl.textContent = currentProductName;
            }

            // Show modal
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close button
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Click outside to close
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeModal();
        }
    });

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // WhatsApp option
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            const message = encodeURIComponent(
                `Olá! Gostaria de saber sobre a disponibilidade do produto: *${currentProductName}*\n\nPoderia me informar se está disponível e o valor?`
            );
            const url = `https://wa.me/${whatsappNumber}?text=${message}`;
            window.open(url, '_blank');
            closeModal();
        });
    }

    // Form option - scroll to contact form
    if (formBtn) {
        formBtn.addEventListener('click', () => {
            closeModal();

            // Pre-fill the contact form with the product name
            const messageField = document.querySelector('#contactForm textarea[name="message"]');
            const serviceField = document.querySelector('#contactForm select[name="service"]');
            const nameField = document.querySelector('#contactForm input[name="name"]');

            if (messageField) {
                messageField.value = `Gostaria de consultar a disponibilidade do produto: ${currentProductName}`;
            }
            if (serviceField) {
                serviceField.value = 'venda';
            }

            // Scroll to contact section
            setTimeout(() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });

                    // Focus on name field after scrolling
                    setTimeout(() => {
                        if (nameField) nameField.focus();
                    }, 800);
                }
            }, 300);
        });
    }
});