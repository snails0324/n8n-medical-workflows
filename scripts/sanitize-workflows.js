const fs = require('fs');
const path = require('path');

const inputDir = path.resolve(__dirname, '..', 'workflows');

const removedKeys = new Set([
  'id',
  'webhookId',
  'createdAt',
  'updatedAt',
  'versionId',
  'activeVersionId',
  'sourceWorkflowId',
  'projectId',
  'creatorId',
  'shared',
  'meta',
  'tags',
  'staticData',
  'pinData',
  'credentials',
]);

function parseExport(filePath) {
  let raw = fs.readFileSync(filePath, 'utf8').trim();
  const jsonStart = Math.min(
    ...['[', '{'].map((token) => {
      const index = raw.indexOf(token);
      return index === -1 ? Number.POSITIVE_INFINITY : index;
    }),
  );
  if (Number.isFinite(jsonStart) && jsonStart > 0) raw = raw.slice(jsonStart);
  return JSON.parse(raw);
}

function clean(value, key = '') {
  if (removedKeys.has(key)) return undefined;
  if (['password', 'secret', 'apiKey', 'accessToken'].includes(key)) return '[REDACTED]';
  if (Array.isArray(value)) return value.map((item) => clean(item)).filter((item) => item !== undefined);
  if (value && typeof value === 'object') {
    const output = {};
    for (const [childKey, childValue] of Object.entries(value)) {
      const cleaned = clean(childValue, childKey);
      if (cleaned !== undefined) output[childKey] = cleaned;
    }
    return output;
  }
  return value;
}

const files = [
  ['current-export.raw.json', 'current-export.json'],
  ['discord-workflow.raw.json', 'discord-workflow.json'],
  ['line-medical-triage.raw.json', 'line-medical-triage.json'],
];

for (const [inputName, outputName] of files) {
  const source = parseExport(path.join(inputDir, inputName));
  const workflows = (Array.isArray(source) ? source : [source]).map((workflow) => {
    const cleaned = clean(workflow);
    cleaned.active = false;
    return cleaned;
  });
  fs.writeFileSync(path.join(inputDir, outputName), `${JSON.stringify(workflows, null, 2)}\n`);
}

console.log(`Sanitized ${files.length} workflow exports for public repository use.`);
