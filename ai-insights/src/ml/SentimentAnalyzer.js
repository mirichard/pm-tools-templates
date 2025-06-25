/**
 * Sentiment Analyzer
 * Analyzes stakeholder sentiment from communications
 */

import Sentiment from 'sentiment';
import { logger } from '../utils/logger.js';

export class SentimentAnalyzer {
  constructor() {
    this.sentiment = new Sentiment();
  }

  async analyze(textData) {
    try {
      if (typeof textData === 'string') {
        textData = [textData];
      }

      const results = textData.map(text => {
        const result = this.sentiment.analyze(text);
        return {
          text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
          score: result.score,
          comparative: result.comparative,
          sentiment: this.categorizesentiment(result.comparative),
          positive: result.positive,
          negative: result.negative
        };
      });

      const overallSentiment = this.calculateOverallSentiment(results);

      return {
        overall: overallSentiment,
        individual: results,
        summary: {
          totalAnalyzed: results.length,
          positiveCount: results.filter(r => r.sentiment === 'positive').length,
          neutralCount: results.filter(r => r.sentiment === 'neutral').length,
          negativeCount: results.filter(r => r.sentiment === 'negative').length
        }
      };

    } catch (error) {
      logger.error('❌ Sentiment analysis failed:', error);
      throw error;
    }
  }

  categorizesentiment(comparative) {
    if (comparative > 0.1) return 'positive';
    if (comparative < -0.1) return 'negative';
    return 'neutral';
  }

  calculateOverallSentiment(results) {
    const avgComparative = results.reduce((sum, r) => sum + r.comparative, 0) / results.length;
    return {
      score: avgComparative,
      sentiment: this.categorizesentiment(avgComparative),
      confidence: Math.abs(avgComparative)
    };
  }
}

