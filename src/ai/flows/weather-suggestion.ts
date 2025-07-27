
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

const WeatherSuggestionOutputSchema = z.object({
    today: z.string().describe("Actionable recommendation for the farmer for today."),
    tomorrow: z.string().describe("Actionable recommendation for the farmer for tomorrow."),
    next7Days: z.string().describe("A summary of recommendations for the next 7 days, highlighting any major weather events to watch for."),
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
  prompt: `You are an expert agronomist providing concise weather-based advice to farmers.

  A farmer has provided their location and the crop they are growing.
  1.  First, use the getWeatherForecastTool to get the 7-day weather forecast for the user's location.
  2.  Provide a simple, actionable suggestion for today.
  3.  Provide a simple, actionable suggestion for tomorrow.
  4.  Provide a summary of advice for the next 7 days, focusing on significant weather events (like heatwaves, heavy rain) and the corresponding actions.
  5.  The advice should consider the weather conditions (temperature, rainfall, humidity, wind) and relate them to the specific crop.
  6.  Examples of advice include watering needs, when it's safe (or unsafe) to spray pesticides, potential harvesting delays, or protective measures.
  
  Your response must be structured into three distinct fields: 'today', 'tomorrow', and 'next7Days'. Do not leave any field blank.

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

