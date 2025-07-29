// API layer for Food Waste Tracker
// Includes USDA Food Database integration and local backend APIs

// Type definitions for USDA API
export interface USDASearchResult {
  fdcId: number;
  description: string;
  dataType: string;
  publicationDate: string;
  foodCategory?: string;
  allHighlightFields?: string;
  score?: number;
}

export interface USDANutrient {
  id: number;
  number: string;
  name: string;
  amount: number;
  unitName: string;
}

export interface USDAFoodDetails {
  fdcId: number;
  description: string;
  dataType: string;
  publicationDate: string;
  foodCategory?: string;
  nutrients: USDANutrient[];
  servingSize?: number;
  servingSizeUnit?: string;
}

export interface WasteImpact {
  carbonFootprint: number; // kg CO2
  waterUsage: number; // liters
  costEstimate: number; // USD
  compostingPotential: boolean;
}

// Type definitions for local backend
export interface AnalysisResult {
  class_name: string;
  confidence_score: number;
  image_path?: string;
  instruction: string;
  usdaData?: USDAFoodDetails;
  wasteImpact?: WasteImpact;
}

export interface AnalysisRequest {
  image: string;
  user_id: number;
  role: string;
  password: string;
}

// API Configuration
const API_CONFIG = {
  USDA_BASE_URL: "https://api.nal.usda.gov/fdc/v1",
  USDA_API_KEY: process.env.NEXT_PUBLIC_USDA_API_KEY || "DEMO_KEY", // Free tier
  BACKEND_URL: "http://localhost:5000",
};

// Error handling
class APIError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = "APIError";
  }
}

// USDA Food Database API
export class USDAFoodAPI {
  private static async makeRequest(
    endpoint: string,
    params: Record<string, any> = {}
  ) {
    const url = new URL(`${API_CONFIG.USDA_BASE_URL}${endpoint}`);

    // Add API key
    params.api_key = API_CONFIG.USDA_API_KEY;

    // Add parameters to URL
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new APIError(
          `USDA API error: ${response.statusText}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Network error: ${error.message}`);
    }
  }

  // Search for foods by query
  static async searchFoods(
    query: string,
    pageSize: number = 25
  ): Promise<USDASearchResult[]> {
    const data = await this.makeRequest("/foods/search", {
      query,
      pageSize,
      dataType: "Foundation,SR Legacy",
    });

    return data.foods || [];
  }

  // Get detailed food information by FDC ID
  static async getFoodDetails(fdcId: number): Promise<USDAFoodDetails> {
    return await this.makeRequest(`/food/${fdcId}`);
  }

  // Get food details by UPC (barcode)
  static async getFoodByUPC(upc: string): Promise<USDAFoodDetails | null> {
    const results = await this.searchFoods(upc, 1);
    if (results.length > 0) {
      return await this.getFoodDetails(results[0].fdcId);
    }
    return null;
  }
}

// Waste Impact Calculator
export class WasteImpactCalculator {
  // Calculate environmental impact based on food type and quantity
  static calculateWasteImpact(
    foodType: string,
    quantity: number = 1
  ): WasteImpact {
    const impactData = {
      organic: { carbon: 0.5, water: 100, cost: 2.5, compostable: true },
      recycle: { carbon: 1.2, water: 50, cost: 1.8, compostable: false },
      trash: { carbon: 2.0, water: 200, cost: 3.2, compostable: false },
    };

    const data = impactData[foodType.toLowerCase()] || impactData["trash"];

    return {
      carbonFootprint: data.carbon * quantity,
      waterUsage: data.water * quantity,
      costEstimate: data.cost * quantity,
      compostingPotential: data.compostable,
    };
  }
}

// Local Backend API
export class LocalBackendAPI {
  static async analyzeImage(request: AnalysisRequest): Promise<AnalysisResult> {
    try {
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new APIError(
          `Backend API error: ${response.statusText}`,
          response.status
        );
      }

      const result: AnalysisResult = await response.json();

      // Enhance with USDA data if it's a food item
      if (result.class_name && !result.error) {
        try {
          const usdaResults = await USDAFoodAPI.searchFoods(
            result.class_name,
            1
          );
          if (usdaResults.length > 0) {
            const usdaDetails = await USDAFoodAPI.getFoodDetails(
              usdaResults[0].fdcId
            );
            result.usdaData = usdaDetails;
          }
        } catch (usdaError) {
          console.warn("USDA API error:", usdaError);
          // Continue without USDA data
        }

        // Add waste impact calculation
        result.wasteImpact = WasteImpactCalculator.calculateWasteImpact(
          result.class_name
        );
      }

      return result;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Network error: ${error.message}`);
    }
  }

  // Get analysis history for a user
  static async getAnalysisHistory(
    userId: number,
    role: string
  ): Promise<AnalysisResult[]> {
    try {
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new APIError(
          `Backend API error: ${response.statusText}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Network error: ${error.message}`);
    }
  }
}

// Main API class that combines all functionality
export class FoodWasteAPI {
  // Analyze image with enhanced data
  static async analyzeImage(request: AnalysisRequest): Promise<AnalysisResult> {
    return await LocalBackendAPI.analyzeImage(request);
  }

  // Search for food information
  static async searchFood(query: string): Promise<USDASearchResult[]> {
    return await USDAFoodAPI.searchFoods(query);
  }

  // Get detailed food information
  static async getFoodDetails(fdcId: number): Promise<USDAFoodDetails> {
    return await USDAFoodAPI.getFoodDetails(fdcId);
  }

  // Calculate waste impact
  static calculateWasteImpact(
    foodType: string,
    quantity: number = 1
  ): WasteImpact {
    return WasteImpactCalculator.calculateWasteImpact(foodType, quantity);
  }

  // Get analysis history
  static async getAnalysisHistory(
    userId: number,
    role: string
  ): Promise<AnalysisResult[]> {
    return await LocalBackendAPI.getAnalysisHistory(userId, role);
  }
}

// Export default instance
export default FoodWasteAPI;
