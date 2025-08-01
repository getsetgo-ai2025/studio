import { config } from 'dotenv';
config();

import '@/ai/flows/market-analysis-overview.ts';
import '@/ai/flows/scheme-finder.ts';
import '@/ai/flows/crop-health-advice.ts';
import '@/ai/flows/translator.ts';
import '@/ai/tools/find-nearby-stores.ts';
import '@/ai/flows/damaged-crop-recovery.ts';
import '@/ai/tools/find-alternative-buyers.ts';
import '@/ai/flows/news-generator.ts';
import '@/ai/tools/get-weather-forecast.ts';
import '@/ai/flows/weather-suggestion.ts';
import '@/ai/schemas/weather-forecast.ts';
