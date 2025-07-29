# USDA Food Database API Integration

This document outlines the USDA Food Database API integration added to your food waste tracking application.

## 🎯 What's New

### Enhanced Features Added:

1. **USDA Food Database Integration**

   - Real-time nutritional data lookup
   - Food categorization and classification
   - Serving size and nutrient information

2. **Environmental Impact Calculator**

   - Carbon footprint calculations
   - Water usage estimates
   - Cost savings tracking
   - Composting potential assessment

3. **Enhanced Dashboard**

   - Real-time statistics
   - Food database search
   - Recent activity tracking
   - Environmental impact metrics

4. **Comprehensive Insights Page**
   - Waste category analysis
   - Personalized recommendations
   - Progress tracking
   - Goal setting

## 🚀 Setup Instructions

### 1. Get USDA API Key (Optional)

The USDA API has a free tier that allows 3,600 requests per day without an API key. For production use, you can get a free API key:

1. Visit: https://fdc.nal.usda.gov/api-key-signup.html
2. Sign up for a free account
3. Get your API key
4. Add it to your environment variables:

```bash
# In your frontend directory, create a .env.local file
NEXT_PUBLIC_USDA_API_KEY=your_api_key_here
```

**Note**: The app works without an API key using the demo key, but you'll have rate limits.

### 2. Install Dependencies

```bash
# Frontend dependencies are already included
cd frontend
npm install

# Backend dependencies
cd ../backend
pip install -r requirements.txt
```

### 3. Start the Application

```bash
# Start both frontend and backend
cd frontend
npm run dev
```

In another terminal:

```bash
cd backend
python camera_app.py
```

## 📊 API Features

### USDA Food Database API

The integration includes several USDA API endpoints:

- **Food Search**: Search for foods by name, category, or UPC
- **Nutritional Data**: Get detailed nutrient information
- **Food Categories**: Categorize foods for better waste tracking

### Environmental Impact Calculator

Calculates environmental impact based on food type:

- **Organic Waste**: 0.5 kg CO₂, 100L water, $2.50 cost, compostable
- **Recyclable**: 1.2 kg CO₂, 50L water, $1.80 cost, not compostable
- **Landfill**: 2.0 kg CO₂, 200L water, $3.20 cost, not compostable

### Enhanced Analysis Results

When you scan food, you now get:

1. **Basic Classification**: Organic, Recycle, or Trash
2. **Confidence Score**: How accurate the classification is
3. **Disposal Instructions**: Specific guidance for proper disposal
4. **Nutritional Information**: USDA data when available
5. **Environmental Impact**: Carbon footprint, water usage, cost estimates
6. **Composting Potential**: Whether the item can be composted

## 🎨 New UI Components

### Enhanced Camera Analysis

The camera analysis now shows:

- Nutritional information from USDA
- Environmental impact metrics
- Composting recommendations
- Cost savings estimates

### Dashboard Features

- **Statistics Cards**: Total scans, waste amount, CO₂ saved, money saved
- **Food Database Search**: Search USDA database for food information
- **Recent Activity**: Latest scans with environmental impact
- **Environmental Impact**: Composting performance and water savings

### Insights Page

- **Waste Categories**: Breakdown of waste by type
- **Composting Performance**: Circular progress indicator
- **Personalized Recommendations**: AI-powered waste reduction tips
- **Weekly Goals**: Actionable targets for users

## 🔧 API Endpoints

### Frontend API Layer (`/frontend/src/app/lib/api.ts`)

```typescript
// Main API class
FoodWasteAPI.analyzeImage(request); // Enhanced analysis with USDA data
FoodWasteAPI.searchFood(query); // Search USDA database
FoodWasteAPI.getFoodDetails(fdcId); // Get detailed food info
FoodWasteAPI.calculateWasteImpact(foodType, quantity); // Environmental impact
```

### Backend Endpoints

```
POST /analyze - Analyze image with enhanced data
GET /history - Get analysis history for dashboard
GET /stats - Get user statistics
```

## 📈 Benefits

### For Users:

- **Better Food Information**: Nutritional data and proper disposal guidance
- **Environmental Awareness**: See the impact of their waste choices
- **Cost Savings**: Track money saved through waste reduction
- **Educational Value**: Learn about composting and recycling

### For Developers:

- **Type Safety**: Full TypeScript integration
- **Error Handling**: Comprehensive error management
- **Scalable Architecture**: Easy to add more APIs
- **Modular Design**: Clean separation of concerns

## 🔮 Future Enhancements

Potential additions to consider:

1. **Recipe API Integration**: Suggest recipes for leftover ingredients
2. **Weather API**: Adjust composting recommendations based on weather
3. **Local Composting APIs**: Find nearby composting facilities
4. **Barcode Scanning**: UPC lookup for packaged foods
5. **Social Features**: Share achievements and tips

## 🐛 Troubleshooting

### Common Issues:

1. **USDA API Rate Limits**: If you hit rate limits, the app gracefully falls back to basic analysis
2. **Network Errors**: The app continues working with local analysis if USDA API is unavailable
3. **CORS Issues**: Backend is configured to allow frontend requests

### Debug Mode:

Check browser console for API errors and network requests.

## 📝 Environment Variables

```bash
# Optional: USDA API Key for higher rate limits
NEXT_PUBLIC_USDA_API_KEY=your_api_key_here

# Backend configuration
BACKEND_URL=http://localhost:5000
```

## 🎉 Success!

Your food waste tracking app now has:

✅ USDA Food Database integration  
✅ Environmental impact calculations  
✅ Enhanced dashboard with real-time data  
✅ Comprehensive insights and analytics  
✅ Type-safe API layer  
✅ Error handling and fallbacks

The app is now much more informative and engaging for users, helping them make better waste reduction decisions!
