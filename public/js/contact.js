document.getElementById('contactForm').onsubmit = async function(e) {
    e.preventDefault();
    const btn = document.getElementById('sendBtn');
    const status = document.getElementById('formStatus');
    btn.disabled = true;
    const originalBtnText = btn.textContent;
    btn.textContent = 'Đang gửi...';
    btn.style.background = 'linear-gradient(90deg, #00eaff 0%, #00fff7 100%)';
    status.textContent = 'Đang gửi...';
    status.classList.add('active');

    const formData = new FormData(this);
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            status.textContent = 'Gửi thành công! Tôi sẽ liên hệ lại sớm.';
            status.style.color = '#00fff7';
            btn.textContent = 'Đã gửi ✓';
            btn.style.background = 'linear-gradient(90deg, #00fff7 0%, #00eaff 100%)';
            this.reset();
        } else {
            throw new Error(result.message || 'Có lỗi xảy ra');
        }
    } catch (error) {
        status.textContent = error.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
        status.style.color = '#ff4b4b';
        btn.textContent = 'Thử lại';
        btn.style.background = 'linear-gradient(90deg, #ff4b4b 0%, #ff5252 100%)';
    }

    setTimeout(() => {
        status.classList.remove('active');
        btn.disabled = false;
        btn.textContent = originalBtnText;
        btn.style.background = '';
    }, 3500);
};

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const fileInput = document.getElementById('jdFile');
  const fileName = document.getElementById('fileName');
  const formStatus = document.getElementById('formStatus');
  const sendBtn = document.getElementById('sendBtn');
  const openUploadPopup = document.getElementById('openUploadPopup');
  const closeUploadPopup = document.getElementById('closeUploadPopup');
  const uploadPopup = document.getElementById('uploadPopup');
  const jdFileInput = document.getElementById('jdFile');
  const openUploadBox = document.getElementById('openUploadBox');
  const uploadBox = document.getElementById('uploadBox');
  const dragDropJD = document.getElementById('dragDropJD');

  // Handle file selection
  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      fileName.textContent = file.name;
      sendBtn.disabled = false;
    } else {
      fileName.textContent = '';
      sendBtn.disabled = true;
    }
  });

  // Handle drag and drop
  const dropZone = document.querySelector('.file-label');

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
  });

  function highlight(e) {
    dropZone.classList.add('highlight');
  }

  function unhighlight(e) {
    dropZone.classList.remove('highlight');
  }

  dropZone.addEventListener('drop', handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const file = dt.files[0];
    fileInput.files = dt.files;
    if (file) {
      fileName.textContent = file.name;
      sendBtn.disabled = false;
    }
  }

  // Handle form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    formData.append('phone', form.phone.value);
    sendBtn.disabled = true;
    formStatus.textContent = 'Đang gửi...';
    formStatus.className = 'form-status';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        formStatus.textContent = 'Gửi thành công! Cảm ơn bạn đã liên hệ.';
        formStatus.className = 'form-status success';
        form.reset();
        fileName.textContent = '';
      } else {
        throw new Error(result.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      formStatus.textContent = error.message || 'Có lỗi xảy ra, vui lòng thử lại.';
      formStatus.className = 'form-status error';
    } finally {
      sendBtn.disabled = false;
    }
  });

  if (openUploadPopup && uploadPopup && closeUploadPopup && jdFileInput && fileName) {
    openUploadPopup.addEventListener('click', function() {
      uploadPopup.style.display = 'flex';
    });
    closeUploadPopup.addEventListener('click', function() {
      uploadPopup.style.display = 'none';
    });
    jdFileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        fileName.textContent = file.name;
        uploadPopup.style.display = 'none';
      } else {
        fileName.textContent = '';
      }
    });
    // Đóng popup khi click ra ngoài
    uploadPopup.addEventListener('click', function(e) {
      if (e.target === uploadPopup) uploadPopup.style.display = 'none';
    });
  }

  if (openUploadBox && uploadBox && jdFileInput && fileName) {
    openUploadBox.addEventListener('click', function() {
      uploadBox.style.display = 'block';
      jdFileInput.click();
    });
    jdFileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        fileName.textContent = file.name;
        uploadBox.style.display = 'none';
      } else {
        fileName.textContent = '';
      }
    });
  }

  if (dragDropJD && jdFileInput && fileName) {
    dragDropJD.addEventListener('click', function(e) {
      if (e.target !== jdFileInput) jdFileInput.click();
    });
    dragDropJD.addEventListener('dragover', function(e) {
      e.preventDefault();
      dragDropJD.style.background = 'rgba(0,234,255,0.10)';
    });
    dragDropJD.addEventListener('dragleave', function(e) {
      e.preventDefault();
      dragDropJD.style.background = 'rgba(0,234,255,0.04)';
    });
    dragDropJD.addEventListener('drop', function(e) {
      e.preventDefault();
      dragDropJD.style.background = 'rgba(0,234,255,0.04)';
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        jdFileInput.files = e.dataTransfer.files;
        const file = jdFileInput.files[0];
        if (file) fileName.textContent = file.name;
      }
    });
    jdFileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) fileName.textContent = file.name;
      else fileName.textContent = '';
    });
  }
}); 