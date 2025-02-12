import { MainConfig } from '../types';

export async function translateWord(words: { word: string, context: string }[], options: MainConfig): Promise<string> {
  const { model = 'gpt-3.5-turbo', apiKey, apiUrl = 'https://api.openai.com/v1/completions', maxTokens = 1000, temperature = 1.3 } = options;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,  // 选择适当的模型
      messages: [
        {
          "role": "system",
          "content": "You are a language translation assistant who can provide accurate Chinese translations based on the context of words in sentences."
        },
        {
          "role": "user",
          "content": "Please provide the meaning of each word in its context and translate it into Chinese according to the following example format:\n\nInput Format:\n[\n  { \"word\": \"appreciate\", \"context\": \"I appreciate your contribution.\" },\n  { \"word\": \"contribution\", \"context\": \"Your contribution is valuable.\" }\n]\n\nOutput Format:\n[\n  { \"word\": \"appreciate\", \"translation\": \"感谢\" },\n  { \"word\": \"contribution\", \"translation\": \"贡献\" }\n]\n\nPlease translate the following words and their contexts:\n" + JSON.stringify(words, null, 2)
        }
      ],
      response_format: {
        'type': 'json_object'
      },
      max_tokens: maxTokens,
      temperature: temperature,
    }),
  });

  const data = await response.json();
  return data.choices[0].message;  // 返回翻译后的文本
}
