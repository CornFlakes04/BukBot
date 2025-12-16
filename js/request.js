// Load request types
fetch('../api/get_request_types.php')
  .then(res => res.json())
  .then(data => {
    const select = document.getElementById('requestType');

    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item.slug;          // internal key
      option.textContent = item.name;    // display name
      select.appendChild(option);
    });
  })
  .catch(err => console.error(err));


// Load dynamic form based on selection
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
      // 1️⃣ Inject the form HTML
      formContainer.innerHTML = html;

      // 2️⃣ NOW the form exists in the DOM
      const form = document.getElementById('requestForm');

      if (form) {
        form.addEventListener('submit', e => {
          e.preventDefault();
          // TODO: add reciept generation and qr logic here
          // Next step goes here
          alert('Form submitted (next step)');
        });
      }
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

