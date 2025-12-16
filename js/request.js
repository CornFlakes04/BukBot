fetch('../api/get_request_types.php')
  .then(res => res.json())
  .then(data => {
    const select = document.getElementById('requestType');

    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item.slug;   // still use ID internally
      option.textContent = item.name; // NAME ONLY
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
  
    .then(res => res.text())
    .then(html => formContainer.innerHTML = html)
    .catch(() => {
      formContainer.innerHTML = `
        <div class="alert alert-danger">
          Form not available.
        </div>`;
    });
});

