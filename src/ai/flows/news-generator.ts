
'use server';

/**
 * @fileOverview An AI agent to generate recent news articles for farmers.
 *
 * - getRecentNews - A function that generates a list of recent news articles.
 * - NewsArticle - The type for a single news article.
 * - GetRecentNewsOutput - The return type for the getRecentNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { translateText } from './translator';

const NewsArticleSchema = z.object({
    title: z.string().describe("The headline of the news article."),
    date: z.string().describe("The publication date of the article in a human-readable format (e.g., 'May 15, 2025')."),
    summary: z.string().describe("A brief summary of the news article."),
    language: z.enum(['en', 'kn']).describe("The language of the generated news article.")
});
export type NewsArticle = z.infer<typeof NewsArticleSchema>;

const GetRecentNewsOutputSchema = z.object({
  articles: z.array(NewsArticleSchema).describe("A list of 3 recent news articles."),
});
export type GetRecentNewsOutput = z.infer<typeof GetRecentNewsOutputSchema>;


export async function getRecentNews(language: 'en' | 'kn'): Promise<GetRecentNewsOutput> {
  const result = await newsGeneratorFlow({ language });

  if (language === 'kn') {
      const translatedArticles = await Promise.all(
          result.articles.map(async (article) => {
              const [
                  translatedTitle,
                  translatedDate,
                  translatedSummary,
              ] = await Promise.all([
                  translateText({ text: article.title, targetLanguage: 'kn' }),
                  translateText({ text: article.date, targetLanguage: 'kn' }),
                  translateText({ text: article.summary, targetLanguage: 'kn' }),
              ]);
              return {
                  title: translatedTitle.translatedText,
                  date: translatedDate.translatedText,
                  summary: translatedSummary.translatedText,
                  language: 'kn'
              };
          })
      );
      return { articles: translatedArticles };
  }

  return result;
}


const prompt = ai.definePrompt({
  name: 'newsGeneratorPrompt',
  input: { schema: z.object({ language: z.enum(['en', 'kn']) }) },
  output: {schema: GetRecentNewsOutputSchema },
  prompt: `You are an AI news correspondent for agriculture.

  Your task is to generate a list of 3 recent, realistic-sounding news articles relevant to farmers in Karnataka, India. The news should cover topics like new government schemes, technological advancements in agriculture, market price updates for local crops, or weather advisories.

  Ensure the publication dates are between January 2025 and June 2025.
  
  The articles should be in English, they will be translated later if needed.`,
});

const newsGeneratorFlow = ai.defineFlow(
  {
    name: 'newsGeneratorFlow',
    inputSchema: z.object({ language: z.enum(['en', 'kn']) }),
    outputSchema: GetRecentNewsOutputSchema,
  },
  async () => {
    const {output} = await prompt({ language: 'en' }); // Always generate in English
    return output!;
  }
);
