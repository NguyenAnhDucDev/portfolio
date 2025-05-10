# Portfolio Website

A modern portfolio website built with Node.js and Express to showcase your skills and projects.

## Features

- Responsive design
- Skills showcase
- Projects gallery
- Contact form
- Modern UI with Bootstrap 5

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```
PORT=3000
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
portfolio/
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── contact.js
├── views/
│   ├── index.ejs
│   └── contact.ejs
├── app.js
├── package.json
└── README.md
```

## Customization

1. Update the skills and projects in `app.js`
2. Modify the styles in `public/css/style.css`
3. Add your own images to the `public/images` directory
4. Update the contact form handling in `public/js/contact.js`

## License

MIT 