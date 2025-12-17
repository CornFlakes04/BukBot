// ===============================
// LOAD REQUEST TYPES
// ===============================
fetch('../api/get_request_types.php')
  .then(res => res.json())
  .then(data => {
    const select = document.getElementById('requestType');

    data.forEach(item => {
      if (!item.slug || !item.name) return;

      const option = document.createElement('option');
      option.value = item.slug;          // internal key
      option.textContent = item.name;    // display name
      select.appendChild(option);
    });
  })
  .catch(err => console.error('Failed to load request types:', err));


// ===============================
// DYNAMIC FORM LOADER
// ===============================
const formContainer = document.getElementById('dynamicForm');
const requestSelect = document.getElementById('requestType');

requestSelect.addEventListener('change', () => {
  const slug = requestSelect.value;

  if (!slug) {
    formContainer.innerHTML = '';
    return;
  }

  fetch(`../forms/${slug}.html`)
    .then(res => {
      if (!res.ok) throw new Error('Form not available');
      return res.text();
    })
    .then(html => {
      // Inject form
      formContainer.innerHTML = html;

      const form = document.getElementById('requestForm');
      if (!form) return;

      // ===============================
      // FORM SUBMIT HANDLER
      // ===============================
      form.addEventListener('submit', e => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        const formData = new FormData(form);

        // Include request type (important)
        formData.append('request_type', slug);

        fetch('../api/submit_request.php', {
          method: 'POST',
          body: formData
        })
          .then(res => res.json())
          .then(data => {
            if (!data.success) {
              throw new Error(data.message || 'Submission failed');
            }

            // ===============================
            // RECEIPT / CONFIRMATION UI
            // ===============================
            formContainer.innerHTML = `
              <div class="alert alert-success text-center p-4">
                <h3>✅ Request Submitted</h3>
                <p>Please keep your tracking number:</p>

                <h2 class="my-3">${data.tracking_code}</h2>

                <!-- QR PLACEHOLDER -->
                <div id="qrContainer" class="my-3">
                  <small>QR Code will appear here</small>
                </div>

                <p class="mt-3">
                  You may check your request status using this code.
                </p>

                <button class="btn btn-primary btn-lg mt-3"
                        onclick="window.location.reload()">
                  New Request
                </button>
              </div>
            `;

            // ===============================
            // QR CODE HOOK (READY)
            // ===============================
            generateQRCode(data.tracking_code);

          })
          .catch(err => {
            formContainer.innerHTML = `
              <div class="alert alert-danger text-center">
                <h5>❌ Submission Failed</h5>
                <p>${err.message}</p>
              </div>
            `;
          });
      });
    })
    .catch(() => {
      formContainer.innerHTML = `
        <div class="alert alert-warning text-center">
          <h5>⚠️ Service Not Available</h5>
          <p>Please ask assistance at the Barangay office.</p>
        </div>
      `;
    });
});


// ===============================
// OPTIONAL: QR CODE FUNCTION (LATER)
// ===============================
function generateQRCode(text) {
  const container = document.getElementById('qrContainer');
  if (!container || !text) return;

  // Clear previous QR if any
  container.innerHTML = '';

  new QRCode(container, {
    text: text,
    width: 160,
    height: 160,
    correctLevel: QRCode.CorrectLevel.H
  });
}
