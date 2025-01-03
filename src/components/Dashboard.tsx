import React from 'react';
import { BarChart, Activity, CheckCircle } from 'lucide-react';
import type { PerformanceMetric } from '../types';

interface DashboardProps {
  metrics: PerformanceMetric;
}

export function Dashboard({ metrics }: DashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <BarChart className="text-blue-500" />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Reviews</h3>
            <p className="text-2xl font-semibold">{metrics.totalReviews}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <Activity className="text-green-500" />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Avg Issues/Review</h3>
            <p className="text-2xl font-semibold">{metrics.averageIssuesPerReview}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <CheckCircle className="text-purple-500" />
          <div>
            <h3 className="text-sm font-medium text-gray-500">Improvement</h3>
            <p className="text-2xl font-semibold">
              {metrics.improvementTrend > 0 ? '+' : ''}{metrics.improvementTrend}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}