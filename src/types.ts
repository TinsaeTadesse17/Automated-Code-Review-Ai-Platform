export interface CodeReview {
  id: string;
  code: string;
  language: string;
  createdAt: Date;
  insights: ReviewInsight[];
}

export interface ReviewInsight {
  type: 'bug' | 'optimization' | 'standard';
  severity: 'low' | 'medium' | 'high';
  message: string;
  line?: number;
  suggestion?: string;
}

export interface PerformanceMetric {
  totalReviews: number;
  averageIssuesPerReview: number;
  mostCommonIssueType: string;
  improvementTrend: number;
}