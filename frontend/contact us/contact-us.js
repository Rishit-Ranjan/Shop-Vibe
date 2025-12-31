

        $(document).ready(function() {
            // Initialize Leaflet map
            var map = L.map('map').setView([34.052235, -118.243683], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.marker([34.052235, -118.243683]).addTo(map)
                .bindPopup('<b>ShopVibe</b><br>123 E-Commerce Street<br>Digital District, Tech City<br>TC 12345, United States')
                .openPopup();

            // Add fade-in animation on scroll
            $(window).on('scroll', function() {
                $('.fade-in').each(function() {
                    var elementTop = $(this).offset().top;
                    var elementBottom = elementTop + $(this).outerHeight();
                    var viewportTop = $(window).scrollTop();
                    var viewportBottom = viewportTop + $(window).height();

                    if (elementBottom > viewportTop && elementTop < viewportBottom) {
                        $(this).addClass('fade-in');
                    }
                });
            });

            // Form validation
            $('#contactForm').on('submit', function(e) {
                e.preventDefault();
                
                var isValid = true;
                
                // Reset all error states
                $('.form-group').removeClass('error');
                $('.error-message').hide();
                $('#successMessage').hide();

                // Validate required fields
                var requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
                
                requiredFields.forEach(function(fieldName) {
                    var field = $('#' + fieldName);
                    var value = field.val().trim();
                    
                    if (!value) {
                        showError(fieldName, getErrorMessage(fieldName, 'required'));
                        isValid = false;
                    }
                });

                // Email validation
                var email = $('#email').val().trim();
                if (email && !isValidEmail(email)) {
                    showError('email', 'Please enter a valid email address');
                    isValid = false;
                }

                // Phone validation (if provided)
                var phone = $('#phone').val().trim();
                if (phone && !isValidPhone(phone)) {
                    showError('phone', 'Please enter a valid phone number');
                    isValid = false;
                }

                // Message length validation
                var message = $('#message').val().trim();
                if (message && message.length < 10) {
                    showError('message', 'Message must be at least 10 characters long');
                    isValid = false;
                }

                // If form is valid, simulate submission
                if (isValid) {
                    submitForm();
                }
            });

            // Real-time validation
            $('input, select, textarea').on('blur', function() {
                var fieldName = $(this).attr('name');
                var value = $(this).val().trim();
                
                // Clear error state
                $(this).closest('.form-group').removeClass('error');
                $(this).siblings('.error-message').hide();

                // Validate based on field type
                if ($(this).prop('required') && !value) {
                    showError(fieldName, getErrorMessage(fieldName, 'required'));
                } else if (fieldName === 'email' && value && !isValidEmail(value)) {
                    showError('email', 'Please enter a valid email address');
                } else if (fieldName === 'phone' && value && !isValidPhone(value)) {
                    showError('phone', 'Please enter a valid phone number');
                } else if (fieldName === 'message' && value && value.length < 10) {
                    showError('message', 'Message must be at least 10 characters long');
                }
            });

            // Functions
            function showError(fieldName, message) {
                var field = $('#' + fieldName);
                var formGroup = field.closest('.form-group');
                var errorDiv = formGroup.find('.error-message');
                
                formGroup.addClass('error');
                errorDiv.text(message).show();
            }

            function getErrorMessage(fieldName, type) {
                var messages = {
                    'firstName': 'Please enter your first name',
                    'lastName': 'Please enter your last name',
                    'email': 'Please enter your email address',
                    'subject': 'Please select a subject',
                    'message': 'Please enter your message'
                };
                
                return messages[fieldName] || 'This field is required';
            }

            function isValidEmail(email) {
                var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }

            function isValidPhone(phone) {
                var phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                var cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
                return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
            }

            function submitForm() {
                var submitBtn = $('#submitBtn');
                
                // Show loading state
                submitBtn.prop('disabled', true);
                submitBtn.addClass('loading');
                submitBtn.text('Sending...');

                // Simulate form submission (replace with actual AJAX call)
                setTimeout(function() {
                    // Hide loading state
                    submitBtn.prop('disabled', false);
                    submitBtn.removeClass('loading');
                    submitBtn.text('Send Message');

                    // Show success message
                    $('#successMessage').show();
                    
                    // Reset form
                    $('#contactForm')[0].reset();
                    
                    // Scroll to success message
                    $('html, body').animate({
                        scrollTop: $('#successMessage').offset().top - 100
                    }, 500);

                }, 2000); // Simulate 2 second processing time
            }

            // Smooth scrolling for navigation links
            $('a[href^="#"]').on('click', function(e) {
                e.preventDefault();
                var target = $($(this).attr('href'));
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top - 80
                    }, 500);
                }
            });
        });
    