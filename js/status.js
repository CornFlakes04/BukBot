document.addEventListener('DOMContentLoaded', () => {

  // ===============================
  // ELEMENTS
  // ===============================
  const btn = document.getElementById('checkStatusBtn');
  const input = document.getElementById('trackingInput');
  const result = document.getElementById('statusResult');

  // Safety check
  if (!btn || !input || !result) {
    console.error('Status page elements not found');
    return;
  }

  console.log('Status page JS loaded');

  // ===============================
  // TEMPLATE RENDER FUNCTION
  // ===============================
  function renderTemplate(templateId, data = {}) {
    const template = document.getElementById(templateId);

    if (!template) {
      console.error('Template not found:', templateId);
      return document.createTextNode('');
    }

    const clone = template.content.cloneNode(true);

    Object.keys(data).forEach(key => {
      const el = clone.querySelector(`[data-field="${key}"]`);
      if (el) el.textContent = data[key];
    });

    return clone;
  }

  // ===============================
  // BUTTON CLICK HANDLER (DEMO)
  // ===============================
  btn.addEventListener('click', () => {
    console.log('Check Status button clicked');

    const code = input.value.trim();

    // Clear previous result
    result.innerHTML = '';

    // Show loading
    result.appendChild(renderTemplate('tpl-loading'));

    // No input
    if (!code) {
      result.innerHTML = '';
      result.appendChild(renderTemplate('tpl-not-found'));
      return;
    }

    // ===============================
    // DEMO RESPONSE (FAKE DATA)
    // ===============================
    const mockResponse = {
      status: 'pending', // change to approved / rejected to test
      tracking: code,
      type: 'Residency Certificate',
      date: 'Sept 15, 2025'
    };

    // Simulate API delay
    setTimeout(() => {
      result.innerHTML = '';
      result.appendChild(
        renderTemplate(`tpl-${mockResponse.status}`, mockResponse)
      );
    }, 500);
  });

});
