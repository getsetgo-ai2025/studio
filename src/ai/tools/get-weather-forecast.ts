
"use server";

import { ai } from "@/ai/genkit";
import { z } from "zod";

const DailyForecastSchema = z.object({
    day: z.string().describe("The day of the week (e.g., 'Monday')."),
    date: z.string().describe("The date in a human-readable format (e.g., 'June 20, 2025')."),
    temp_max_c: z.number().describe("Maximum temperature in Celsius."),
    temp_min_c: z.number().describe("Minimum temperature in Celsius."),
    rainfall_mm: z.number().describe("Total rainfall in millimeters."),
    humidity_percent: z.number().describe("Average humidity percentage."),
    wind_kph: z.number().describe("Maximum wind speed in kilometers per hour."),
    condition: z.string().describe("A brief description of the weather condition (e.g., 'Sunny', 'Partly cloudy', 'Heavy rain').")
});

export const getWeatherForecastTool = ai.defineTool(
  {
    name: "getWeatherForecastTool",
    description: "Fetches the current weather and a 7-day forecast for a given location.",
    inputSchema: z.object({
      location: z.string().describe("The location to get the weather forecast for (e.g., 'Bangalore, India')."),
    }),
    outputSchema: z.object({
        today: DailyForecastSchema,
        forecast: z.array(DailyForecastSchema).describe("A 7-day weather forecast."),
    })
  },
  async ({ location }) => {
    console.log(`Fetching mock weather forecast for ${location}`);
    
    // This is a mock implementation. In a real application, you would
    // query a real weather API service.
    const today = new Date();
    const forecast = [];

    for (let i = 0; i < 7; i++) {
        const forecastDate = new Date(today);
        forecastDate.setDate(today.getDate() + i);

        // Simulate varying weather conditions
        const isRainy = Math.random() > 0.6;
        const isHeatwave = Math.random() > 0.8;

        let temp_max_c = 28 + Math.random() * 5; // 28-33°C
        if (isHeatwave) temp_max_c += 5; // Heatwave condition

        let rainfall_mm = 0;
        if (isRainy) rainfall_mm = 5 + Math.random() * 25; // 5-30mm of rain
        
        let condition = "Partly cloudy";
        if (rainfall_mm > 15) condition = "Heavy rain";
        else if (rainfall_mm > 0) condition = "Light rain";
        else if (isHeatwave) condition = "Heatwave";
        else if (temp_max_c > 32) condition = "Sunny and hot";
        else condition = "Sunny";


        forecast.push({
            day: forecastDate.toLocaleDateString('en-US', { weekday: 'long' }),
            date: forecastDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            temp_max_c: parseFloat(temp_max_c.toFixed(1)),
            temp_min_c: parseFloat((18 + Math.random() * 4).toFixed(1)), // 18-22°C
            rainfall_mm: parseFloat(rainfall_mm.toFixed(1)),
            humidity_percent: Math.floor(60 + Math.random() * 30), // 60-90%
            wind_kph: parseFloat((8 + Math.random() * 12).toFixed(1)), // 8-20 kph
            condition: condition,
        });
    }

    return {
      today: forecast[0],
      forecast: forecast,
    };
  }
);
