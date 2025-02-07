import { MainConfig } from './types';
import { wordDictionary } from './dictionary/coca';
import { translateWord } from './gpt-api/translate';
import nlp from 'compromise';

function preprocessText(text: string, minLength: number): string[] {
  // 转换为小写，去除标点
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')  // 移除非字母字符

  // 使用compromise库进行自然语言处理
  const doc = nlp(words);
  doc.normalize({
    whitespace: true,
    punctuation: true,
    case: false,
    parentheses: true,
    possessives: true,
    verbs: true
  });
  doc.nouns().toSingular();
  
  // 去重并过滤短单词
  const uniqueWords: string[] = Array.from(new Set(doc.terms().out('array')));
  return uniqueWords.filter(word => word.length >= minLength);
}

function extractHighDifficultyWords(text: string, difficultyThreshold: number, minLength: number): { word: string, context: string }[] {
  const words = preprocessText(text, minLength);
  const highDifficultyWords: { word: string, context: string }[] = [];
  const x = 10 - difficultyThreshold;
  const difficulty = Math.floor(2.1 * Math.pow(x, 2) - 1.1 * x + 200);

  // 将文本按单词分割并提取上下文
  words.forEach((word, index) => {
    const wordDifficulty = wordDictionary[word];
    if (wordDifficulty && wordDifficulty < difficulty) {
      // 提取上下文：前后各2个单词作为上下文
      const start = Math.max(0, index - 2);
      const end = Math.min(words.length, index + 3);
      const context = words.slice(start, end).join(' ');

      highDifficultyWords.push({ word, context });
    }
  });

  return highDifficultyWords;
}

// async function translateHighDifficultyWords(words: { word: string, context: string }[], options: MainConfig): Promise<{ [key: string]: string }> {
//   return await translateWord(words, options);
// }

export async function main(content: string, options: MainConfig): Promise<any> {
  const { difficulty, minLength } = options;

  // 提取高难度单词及其上下文
  const highDifficultyWords = extractHighDifficultyWords(content, difficulty, minLength);

  // 翻译高难度单词
  return await translateWord(highDifficultyWords, options);
}
