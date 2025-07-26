'use server';

/**
 * @fileOverview A simple text translator.
 *
 * - translateText - A function that translates text to a target language.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LANG_MAP = {
    'en': 'English',
    'kn': 'Kannada',
}

const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  targetLanguage: z.enum(Object.keys(LANG_MAP) as [keyof typeof LANG_MAP, ...(keyof typeof LANG_MAP)[]]).describe('The target language code (e.g., "kn" for Kannada).'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: {schema: TranslateTextInputSchema},
  output: {schema: TranslateTextOutputSchema},
  prompt: `Translate the following text to {{{targetLanguage}}}.

Text:
{{{text}}}

Only return the translated text.`,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async (input) => {
    if (!input.text.trim()) {
        return { translatedText: '' };
    }
    const {output} = await prompt({ ...input, targetLanguage: LANG_MAP[input.targetLanguage] });
    return output!;
  }
);
