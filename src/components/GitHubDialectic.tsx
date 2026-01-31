'use client';

/**
 * GitHubDialectic - Displays approved comments from GitHub Discussions
 *
 * This component shows the dialectic conversation (thesis/antithesis/synthesis)
 * for a specific page by fetching comments from GitHub Discussions API.
 */

import { useState, useEffect, useMemo } from 'react';
import sanitizeHtml from 'sanitize-html';
import type { GitHubComment } from '@/lib/github';
import { getDialecticLabel } from '@/lib/github';

interface GitHubDialecticProps {
  pageId: string;
  pageTitle: string;
  discussionNumber?: number;
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p', 'br', 'strong', 'em', 'del', 'a', 'code', 'pre',
    'ul', 'ol', 'li', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
};

export function GitHubDialectic({ pageId, pageTitle, discussionNumber }: GitHubDialecticProps) {
  const [comments, setComments] = useState<GitHubComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadComments() {
      try {
        setLoading(true);
        setError(null);

        // Fetch comments from Cloudflare Worker (proxies GitHub API)
        const workerUrl = process.env.NEXT_PUBLIC_AI_COUNCIL_URL || 'https://shabrang-ai-council.weathered-scene-2272.workers.dev';
        const response = await fetch(
          `${workerUrl}/comments?pageId=${encodeURIComponent(pageId)}`,
          {
            headers: {
              'Accept': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch comments from worker');
        }

        const data = await response.json();

        if (!data.issue) {
          setComments([]);
          setLoading(false);
          return;
        }

        // Show all comments (moderation handles filtering)
        setComments(data.comments || []);
      } catch (err) {
        console.error('Error loading comments:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadComments();
  }, [pageId]);

  const issueUrl = discussionNumber
    ? `https://github.com/Digidinc/shabrang/issues/${discussionNumber}`
    : `https://github.com/Digidinc/shabrang/issues/new?title=${encodeURIComponent(pageId)}&body=${encodeURIComponent(`Comments for: ${pageTitle}\n\nPlease read the dialectic guide before commenting:\nhttps://github.com/Digidinc/shabrang/blob/main/docs/DIALECTIC_GUIDE.md\n\nLabel your perspective: [Kasra], [River], or [Synthesis]`)}`;

  return (
    <aside className="dialectic-panel border-l-2 border-shabrang-gold p-6 bg-shabrang-parchment/30 min-h-screen">
      <div className="sticky top-6">
        <div className="mb-6">
          <h3 className="font-display text-shabrang-gold text-sm uppercase tracking-widest mb-2">
            The Dialectic
          </h3>
          <p className="text-xs text-shabrang-ink-dim italic leading-relaxed">
            Thesis • Antithesis • Synthesis
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-shabrang-gold"></div>
            <p className="text-shabrang-ink-dim text-sm mt-3">Loading voices...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-shabrang-crimson text-sm">
              Failed to load comments. Please try refreshing.
            </p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 border-2 border-shabrang-teal/30 p-6">
            <p className="text-shabrang-ink-dim text-sm italic mb-4">
              No voices yet in this dialectic.
            </p>
            <p className="text-shabrang-ink-dim text-xs">
              Be the first to contribute a perspective.
            </p>
          </div>
        ) : (
          <div className="space-y-6 mb-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {comments.map(comment => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        )}

        <a
          href={issueUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block w-full px-4 py-3 bg-shabrang-gold text-shabrang-ink text-center font-display text-xs uppercase tracking-widest hover:bg-shabrang-teal hover:text-shabrang-parchment transition-all duration-200 border-2 border-shabrang-gold hover:border-shabrang-teal"
        >
          Add Your Voice
        </a>

        <div className="mt-4 text-xs text-shabrang-ink-dim text-center space-y-2">
          <p className="italic">
            Comments reviewed by AI council before appearing
          </p>
          <a
            href="https://github.com/Digidinc/shabrang/blob/main/docs/DIALECTIC_GUIDE.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-shabrang-teal hover:text-shabrang-gold transition-colors inline-flex items-center gap-1"
          >
            Read the guide
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </aside>
  );
}

function CommentCard({ comment }: { comment: GitHubComment }) {
  // Determine dialectic label from comment text
  // AI moderation adds labels to the issue, but we also do client-side detection
  const commentText = comment.body.toLowerCase();
  let dialecticLabel: 'thesis' | 'antithesis' | 'synthesis' | null = null;

  if (commentText.includes('[synthesis]') || commentText.includes('synthesis') || commentText.includes('both')) {
    dialecticLabel = 'synthesis';
  } else if (commentText.includes('[kasra]') || commentText.includes('scientific') || commentText.includes('technical')) {
    dialecticLabel = 'thesis';
  } else if (commentText.includes('[river]') || commentText.includes('mystic') || commentText.includes('poetic')) {
    dialecticLabel = 'antithesis';
  }

  // Sanitize HTML from GitHub to prevent XSS
  const sanitizedHtml = useMemo(() => {
    const html = comment.body_html || comment.body;
    return sanitizeHtml(html, SANITIZE_OPTIONS);
  }, [comment.body_html, comment.body]);

  const labelColors = {
    thesis: 'bg-shabrang-teal/20 text-shabrang-teal border-shabrang-teal',
    antithesis: 'bg-shabrang-gold/20 text-shabrang-gold border-shabrang-gold',
    synthesis: 'bg-shabrang-crimson/20 text-shabrang-crimson border-shabrang-crimson',
  };

  const labelIcons = {
    thesis: '◇', // Diamond for Kasra (scientific)
    antithesis: '◎', // Circle for River (mystic)
    synthesis: '◆', // Filled diamond for Shabrang (integration)
  };

  return (
    <div className="comment-card border-l-2 border-shabrang-teal/30 pl-4 py-2">
      {dialecticLabel && (
        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] uppercase tracking-wider font-display border ${labelColors[dialecticLabel]} mb-3`}>
          <span>{labelIcons[dialecticLabel]}</span>
          <span>{dialecticLabel}</span>
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <img
          src={comment.author.avatar_url}
          alt={comment.author.login}
          className="w-8 h-8 rounded-full border border-shabrang-gold/30"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <p className="text-sm font-medium text-shabrang-ink">
              {comment.author.login}
            </p>
            <p className="text-xs text-shabrang-ink-dim">
              {new Date(comment.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      <div
        className="text-sm text-shabrang-ink-dim leading-relaxed prose prose-sm prose-invert max-w-none
          prose-p:my-2 prose-a:text-shabrang-teal prose-a:hover:text-shabrang-gold
          prose-strong:text-shabrang-ink prose-em:text-shabrang-ink-dim
          prose-code:text-shabrang-gold prose-code:bg-shabrang-ink/10 prose-code:px-1 prose-code:rounded"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </div>
  );
}
