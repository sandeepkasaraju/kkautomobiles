/**
 * AutoDrive Motors Client Application Logic
 * Implements: Lucide Icon instantiation, mobile menu, car category filters,
 * live price booking estimator, modals, validation, and toast notification alerts.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const menuIcon = document.getElementById('menu-icon-icon');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const isActive = mainNav.classList.contains('active');
            
            // Toggle icon inside menu button
            if (isActive) {
                mobileMenuToggle.innerHTML = '<i data-lucide="x"></i>';
            } else {
                mobileMenuToggle.innerHTML = '<i data-lucide="menu"></i>';
            }
            lucide.createIcons();
        });

        // Close mobile nav when clicking a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                mobileMenuToggle.innerHTML = '<i data-lucide="menu"></i>';
                lucide.createIcons();
            });
        });
    }

    // 3. Showroom Filtering Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const carCards = document.querySelectorAll('.car-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from other buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            carCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                // Animate card transition
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 200);
            });
        });
    });

    // 4. Live Pricing Service Estimator
    const vehicleTypeSelect = document.getElementById('calc-vehicle-type');
    const servicesCheckboxes = document.querySelectorAll('input[name="services"]');
    
    // Summary elements
    const summaryMultiplier = document.getElementById('summary-multiplier');
    const summaryBaseRate = document.getElementById('summary-base-rate');
    const summaryServicesList = document.getElementById('summary-services-list');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTax = document.getElementById('summary-tax');
    const summaryTotal = document.getElementById('summary-total');

    // Rates map
    const vehicleMultipliers = {
        sedan: { rate: 1.0, label: '1.0x (Sedan)' },
        suv: { rate: 1.2, label: '1.2x (Luxury SUV)' },
        sports: { rate: 1.5, label: '1.5x (High-Performance Sports)' },
        electric: { rate: 1.1, label: '1.1x (Electric Vehicle)' }
    };

    function updateCostEstimate() {
        if (!vehicleTypeSelect) return;

        const vehicleType = vehicleTypeSelect.value;
        const multiplierInfo = vehicleMultipliers[vehicleType] || { rate: 1.0, label: '1.0x (Sedan)' };
        const multiplier = multiplierInfo.rate;

        // Base price calculation (first selected service or standard fee)
        let subtotal = 0;
        summaryServicesList.innerHTML = '';

        servicesCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const basePrice = parseFloat(checkbox.getAttribute('data-price'));
                const isDelivery = checkbox.value === 'delivery';
                const adjustedPrice = isDelivery ? basePrice : (basePrice * multiplier);
                
                subtotal += adjustedPrice;

                // Add to list
                const li = document.createElement('li');
                li.innerHTML = `${checkbox.parentNode.querySelector('.checkbox-title').innerText} <span>₹${adjustedPrice.toFixed(2)}</span>`;
                summaryServicesList.appendChild(li);
            }
        });

        // If no services checked, default values
        if (summaryServicesList.children.length === 0) {
            const li = document.createElement('li');
            li.style.color = '#64748b';
            li.style.listStyleType = 'none';
            li.innerHTML = 'No services selected';
            summaryServicesList.appendChild(li);
        }

        const taxRate = 0.18; // 18% GST for India services
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        // Update DOM
        summaryMultiplier.innerText = multiplierInfo.label;
        summaryBaseRate.innerText = `₹${(0.0).toFixed(2)}`; // Set base indicator to zero, services represent full rates
        summarySubtotal.innerText = `₹${subtotal.toFixed(2)}`;
        summaryTax.innerText = `₹${tax.toFixed(2)}`;
        summaryTotal.innerText = `₹${total.toFixed(2)}`;
    }

    // Event listeners for calculator triggers
    if (vehicleTypeSelect) {
        vehicleTypeSelect.addEventListener('change', updateCostEstimate);
    }
    servicesCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateCostEstimate);
    });

    // Run initial update on load
    updateCostEstimate();

    // 5. Toast Notification System
    const toastContainer = document.getElementById('toast-container');

    function showToast(title, message, type = 'success') {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let iconMarkup = '<i data-lucide="check-circle" class="toast-icon"></i>';
        if (type === 'error') {
            iconMarkup = '<i data-lucide="alert-circle" class="toast-icon"></i>';
        } else if (type === 'info') {
            iconMarkup = '<i data-lucide="info" class="toast-icon"></i>';
        }

        toast.innerHTML = `
            ${iconMarkup}
            <div class="toast-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="toast-close" aria-label="Close Notification">
                <i data-lucide="x"></i>
            </button>
        `;

        toastContainer.appendChild(toast);
        lucide.createIcons();

        // Close event
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(15px)';
            setTimeout(() => toast.remove(), 300);
        });

        // Auto remove
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(15px)';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    }

    // Set today's date as min date for booking calendar
    const dateInput = document.getElementById('book-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    // 6. Booking Appointment Form Validation & Submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            const inputs = bookingForm.querySelectorAll('[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                }
            });

            // Specific validation checks
            const emailInput = document.getElementById('book-email');
            if (emailInput && emailInput.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    emailInput.classList.add('is-invalid');
                    isValid = false;
                }
            }

            // At least one service check
            const checkedServices = bookingForm.querySelectorAll('input[name="services"]:checked');
            if (checkedServices.length === 0) {
                showToast('Booking Error', 'Please select at least one service to book.', 'error');
                isValid = false;
            }

            if (isValid) {
                const clientName = document.getElementById('book-name').value;
                const bookDate = document.getElementById('book-date').value;
                const bookTime = document.getElementById('book-time').value;

                showToast(
                    'Appointment Scheduled!',
                    `Hi ${clientName}, your slot on ${bookDate} at ${bookTime} is reserved. Check your email for details.`,
                    'success'
                );

                // Reset Form and Live Calculator
                bookingForm.reset();
                updateCostEstimate();
                
                // Clear validation states
                inputs.forEach(input => input.classList.remove('is-invalid'));
            } else {
                showToast('Incomplete Form', 'Please review highlighted fields and try again.', 'error');
            }
        });

        // Add clear on type behavior
        bookingForm.querySelectorAll('.form-control').forEach(control => {
            control.addEventListener('input', () => {
                control.classList.remove('is-invalid');
            });
        });
    }

    // 7. Modal Functionality (Car Inquiry)
    const inquiryModal = document.getElementById('inquiry-modal');
    const modalClose = document.getElementById('modal-close');
    const modalCarTitle = document.getElementById('modal-car-title');
    const inquiryCarNameHidden = document.getElementById('inquiry-car-name');
    const inquireButtons = document.querySelectorAll('.btn-inquire');

    function openModal(carName) {
        if (!inquiryModal) return;
        modalCarTitle.innerText = carName;
        if (inquiryCarNameHidden) inquiryCarNameHidden.value = carName;
        inquiryModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent main page scrolling
    }

    function closeModal() {
        if (!inquiryModal) return;
        inquiryModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Reset modal form
        const inquiryForm = document.getElementById('inquiry-form');
        if (inquiryForm) {
            inquiryForm.reset();
            inquiryForm.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-invalid'));
        }
    }

    inquireButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const carName = btn.getAttribute('data-car');
            openModal(carName);
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close when clicking overlay backdrop
    if (inquiryModal) {
        inquiryModal.addEventListener('click', (e) => {
            if (e.target === inquiryModal) {
                closeModal();
            }
        });
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && inquiryModal && inquiryModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Modal Inquiry Form Submit
    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            const requiredFields = inquiryForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            // Specific Email Validation
            const emailField = document.getElementById('inquire-email');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    emailField.classList.add('is-invalid');
                    isValid = false;
                }
            }

            if (isValid) {
                const name = document.getElementById('inquire-name').value;
                const car = inquiryCarNameHidden.value;
                
                showToast(
                    'Inquiry Received!',
                    `Thank you, ${name}. Our sales specialists will contact you shortly about the ${car}.`,
                    'success'
                );
                
                closeModal();
            } else {
                showToast('Validation Error', 'Please complete the inquiry details correctly.', 'error');
            }
        });

        // Clear error classes on keystroke
        inquiryForm.querySelectorAll('.form-control').forEach(el => {
            el.addEventListener('input', () => {
                el.classList.remove('is-invalid');
            });
        });
    }

    // 8. Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            const emailField = document.getElementById('contact-email');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    emailField.classList.add('is-invalid');
                    isValid = false;
                }
            }

            if (isValid) {
                const name = document.getElementById('contact-name').value;
                showToast(
                    'Message Transmitted!',
                    `Thank you ${name}. Your message has been sent to our customer care team.`,
                    'success'
                );
                contactForm.reset();
            } else {
                showToast('Submission Error', 'Please verify your contact inputs and resubmit.', 'error');
            }
        });

        contactForm.querySelectorAll('.form-control').forEach(el => {
            el.addEventListener('input', () => {
                el.classList.remove('is-invalid');
            });
        });
    }

    // 9. Newsletter Form Handler
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            if (input && input.value.trim()) {
                showToast(
                    'Subscription Confirmed!',
                    `Your email ${input.value} is now registered for VIP releases and track invitations.`,
                    'success'
                );
                newsletterForm.reset();
            }
        });
    }

    // 10. Sticky Nav Scroll Behavior
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.backgroundColor = 'rgba(11, 15, 25, 0.95)';
        } else {
            header.style.padding = '16px 0';
            header.style.backgroundColor = 'var(--bg-nav)';
        }
    });

    // 11. Simple Stats Counter Animation (optional flourish)
    const stats = document.querySelectorAll('.stat-number');
    const animateSpeed = 200;

    function animateCounter(stat) {
        const target = parseInt(stat.getAttribute('data-target'));
        const text = stat.innerText;
        let count = 0;

        // Skip non-integers (like 24/7 or 99.4%)
        if (isNaN(target)) return;

        const updateCount = () => {
            const increment = target / animateSpeed;
            if (count < target) {
                count += increment;
                stat.innerText = Math.ceil(count) + (text.includes('+') ? '+' : text.includes('K+') ? 'K+' : '');
                setTimeout(updateCount, 5);
            } else {
                stat.innerText = text;
            }
        };
        updateCount();
    }

    // Run animation when visible
    const observerOptions = {
        threshold: 0.5
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target.querySelector('.stat-number'));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat-card').forEach(card => {
        statsObserver.observe(card);
    });

    // 12. Distance / Mileage Delivery Fee Estimator
    const btnCalcDelivery = document.getElementById('btn-calc-delivery');
    const deliveryDistanceInput = document.getElementById('delivery-distance');
    const deliveryResultBox = document.getElementById('delivery-result');
    const deliveryCalcError = document.getElementById('delivery-calc-error');
    const resultMileageCost = document.getElementById('result-mileage-cost');
    const resultTotalCost = document.getElementById('result-total-cost');

    if (btnCalcDelivery && deliveryDistanceInput) {
        btnCalcDelivery.addEventListener('click', () => {
            const distanceVal = parseFloat(deliveryDistanceInput.value);
            
            if (isNaN(distanceVal) || distanceVal < 1 || distanceVal > 100) {
                deliveryDistanceInput.classList.add('is-invalid');
                if (deliveryCalcError) deliveryCalcError.style.display = 'block';
                if (deliveryResultBox) deliveryResultBox.style.display = 'none';
            } else {
                deliveryDistanceInput.classList.remove('is-invalid');
                if (deliveryCalcError) deliveryCalcError.style.display = 'none';
                
                const baseFee = 1500.00; // Base INR fee for pickup
                const mileageRate = 50.00; // ₹50 per mile
                const mileageCost = distanceVal * mileageRate;
                const totalCost = baseFee + mileageCost;
                
                if (resultMileageCost) resultMileageCost.innerText = `₹${mileageCost.toFixed(2)}`;
                if (resultTotalCost) resultTotalCost.innerText = `₹${totalCost.toFixed(2)}`;
                if (deliveryResultBox) deliveryResultBox.style.display = 'block';
                
                showToast('Estimation Computed', `Delivery estimated at ₹${totalCost.toFixed(2)} for ${distanceVal} miles.`, 'info');
            }
        });

        deliveryDistanceInput.addEventListener('input', () => {
            deliveryDistanceInput.classList.remove('is-invalid');
            if (deliveryCalcError) deliveryCalcError.style.display = 'none';
        });
    }
});
