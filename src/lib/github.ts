/**
 * GitHub API utilities for Dialectic system
 */

export interface GitHubComment {
  id: number;
  author: {
    login: string;
    avatar_url: string;
  };
  body: string;
  body_html: string;
  created_at: string;
  labels: Array<{
    name: string;
    color: string;
  }>;
}

export interface GitHubDiscussion {
  id: number;
  number: number;
  title: string;
  url: string;
  comments_url: string;
  labels: Array<{
    name: string;
    color: string;
  }>;
}

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'Digidinc';
const REPO_NAME = 'shabrang';

/**
 * Fetch all discussions for the repository
 */
export async function fetchDiscussions(): Promise<GitHubDiscussion[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/discussions`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch discussions:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return [];
  }
}

/**
 * Find a discussion by page ID
 */
export async function findDiscussionByPageId(pageId: string): Promise<GitHubDiscussion | null> {
  const discussions = await fetchDiscussions();
  return discussions.find(d => d.title === pageId) || null;
}

/**
 * Fetch comments for a specific discussion
 */
export async function fetchDiscussionComments(discussionId: number): Promise<GitHubComment[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/discussions/${discussionId}/comments`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch comments:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

/**
 * Filter approved comments (those with "approved" label)
 */
export function filterApprovedComments(comments: GitHubComment[]): GitHubComment[] {
  return comments.filter(comment =>
    comment.labels?.some(label => label.name === 'approved')
  );
}

/**
 * Get approved comments for a specific page
 */
export async function getApprovedCommentsForPage(pageId: string): Promise<GitHubComment[]> {
  const discussion = await findDiscussionByPageId(pageId);

  if (!discussion) {
    return [];
  }

  const allComments = await fetchDiscussionComments(discussion.id);
  return filterApprovedComments(allComments);
}

/**
 * Generate GitHub discussion URL for a page
 */
export function getDiscussionUrl(pageId: string, pageTitle: string): string {
  const encodedTitle = encodeURIComponent(pageTitle);
  return `https://github.com/${REPO_OWNER}/${REPO_NAME}/discussions/new?title=${pageId}&body=${encodedTitle}`;
}

/**
 * Determine dialectic label (thesis/antithesis/synthesis) from comment
 */
export function getDialecticLabel(comment: GitHubComment): 'thesis' | 'antithesis' | 'synthesis' | null {
  const labels = comment.labels?.map(l => l.name) || [];

  if (labels.includes('thesis')) return 'thesis';
  if (labels.includes('antithesis')) return 'antithesis';
  if (labels.includes('synthesis')) return 'synthesis';

  return null;
}
