
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
import { getWeatherForecastTool } from '../tools/get-weather-forecast';

const WeatherSuggestionInputSchema = z.object({
  location: z.string().describe('The current location of the user.'),
  cropName: z.string().describe('The name of the crop the user is growing.'),
});
export type WeatherSuggestionInput = z.infer<typeof WeatherSuggestionInputSchema>;

const DailySuggestionSchema = z.object({
    day: z.string().describe("The day of the week."),
    date: z.string().describe("The date."),
    condition: z.string().describe("The weather condition."),
    suggestion: z.string().describe("Actionable recommendation for the farmer for that day."),
});

const WeatherSuggestionOutputSchema = z.object({
    suggestions: z.array(DailySuggestionSchema).describe("A list of daily suggestions for the next 7 days."),
});
export type WeatherSuggestionOutput = z.infer<typeof WeatherSuggestionOutputSchema>;

export async function getWeatherSuggestions(input: WeatherSuggestionInput): Promise<WeatherSuggestionOutput> {
  return weatherSuggestionFlow(input);
}

const weatherSuggestionPrompt = ai.definePrompt({
  name: 'weatherSuggestionPrompt',
  input: {schema: WeatherSuggestionInputSchema},
  output: {schema: WeatherSuggestionOutputSchema},
  tools: [getWeatherForecastTool],
  prompt: `You are an expert agronomist providing weather-based advice to farmers.

  A farmer has provided their location and the crop they are growing.
  1. First, use the getWeatherForecastTool to get the 7-day weather forecast for the user's location.
  2. For each day in the forecast, provide a simple, actionable suggestion for the specified crop.
  3. The advice should consider the weather conditions for that day (temperature, rainfall, humidity, wind).
  4. Specifically address potential stress conditions like heavy rain, heatwaves, or strong winds, and relate them to the crop.
  5. Examples of advice include watering needs, when it's safe (or unsafe) to spray pesticides, potential harvesting delays, or protective measures.
  6. The output should be a list of daily suggestions.

  Crop: {{{cropName}}}
  Location: {{{location}}}
  `,
});

const weatherSuggestionFlow = ai.defineFlow(
  {
    name: 'weatherSuggestionFlow',
    inputSchema: WeatherSuggestionInputSchema,
    outputSchema: WeatherSuggestionOutputSchema,
  },
  async input => {
    const {output} = await weatherSuggestionPrompt(input);
    return output!;
  }
);
