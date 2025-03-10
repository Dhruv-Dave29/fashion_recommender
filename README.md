# HueMatch Beauty - Beauty Try-On Platform

HueMatch Beauty is an AI-powered virtual beauty platform that helps users find their perfect color matches for makeup and fashion based on their skin tone analysis.

## 🌟 Features

- **Skin Tone Analysis**: Advanced AI-powered skin tone detection.
- **Virtual Try-On**: Test makeup products virtually.
- **Personalized Recommendations**: Get customized makeup and outfit color suggestions.
- **Product Catalog**: Browse through curated makeup and fashion items.
- **Responsive Design**: Seamless experience across all devices.

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- TailwindCSS
- Lucide Icons
- React Router

### Backend
- FastAPI
- Pandas
- Gradio Client
- CORS Middleware

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- pip

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```

2. **Install frontend dependencies:**
   ```bash
   cd src
   yarn install
   ```

3. **Install backend dependencies:**
   ```bash
   cd prods_fastapi
   pip install -r requirements.txt
   ```

4. **Start the backend server:**
   ```bash
   cd prods_fastapi
   uvicorn main:app --reload
   ```

5. **Start the frontend development server:**
   ```bash
   cd src
   npm run dev
   ```

## 📁 Project Structure
```
├── prods_fastapi/        # Backend FastAPI application
│   ├── main.py           # Main FastAPI application
│   ├── hm_products.csv   # Product database
│   └── requirements.txt  # Python dependencies
│
└── src/                  # Frontend React application
    ├── components/       # Reusable React components
    ├── pages/            # Page components
    ├── utils/            # Utility functions
    ├── types/            # TypeScript type definitions
    └── lib/              # Shared libraries and data
```

## 🎨 Features in Detail

### Skin Tone Analysis
- Upload or capture a photo.
- AI-powered skin tone detection.
- Monk scale classification.
- Hex color code extraction.

### Virtual Try-On
- Foundation matching.
- Lipstick colors.
- Blush and other makeup products.
- Real-time preview.

### Color Recommendations
- Personalized color palettes.
- Seasonal color analysis.
- Outfit color suggestions.
- Products matching your colors.

## 🔒 Privacy

- All image processing is done locally.
- No personal data is stored.
- Secure API endpoints.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please email [support@huematch.com](mailto:support@huematch.com).

