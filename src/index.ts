import { MainConfig } from './types';
import { wordDictionary } from './dictionary/cefr';
import { translateWord } from './gpt-api/translate';
import nlp from 'compromise';

function preprocessText(text: string, minLength: number, useNLP: boolean = false): string[] {
  // 转换为小写，去除标点
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, '');  // 移除非字母字符

  const preprocessTextNLP = (text: string): string[] => {
    // 使用compromise库进行自然语言处理
    const doc = nlp(text);
    doc.normalize({
      whitespace: true,
      punctuation: true,
      case: false,
      parentheses: true,
      possessives: true,
      verbs: true
    });
    doc.nouns().toSingular();
    return doc.terms().out('array')
  }
  // 生成一个格式化前后的对照文本
  const preprocessTextNoNLP = (text: string): string[] => {
    return text.split(' ');
  }

  // 文本预处理
  const preprocessTexts: string[] = useNLP ? preprocessTextNLP(words) : preprocessTextNoNLP(words);
  // 去重并过滤短单词
  return Array.from(new Set(preprocessTexts)).filter(word => word.length >= minLength);
}

function extractHighDifficultyWords(text: string, difficultyThreshold: number, minLength: number): { word: string, context: string }[] {
  const words = preprocessText(text, minLength, true);
  const highDifficultyWords: { word: string, context: string }[] = [];
  
  // 将文本按单词分割并提取上下文
  words.forEach((word, index) => {
    const wordDifficulty = wordDictionary[word];
    if (wordDifficulty && wordDifficulty >= difficultyThreshold) {
      // 提取上下文：前后各2个单词作为上下文
      const start = Math.max(0, index - 2);
      const end = Math.min(words.length, index + 3);
      const context = words.slice(start, end).join(' ');
      
      highDifficultyWords.push({ word, context });
    }
  });
  console.log('🙆‍♂️🙆🙆‍♀️ ~ highDifficultyWords:', JSON.stringify(highDifficultyWords.map(item => item.word)))

  return highDifficultyWords;
}

export async function main(content: string, options: MainConfig): Promise<any> {
  const { difficulty, minLength } = options;

  // 提取高难度单词及其上下文
  const highDifficultyWords = extractHighDifficultyWords(content, difficulty, minLength);

  // 翻译高难度单词
  return await translateWord(highDifficultyWords, options);
}
