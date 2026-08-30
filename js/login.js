/**
 * ==========================================================================
 * SMART PLACEMENT HUB - AUTHENTICATION CLIENT LOGIC (login.js)
 * Pure Frontend Validation & Mock Session Handling
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggles();
  initLoginForm();
  initRegisterForm();
  initDemoFill();
  initForgotPassword();
});

/**
 * 1. Password Visibility Toggle
 */
function initPasswordToggles() {
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      const icon = btn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-eye', !isPassword);
        icon.classList.toggle('fa-eye-slash', isPassword);
      }
    });
  });
}

/**
 * 2. Login Form Handling
 */
function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const submitBtn = document.getElementById('loginSubmitBtn');

  // Check if redirected from registration page
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('registered') === 'true') {
    const savedUser = JSON.parse(localStorage.getItem('smartPlacementUser') || '{}');
    if (savedUser && savedUser.email && emailInput) {
      emailInput.value = savedUser.email;
    }
    showToast('Account created successfully! Please enter your password to log in.', 'success');
    if (passwordInput) {
      passwordInput.focus();
    }
  }

  // Clear errors on input
  [emailInput, passwordInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => clearInputError(input));
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Email
    if (!emailInput.value.trim()) {
      showInputError(emailInput, 'Please enter your email or student ID');
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showInputError(emailInput, 'Please enter a valid email address');
      isValid = false;
    }

    // Validate Password
    if (!passwordInput.value) {
      showInputError(passwordInput, 'Please enter your password');
      isValid = false;
    } else if (passwordInput.value.length < 6) {
      showInputError(passwordInput, 'Password must be at least 6 characters');
      isValid = false;
    }

    if (!isValid) return;

    // Simulate login loading state
    setButtonLoading(submitBtn, true, 'Signing in...');

    setTimeout(() => {
      // Store mock user session
      const mockUser = {
        name: emailInput.value.split('@')[0] || 'Student',
        email: emailInput.value.trim(),
        role: 'student',
        isLoggedIn: true,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('smartPlacementUser', JSON.stringify(mockUser));

      showToast('Login successful! Redirecting to Student Dashboard...', 'success');

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 900);
    }, 900);
  });
}

/**
 * 3. Registration Form Handling
 */
function initRegisterForm() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  const nameInput = document.getElementById('regFullName');
  const emailInput = document.getElementById('regEmail');
  const passwordInput = document.getElementById('regPassword');
  const confirmPasswordInput = document.getElementById('regConfirmPassword');
  const collegeInput = document.getElementById('regCollege');
  const deptInput = document.getElementById('regDept');
  const gradYearInput = document.getElementById('regGradYear');
  const termsCheckbox = document.getElementById('regTerms');
  const submitBtn = document.getElementById('registerSubmitBtn');

  // Password strength meter
  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      clearInputError(passwordInput);
      updatePasswordStrength(passwordInput.value);
    });
  }

  // Clear errors on input
  [nameInput, emailInput, confirmPasswordInput, collegeInput, deptInput, gradYearInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => clearInputError(input));
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Full Name
    if (!nameInput.value.trim()) {
      showInputError(nameInput, 'Full name is required');
      isValid = false;
    }

    // Email
    if (!emailInput.value.trim()) {
      showInputError(emailInput, 'Email is required');
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showInputError(emailInput, 'Enter a valid college/personal email');
      isValid = false;
    }

    // Password
    if (!passwordInput.value) {
      showInputError(passwordInput, 'Password is required');
      isValid = false;
    } else if (passwordInput.value.length < 6) {
      showInputError(passwordInput, 'Password must be at least 6 characters');
      isValid = false;
    }

    // Confirm Password
    if (!confirmPasswordInput.value) {
      showInputError(confirmPasswordInput, 'Please confirm your password');
      isValid = false;
    } else if (confirmPasswordInput.value !== passwordInput.value) {
      showInputError(confirmPasswordInput, 'Passwords do not match');
      isValid = false;
    }

    // College
    if (!collegeInput.value.trim()) {
      showInputError(collegeInput, 'College name is required');
      isValid = false;
    }

    // Department
    if (!deptInput.value) {
      showInputError(deptInput, 'Please select your department');
      isValid = false;
    }

    // Graduation Year
    if (!gradYearInput.value) {
      showInputError(gradYearInput, 'Please select graduation year');
      isValid = false;
    }

    // Terms Checkbox
    if (termsCheckbox && !termsCheckbox.checked) {
      showToast('Please accept the Terms & Privacy Policy to continue', 'warning');
      isValid = false;
    }

    if (!isValid) return;

    // Simulate account creation
    setButtonLoading(submitBtn, true, 'Creating Student Account...');

    setTimeout(() => {
      const newUser = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        college: collegeInput.value.trim(),
        department: deptInput.value,
        graduationYear: gradYearInput.value,
        isLoggedIn: true,
        registeredAt: new Date().toISOString()
      };
      localStorage.setItem('smartPlacementUser', JSON.stringify(newUser));

      showToast('Account created successfully! Redirecting to Login...', 'success');

      setTimeout(() => {
        window.location.href = 'login.html?registered=true';
      }, 1000);
    }, 1000);
  });
}

/**
 * 4. Password Strength Meter Logic
 */
function updatePasswordStrength(val) {
  const bar1 = document.getElementById('strBar1');
  const bar2 = document.getElementById('strBar2');
  const bar3 = document.getElementById('strBar3');
  const text = document.getElementById('strengthText');
  if (!bar1 || !bar2 || !bar3 || !text) return;

  // Reset bars
  [bar1, bar2, bar3].forEach(b => {
    b.className = 'strength-bar';
  });

  if (!val) {
    text.textContent = 'Enter at least 6 characters';
    return;
  }

  let score = 0;
  if (val.length >= 6) score++;
  if (val.length >= 8 && /[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
  if (val.length >= 10 && /[^A-Za-z0-9]/.test(val)) score++;

  if (score === 1) {
    bar1.classList.add('active-weak');
    text.textContent = 'Strength: Weak (Add numbers & uppercase)';
    text.style.color = 'var(--danger)';
  } else if (score === 2) {
    bar1.classList.add('active-medium');
    bar2.classList.add('active-medium');
    text.textContent = 'Strength: Medium (Add special symbols)';
    text.style.color = 'var(--warning)';
  } else if (score >= 3) {
    bar1.classList.add('active-strong');
    bar2.classList.add('active-strong');
    bar3.classList.add('active-strong');
    text.textContent = 'Strength: Strong & Secure';
    text.style.color = 'var(--success)';
  }
}

/**
 * 5. Quick Fill Demo Credentials Helper
 */
function initDemoFill() {
  const demoBtn = document.getElementById('demoFillBtn');
  if (!demoBtn) return;

  demoBtn.addEventListener('click', () => {
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    if (emailInput && passwordInput) {
      emailInput.value = 'student.demo@placementhub.edu';
      passwordInput.value = 'Placement2026!';
      clearInputError(emailInput);
      clearInputError(passwordInput);
      showToast('Demo credentials filled! Click Log In.', 'info');
    }
  });
}

/**
 * 6. Mock Forgot Password Alert
 */
function initForgotPassword() {
  const forgotBtn = document.getElementById('forgotPasswordLink');
  if (!forgotBtn) return;

  forgotBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('loginEmail');
    const email = emailInput && emailInput.value.trim() ? emailInput.value.trim() : 'your email';
    showToast(`Password reset link sent to ${email} (Mock Demo).`, 'info');
  });
}

/**
 * Helper: Show input error
 */
function showInputError(input, message) {
  input.classList.add('is-invalid');
  const group = input.closest('.form-group');
  if (group) {
    let feedback = group.querySelector('.form-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'form-feedback error-message';
      group.appendChild(feedback);
    }
    feedback.textContent = message;
    feedback.classList.add('error-message');
    feedback.style.display = 'block';
  }
}

/**
 * Helper: Clear input error
 */
function clearInputError(input) {
  input.classList.remove('is-invalid');
  const group = input.closest('.form-group');
  if (group) {
    const feedback = group.querySelector('.form-feedback');
    if (feedback) {
      feedback.style.display = 'none';
      feedback.textContent = '';
    }
  }
}

/**
 * Helper: Validate Email Format
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Helper: Button Loading State
 */
function setButtonLoading(btn, isLoading, loadingText) {
  if (!btn) return;
  if (isLoading) {
    btn.disabled = true;
    btn.dataset.originalHtml = btn.innerHTML;
    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> ${loadingText}`;
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.originalHtml || 'Submit';
  }
}

/**
 * Helper: Toast Notification
 */
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 9999;
      max-width: 380px;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgColors = {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#4F46E5'
  };

  toast.style.cssText = `
    background: #0F172A;
    color: #FFFFFF;
    border-left: 4px solid ${bgColors[type] || bgColors.info};
    padding: 14px 18px;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.5;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  `;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 4000);
}
