const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const langData = require('./lang');
const cookieParser = require('cookie-parser');
const PDFDocument = require('pdfkit');
const expressLayouts = require('express-ejs-layouts');
const nodemailer = require('nodemailer');

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressLayouts);
app.set('layout', 'layout');

// Personal info
const profile = {
    name: 'Nguyễn Anh Đức',
    title: 'K67 T-CLC UET-VNU',
    avatar: '/images/avatar.jpg', // Đổi thành tên file ảnh thật nếu có
    contact: {
        phone: '0868666582',
        email: '22024536@vnu.edu.vn',
        facebook: 'https://web.facebook.com/nguyenanhductclc/',
        github: 'NguyenAnhDucDev'
    },
    location: 'Nam Định, Việt Nam',
    birthday: '03/01/2004',
    university: 'VNU University of Engineering and Technology',
    introduce: [
        {
            vi: 'Lớp trưởng: QH2022-I/CQ-T-CLC',
            en: 'Class president: QH2022-I/CQ-T-CLC'
        },
        {
            vi: 'Bí thư chi đoàn: QH2022-I/CQ-T-CLC',
            en: 'Chairperson of the Student Association Branch: QH2022-I/CQ-T-CLC'
        },
        {
            vi: 'Phó Chủ nhiệm CLB Nhân sự HRTech - UET',
            en: 'Vice President: Human Resource Club HRTech- UET'
        },
        {
            vi: 'Thành viên Phòng thí nghiệm Kỹ thuật phần mềm - RD320',
            en: 'Member: Software Engineering Laboratory - RD320'
        },
        {
            vi: "Ban tổ chức: Vietnamese Youth TEchnopreneur Challenge'22 - VYTEC'22",
            en: "Organizing Committee: Vietnamese Youth TEchnopreneur Challenge'22 - VYTEC'22"
        }
    ],
    education: [
        {
            school: { vi: 'Đại học Ngoại thương (FTU)', en: 'Foreign Trade University (FTU)' },
            time: '2024 - 2028',
            major: { vi: 'Kinh tế đối ngoại', en: 'International Economics' },
            studentId: '2421113039',
            gpa: 3.67,
            description: {
                vi: 'Học song ngành Kinh tế đối ngoại, trang bị kiến thức kinh tế, kinh doanh quốc tế, kỹ năng phân tích thị trường và tư duy toàn cầu.',
                en: 'Double major in International Economics, equipped with knowledge of economics, international business, market analysis skills, and a global mindset.'
            }
        },
        {
            school: { vi: 'Trường Đại học Công nghệ - ĐHQGHN', en: 'VNU University of Engineering and Technology' },
            time: '2022 - 2026',
            major: { vi: 'Hệ thống thông tin', en: 'Information System' },
            studentId: '22024536',
            gpa: 3.24,
            description: {
                vi: 'Đào tạo chuyên sâu về hệ thống thông tin, kỹ năng lập trình, phân tích dữ liệu, quản trị hệ thống và phát triển phần mềm.',
                en: 'Specialized in Information Systems, with strong skills in programming, data analysis, system administration, and software development.'
            }
        },
        {
            school: { vi: 'Trường THPT A Hải Hậu', en: 'A Hai Hau High School' },
            time: '2019 - 2022',
            location: { vi: 'Hải Hậu - Nam Định', en: 'Hai Hau - Nam Dinh' }
        },
        {
            school: { vi: 'Trường THCS Hải Hậu', en: 'Hai Hau Secondary School' },
            time: '2015 - 2019',
            location: { vi: 'Hải Hậu - Nam Định', en: 'Hai Hau - Nam Dinh' }
        }
    ],
    skills: {
        'Programming Languages': [
            { name: { vi: 'C/C++', en: 'C/C++' }, description: { vi: 'Thành thạo lập trình C/C++, sử dụng tốt các thư viện chuẩn, giải thuật, cấu trúc dữ liệu, OOP.', en: 'Proficient in C/C++ programming, standard libraries, algorithms, data structures, OOP.' } },
            { name: { vi: 'Python', en: 'Python' }, description: { vi: 'Lập trình Python cho automation, phân tích dữ liệu, scripting, và AI cơ bản.', en: 'Python for automation, data analysis, scripting, and basic AI.' } },
            { name: { vi: 'Java', en: 'Java' }, description: { vi: 'Nắm vững Java core, OOP, sử dụng cho backend, desktop app.', en: 'Solid Java core, OOP, for backend and desktop apps.' } },
            { name: { vi: 'JavaScript', en: 'JavaScript' }, description: { vi: 'Lập trình JavaScript cho web, xử lý DOM, ES6+, các thư viện phổ biến.', en: 'JavaScript for web, DOM manipulation, ES6+, popular libraries.' } },
            { name: { vi: 'TypeScript', en: 'TypeScript' }, description: { vi: 'Phát triển backend với TypeScript giúp code an toàn, dễ bảo trì.', en: 'Backend development with TypeScript for safer, maintainable code.' } }
        ],
        'Backend & API Development': [
            { name: { vi: 'Node.js/Express.js', en: 'Node.js/Express.js' }, description: { vi: 'Xây dựng RESTful API, xử lý nghiệp vụ backend, microservices.', en: 'Build RESTful APIs, backend logic, microservices.' } },
            { name: { vi: 'NestJS', en: 'NestJS' }, description: { vi: 'Phát triển backend hiện đại, module hóa, dễ mở rộng.', en: 'Modern backend development, modular, scalable.' } },
            { name: { vi: 'RESTful API', en: 'RESTful API' }, description: { vi: 'Thiết kế, xây dựng và tích hợp API cho web, mobile.', en: 'Design, build, and integrate APIs for web and mobile.' } },
            { name: { vi: 'GraphQL', en: 'GraphQL' }, description: { vi: 'Thiết kế API linh hoạt, tối ưu hóa truy vấn dữ liệu.', en: 'Flexible API design, optimized data queries.' } }
        ],
        'Database & Data Management': [
            { name: { vi: 'MySQL/PostgreSQL', en: 'MySQL/PostgreSQL' }, description: { vi: 'Thiết kế, tối ưu cơ sở dữ liệu quan hệ, truy vấn SQL.', en: 'Design, optimize relational databases, SQL queries.' } },
            { name: { vi: 'MongoDB/Redis', en: 'MongoDB/Redis' }, description: { vi: 'Làm việc với NoSQL, lưu trữ dữ liệu phi cấu trúc, cache.', en: 'Work with NoSQL, unstructured data storage, caching.' } }
        ],
        'DevOps & Tools': [
            { name: { vi: 'Docker', en: 'Docker' }, description: { vi: 'Đóng gói, triển khai ứng dụng backend, microservices.', en: 'Containerize, deploy backend apps, microservices.' } },
            { name: { vi: 'Linux/Ubuntu', en: 'Linux/Ubuntu' }, description: { vi: 'Quản trị server, thao tác terminal, triển khai ứng dụng.', en: 'Server administration, terminal, app deployment.' } },
            { name: { vi: 'Git', en: 'Git' }, description: { vi: 'Quản lý mã nguồn, branching, pull request, làm việc nhóm.', en: 'Source control, branching, pull requests, teamwork.' } },
            { name: { vi: 'CI/CD (GitHub Actions)', en: 'CI/CD (GitHub Actions)' }, description: { vi: 'Tự động hóa kiểm thử, build, deploy ứng dụng.', en: 'Automate testing, build, deploy apps.' } },
            { name: { vi: 'Swagger/Postman', en: 'Swagger/Postman' }, description: { vi: 'Viết tài liệu, kiểm thử API, giao tiếp với frontend/mobile.', en: 'API documentation, testing, frontend/mobile integration.' } },
            { name: { vi: 'Unit Test (Jest, Mocha)', en: 'Unit Test (Jest, Mocha)' }, description: { vi: 'Viết test cho API, service, nâng cao chất lượng sản phẩm.', en: 'Write tests for APIs, services, improve quality.' } }
        ],
        'Project Management & Collaboration': [
            { name: { vi: 'Agile/Scrum', en: 'Agile/Scrum' }, description: { vi: 'Làm việc nhóm, quản lý dự án phần mềm linh hoạt.', en: 'Teamwork, flexible software project management.' } },
            { name: { vi: 'Jira, Trello', en: 'Jira, Trello' }, description: { vi: 'Quản lý task, backlog, theo dõi tiến độ dự án.', en: 'Task management, backlog, project tracking.' } },
            { name: { vi: 'Kỹ năng giao tiếp, teamwork', en: 'Communication & Teamwork skills' }, description: { vi: 'Làm việc hiệu quả với khách hàng, team dev, trình bày giải pháp.', en: 'Work effectively with clients, dev team, present solutions.' } }
        ],
        'Business Analysis': [
            { name: { vi: 'Phân tích yêu cầu', en: 'Requirement Analysis' }, description: { vi: 'Thu thập, phân tích, đặc tả yêu cầu nghiệp vụ.', en: 'Collect, analyze, specify business requirements.' } },
            { name: { vi: 'Use Case, User Story', en: 'Use Case, User Story' }, description: { vi: 'Mô hình hóa quy trình nghiệp vụ, viết tài liệu BA.', en: 'Model business processes, write BA documents.' } },
            { name: { vi: 'Wireframe/Mockup', en: 'Wireframe/Mockup' }, description: { vi: 'Thiết kế giao diện mẫu, trình bày ý tưởng sản phẩm.', en: 'Design wireframes, present product ideas.' } }
        ],
        'Web Frontend & UI': [
            { name: { vi: 'HTML', en: 'HTML' }, description: { vi: 'Hiểu rõ cấu trúc HTML5, xây dựng giao diện web chuẩn SEO.', en: 'Understand HTML5 structure, build SEO-friendly web UI.' } },
            { name: { vi: 'CSS', en: 'CSS' }, description: { vi: 'Thiết kế giao diện web responsive, sử dụng Flexbox, Grid, Bootstrap.', en: 'Responsive web design, Flexbox, Grid, Bootstrap.' } }
        ],
        'Soft Skills': [
            { name: { vi: 'Lãnh đạo (Leadership)', en: 'Leadership' }, description: { vi: 'Lớp trưởng K67I-IS-UET-VNU, dẫn dắt, tổ chức, truyền cảm hứng cho tập thể.', en: 'Class president of K67I-IS-UET-VNU, leading, organizing, and inspiring the class.' } },
            { name: { vi: 'Kỹ năng giao tiếp', en: 'Communication' }, description: { vi: 'Giao tiếp hiệu quả với đồng đội, khách hàng, trình bày ý tưởng rõ ràng.', en: 'Communicate effectively with teammates, clients, present ideas clearly.' } },
            { name: { vi: 'Làm việc nhóm', en: 'Teamwork' }, description: { vi: 'Hợp tác, hỗ trợ, chia sẻ trách nhiệm trong nhóm.', en: 'Collaborate, support, and share responsibility in teams.' } },
            { name: { vi: 'Giải quyết vấn đề', en: 'Problem Solving' }, description: { vi: 'Phân tích, tìm giải pháp tối ưu cho các vấn đề thực tế.', en: 'Analyze and find optimal solutions for real-world problems.' } },
            { name: { vi: 'Tư duy phản biện', en: 'Critical Thinking' }, description: { vi: 'Đánh giá, phản biện, đưa ra quyết định hợp lý.', en: 'Evaluate, critique, and make sound decisions.' } }
        ]
    },
    projects: [
        {
            title: { vi: 'BunniesAndCarrots', en: 'BunniesAndCarrots' },
            year: '2023',
            link: 'https://github.com/NguyenAnhDucDev/BTL-LTNC',
            description: {
                vi: 'Dự án môn học Lập trình nâng cao sử dụng C/C++ và thư viện SDL2.',
                en: 'A project for my university courses using C/C++ and SDL2 library.'
            }
        },
        {
            title: {
                vi: 'Todo List App - Fullstack DevOps Demo',
                en: 'Todo List App - Fullstack DevOps Demo'
            },
            year: '2024',
            link: 'https://github.com/NguyenAnhDucDev/to_do_list_nodejs',
            description: {
                vi: 'Dự án Todo List tích hợp Node.js, Express, MySQL, Docker, Prometheus, Grafana, Redis, Kafka, Socket.io, CI/CD, Cloud Deploy. Quản lý công việc, đăng nhập, realtime, monitoring, auto deploy. Xem chi tiết README để biết thêm tính năng và hướng dẫn.',
                en: 'A Todo List project integrating Node.js, Express, MySQL, Docker, Prometheus, Grafana, Redis, Kafka, Socket.io, CI/CD, Cloud Deploy. Task management, login, realtime, monitoring, auto deploy. See README for full features and instructions.'
            }
        }
    ],
    achievements: [
        {
            time: '1/2020',
            description: {
                vi: 'Giải nhất khoa học kỹ thuật tỉnh Nam Định',
                en: 'Nam Dinh province first prize in science and technology'
            }
        },
        {
            time: '3/2021',
            description: {
                vi: 'Giải ba hóa học bằng tiếng Anh tỉnh Nam Định',
                en: 'Third prize in chemistry in English in Nam Dinh province'
            }
        }
    ],
    certifications: [
        {
            time: '6/2023',
            description: {
                vi: 'UET Code Camp',
                en: 'UET Code Camp'
            }
        }
    ],
    career_goals: [
        {
            vi: 'Kỹ sư phần mềm',
            en: 'Software Engineer'
        },
        {
            vi: 'Nhà khoa học dữ liệu',
            en: 'Data Scientist'
        },
        {
            vi: 'Kỹ sư trí tuệ nhân tạo',
            en: 'Artificial Intelligence Engineer'
        },
        {
            vi: 'Kỹ sư DevOps',
            en: 'DevOps Engineer'
        },
        {
            vi: 'Chuyên viên phân tích nghiệp vụ',
            en: 'Business Analyst'
        }
    ]
};

// Routes
app.get('/', (req, res) => {
    let lang = req.query.lang || req.cookies.lang || 'vi';
    if (!['vi', 'en'].includes(lang)) lang = 'vi';
    res.cookie('lang', lang, { maxAge: 900000, httpOnly: false });
    res.render('index', {
        title: 'Home',
        profile,
        lang: langData[lang],
        langCode: lang,
        activePage: 'home'
    });
});

app.get('/about', (req, res) => {
    let lang = req.query.lang || req.cookies.lang || 'vi';
    if (!['vi', 'en'].includes(lang)) lang = 'vi';
    res.cookie('lang', lang, { maxAge: 900000, httpOnly: false });
    res.render('about', {
        title: 'About',
        profile,
        lang: langData[lang],
        langCode: lang,
        activePage: 'about'
    });
});

app.get('/skills', (req, res) => {
    let lang = req.query.lang || req.cookies.lang || 'vi';
    if (!['vi', 'en'].includes(lang)) lang = 'vi';
    res.cookie('lang', lang, { maxAge: 900000, httpOnly: false });
    res.render('skills', {
        title: 'Skills',
        profile,
        lang: langData[lang],
        langCode: lang,
        activePage: 'skills'
    });
});

app.get('/projects', (req, res) => {
    let lang = req.query.lang || req.cookies.lang || 'vi';
    if (!['vi', 'en'].includes(lang)) lang = 'vi';
    res.cookie('lang', lang, { maxAge: 900000, httpOnly: false });
    res.render('projects', {
        title: 'Projects',
        profile,
        lang: langData[lang],
        langCode: lang,
        activePage: 'projects'
    });
});

app.get('/contact', (req, res) => {
    let lang = req.query.lang || req.cookies.lang || 'vi';
    if (!['vi', 'en'].includes(lang)) lang = 'vi';
    res.cookie('lang', lang, { maxAge: 900000, httpOnly: false });
    res.render('contact', {
        title: 'Contact',
        profile,
        lang: langData[lang],
        langCode: lang,
        activePage: 'contact'
    });
});

// Route tạo và tải CV PDF động
app.get('/download-cv', (req, res) => {
    let lang = req.query.lang || req.cookies.lang || 'vi';
    if (!['vi', 'en'].includes(lang)) lang = 'vi';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cv.pdf"');
    const doc = new PDFDocument({ margin: 40 });
    doc.registerFont('Roboto', 'fonts/Roboto-Regular.ttf');
    doc.font('Roboto');
    // Header
    doc.fontSize(24).fillColor('#1e40af').text(profile.name, { align: 'center', underline: true });
    doc.moveDown(0.2);
    doc.fontSize(14).fillColor('#222').text(profile.title, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor('#444').text(`${profile.contact.email} | ${profile.contact.phone}`, { align: 'center' });
    doc.text(`${profile.location} | ${profile.birthday}`, { align: 'center' });
    doc.text(profile.university, { align: 'center' });
    doc.moveDown(1);
    // Section helper
    function sectionTitle(title) {
        doc.moveDown(0.5);
        doc.fontSize(14).fillColor('#2563eb').text(title, { underline: true });
        doc.moveDown(0.2);
        doc.fontSize(11).fillColor('#222');
    }
    // Introduce
    sectionTitle(lang === 'vi' ? 'Giới thiệu bản thân' : 'About Me');
    profile.introduce.forEach(item => {
        doc.text('• ' + item[lang]);
    });
    // Education
    sectionTitle(lang === 'vi' ? 'Học vấn' : 'Education');
    profile.education.forEach(edu => {
        doc.font('Roboto').fontSize(12).fillColor('#1e40af').text(`${edu.school[lang]} (${edu.time})`, { continued: false, underline: false, bold: true });
        if (edu.major) doc.font('Roboto').fontSize(11).fillColor('#222').text((edu.major[lang] || ''));
        if (edu.description) doc.font('Roboto').fontSize(10).fillColor('#444').text((edu.description[lang] || ''));
        if (edu.location) doc.font('Roboto').fontSize(10).fillColor('#444').text((edu.location[lang] || ''));
        doc.moveDown(0.3);
    });
    // Skills
    sectionTitle(lang === 'vi' ? 'Kỹ năng' : 'Skills');
    Object.values(profile.skills).forEach(skillGroup => {
        skillGroup.forEach(skill => {
            doc.text('• ' + skill.name[lang]);
        });
    });
    // Projects
    sectionTitle(lang === 'vi' ? 'Dự án' : 'Projects');
    profile.projects.forEach(project => {
        doc.font('Roboto').fontSize(12).fillColor('#1e40af').text(`${project.title[lang]} (${project.year})`, { continued: false, underline: false });
        doc.font('Roboto').fontSize(10).fillColor('#222').text(project.description[lang]);
        doc.font('Roboto').fontSize(10).fillColor('#2563eb').text(project.link);
        doc.moveDown(0.3);
    });
    // Achievements
    sectionTitle(lang === 'vi' ? 'Thành tích' : 'Achievements');
    profile.achievements.forEach(a => {
        doc.text('• ' + a.time + ': ' + a.description[lang]);
    });
    // Certifications
    sectionTitle(lang === 'vi' ? 'Chứng chỉ' : 'Certifications');
    profile.certifications.forEach(c => {
        doc.text('• ' + c.time + ': ' + c.description[lang]);
    });
    // Career goals
    sectionTitle(lang === 'vi' ? 'Mục tiêu nghề nghiệp' : 'Career Goals');
    profile.career_goals.forEach(goal => {
        doc.text('• ' + goal[lang]);
    });
    doc.end();
});

// Contact form - send email
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    // Cấu hình transporter (Gmail, cần bật 2FA và tạo App Password)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your.email@gmail.com', // Thay bằng email của bạn
            pass: 'your-app-password'     // Thay bằng App Password
        }
    });
    const mailOptions = {
        from: email,
        to: 'your.email@gmail.com', // Thay bằng email nhận
        subject: `Portfolio Contact: ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`
    };
    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Gửi email thành công! Tôi sẽ liên hệ lại sớm.' });
    } catch (err) {
        res.json({ success: false, message: 'Gửi email thất bại. Vui lòng thử lại sau.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 