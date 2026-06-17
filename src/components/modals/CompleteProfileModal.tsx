'use client';

import { useRef, useState } from 'react';
import { X, Sparkles, FileText, Loader2, CheckCircle2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ProfileForm = {
  bio: string;
  course: string;
  year: string;
  tags: string;
  collegeName: string;
  twitter: string;
  instagram: string;
  linkedin: string;
};

export interface CompleteProfileModalProps {
  open: boolean;
  onClose: () => void;
  profileForm: ProfileForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onProfileFormPatch: (patch: Partial<ProfileForm>) => void;
  onSubmit: (e: React.FormEvent) => void;
  selectedPredefinedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

async function extractTextFromPdf(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();

  const loadingTask = pdfjsLib.getDocument({ data: bytes });
  const pdf = await loadingTask.promise;
  const chunks: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => ('str' in item ? String(item.str) : ''))
      .join(' ');
    chunks.push(pageText);
  }

  return chunks.join('\n').trim();
}

async function extractResumeText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (file.type === 'application/pdf' || name.endsWith('.pdf')) {
    return extractTextFromPdf(file);
  }
  return (await file.text()).trim();
}

type TagRule = { tag: string; keywords: string[] };

const RESUME_TAG_RULES: TagRule[] = [
  { tag: 'Web Dev 🌐',             keywords: ['html', 'css', 'web development', 'javascript', 'typescript', 'web app', 'website'] },
  { tag: 'Frontend ✨',            keywords: ['react', 'next.js', 'nextjs', 'vue', 'angular', 'svelte', 'tailwind', 'frontend', 'sass', 'webpack', 'vite', 'shadcn'] },
  { tag: 'Backend 💻',             keywords: ['node.js', 'nodejs', 'express', 'django', 'flask', 'fastapi', 'spring', 'laravel', 'rails', 'backend', 'rest api', 'graphql', 'java', 'golang', 'rust', 'php'] },
  { tag: 'Full Stack ⚡',          keywords: ['full stack', 'fullstack', 'mern', 'mean', 'mevn', 'full-stack'] },
  { tag: 'App Dev 📱',             keywords: ['android', 'ios', 'react native', 'flutter', 'swift', 'kotlin', 'mobile app', 'mobile development', 'expo'] },
  { tag: 'Data Science 📈',        keywords: ['data science', 'pandas', 'numpy', 'matplotlib', 'seaborn', 'data analysis', 'data analyst', 'tableau', 'power bi', 'excel', 'r programming', 'statistics', 'data visualization'] },
  { tag: 'Machine Learning 🧠',    keywords: ['machine learning', 'scikit-learn', 'sklearn', 'tensorflow', 'pytorch', 'keras', 'neural network', 'deep learning', 'ml model', 'nlp', 'computer vision', 'xgboost', 'random forest', 'regression', 'classification'] },
  { tag: 'AI 🤖',                  keywords: ['artificial intelligence', ' ai ', 'llm', 'large language model', 'prompt engineering', 'openai', 'chatgpt', 'gemini', 'mistral', 'hugging face', 'transformers'] },
  { tag: 'GenAI 🪄',               keywords: ['generative ai', 'gen ai', 'langchain', 'rag', 'vector database', 'pinecone', 'stable diffusion', 'midjourney', 'fine-tuning', 'fine tuning'] },
  { tag: 'Cloud ☁️',               keywords: ['aws', 'amazon web services', 'gcp', 'google cloud', 'azure', 'cloud computing', 'vercel', 'netlify', 's3', 'lambda', 'ec2', 'firebase'] },
  { tag: 'DevOps ⚙️',              keywords: ['devops', 'ci/cd', 'github actions', 'jenkins', 'terraform', 'ansible', 'pipeline', 'devsecops'] },
  { tag: 'Docker 🐳',              keywords: ['docker', 'containerization', 'container', 'dockerfile'] },
  { tag: 'K8s 🚢',                 keywords: ['kubernetes', 'k8s', 'helm', 'kubectl'] },
  { tag: 'Cybersecurity 🔒',       keywords: ['cybersecurity', 'penetration testing', 'pentest', 'owasp', 'security', 'ethical hacking', 'ctf', 'vulnerability', 'kali', 'metasploit', 'burp suite'] },
  { tag: 'CTF 🕵️',                 keywords: ['capture the flag', 'ctf challenge', 'pwn', 'reverse engineering', 'binary exploitation'] },
  { tag: 'Blockchain ⛓️',          keywords: ['blockchain', 'ethereum', 'solidity', 'web3', 'smart contract', 'defi', 'nft', 'cryptocurrency', 'polygon'] },
  { tag: 'Databases 🗄️',           keywords: ['sql', 'mysql', 'postgresql', 'mongodb', 'database', 'redis', 'sqlite', 'nosql', 'firebase', 'supabase', 'prisma', 'orm'] },
  { tag: 'UI/UX ✏️',               keywords: ['ui/ux', 'ui ux', 'figma', 'wireframe', 'prototype', 'user experience', 'user interface', 'adobe xd', 'sketch', 'design system', 'usability'] },
  { tag: 'Design 🎨',              keywords: ['graphic design', 'photoshop', 'illustrator', 'canva', 'after effects', 'branding', 'logo design', 'typography'] },
  { tag: 'Game Dev 🎮',            keywords: ['game development', 'unity', 'unreal engine', 'godot', 'game design', 'opengl', 'pygame'] },
  { tag: 'Open Source 🌍',         keywords: ['open source', 'pull request', 'contributor', 'github contributor', 'hacktoberfest', 'gssoc', 'gsoc'] },
  { tag: 'Competitive Programming 🥇', keywords: ['codeforces', 'leetcode', 'codechef', 'competitive programming', 'atcoder', 'topcoder', 'icpc', 'olympiad'] },
  { tag: 'System Design 🏗️',       keywords: ['system design', 'distributed systems', 'microservices', 'scalability', 'load balancer', 'caching'] },
  { tag: 'Product Management 📊',  keywords: ['product management', 'product manager', 'roadmap', 'user stories', 'agile', 'scrum', 'sprint', 'jira', 'backlog', 'kpis'] },
  { tag: 'Public Speaking 🎤',     keywords: ['public speaking', 'speaker', 'presentation', 'ted', 'toastmasters', 'keynote'] },
  { tag: 'Leadership 👑',          keywords: ['team lead', 'leadership', 'coordinator', 'captain', 'president', 'vice president', 'club lead', 'head of', 'organized', 'managed a team'] },
  { tag: 'Entrepreneurship 🚀',    keywords: ['startup', 'entrepreneur', 'co-founder', 'founder', 'venture', 'bootstrapped', 'incubator'] },
  { tag: 'Hackathons ⏱️',          keywords: ['hackathon', 'hack', '24-hour', '36-hour', '48-hour', 'winner', 'runner-up', 'smart india hackathon', 'sih'] },
  { tag: 'Content Creator 📣',     keywords: ['content creation', 'youtube', 'instagram creator', 'blog', 'newsletter', 'social media'] },
  { tag: 'Writing ✍️',             keywords: ['technical writing', 'copywriting', 'article', 'editor', 'journalist', 'author'] },
  { tag: 'Marketing 📢',           keywords: ['marketing', 'seo', 'sem', 'google ads', 'social media marketing', 'branding', 'campaigns', 'growth hacking'] },
  { tag: 'IOT 🌐🔧',               keywords: ['iot', 'internet of things', 'arduino', 'raspberry pi', 'embedded', 'firmware', 'sensors'] },
  { tag: 'Robotics 🤖🔧',          keywords: ['robotics', 'ros', 'servo', 'actuator', 'autonomous', 'drone'] },
  { tag: 'AR/VR 🥽',               keywords: ['augmented reality', 'virtual reality', 'ar/vr', 'mixed reality', 'meta quest', 'arkit', 'arcore'] },
];

function matchTagsFromResume(resumeText: string, existingTags: Set<string>): string[] {
  const lower = resumeText.toLowerCase().slice(0, 16000);
  const scored = RESUME_TAG_RULES.map(({ tag, keywords }) => {
    const score = keywords.reduce((sum, kw) => {
      const idx = lower.indexOf(kw);
      if (idx === -1) return sum;
      // Count non-overlapping occurrences
      let count = 0;
      let pos = 0;
      while ((pos = lower.indexOf(kw, pos)) !== -1) { count++; pos += kw.length; }
      return sum + count;
    }, 0);
    return { tag, score };
  })
    .filter((x) => x.score > 0 && !existingTags.has(x.tag))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 10).map((x) => x.tag);
}

const TAG_CATEGORIES: { label: string; tags: string[] }[] = [
  {
    label: '💻 Tech',
    tags: [
      'AI 🤖', 'Web Dev 🌐', 'App Dev 📱', 'Backend 💻', 'Frontend ✨',
      'Full Stack ⚡', 'DevOps ⚙️', 'Cloud ☁️', 'Docker 🐳', 'K8s 🚢',
      'Cybersecurity 🔒', 'Blockchain ⛓️', 'Data Science 📈', 'Machine Learning 🧠',
      'GenAI 🪄', 'AR/VR 🥽', 'Game Dev 🎮', 'IOT 🌐🔧', 'Web3 🪙',
      'Open Source 🌍', 'Hackathons ⏱️', 'LeetCode 🧩', 'Competitive Programming 🥇',
      'System Design 🏗️', 'Databases 🗄️', 'APIs 🔗', 'Robotics 🤖🔧',
      'CTF 🕵️', 'FinTech 💸', 'NoCode/LowCode 🧩',
    ],
  },
  {
    label: '🎨 Creative',
    tags: [
      'UI/UX ✏️', 'Design 🎨', 'Photography 📸', 'Video Editing ✂️',
      'Digital Art 🖌️', 'Content Creator 📣', 'Writing ✍️', 'Podcasting 🎙️',
      'Motion Graphics 🎞️', 'Cinematography 🎬', 'Music 🎵', 'Dance 🕺',
      'Theatre 🎭', 'Fashion 👗', 'Painter 🎨', 'Photographer 📷',
    ],
  },
  {
    label: '📣 Soft Skills',
    tags: [
      'Public Speaking 🎤', 'Leadership 👑', 'Debate 🗣️', 'Marketing 📢',
      'Entrepreneurship 🚀', 'Startup Builder 🧪', 'Product Management 📊',
      'Community ⚡', 'Volunteering 🤝', 'Mentor 🎓', 'Event Ops 🎪',
      'Growth 📈', 'Sales 💼',
    ],
  },
  {
    label: '🏋️ Lifestyle',
    tags: [
      'Fitness 🏋️', 'Sports ⚽', 'Esports 🕹️', 'Gym Rat 🏋️', 'Yoga 🧘',
      'Travel ✈️', 'Foodie 🍜', 'Coffee ☕', 'Reading 📚', 'Anime 🍥',
      'Manga 📖', 'Mindfulness 🧘', 'Night Owl 🌙', 'Early Bird 🌅',
      'Gamer 🎮', 'Chess Player ♟️', 'Hiker ⛰️', 'Cyclist 🚴',
    ],
  },
];

const ALL_PREDEFINED_TAGS = TAG_CATEGORIES.flatMap((c) => c.tags);

const TagSelector = ({
  selectedTags,
  onTagsChange,
}: {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState('');
  const customInputRef = useRef<HTMLInputElement>(null);

  const toggleTag = (tag: string) => {
    onTagsChange(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag]
    );
  };

  const removeTag = (tag: string) => {
    onTagsChange(selectedTags.filter((t) => t !== tag));
  };

  const addCustomTag = () => {
    const cleaned = customInput.trim();
    if (!cleaned || selectedTags.includes(cleaned)) {
      setCustomInput('');
      return;
    }
    onTagsChange([...selectedTags, cleaned]);
    setCustomInput('');
    customInputRef.current?.focus();
  };

  const visibleCategories = searchTerm
    ? [{
        label: '🔍 Results',
        tags: ALL_PREDEFINED_TAGS.filter((t) =>
          t.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }]
    : activeCategory
    ? TAG_CATEGORIES.filter((c) => c.label === activeCategory)
    : TAG_CATEGORIES;

  return (
    <div className="space-y-3">
      {/* Selected chips */}
      {selectedTags.length > 0 && (
        <div>
          <p className="text-xs font-medium text-neutral-400 mb-1.5">
            Selected ({selectedTags.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-400/15 border border-yellow-400/40 text-yellow-300"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-yellow-100 ml-0.5 leading-none"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => onTagsChange([])}
              className="text-[10px] text-neutral-500 hover:text-red-400 transition-colors self-center ml-1"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="Search tags..."
        value={searchTerm}
        onChange={(e) => { setSearchTerm(e.target.value); setActiveCategory(null); }}
        className="w-full px-3 py-2 bg-neutral-900/60 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 focus:border-transparent text-xs"
      />

      {/* Category pills — hidden while searching */}
      {!searchTerm && (
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
              activeCategory === null
                ? 'bg-yellow-400 text-black'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            All
          </button>
          {TAG_CATEGORIES.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => setActiveCategory(activeCategory === c.label ? null : c.label)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                activeCategory === c.label
                  ? 'bg-yellow-400 text-black'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {/* Tag grid */}
      <div className="max-h-52 overflow-y-auto rounded-lg border border-neutral-800 bg-neutral-950/50 p-2.5 space-y-3">
        {visibleCategories.map((cat) =>
          cat.tags.length === 0 ? null : (
            <div key={cat.label}>
              {!searchTerm && (
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1.5 px-0.5">
                  {cat.label}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {cat.tags.map((tag) => {
                  const selected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 border ${
                        selected
                          ? 'bg-yellow-400 text-black border-yellow-400 scale-105 shadow-sm shadow-yellow-400/20'
                          : 'bg-neutral-800/70 text-neutral-300 border-neutral-700 hover:border-neutral-500 hover:text-white'
                      }`}
                    >
                      {tag}
                      {selected && <span className="ml-1 opacity-60">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )
        )}
        {searchTerm && visibleCategories[0]?.tags.length === 0 && (
          <p className="text-xs text-neutral-500 py-4 text-center">No tags match — add it as custom below</p>
        )}
      </div>

      {/* Custom tag input */}
      <div className="flex gap-2">
        <input
          ref={customInputRef}
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); addCustomTag(); }
            if (e.key === ',' && customInput.trim()) { e.preventDefault(); addCustomTag(); }
          }}
          placeholder="Add custom tag and press Enter..."
          className="flex-1 px-3 py-2 bg-neutral-900/60 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 focus:border-transparent text-xs"
          maxLength={40}
        />
        <button
          type="button"
          onClick={addCustomTag}
          disabled={!customInput.trim()}
          className="px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-yellow-400 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Add custom tag"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default function CompleteProfileModal({
  open,
  onClose,
  profileForm,
  onChange,
  onProfileFormPatch,
  onSubmit,
  selectedPredefinedTags,
  onTagsChange,
}: CompleteProfileModalProps) {
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [resumeError, setResumeError] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

  const normalizeTag = (tag: string) => tag.trim();
  // track which suggested tags have been individually toggled in
  const [pendingSuggested, setPendingSuggested] = useState<Set<string>>(new Set());

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.currentTarget.value = '';
    setResumeError('');
    if (!file) return;

    try {
      setIsGeneratingTags(true);
      setSuggestedTags([]);
      const extractedText = await extractResumeText(file);
      if (!extractedText || extractedText.length < 30) {
        setResumeError('Could not read enough text from the resume.');
        return;
      }

      const existingSet = new Set<string>([
        ...selectedPredefinedTags,
        ...profileForm.tags.split(',').map((t) => normalizeTag(t)).filter(Boolean),
      ]);
      const tags = matchTagsFromResume(extractedText, existingSet);
      setSuggestedTags(tags);
      setPendingSuggested(new Set());
      if (tags.length === 0) {
        setResumeError('No matching tags found — try adding tags manually below.');
      }
    } catch (error) {
      setResumeError(
        error instanceof Error
          ? error.message
          : 'Unable to read the resume right now.'
      );
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const toggleSuggestedTag = (tag: string) => {
    const normalized = normalizeTag(tag);
    const alreadySelected = selectedPredefinedTags.includes(normalized);
    if (alreadySelected) {
      onTagsChange(selectedPredefinedTags.filter((t) => t !== normalized));
      setPendingSuggested((prev) => { const s = new Set(prev); s.delete(normalized); return s; });
    } else {
      onTagsChange([...selectedPredefinedTags, normalized]);
      setPendingSuggested((prev) => new Set([...prev, normalized]));
    }
  };

  const applyAllSuggestedTags = () => {
    if (suggestedTags.length === 0) return;
    const normalized = suggestedTags.map(normalizeTag).filter(Boolean);
    const merged = Array.from(new Set([...selectedPredefinedTags, ...normalized]));
    onTagsChange(merged);
    setPendingSuggested(new Set(normalized));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-3 sm:p-6">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(250,204,21,0.15),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] pointer-events-none" />

        {/* Header - Fixed at top */}
        <div className="relative shrink-0 z-10 flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-neutral-950/90 backdrop-blur-md">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-yellow-400/80 font-semibold">Profile</p>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Complete Your Profile</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Help others discover you faster</p>
          </div>
          <Button onClick={onClose} className="text-neutral-300 hover:text-white bg-transparent hover:bg-neutral-800/60 px-2 py-2">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Form Content */}
        <div className="relative flex-1 overflow-y-auto min-h-0 bg-neutral-950/50">
          <form id="complete-profile-form" onSubmit={onSubmit} className="px-5 sm:px-6 py-5 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Bio</label>
              <textarea
                name="bio"
                value={profileForm.bio}
                onChange={onChange}
                className="w-full px-3 py-2 bg-neutral-900/60 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-transparent text-sm"
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-blue-800 mb-2">Twitter</label>
                <input
                  type="text"
                  name="twitter"
                  value={profileForm.twitter}
                  onChange={onChange}
                  className="w-full px-3 py-2 bg-neutral-900/60 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-transparent text-sm"
                  placeholder="https://x.com/username or @username"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-blue-300 mb-2">LinkedIn</label>
                <input
                  type="text"
                  name="linkedin"
                  value={profileForm.linkedin}
                  onChange={onChange}
                  className="w-full px-3 py-2 bg-neutral-900/60 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-transparent text-sm"
                  placeholder="https://linkedin.com/in/username or @username"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-rose-400 mb-2">Instagram</label>
                <input
                  type="text"
                  name="instagram"
                  value={profileForm.instagram}
                  onChange={onChange}
                  className="w-full px-3 py-2 bg-neutral-900/60 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-transparent text-sm"
                  placeholder="https://instagram.com/username or @username"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-yellow-600 mb-2">Course</label>
                <input
                  type="text"
                  name="course"
                  value={profileForm.course}
                  onChange={onChange}
                  className="w-full px-3 py-2 bg-neutral-900/60 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-transparent text-sm"
                  placeholder="e.g. Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-600 mb-2">Year</label>
                <input
                  type="text"
                  name="year"
                  value={profileForm.year}
                  onChange={onChange}
                  className="w-full px-3 py-2 bg-neutral-900/60 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 focus:border-transparent text-sm"
                  placeholder="e.g. 2025"
                />
              </div>
            </div>

            {/* Resume → Tags */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 overflow-hidden">
              <div className="flex items-center gap-2 px-3 pt-3 pb-2 border-b border-neutral-800/60">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <p className="text-xs font-semibold text-white">Smart tag suggestions from resume</p>
                <span className="ml-auto text-[10px] text-neutral-500">Not stored</span>
              </div>

              <div className="p-3">
                {/* Drop zone / file picker */}
                <label
                  className={`flex items-center gap-3 w-full rounded-lg border border-dashed px-3 py-2.5 cursor-pointer transition-colors ${
                    isGeneratingTags
                      ? 'border-yellow-500/30 bg-yellow-500/5 cursor-not-allowed'
                      : 'border-neutral-700 bg-neutral-900/40 hover:border-yellow-500/50 hover:bg-yellow-500/5'
                  }`}
                >
                  {isGeneratingTags ? (
                    <Loader2 className="w-4 h-4 text-yellow-400 animate-spin shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                  <span className="text-xs text-neutral-400">
                    {isGeneratingTags ? 'Reading resume and finding tags...' : 'Upload resume to get tag suggestions (PDF, TXT, MD)'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.txt,.md"
                    onChange={handleResumeUpload}
                    className="sr-only"
                    disabled={isGeneratingTags}
                  />
                </label>

                {resumeError && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                    <X className="w-3 h-3 shrink-0" /> {resumeError}
                  </p>
                )}

                {suggestedTags.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-medium text-neutral-300">
                        {suggestedTags.length} suggestions — click to toggle
                      </p>
                      <button
                        type="button"
                        onClick={applyAllSuggestedTags}
                        className="text-[11px] text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
                      >
                        Add all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedTags.map((tag) => {
                        const added = selectedPredefinedTags.includes(normalizeTag(tag));
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleSuggestedTag(tag)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
                              added
                                ? 'bg-yellow-400 text-black border-yellow-400'
                                : 'bg-neutral-800 text-neutral-200 border-neutral-700 hover:border-yellow-500/50'
                            }`}
                          >
                            {added && <CheckCircle2 className="w-3 h-3 shrink-0" />}
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tag Selector */}
            <div>
              <label className="block text-sm font-semibold text-neutral-200 mb-3">
                Skills & Interests
              </label>
              <TagSelector
                selectedTags={selectedPredefinedTags}
                onTagsChange={onTagsChange}
              />
            </div>
            
            {/* Spacer to ensure content isn't cut off */}
            <div className="h-2"></div>
          </form>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="relative shrink-0 px-5 sm:px-6 py-4 border-t border-white/10 bg-neutral-950/80 backdrop-blur-xl z-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant={'ghost'}
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-neutral-900/50 border border-white/5 text-neutral-400 rounded-xl hover:bg-white/5 hover:text-white hover:border-white/10 transition-all duration-200 text-sm font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="complete-profile-form"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-xl hover:from-yellow-500 hover:to-yellow-600 shadow-[0_0_20px_rgba(250,204,21,0.15)] hover:shadow-[0_0_25px_rgba(250,204,21,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-bold text-sm"
            >
              Save Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


