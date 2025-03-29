// Add this function to enable the submit button when hCaptcha is completed
window.enableSubmit = function() {
  const submitButton = document.querySelector('.btn-submit');
  if (submitButton && document.getElementById('data-consent').checked) {
    submitButton.disabled = false;
    submitButton.classList.remove('btn-disabled');
  }
};

document.addEventListener("DOMContentLoaded", function() {
  // Get reference to the consent checkbox and submit button
  const consentCheckbox = document.getElementById('data-consent');
  const submitButton = document.querySelector('.btn-submit');
  
  // Disable the submit button by default
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.classList.add('btn-disabled');
  }
  
  // Add event listener to the checkbox
  if (consentCheckbox && submitButton) {
    consentCheckbox.addEventListener('change', function() {
      // Enable button only if both checkbox is checked AND hCaptcha is completed
      if (this.checked) {
        // Check if hCaptcha is completed
        const hcaptchaResponse = hcaptcha.getResponse();
        if (hcaptchaResponse) {
          submitButton.disabled = false;
          submitButton.classList.remove('btn-disabled');
        }
      } else {
        submitButton.disabled = true;
        submitButton.classList.add('btn-disabled');
      }
    });
  }
});

// Rest of your existing validation code