import { experiences, profile } from '../content/portfolio';

export const guideTargets = {
  main: { title: 'Meet Shahmeer.', description: `${profile.introduction} Based in ${profile.location}.`, question: 'Who is Shahmeer?' },
  photos: { title: 'Life beyond the screen.', description: 'A few places, faces, and small pauses—another part of Shahmeer’s story.', question: 'Tell me about the photographs' },
  experience: { title: 'Research, building, and learning.', description: 'Seven roles across applied science, machine learning, and building a company. Company names and logos open their websites.', question: 'Tell me about his experience' },
  about: { title: 'Beyond the work.', description: profile.personal, question: 'Who is Shahmeer?' },
  contact: { title: 'A good conversation starts here.', description: `A research idea, a collaboration, or a hello—reach Shahmeer at ${profile.email}.`, question: 'How can I contact Shahmeer?' },
  ...Object.fromEntries(experiences.map(entry => [`experience-${entry.slug}`, { title: entry.organization === 'Orena' ? 'This is what Shahmeer’s building now.' : `${entry.organization} · ${entry.title}`, description: `${entry.summary} ${entry.date}.`, question: `Tell me about ${entry.organization} ${entry.title}` }])),
} as Record<string, { title: string; description: string; question: string }>;

export const tourStops = ['photos', 'experience-orena', 'experience-microsoft', 'contact'] as const;
export type CompanionAction = { kind: 'tour' } | { kind: 'navigate'; target: string };

export function getCompanionAction(question: string): CompanionAction | null {
  const q = question.toLowerCase().trim();
  if (/\b(don.t|do not|stop|cancel|never)\b/.test(q) || /https?:\/\//.test(q)) return null;
  if (/^(tour|guided tour)$/.test(q) || /\b(take|start|begin|give|show|want|like)\b.*\b(tour|around)\b/.test(q)) return { kind: 'tour' };
  if (!/\b(show|take|go|open|scroll|bring|jump|back|navigate)\b/.test(q)) return null;
  const target = /\b(microsoft)\b/.test(q) ? 'experience-microsoft'
    : /\b(orena)\b/.test(q) ? 'experience-orena'
    : /\b(remmie)\b/.test(q) ? 'experience-remmie'
    : /\b(bmc|helix)\b/.test(q) ? /\b(machine learning|ml engineer)\b/.test(q) ? 'experience-bmc' : 'experience-bmc-helix'
    : /\b(rbc)\b/.test(q) ? /\b(data engineer)\b/.test(q) ? 'experience-rbc-data-engineer' : 'experience-rbc-data-scientist'
    : /\b(photo|photos|picture|pictures|slideshow|gallery)\b/.test(q) ? 'photos'
    : /\b(contact|email|hello)\b/.test(q) ? 'contact'
    : /\b(experience|roles|work|career)\b/.test(q) ? 'experience'
    : /\b(about|personality)\b/.test(q) ? 'about'
    : /\b(top|home|intro|introduction)\b/.test(q) ? 'main' : null;
  return target && guideTargets[target] ? { kind: 'navigate', target } : null;
}

export function companionPosition(viewport: { width: number; height: number }, base: { left: number; top: number; width: number; height: number }, target: { top: number; right: number; height: number }) {
  const mobile = viewport.width <= 760;
  const left = mobile ? viewport.width - base.width - 20 : Math.min(viewport.width - base.width - 24, target.right + 24);
  const top = mobile ? Math.max(20, Math.min(viewport.height - base.height - 24, target.top - base.height - 16)) : Math.max(30, Math.min(viewport.height - base.height - 190, target.top + Math.min(110, target.height * .3)));
  return { x: left - base.left, y: top - base.top };
}
