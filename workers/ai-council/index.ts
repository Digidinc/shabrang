/**
 * Shabrang AI Council - Comment Moderation Worker
 *
 * Uses Cloudflare Workers AI (Llama 3 8B) to moderate GitHub Discussion comments
 * based on dialectic principles (thesis/antithesis/synthesis).
 */

interface Env {
  AI: any;
  GITHUB_TOKEN: string;
  GITHUB_WEBHOOK_SECRET?: string;
  REPO_OWNER: string;
  REPO_NAME: string;
}

interface ModerateRequest {
  comment: string;
  author: string;
  pageId: string;
  commentId?: number;
  discussionId?: number;
}

interface ModerateResponse {
  decision: 'approved' | 'pending' | 'rejected';
  reason: string;
  confidence: number;
  suggestedLabels?: string[];
}

const MODERATION_PROMPT = `You are the AI Council for the Shabrang dialectic system, moderating comments on a cultural preservation project about Persian philosophy and identity.

Your role is to evaluate comments based on these criteria:

**APPROVE if the comment:**
- Adds a new perspective (thesis, antithesis, or synthesis)
- Presents respectful disagreement with evidence
- Shares cultural insight or personal/family stories
- Asks questions that deepen understanding
- References sources or lived experience
- Engages with opposing views constructively

**REJECT if the comment:**
- Contains hate speech, racism, sexism, homophobia
- Is spam or commercial advertising
- Is off-topic (not related to the page content)
- Contains personal attacks on other commenters
- Spreads disinformation without sources

**PENDING REVIEW if the comment:**
- Makes complex theological/political claims
- Has borderline relevance to the topic
- Has unclear intent or ambiguous meaning
- Your confidence is below 80%

The dialectic has three voices:
- **Kasra (thesis)**: Scientific, technical, logical perspective
- **River (antithesis)**: Mystic, poetic, symbolic perspective
- **Shabrang (synthesis)**: Integration of both perspectives

For approved comments, suggest dialectic labels: "thesis", "antithesis", or "synthesis".

Respond in JSON format:
{
  "decision": "approved" | "pending" | "rejected",
  "reason": "Brief explanation of your decision",
  "confidence": 0.0-1.0,
  "suggestedLabels": ["approved", "thesis"] // only if approved
}`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // Route: GET /health - check worker status
    if (request.method === 'GET' && url.pathname === '/health') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          hasGitHubToken: !!env.GITHUB_TOKEN,
          tokenLength: env.GITHUB_TOKEN ? env.GITHUB_TOKEN.length : 0,
          repoOwner: env.REPO_OWNER,
          repoName: env.REPO_NAME,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Route: GET /comments?pageId={pageId}
    if (request.method === 'GET' && url.pathname === '/comments') {
      return handleGetComments(url, env, corsHeaders);
    }

    // Route: POST /moderate (existing moderation endpoint)
    if (request.method === 'POST' && url.pathname === '/moderate') {
      return handleModerate(request, env, corsHeaders);
    }

    // Default route for backward compatibility
    if (request.method === 'POST') {
      return handleModerate(request, env, corsHeaders);
    }

    return new Response('Not found', {
      status: 404,
      headers: corsHeaders,
    });
  },
};

async function handleGetComments(
  url: URL,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const pageId = url.searchParams.get('pageId');

    if (!pageId) {
      return new Response(
        JSON.stringify({ error: 'Missing pageId parameter' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch issues from GitHub
    const token = (env.GITHUB_TOKEN || '').replace(/\s+/g, '');
    const issuesResponse = await fetch(
      `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/issues?state=all&per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${token}`,
          'User-Agent': 'Shabrang-AI-Council',
        },
      }
    );

    if (!issuesResponse.ok) {
      throw new Error(`GitHub API error: ${issuesResponse.status}`);
    }

    const issues = await issuesResponse.json() as any[];

    // Find issue matching pageId with 'dialectic' label
    const issue = issues.find((i: any) =>
      i.title === pageId &&
      i.labels?.some((l: any) => l.name === 'dialectic')
    );

    if (!issue) {
      return new Response(
        JSON.stringify({ comments: [], issue: null }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch comments for this issue
    const commentsResponse = await fetch(
      `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/issues/${issue.number}/comments`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${token}`,
          'User-Agent': 'Shabrang-AI-Council',
        },
      }
    );

    if (!commentsResponse.ok) {
      throw new Error(`GitHub API error: ${commentsResponse.status}`);
    }

    const comments = await commentsResponse.json();

    return new Response(
      JSON.stringify({
        comments,
        issue: {
          number: issue.number,
          title: issue.title,
          labels: issue.labels,
          html_url: issue.html_url,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error fetching comments:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch comments',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

async function handleModerate(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const body = await request.json() as ModerateRequest;

      if (!body.comment || !body.author || !body.pageId) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: comment, author, pageId' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Prepare the AI prompt
      const userPrompt = `
Page ID: ${body.pageId}
Author: ${body.author}
Comment:
${body.comment}

Evaluate this comment and respond in JSON format.`;

      // Call Cloudflare Workers AI (Llama 3 8B)
      const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
        messages: [
          { role: 'system', content: MODERATION_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent moderation
        max_tokens: 500,
      });

      // Parse AI response
      let result: ModerateResponse;
      try {
        const aiText = aiResponse.response || aiResponse.text || '';
        // Extract JSON from response (AI might wrap it in markdown code blocks)
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in AI response');
        }
        result = JSON.parse(jsonMatch[0]);

        // Validate and normalize the response
        if (!['approved', 'pending', 'rejected'].includes(result.decision)) {
          result.decision = 'pending'; // Default to pending if decision is unclear
        }

        result.confidence = Math.max(0, Math.min(1, result.confidence || 0.5));

        // Ensure suggestedLabels includes the decision
        if (result.decision === 'approved' && result.suggestedLabels) {
          if (!result.suggestedLabels.includes('approved')) {
            result.suggestedLabels.unshift('approved');
          }
        }

      } catch (parseError) {
        console.error('Failed to parse AI response:', aiResponse);
        // Fallback to pending review if AI response is unclear
        result = {
          decision: 'pending',
          reason: 'AI response was unclear, requires human review',
          confidence: 0.3,
        };
      }

      // If confidence is low, default to pending review
      if (result.confidence < 0.7 && result.decision === 'approved') {
        result.decision = 'pending';
        result.reason = `${result.reason} (Low confidence - requires human review)`;
      }

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in moderation:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}
