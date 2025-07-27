
'use server';

/**
 * @fileOverview Provides weather-based suggestions for crops.
 *
 * - getWeatherSuggestions - A function that takes a location and crop name and returns daily suggestions.
 * - WeatherSuggestionInput - The input type for the getWeatherSuggestions function.
 * - WeatherSuggestionOutput - The return type for the getWeatherSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getWeatherForecastTool, DailyForecastSchema } from '../tools/get-weather-forecast';

const WeatherSuggestionInputSchema = z.object({
  location: z.string().describe('The current location of the user.'),
  cropName: z.string().describe('The name of the crop the user is growing.'),
});
export type WeatherSuggestionInput = z.infer<typeof WeatherSuggestionInputSchema>;

const WeatherSuggestionOutputSchema = z.object({
    today: z.object({
        suggestion: z.string().describe("Actionable recommendation for the farmer for today."),
        forecast: DailyForecastSchema.describe("The weather forecast for today."),
    }),
    tomorrow: z.object({
        suggestion: z.string().describe("Actionable recommendation for the farmer for tomorrow."),
        forecast: DailyForecastSchema.describe("The weather forecast for tomorrow."),
    }),
    next7Days: z.object({
        suggestion: z.string().describe("A summary of recommendations for the next 7 days, highlighting any major weather events to watch for."),
        forecastSummary: z.string().describe("A human-readable summary of the weather forecast for the next 7 days."),
    }),
});
export type WeatherSuggestionOutput = z.infer<typeof WeatherSuggestionOutputSchema>;

export async function getWeatherSuggestions(input: WeatherSuggestionInput): Promise<WeatherSuggestionOutput> {
  return weatherSuggestionFlow(input);
}

const weatherSuggestionPrompt = ai.definePrompt({
  name: 'weatherSuggestionPrompt',
  input: {schema: z.object({
    location: z.string(),
    cropName: z.string(),
    forecast: z.any(),
  })},
  output: {schema: WeatherSuggestionOutputSchema},
  tools: [getWeatherForecastTool],
  prompt: `You are an expert agronomist providing concise weather-based advice to farmers.

  A farmer has provided their location, the crop they are growing, and the 7-day weather forecast.
  1.  Based on the forecast, provide a simple, actionable suggestion for today.
  2.  Based on the forecast, provide a simple, actionable suggestion for tomorrow.
  3.  Provide a summary of advice for the next 7 days, focusing on significant weather events (like heatwaves, heavy rain) and the corresponding actions.
  4.  Provide a human-readable summary of the 7-day forecast.
  5.  The advice should consider the weather conditions (temperature, rainfall, humidity, wind) and relate them to the specific crop.
  6.  Examples of advice include watering needs, when it's safe (or unsafe) to spray pesticides, potential harvesting delays, or protective measures.
  
  Your response must be structured into the required output fields. Do not leave any field blank.
  Populate the 'forecast' fields for 'today' and 'tomorrow' directly from the provided forecast data.

  Crop: {{{cropName}}}
  Location: {{{location}}}
  7-Day Forecast:
  \`\`\`json
  {{{json forecast}}}
  \`\`\`
  `,
});

const weatherSuggestionFlow = ai.defineFlow(
  {
    name: 'weatherSuggestionFlow',
    inputSchema: WeatherSuggestionInputSchema,
    outputSchema: WeatherSuggestionOutputSchema,
  },
  async input => {
    // First, call the tool to get the weather data.
    const weatherData = await getWeatherForecastTool.fn(input);

    // Then, pass the weather data along with the original input to the prompt.
    const {output} = await weatherSuggestionPrompt({ ...input, forecast: weatherData });
    return output!;
  }
);
