import {GoogleGenAI} from '@google/genai';
import 'dotenv/config';

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // This is the default and can be omitted
});

const response = await client.models.generateContent({
  model: 'gemini-3.6-flash',
  contents: 'Difference between mongoDb and MySQL',
});

console.log(response.text);