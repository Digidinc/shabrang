/**
 * API Route: /api/dialectic/comments
 *
 * Fetches approved comments for a page from GitHub Discussions
 * This server-side route avoids CORS issues with GitHub API
 */

import { NextRequest, NextResponse } from 'next/server';
import { getApprovedCommentsForPage } from '@/lib/github';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pageId = searchParams.get('pageId');

  if (!pageId) {
    return NextResponse.json(
      { error: 'pageId parameter is required' },
      { status: 400 }
    );
  }

  try {
    const comments = await getApprovedCommentsForPage(pageId);

    return NextResponse.json(
      { comments },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments', comments: [] },
      { status: 500 }
    );
  }
}
