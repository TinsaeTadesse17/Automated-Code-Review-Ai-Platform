import React, { useState, useEffect } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { ReviewInsights } from './components/ReviewInsights';
import { Dashboard } from './components/Dashboard';
import { Code2, History, AlertCircle, Loader2 } from 'lucide-react';
import type { CodeReview, ReviewInsight, PerformanceMetric } from './types';
import { analyzeCode } from './services/gemini';
import { saveReview, getReviews, getMetrics } from './services/storage';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [activeTab, setActiveTab] = useState<'review' | 'history'>('review');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<ReviewInsight[]>([]);
  const [reviews, setReviews] = useState<CodeReview[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetric>(getMetrics());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setReviews(getReviews());
    setMetrics(getMetrics());
  }, []);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setInsights([]);

    try {
      const result = await analyzeCode(code, language);
      setInsights(result.insights);

      const review: CodeReview = {
        id: crypto.randomUUID(),
        code,
        language,
        createdAt: new Date(),
        insights: result.insights
      };

      saveReview(review);
      setReviews(getReviews());
      setMetrics(getMetrics());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Code2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold">CodeReview AI</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => {
              setActiveTab('review');
              setError(null);
            }}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'review'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Code2 className="mr-2 h-5 w-5" />
            New Review
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              setError(null);
            }}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <History className="mr-2 h-5 w-5" />
            History
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {activeTab === 'review' ? (
          <div className="space-y-8">
            <CodeEditor
              code={code}
              language={language}
              onChange={setCode}
              onLanguageChange={setLanguage}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
            
            {isAnalyzing && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <span className="ml-3 text-lg text-gray-600">Analyzing code...</span>
              </div>
            )}
            
            {insights.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Review Insights</h2>
                <ReviewInsights insights={insights} />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <Dashboard metrics={metrics} />
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Recent Reviews</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {reviews.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No code reviews yet. Start by analyzing some code!
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">
                            {review.insights.length} issues found
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()} {new Date(review.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                          {review.language}
                        </span>
                      </div>
                      <div className="mt-2">
                        <pre className="text-sm bg-gray-50 p-2 rounded overflow-x-auto">
                          <code>{review.code.slice(0, 100)}...</code>
                        </pre>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;