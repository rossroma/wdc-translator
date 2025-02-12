import { MainConfig } from './types';
import { wordDictionary } from './dictionary/cefr';
import { translateWord } from './gpt-api/translate';
import nlp from 'compromise';

function preprocessText(text: string, minLength: number): string[] {
  const words = text.replace(/[^a-zA-Z\s]/g, '');  // 移除非字母字符

  const preprocessTextNLP = (text: string): string[] => {
    // 使用compromise库进行自然语言处理
    const doc = nlp(text.toLowerCase());
    doc.normalize({
      whitespace: true,
      punctuation: true,
      parentheses: true,
      possessives: true,
      verbs: true
    });
    doc.nouns().toSingular();
    return doc.terms().out('array');
  }

  // 文本预处理
  const preprocessTexts: string[] = preprocessTextNLP(words);
  // 去重并过滤短单词
  return Array.from(new Set(preprocessTexts)).filter(word => word.length >= minLength);
}

function extractHighDifficultyWords(text: string, difficultyThreshold: number, minLength: number): { word: string, context: string }[] {
  const words = preprocessText(text, minLength);
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
