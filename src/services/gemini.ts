import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Validate API key format instead of throwing immediately
const isValidApiKey = (key: string) => {
  return typeof key === 'string' && key.length > 0 && key !== 'your_gemini_api_key_here';
};

const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeCode(code: string, language: string) {
  // Validate inputs
  if (!isValidApiKey(API_KEY)) {
    throw new Error('Invalid or missing Gemini API key. Please check your .env file.');
  }

  if (!code.trim()) {
    throw new Error('Code is required');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a code review expert. Your task is to analyze the provided code and return ONLY a JSON response in the specified format, with no additional text or explanation.

Code to analyze (${language}):
\`\`\`
${code}
\`\`\`

You must respond with a JSON object that follows this exact structure:
{
  "insights": [
    {
      "type": "bug",
      "severity": "high",
      "message": "Description of a critical bug",
      "suggestion": "How to fix the bug"
    },
    {
      "type": "optimization",
      "severity": "medium",
      "message": "Performance improvement opportunity",
      "suggestion": "How to optimize"
    },
    {
      "type": "standard",
      "severity": "low",
      "message": "Code style or best practice issue",
      "suggestion": "How to improve"
    }
  ]
}

Requirements:
1. The response must be valid JSON
2. Each insight must have all fields: type, severity, message, and suggestion
3. Type must be one of: "bug", "optimization", "standard"
4. Severity must be one of: "low", "medium", "high"
5. Message and suggestion must be clear and actionable
6. Provide 2-4 meaningful insights
7. DO NOT include any text outside the JSON structure
8. DO NOT include any explanations or markdown`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    try {
      // Remove any potential markdown code block markers
      const cleanJson = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      const parsedResponse = JSON.parse(cleanJson);
      
      // Validate response structure
      if (!parsedResponse || typeof parsedResponse !== 'object') {
        throw new Error('Invalid response format: not an object');
      }

      if (!Array.isArray(parsedResponse.insights)) {
        throw new Error('Invalid response format: insights must be an array');
      }

      // Validate and sanitize each insight
      parsedResponse.insights = parsedResponse.insights
        .filter(insight => {
          return (
            insight &&
            typeof insight === 'object' &&
            ['bug', 'optimization', 'standard'].includes(insight.type) &&
            ['low', 'medium', 'high'].includes(insight.severity) &&
            typeof insight.message === 'string' &&
            typeof insight.suggestion === 'string'
          );
        })
        .map(insight => ({
          type: insight.type,
          severity: insight.severity,
          message: insight.message.trim(),
          suggestion: insight.suggestion.trim()
        }));

      if (parsedResponse.insights.length === 0) {
        throw new Error('No valid insights found in the response');
      }

      return parsedResponse;
    } catch (e) {
      console.error('Failed to parse Gemini response:', e);
      throw new Error(
        'Failed to process the code review. Please try again with a different code sample.'
      );
    }
  } catch (error) {
    console.error('Error analyzing code:', error);
    if (error instanceof Error) {
      // Pass through our custom error messages
      if (error.message.includes('Failed to process') || 
          error.message.includes('Invalid or missing Gemini API key')) {
        throw error;
      }
      // Handle Gemini API specific errors
      if (error.message.includes('INVALID_ARGUMENT')) {
        throw new Error('The code sample is too large or contains invalid characters. Please try a shorter sample.');
      }
      if (error.message.includes('PERMISSION_DENIED')) {
        throw new Error('Invalid API key. Please check your Gemini API key in the .env file.');
      }
      if (error.message.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('API quota exceeded. Please try again later.');
      }
    }
    throw new Error('Failed to analyze code. Please try again later.');
  }
}