#!/usr/bin/env node
/**
 * Guardian Voice Agent — MCP Test Server
 *
 * Exposes two tools to Claude:
 *   test_voice_command(phrase)   — run a phrase through localFallback and return the result
 *   list_intent_patterns()       — describe every intent and its trigger patterns
 *
 * Protocol: MCP stdio (JSON-RPC 2.0)
 * No npm dependencies required.
 */

// ─── localFallback (JS port of src/lib/voiceAgent.ts) ───────────────────────
// Keep this in sync with the TypeScript source.

function localFallback(text) {
  const lower = text.toLowerCase();

  // ── Wellbeing ──────────────────────────────────────────────────────────────
  if (/feel(ing)?\s+(good|great|fine|happy|wonderful)/.test(lower)) {
    return { intent: 'record_wellbeing', confidence: 0.8, params: { mood: 'good' } };
  }
  if (/feel(ing)?\s+(okay|ok|so.so|alright)/.test(lower)) {
    return { intent: 'record_wellbeing', confidence: 0.8, params: { mood: 'okay' } };
  }
  if (/(not\s+well|not\s+good|sick|unwell|bad|pain|hurt|ache|दर्द)/.test(lower)) {
    const painAreas = {
      head: 'head', sir: 'head', headache: 'head',
      chest: 'chest', seena: 'chest',
      stomach: 'stomach', pet: 'stomach', tummy: 'stomach',
      back: 'back', kamar: 'back',
      leg: 'legs', legs: 'legs', pair: 'legs', knee: 'legs',
    };
    let painArea = '';
    for (const [kw, area] of Object.entries(painAreas)) {
      if (lower.includes(kw)) { painArea = area; break; }
    }
    return {
      intent: 'record_wellbeing', confidence: 0.75,
      params: { mood: 'not_well', ...(painArea ? { painArea } : {}) },
    };
  }

  // ── Snooze / remind later ─────────────────────────────────────────────────
  const snoozeSignals = [
    /remind\s+me\b/i,
    /set\s+(a\s+)?reminder/i,
    /reminder\s+(for|about|de\s*do|lagao)/i,
    /\b(will\s+take|gonna\s+take|going\s+to\s+take|want\s+to\s+take|i'll\s+take)\b.*\blater\b/i,
    /\btake\b.*\blater\b/i,
    /\blater\b.*(le\s*(loonga|loongi|lunga|lungi)|kha\s*(loonga|loongi|lunga|lungi))/i,
    /\bsnooze\b/i,
    /\bskip\s+for\s+now\b/i,
    /\bnot\s+now\b/i,
    /\babhi\s+nahi\b/i,
    /\babhi\s+mat\b/i,
    /\bbaad\s*mein\b/i,
    /\bthodi\s*der\s*(mein|baad|ke\s*baad)?\b/i,
    /\bkuch\s*der\s*(mein|baad)?\b/i,
    /\bbaad\s+mein\s+yaad/i,
    /\byaad\s+dila(o|na|do)\b/i,
    /\b(after|before)\s+(dinner|lunch|breakfast|khana|nashta)\b/i,
    /\b(tonight|this\s+evening|in\s+the\s+evening|raat\s+ko|shaam\s+ko)\b/i,
    /\bin\s+\d+\s*(minute|min|hour|ghante)/i,
    /\b\d+\s*(minute|min|ghante)\s+(mein|baad)\b/i,
  ];
  if (snoozeSignals.some(re => re.test(lower))) {
    const namePatterns = [
      /remind\s+me\s+(?:later\s+)?(?:about\s+)?([a-z][a-z0-9]+)(?:\s+\d+\s*(?:mg|ml|g))?/i,
      /reminder\s+(?:for|about)\s+([a-z][a-z0-9]+)(?:\s+\d+\s*(?:mg|ml|g))?/i,
      /(?:will\s+take|gonna\s+take|i'll\s+take|take)\s+([a-z][a-z0-9]+)(?:\s+\d+\s*(?:mg|ml|g))?\s+later/i,
      /snooze\s+([a-z][a-z0-9]+)/i,
      /(?:i\s+will\s+take|i'll\s+take)\s+([a-z][a-z0-9]+)/i,
    ];
    let medicineName = '';
    const stopwords = ['my', 'the', 'it', 'this', 'that'];
    for (const pat of namePatterns) {
      const m = lower.match(pat);
      if (m?.[1] && !stopwords.includes(m[1])) { medicineName = m[1]; break; }
    }
    let snoozeMinutes = '30';
    const hourMatch = lower.match(/(\d+)\s*(?:hour|hr|ghante)/i);
    const minMatch = lower.match(/(\d+)\s*(?:minute|min)/i);
    if (hourMatch) snoozeMinutes = String(parseInt(hourMatch[1], 10) * 60);
    else if (minMatch) snoozeMinutes = minMatch[1];
    else if (/tonight|raat\s+ko|shaam\s+ko|this\s+evening|in\s+the\s+evening/i.test(lower)) snoozeMinutes = '120';
    else if (/after\s+(dinner|khana)/i.test(lower)) snoozeMinutes = '120';
    else if (/after\s+(lunch)/i.test(lower)) snoozeMinutes = '60';
    else if (/after\s+(breakfast|nashta)/i.test(lower)) snoozeMinutes = '60';
    return { intent: 'snooze_medicine', confidence: 0.85, params: { medicineName, snoozeMinutes } };
  }

  // ── Medicine taken ─────────────────────────────────────────────────────────
  const takenSignals = [
    /(took|taken|had|consumed|swallowed|finished|completed|done\s+with)\s.*(medicine|pill|tablet|capsule|dose|drug)/i,
    /(medicine|pill|tablet|capsule|dose)\s.*(took|taken|had|consumed|swallowed|finished|done)/i,
    /already\s+(took|taken|had)/i,
    /just\s+(took|had|taken)/i,
    /all\s+(medicines?|pills?|tablets?|done)/i,
    /medicines?\s+done/i,
    /(kha\s*li|kha\s*liya|kha\s*liya\s*hai|le\s*li|le\s*liya|pi\s*li|pi\s*liya)\s.*(dawai|goli|tablet|medicine)/i,
    /(dawai|goli|tablet|medicine)\s.*(kha\s*li|kha\s*liya|le\s*li|le\s*liya|pi\s*li|pi\s*liya|ho\s*gayi|ho\s*gyi)/i,
    /dawai\s+(kha\s*li|le\s*li|ho\s*gayi|ho\s*gyi)/i,
    /goli\s+(kha\s*li|le\s*li|ho\s*gayi)/i,
    /maine\s+.*(dawai|goli|tablet|medicine|le\s*li|kha\s*li)/i,
    /meri\s+(dawai|goli)\s+(ho\s*gayi|kha\s*li|le\s*li)/i,
    /(subah|raat|dopahar|shaam)\s+ki\s+(dawai|goli)\s+(kha\s*li|le\s*li)/i,
  ];
  const isTaken = takenSignals.some(re => re.test(lower));
  const broadTakenMatch = !isTaken
    ? lower.match(/\b(?:i\s+(?:have\s+)?took|i\s+have\s+taken|i\s+took|i've\s+taken|maine\s+(?:le\s*li|kha\s*li|pi\s*li))\s+(?:my\s+)?([a-z0-9][a-z0-9\s]*?)(?:\s*\d+\s*(?:mg|ml|g))?\s*$/i)
    : null;

  if (isTaken || broadTakenMatch) {
    const namePatterns2 = [
      /(?:took|taken|had|consumed|swallowed)\s+(?:my\s+)?([a-z][a-z0-9]+)(?:\s+\d+\s*(?:mg|ml|g))?/i,
      /([a-z][a-z0-9]+)\s+(?:\d+\s*(?:mg|ml|g)\s+)?(?:le\s*li|le\s*liya|kha\s*li|kha\s*liya|pi\s*li)/i,
      /(?:maine|i)\s+(?:apni\s+)?([a-z][a-z0-9]+)\s+(?:le\s*li|kha\s*li|taken)/i,
    ];
    const stopwords2 = ['my', 'the', 'all', 'medicine', 'pill', 'tablet', 'capsule', 'dawai', 'goli', 'just', 'already'];
    let medicineName = broadTakenMatch?.[1]?.trim() || 'all';
    for (const pat of namePatterns2) {
      const m = lower.match(pat);
      if (m?.[1] && !stopwords2.includes(m[1])) { medicineName = m[1]; break; }
    }
    if (/\ball\b/.test(lower) || /sab\s+(kha|le)\s*li/i.test(lower)) medicineName = 'all';
    return { intent: 'mark_medicine_taken', confidence: isTaken ? 0.85 : 0.55, params: { medicineName } };
  }

  // ── Add medicine ───────────────────────────────────────────────────────────
  if (/(add|new|start|शुरू).*(medicine|pill|tablet|dawai|goli)/i.test(lower) ||
      /(medicine|pill|tablet|dawai|goli).*(add|new|start|जोड़)/i.test(lower)) {
    const medMatch = lower.match(/(?:add|new|start)\s+(?:medicine\s+)?(\w+)\s*(\d+\s*(?:mg|ml|g)?)?/i);
    const name = medMatch?.[1] || '';
    const dosage = medMatch?.[2] || '';
    let frequency = 'once daily';
    if (/twice|two times|2 times/.test(lower)) frequency = 'twice daily';
    if (/thrice|three times|3 times/.test(lower)) frequency = 'thrice daily';
    let beforeAfterFood = 'any';
    if (/before food|before meal/.test(lower)) beforeAfterFood = 'before';
    if (/after food|after meal/.test(lower)) beforeAfterFood = 'after';
    if (/with food|with meal/.test(lower)) beforeAfterFood = 'with';
    return { intent: 'add_medicine', confidence: 0.65, params: { name, dosage, frequency, beforeAfterFood } };
  }

  // ── Meal logging ───────────────────────────────────────────────────────────
  if (/(ate|eaten|had|finished|done).*(breakfast|lunch|dinner|snack|food|meal|khana|nashta)/i.test(lower) ||
      /(breakfast|lunch|dinner|snack|khana|nashta).*(ate|eaten|had|finished|done|kha)/i.test(lower)) {
    let mealType = 'meal';
    if (/breakfast|nashta/.test(lower)) mealType = 'breakfast';
    else if (/lunch/.test(lower)) mealType = 'lunch';
    else if (/dinner|khana/.test(lower)) mealType = 'dinner';
    else if (/snack/.test(lower)) mealType = 'snack';
    return { intent: 'log_meal', confidence: 0.8, params: { mealType } };
  }

  // ── Check medicines ────────────────────────────────────────────────────────
  if (/(what|which|show|list|pending|remaining).*(medicine|pill|tablet|dawai|goli)/i.test(lower) ||
      /(medicine|pill|dawai).*(what|show|list|pending|remaining|left)/i.test(lower)) {
    return { intent: 'check_medicines', confidence: 0.8, params: {} };
  }

  // ── Check status ───────────────────────────────────────────────────────────
  if (/(how|status|summary|today|report|kaisa)/i.test(lower)) {
    return { intent: 'check_status', confidence: 0.6, params: {} };
  }

  return { intent: 'unknown', confidence: 0, params: {} };
}

// ─── MCP stdio server ─────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'test_voice_command',
    description:
      'Run a spoken phrase through the Guardian voice agent local fallback and return the detected intent, confidence, and extracted params. Use this to validate changes to localFallback() before editing the TypeScript source.',
    inputSchema: {
      type: 'object',
      properties: {
        phrase: { type: 'string', description: 'The voice phrase to test, exactly as the user would say it.' },
      },
      required: ['phrase'],
    },
  },
  {
    name: 'batch_test_voice_commands',
    description:
      'Run multiple phrases at once and return a table of results. Useful for regression testing after editing patterns.',
    inputSchema: {
      type: 'object',
      properties: {
        phrases: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of phrases to test.',
        },
        expected_intent: {
          type: 'string',
          description: 'Optional: if provided, marks each result as PASS/FAIL based on whether intent matches.',
        },
      },
      required: ['phrases'],
    },
  },
  {
    name: 'list_intent_patterns',
    description: 'Returns the full list of intents with their trigger signal descriptions and example phrases.',
    inputSchema: { type: 'object', properties: {} },
  },
];

const INTENT_PATTERNS = {
  record_wellbeing: {
    signals: ['feeling good/great/fine/happy/wonderful', 'feeling okay/ok/alright', 'not well/sick/unwell/pain/hurt/ache', 'दर्द'],
    examples: ["I'm feeling good", "I feel okay", "I'm not well", "I have a headache", "my back hurts"],
  },
  snooze_medicine: {
    signals: ['remind me', 'set a reminder', 'will take/gonna take ... later', 'take ... later', 'snooze', 'skip for now', 'not now / abhi nahi / abhi mat', 'baad mein / thodi der mein / kuch der baad', 'yaad dilao', 'after dinner/lunch/breakfast', 'tonight / raat ko / shaam ko', 'in X minutes/hours'],
    examples: ['remind me later atorvastatin 10mg', 'I will take Omeprazole 20mg later', "I'll take it later", 'snooze', 'not now', 'abhi nahi', 'baad mein yaad dilao', 'remind me in 30 minutes', 'I will take metformin after dinner'],
  },
  mark_medicine_taken: {
    signals: ['took/taken/had/consumed/swallowed/finished + medicine keyword', 'already took', 'just took', 'all medicines/done', 'kha li/le li/pi li + dawai/goli', 'maine dawai kha li', 'meri dawai ho gayi', 'subah/raat ki dawai kha li', 'broad: I took/have taken [anything]'],
    examples: ['I took my medicine', 'I have taken paracetamol', "I've taken metformin 500mg", 'just took my tablet', 'already took all medicines', 'dawai kha li', 'maine goli le li', 'meri dawai ho gayi', 'subah ki dawai kha li', 'I have taken embroidery pin 5 inch (garbled STT)'],
  },
  add_medicine: {
    signals: ['add/new/start + medicine/pill/tablet/dawai/goli'],
    examples: ['add paracetamol 500mg twice daily after food', 'new medicine metformin 1000mg', 'start atorvastatin 10mg once a day'],
  },
  log_meal: {
    signals: ['ate/eaten/had/finished/done + breakfast/lunch/dinner/snack/food/meal/khana/nashta'],
    examples: ['I had breakfast', 'I ate lunch', 'dinner done', 'khana kha liya'],
  },
  check_medicines: {
    signals: ['what/which/show/list/pending/remaining + medicine/pill/dawai'],
    examples: ['what medicines are pending?', 'show my pills', 'which dawai is remaining?'],
  },
  check_status: {
    signals: ['how/status/summary/today/report/kaisa'],
    examples: ["how am I doing today?", "today's status", 'kaisa hai aaj'],
  },
  unknown: {
    signals: ['none of the above matched'],
    examples: ['hello', 'open door', 'call doctor'],
  },
};

function handleToolCall(name, args) {
  if (name === 'test_voice_command') {
    const result = localFallback(args.phrase);
    return {
      phrase: args.phrase,
      ...result,
      summary: `Intent: ${result.intent} (confidence: ${result.confidence})\nParams: ${JSON.stringify(result.params)}`,
    };
  }

  if (name === 'batch_test_voice_commands') {
    const rows = args.phrases.map(phrase => {
      const result = localFallback(phrase);
      const pass = args.expected_intent ? (result.intent === args.expected_intent ? 'PASS' : 'FAIL') : null;
      return { phrase, intent: result.intent, confidence: result.confidence, params: result.params, ...(pass ? { pass } : {}) };
    });
    const passCount = rows.filter(r => r.pass === 'PASS').length;
    const failCount = rows.filter(r => r.pass === 'FAIL').length;
    return {
      results: rows,
      summary: args.expected_intent
        ? `${passCount} PASS / ${failCount} FAIL out of ${rows.length} phrases (expected: ${args.expected_intent})`
        : `Tested ${rows.length} phrases`,
    };
  }

  if (name === 'list_intent_patterns') {
    return INTENT_PATTERNS;
  }

  throw new Error(`Unknown tool: ${name}`);
}

// ─── JSON-RPC / MCP wire protocol ─────────────────────────────────────────────

let buf = '';

process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  buf += chunk;
  const lines = buf.split('\n');
  buf = lines.pop(); // keep incomplete line
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      handleMessage(msg);
    } catch {
      // ignore parse errors
    }
  }
});

function send(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

function handleMessage(msg) {
  const { id, method, params } = msg;

  if (method === 'initialize') {
    send({
      jsonrpc: '2.0', id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'guardian-voice-tester', version: '1.0.0' },
      },
    });
    return;
  }

  if (method === 'notifications/initialized') return; // no response needed

  if (method === 'tools/list') {
    send({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
    return;
  }

  if (method === 'tools/call') {
    try {
      const result = handleToolCall(params.name, params.arguments || {});
      send({
        jsonrpc: '2.0', id,
        result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] },
      });
    } catch (e) {
      send({
        jsonrpc: '2.0', id,
        result: { content: [{ type: 'text', text: `Error: ${e.message}` }], isError: true },
      });
    }
    return;
  }

  // Unknown method
  if (id !== undefined) {
    send({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
  }
}

process.stderr.write('Guardian voice-tester MCP server running\n');
