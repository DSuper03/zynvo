import { NextResponse } from 'next/server';

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

type TagRule = { tag: string; keywords: string[] };

const TAG_RULES: TagRule[] = [
  { tag: 'Web Dev 🌐', keywords: ['html', 'css', 'javascript', 'web development'] },
  { tag: 'App Dev 📱', keywords: ['android', 'ios', 'react native', 'flutter', 'mobile app'] },
  { tag: 'Frontend ✨', keywords: ['react', 'next.js', 'vue', 'angular', 'tailwind', 'frontend'] },
  { tag: 'Backend 💻', keywords: ['node.js', 'express', 'django', 'flask', 'spring boot', 'backend'] },
  { tag: 'Full Stack ⚡', keywords: ['full stack', 'mern', 'mean'] },
  { tag: 'Data Science 📈', keywords: ['data science', 'pandas', 'numpy', 'matplotlib', 'seaborn'] },
  { tag: 'Machine Learning 🧠', keywords: ['machine learning', 'scikit-learn', 'ml model'] },
  { tag: 'AI 🤖', keywords: ['artificial intelligence', 'ai', 'llm', 'prompt engineering'] },
  { tag: 'GenAI 🪄', keywords: ['generative ai', 'openai', 'langchain', 'rag'] },
  { tag: 'Cloud ☁️', keywords: ['aws', 'gcp', 'azure', 'cloud'] },
  { tag: 'DevOps ⚙️', keywords: ['devops', 'ci/cd', 'github actions', 'jenkins'] },
  { tag: 'Docker 🐳', keywords: ['docker', 'containerization'] },
  { tag: 'K8s 🚢', keywords: ['kubernetes', 'k8s'] },
  { tag: 'Cybersecurity 🔒', keywords: ['cybersecurity', 'penetration testing', 'owasp', 'security'] },
  { tag: 'Blockchain ⛓️', keywords: ['blockchain', 'ethereum', 'solidity', 'web3'] },
  { tag: 'UI/UX ✏️', keywords: ['ui/ux', 'ui ux', 'figma', 'wireframe', 'prototype'] },
  { tag: 'Product Management 📊', keywords: ['product management', 'roadmap', 'user stories'] },
  { tag: 'Public Speaking 🎤', keywords: ['public speaking', 'speaker', 'presentation'] },
  { tag: 'Competitive Programming 🥇', keywords: ['codeforces', 'leetcode', 'competitive programming'] },
  { tag: 'Open Source 🌍', keywords: ['open source', 'pull request', 'contributor'] },
  { tag: 'Hackathons ⏱️', keywords: ['hackathon', 'hackathons'] },
  { tag: 'Leadership 👑', keywords: ['team lead', 'leadership', 'coordinator', 'captain'] },
];

function normalizeForMatch(text: string) {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function keywordScore(haystack: string, keyword: string) {
  const normalizedKeyword = normalizeForMatch(keyword);
  if (!normalizedKeyword) return 0;
  if (!haystack.includes(normalizedKeyword)) return 0;
  const escaped = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'g');
  const matches = haystack.match(regex);
  return matches?.length || 1;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      resumeText?: string;
      existingTags?: string[];
    };

    const resumeText = cleanText(body.resumeText);
    if (!resumeText) {
      return NextResponse.json({ error: 'Missing resume text' }, { status: 400 });
    }

    const normalizedResume = normalizeForMatch(resumeText.slice(0, 16000));
    const existingTags = new Set(
      Array.isArray(body.existingTags)
        ? body.existingTags.map((t) => cleanText(t)).filter(Boolean)
        : []
    );

    const scored = TAG_RULES.map((rule) => {
      const score = rule.keywords.reduce(
        (sum, keyword) => sum + keywordScore(normalizedResume, keyword),
        0
      );
      return { tag: rule.tag, score };
    })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);

    const tags: string[] = [];
    for (const { tag } of scored) {
      if (tags.length >= 10) break;
      if (!existingTags.has(tag)) tags.push(tag);
    }

    return NextResponse.json({ tags });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to generate tags';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

