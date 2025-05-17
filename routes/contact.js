const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const sgMail = require('@sendgrid/mail');
const fs = require('fs');

// Cấu hình SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Cấu hình multer để lưu file tạm
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// API endpoint xử lý form liên hệ
router.post('/api/contact', upload.single('jdFile'), async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        const jdFile = req.file;

        // Kiểm tra các trường bắt buộc
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
            });
        }

        // Chuẩn bị nội dung email
        const msg = {
            to: process.env.CONTACT_EMAIL, // Email nhận
            from: process.env.SENDGRID_FROM_EMAIL, // Email gửi (đã xác thực trên SendGrid)
            subject: `Liên hệ mới từ ${name}`,
            text: `
                Tên: ${name}
                Email: ${email}
                Số điện thoại: ${phone || 'Không có'}
                Tin nhắn: ${message}
            `,
            html: `
                <h3>Thông tin liên hệ mới</h3>
                <p><strong>Tên:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Số điện thoại:</strong> ${phone || 'Không có'}</p>
                <p><strong>Tin nhắn:</strong> ${message}</p>
            `
        };

        // Nếu có file JD, thêm vào email
        if (jdFile) {
            msg.attachments = [{
                content: jdFile.buffer.toString('base64'),
                filename: jdFile.originalname,
                type: jdFile.mimetype,
                disposition: 'attachment'
            }];
        }

        // Gửi email
        await sgMail.send(msg);

        // Xóa file tạm nếu có
        if (jdFile) {
            fs.unlinkSync(jdFile.path);
        }

        res.json({
            success: true,
            message: 'Gửi thành công!'
        });

    } catch (error) {
        console.error('Lỗi gửi email:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi gửi email'
        });
    }
});

module.exports = router; 