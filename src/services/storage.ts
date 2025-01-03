import type { CodeReview } from '../types';

const STORAGE_KEY = 'code_reviews';

export function saveReview(review: CodeReview): void {
  const reviews = getReviews();
  reviews.unshift(review);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

export function getReviews(): CodeReview[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getMetrics() {
  const reviews = getReviews();
  
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageIssuesPerReview: 0,
      mostCommonIssueType: 'N/A',
      improvementTrend: 0
    };
  }

  const totalIssues = reviews.reduce((sum, review) => sum + review.insights.length, 0);
  const issueTypes = reviews.flatMap(review => 
    review.insights.map(insight => insight.type)
  );
  
  const typeCounts = issueTypes.reduce((acc: Record<string, number>, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const mostCommonType = Object.entries(typeCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

  // Calculate improvement trend based on average issues per review
  // comparing the first half with the second half of reviews
  const midPoint = Math.floor(reviews.length / 2);
  const recentReviews = reviews.slice(0, midPoint);
  const olderReviews = reviews.slice(midPoint);
  
  const recentAvg = recentReviews.length > 0
    ? recentReviews.reduce((sum, review) => sum + review.insights.length, 0) / recentReviews.length
    : 0;
  
  const olderAvg = olderReviews.length > 0
    ? olderReviews.reduce((sum, review) => sum + review.insights.length, 0) / olderReviews.length
    : 0;

  const improvementTrend = olderAvg !== 0
    ? Math.round(((olderAvg - recentAvg) / olderAvg) * 100)
    : 0;

  return {
    totalReviews: reviews.length,
    averageIssuesPerReview: totalIssues / reviews.length,
    mostCommonIssueType: mostCommonType,
    improvementTrend
  };
}