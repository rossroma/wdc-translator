import { MainConfig } from '../types';

export async function translateWord(words: { word: string, context: string }[], options: MainConfig): Promise<string> {
  console.log('🙆‍♂️🙆🙆‍♀️ ~ translateWord ~ words:', words)
  const { model = 'gpt-3.5-turbo', apiKey, apiUrl = 'https://api.openai.com/v1/completions', maxTokens = 1000, temperature = 0.1 } = options;

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
          "content": "你是一个语言翻译助手，能够根据单词在句子中的上下文提供准确的中文翻译。请根据示例格式来理解用户的输入和输出要求。"
        },
        {
          "role": "user",
          "content": "请根据以下示例格式，给出每个单词在其上下文中的含义，并翻译成中文：\n\n输入格式：\n[\n  { \"word\": \"appreciate\", \"context\": \"I appreciate your contribution.\" },\n  { \"word\": \"contribution\", \"context\": \"Your contribution is valuable.\" }\n]\n\n输出格式：\n[\n  { \"word\": \"appreciate\", \"translation\": \"感谢\" },\n  { \"word\": \"contribution\", \"translation\": \"贡献\" }\n]\n\n请根据上面的示例格式，处理以下用户输入并输出相应的翻译结果：\n\n" + JSON.stringify(words, null, 2)
        }
      ],
      max_tokens: maxTokens,
      temperature: temperature,
    }),
  });

  const data = await response.json();
  return data.choices[0].message;  // 返回翻译后的文本
}
