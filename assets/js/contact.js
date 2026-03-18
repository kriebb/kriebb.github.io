/**
   * runValidations()
   *   - name: min 2 chars
   *   - email: required + basic format check
   *   - phone: required + broad format check
   *   - subject: min 2 chars
   *   - message: min 5 words
   */
function runValidations() {
  var $formStatus = $('#form-status');
  // Clear any old messages
  $formStatus.text("").css('color', '#d9534f');

  var nameVal = $('#name').val().trim();
  var emailVal = $('#email').val().trim();
  var phoneVal = $('#phone').val().trim();
  var subjectVal = $('#subject').val().trim();
  var messageVal = $('#message').val().trim();

  // 1) Name check
  if (nameVal.length < 2) {
    $formStatus.text("Please enter at least 2 characters for your name.");
    return false;
  }

  // 2) Email check (required + pattern)
  if (!emailVal) {
    $formStatus.text("Please provide an email address.");
    return false;
  }
  if (!validateEmail(emailVal)) {
    $formStatus.text("Please provide a valid email address.");
    return false;
  }

  // 3) Phone check (required + broad format)
  if (!phoneVal) {
    $formStatus.text("Please provide a phone number.");
    return false;
  }
  // For a broad phone pattern, just ensure it contains digits (and optional +, -, spaces, parentheses).
  // This requires at least 5 characters total. Adjust as needed.
  if (!validatePhone(phoneVal)) {
    $formStatus.text("Please provide a valid phone number.");
    return false;
  }

  // 4) Subject check
  if (subjectVal.length < 2) {
    $formStatus.text("Please enter at least 2 characters for your subject.");
    return false;
  }

  // 5) Message check (5 words minimum)
  var wordCount = messageVal.split(/\s+/).filter(Boolean).length;
  if (wordCount < 5) {
    $formStatus.text("Please enter at least 5 words in your message.");
    return false;
  }

  return true; // All checks passed
}

/**
 * validateEmail(email)
 * Simple pattern for demonstration; adjust as needed.
 */
function validateEmail(email) {
  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

/**
 * validatePhone(phone)
 * Broad pattern: digits, plus sign, dashes, spaces, parentheses, min length of 5
 */
function validatePhone(phone) {
  var pattern = /^[+\-\(\)\d\s]{5,}$/;
  return pattern.test(phone);
}

document.addEventListener("DOMContentLoaded", function () {  // Cache references to the form and status element
  var $form = $('#contact-form');
  var $formStatus = $('#form-status');

  if ($form.length) {
    $form.on('submit', function (event) {
      event.preventDefault(); // Prevent default form submission

      // 1) Run our custom validations
      if (!runValidations()) {
        return; // If validation fails, stop here
      }

      // 1) Check if the form is valid using HTML5 validation
      if (!$form[0].checkValidity()) {
        // Optionally, display native validation tooltips (if the browser supports them)
        $form[0].reportValidity();
        return;
      }

      // Serialize the form fields for submission
      var formData = $form.serialize();

      // Perform the AJAX request
      $.ajax({
        url: $form.attr('action'),        // The URL in the form's action attribute
        type: 'POST',                     // Or 'GET', based on your form method
        data: formData,
        headers: { 'Accept': 'application/json' },
        success: function (response) {
          // If the request succeeds, reset the form and show a success message
          $form[0].reset();
          $formStatus.text("Thanks for your submission!");
          window.location.href = "/thank-you"
        },
        error: function (xhr, status, error) {
          // If there's an error, show a fallback message
          $formStatus.text("Oops! There was a problem submitting your form");
        }
      });
    });
  }


});
// Add this function to enable the submit button when hCaptcha is completed
window.enableSubmit = function() {
  const submitButton = document.querySelector('.btn-submit');
  if (submitButton && document.getElementById('data-consent').checked) {
    submitButton.disabled = false;
    submitButton.classList.remove('btn-disabled');
  }
};
window.onSubmit = function () {
  var $form = $('#contact-form');
  if ($form.length) {
    $form.submit();
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