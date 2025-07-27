import { z } from "zod";

export const DailyForecastSchema = z.object({
    day: z.string().describe("The day of the week (e.g., 'Monday')."),
    date: z.string().describe("The date in a human-readable format (e.g., 'June 20, 2025')."),
    temp_max_c: z.number().describe("Maximum temperature in Celsius."),
    temp_min_c: z.number().describe("Minimum temperature in Celsius."),
    rainfall_mm: z.number().describe("Total rainfall in millimeters."),
    humidity_percent: z.number().describe("Average humidity percentage."),
    wind_kph: z.number().describe("Maximum wind speed in kilometers per hour."),
    condition: z.string().describe("A brief description of the weather condition (e.g., 'Sunny', 'Partly cloudy', 'Heavy rain').")
});
