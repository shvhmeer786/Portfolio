import test from 'node:test';
import assert from 'node:assert/strict';
import { answerQuestion, nextMomentDelay } from './portfolio-assistant';

test('answers supplied Microsoft experience and links to the experience section', () => {
  const answer = answerQuestion('What does Shahmeer do at Microsoft?');
  assert.match(answer.text, /Applied Scientist/);
  assert.match(answer.text, /research/i);
  assert.equal(answer.sources[0].href, '/#experience');
});
test('answers co-founder questions using the supplied event planning work', () => {
  const answer = answerQuestion('Tell me about Orena');
  assert.match(answer.text, /CTO/);
  assert.match(answer.text, /Co-founder/);
  assert.match(answer.text, /event planning/);
  assert.doesNotMatch(answer.text, /funding|customers|revenue/i);
});
test('returns the exact public contact address', () => {
  assert.match(answerQuestion('How can I contact him?').text, /shvhmeer@gmail\.com/);
});
test('does not invent answers to unprovided personal facts', () => {
  const answer = answerQuestion('What is his favourite movie?');
  assert.equal(answer.kind, 'unknown');
  assert.match(answer.text, /don.t have that detail/i);
});
test('answers supplied employment dates while keeping unprovided education dates unknown', () => {
  const microsoft = answerQuestion('When did he join Microsoft?');
  assert.equal(microsoft.kind, 'answer');
  assert.match(microsoft.text, /May–Sep 2026/);
  assert.equal(answerQuestion('What year does he graduate from Waterloo?').kind, 'unknown');
});
test('recognizes natural-language research and employer questions', () => {
  assert.equal(answerQuestion('Which company employs Shahmeer?').sources[0].href, '/#experience');
  assert.match(answerQuestion('What areas is his research in?').text, /applied AI/);
});
test('the bot moments stay within the requested 15 to 20 second interval', () => {
  assert.equal(nextMomentDelay(0), 15000);
  assert.equal(nextMomentDelay(1), 20000);
  assert.equal(nextMomentDelay(0.5), 17500);
});

test('answers the supplied Seattle and Toronto location', () => {
  const answer = answerQuestion('Where is Shahmeer based?');
  assert.match(answer.text, /Seattle & Toronto/);
  assert.equal(answer.sources[0].href, '/#main');
});

test('all experience answers point to the single-page overview', () => {
  for (const question of ['Microsoft', 'Orena', 'Remmie', 'BMC', 'RBC']) {
    assert.equal(answerQuestion(question).sources[0].href, '/#experience');
  }
});

test('describes Waterloo as Systems Design Engineering education', () => {
  const answer = answerQuestion('Tell me about his University of Waterloo education');
  assert.match(answer.text, /studies Systems Design Engineering/);
  assert.doesNotMatch(answer.text, /researcher/);
});
test('uses the broad scientist and researcher identity without a Waterloo research role', () => {
  for (const question of ['Who is Shahmeer?', 'Researcher', 'What does he research?']) {
    const answer = answerQuestion(question);
    assert.match(answer.text, /applied scientist and researcher/i);
    assert.doesNotMatch(answer.text, /security research|researcher at the University of Waterloo/i);
  }
});


test('company location questions use the role location instead of the home base', () => {
  assert.match(answerQuestion('Where did he work at Microsoft?').text, /Redmond, Washington/);
  assert.match(answerQuestion('Where was his BMC role?').text, /Santa Clara, California/);
});
test('keeps both BMC and RBC roles and their distinct dates', () => {
  const bmc = answerQuestion('Tell me about BMC').text;
  assert.match(bmc, /AI Engineer \(Jan–May 2025\)/);
  assert.match(bmc, /Machine Learning Engineer \(May–Sep 2024\)/);
  const rbc = answerQuestion('Tell me about RBC').text;
  assert.match(rbc, /Data Scientist \(Sep 2023–Jan 2024\)/);
  assert.match(rbc, /Data Engineer \(Jan–Apr 2023\)/);
  assert.doesNotMatch(answerQuestion('RBC Data Engineer').text, /Data Scientist/);
});
test('only confirms ongoing roles when explicitly supplied', () => {
  assert.equal(answerQuestion('Does he currently work at Microsoft?').kind, 'unknown');
  const orena = answerQuestion('Does he currently work at Orena?');
  assert.equal(orena.kind, 'answer');
  assert.match(orena.text, /Jan 2026–Present/);
});
