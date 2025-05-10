document.getElementById('contactForm').onsubmit = async function(e) {
    e.preventDefault();
    const btn = document.getElementById('sendBtn');
    const status = document.getElementById('formStatus');
    btn.disabled = true;
    status.textContent = 'Sending...';
    status.classList.add('active');
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    try {
        const res = await fetch('/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        status.textContent = result.message;
        status.style.color = result.success ? '#00fff7' : '#ff4b4b';
        setTimeout(() => status.classList.remove('active'), 3500);
        if(result.success) this.reset();
    } catch {
        status.textContent = 'Có lỗi xảy ra. Vui lòng thử lại!';
        status.style.color = '#ff4b4b';
        setTimeout(() => status.classList.remove('active'), 3500);
    }
    btn.disabled = false;
}; 