import { experiences, profile, type ExperienceEntry } from '../content/portfolio';

export type PortfolioAnswer = {
  text: string;
  kind: 'answer' | 'unknown';
  sources: { label: string; href: string }[];
};
export function nextMomentDelay(random = Math.random()) {
  return 15000 + Math.round(Math.max(0, Math.min(1, random)) * 5000);
}
export function answerQuestion(question: string): PortfolioAnswer {
  const q = question.toLowerCase().trim();
  const answer = (text: string, label: string, href: string): PortfolioAnswer => ({ text, kind: 'answer', sources: [{ label, href }] });
  const unknown = (): PortfolioAnswer => ({ text: 'I don’t have that detail yet. I can help with the research, experience, and contact information Shahmeer has shared.', kind: 'unknown', sources: [] });
  if (/\b(salary|age|born|favourite|favorite|funding|revenue|customers|address|phone)\b/.test(q)) return unknown();
  if (/\b(contact|email|reach|hello|hi|connect)\b/.test(q)) {
    return answer(`You can reach Shahmeer at ${profile.email}. A research idea, a collaboration, or a simple hello is a good place to start.`, 'Send an email', `mailto:${profile.email}`);
  }

  let roles: ExperienceEntry[] = [];
  if (/\b(orena|founder|co-founder|startup|cto)\b/.test(q)) roles = experiences.filter(e => e.slug === 'orena');
  else if (/\b(microsoft)\b/.test(q)) roles = experiences.filter(e => e.slug === 'microsoft');
  else if (/\b(remmie)\b/.test(q)) roles = experiences.filter(e => e.slug === 'remmie');
  else if (/\b(bmc|helix)\b/.test(q)) {
    roles = experiences.filter(e => e.slug === 'bmc' || e.slug === 'bmc-helix');
    if (/\b(helix|ai engineer)\b/.test(q)) roles = roles.filter(e => e.slug === 'bmc-helix');
    else if (/\b(machine learning|ml engineer)\b/.test(q)) roles = roles.filter(e => e.slug === 'bmc');
  } else if (/\b(rbc|bank)\b/.test(q)) {
    roles = experiences.filter(e => e.organization === 'RBC');
    if (/\b(data scientist|2024)\b/.test(q)) roles = roles.filter(e => e.slug === 'rbc-data-scientist');
    else if (/\b(data engineer|engineering)\b/.test(q)) roles = roles.filter(e => e.slug === 'rbc-data-engineer');
  }
  if (roles.length) {
    if (/\b(current|currently|today|still)\b/.test(q) && !roles.every(e => e.ongoing)) return unknown();
    return answer(roles.map(e => `${e.organization}: ${e.title} (${e.date}), ${e.location}. ${e.summary}${e.team ? ` Team: ${e.team}.` : ''}`).join('\n\n'), roles.length === 1 ? `${roles[0].organization} experience` : `${roles[0].organization} roles`, '/#experience');
  }
  if (/\b(current|currently|today|still)\b/.test(q)) return unknown();
  if (/\b(waterloo|university|education|study|studies|engineering)\b/.test(q)) {
    if (/\b(when|date|year|graduate|graduation)\b/.test(q)) return unknown();
    return answer('Shahmeer studies Systems Design Engineering at the University of Waterloo.', 'Waterloo education', '/#main');
  }
  if (/\b(based|location|seattle|toronto|where)\b/.test(q)) {
    return answer(`Shahmeer is based in ${profile.location}.`, 'About Shahmeer', '/#main');
  }
  if (/\b(when|date|year)\b/.test(q)) return unknown();
  if (/\b(research|security|ai|artificial|areas|focus|interests)\b/.test(q)) {
    return answer('Shahmeer is an applied scientist and researcher working in research and applied AI. His experience includes applied science at Microsoft and co-founding Orena.', 'Explore the experience', '/#experience');
  }
  if (/\b(photo|photos|photographs|pictures|slideshow|gallery)\b/.test(q)) {
    return answer('The slideshow is a small window into life beyond the work: markets, city evenings, mountain trails, and small pauses. All seven photographs were shared by Shahmeer.', 'See the photographs', '/#photos');
  }
  if (/\b(project|projects|built|building|code)\b/.test(q)) {
    return answer('Projects will be added as Shahmeer shares specific work. For now, you can explore his research and building experience, including Orena.', 'Explore the experience', '/#experience');
  }
  if (/\b(experience|roles|career|work|does|about|who|scientist|researcher|employer|employs|company)\b/.test(q)) {
    return answer('Shahmeer is an applied scientist and researcher focused on applied AI. His experience spans Orena, Microsoft, Remmie Health, BMC Helix, BMC, and RBC. He studies Systems Design Engineering at the University of Waterloo.', 'Experience', '/#experience');
  }
  return unknown();
}
