export interface WordDifficulty {
  [word: string]: number;  // 词汇 -> 难度等级
}

export interface MainConfig {
  difficulty: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;  // 难度等级 (1-10)
  minLength: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;  // 限制最小长度 (3-10)
  model: string;  // GPT模型
  apiKey: string;  // GPT Key
  apiUrl?: string;  // 自定义API地址
  temperature?: number;  // 温度
  maxTokens?: number;  // 最大令牌
}