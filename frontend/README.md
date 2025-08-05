# AI Candidate Recommendation Engine Frontend

A beautiful, modern React frontend for the AI-powered candidate recommendation engine, featuring a professional and elegant design.

## Features

- 🎨 **Beautiful Design**: Modern, glass-morphism UI with gradient backgrounds
- 📱 **Responsive**: Fully responsive design that works on all devices
- 🚀 **Fast Performance**: Optimized with React and Framer Motion animations
- 📄 **File Upload**: Drag-and-drop file upload for PDF, DOCX, and TXT files
- 🤖 **AI Analysis**: Real-time AI-powered candidate analysis and matching
- 📊 **Analytics**: Beautiful metrics and analytics visualization
- 🎯 **Smart Filtering**: Advanced filtering and sorting capabilities

## Tech Stack

- **React 18** - Modern React with hooks
- **Framer Motion** - Smooth animations and transitions
- **React Dropzone** - File upload functionality
- **React Icons** - Beautiful icon library
- **CSS3** - Modern styling with glass-morphism effects

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

This creates a `build` folder with the production-ready files.

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Hero.js
│   │   ├── UploadSection.js
│   │   ├── AnalyticsSection.js
│   │   ├── ResultsSection.js
│   │   └── *.css files
│   ├── styles/
│   │   ├── index.css
│   │   └── App.css
│   ├── App.js
│   └── index.js
└── package.json
```

## Design Features

- **Glass-morphism Effects**: Beautiful translucent cards with backdrop blur
- **Gradient Backgrounds**: Warm, inviting color schemes
- **Smooth Animations**: Framer Motion powered transitions
- **Modern Typography**: Inter font family for clean readability
- **Responsive Grid**: CSS Grid and Flexbox for perfect layouts

## API Integration

The frontend communicates with the Flask backend API:

- `POST /api/analyze` - Submit job description and resumes for analysis
- `GET /api/health` - Health check endpoint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the DUNA AI Candidate Recommendation Engine. 