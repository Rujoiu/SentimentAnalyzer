import { useState } from 'react';
import { analyzeSentiment } from './utils/sentimentAnalyzer';
import { MessageSquare, RefreshCw, Send, AlertCircle } from 'lucide-react';
import type { SentimentResult } from './utils/sentimentAnalyzer';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeSentiment(text);
      setResult(result);
    } catch (err) {
      setError('Failed to analyze sentiment. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-200 to-indigo-400 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            AI Sentiment Analyzer
          </h1>
          <p className="text-gray-600">
            Powered by OpenAI to analyze the emotional tone of your text
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text here..."
              className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={handleAnalyze}
              disabled={!text.trim() || isAnalyzing}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              Analyze
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-gray-50 rounded-lg p-6 animate-fade-in">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{result.emoji}</span>
                <div>
                  <h3 className={`text-xl font-semibold capitalize ${result.color}`}>
                    {result.sentiment}
                  </h3>
                  <p className="text-gray-600">
                    Sentiment Score: {result.score.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-gray-600">
                <MessageSquare className="w-5 h-5 mt-1 flex-shrink-0" />
                <p>{result.explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;