import React from 'react';
import { AlertCircle, Zap, Book } from 'lucide-react';
import type { ReviewInsight } from '../types';

interface ReviewInsightsProps {
  insights: ReviewInsight[];
}

export function ReviewInsights({ insights }: ReviewInsightsProps) {
  const getIcon = (type: ReviewInsight['type']) => {
    switch (type) {
      case 'bug':
        return <AlertCircle className="text-red-500" />;
      case 'optimization':
        return <Zap className="text-yellow-500" />;
      case 'standard':
        return <Book className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-start gap-3">
            {getIcon(insight.type)}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold capitalize">{insight.type}</span>
                <span className={`
                  px-2 py-1 rounded-full text-xs
                  ${insight.severity === 'high' ? 'bg-red-100 text-red-800' :
                    insight.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'}
                `}>
                  {insight.severity}
                </span>
              </div>
              <p className="mt-1 text-gray-600">{insight.message}</p>
              {insight.suggestion && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                  <span className="text-gray-500">Suggestion: </span>
                  {insight.suggestion}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}