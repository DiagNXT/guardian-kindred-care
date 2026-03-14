// Voice Agent - AI-powered natural language command processor
// Uses Groq/OpenRouter LLM to understand voice commands and map them to app actions

export type AgentIntent =
  | 'add_medicine'
  | 'mark_medicine_taken'
  | 'snooze_medicine'
  | 'log_meal'
  | 'record_wellbeing'
  | 'check_medicines'
  | 'check_status'
  | 'unknown';

export interface AgentAction {
  intent: AgentIntent;
  confidence: number;
  params: Record<string, string>;
  responseEn: string;
  responseHi: string;
}

interface LLMAgentResponse {
  intent: AgentIntent;
  confidence: number;
  params: Record<string, string>;
  response_en: string;
  response_hi: string;
}

const SYSTEM_PROMPT = `You are a voice assistant for an elderly care app called Guardian. You help seniors manage their daily health tasks through voice commands.

Your job is to understand the user's voice command and extract the intent and parameters.

Available intents:
1. "add_medicine" - User wants to add a new medicine. Extract: name, dosage, frequency, timing, beforeAfterFood (before/after/with/any)
2. "mark_medicine_taken" - User says they took a medicine. Extract: medicineName (partial match OK), or "all" if they say they took all medicines
3. "snooze_medicine" - User wants to be reminded later about a medicine (e.g. "remind me later", "I'll take it later", "snooze"). Extract: medicineName (if mentioned), snoozeMinutes (default 30 if not specified)
4. "log_meal" - User says they ate a meal. Extract: mealType (breakfast/lunch/dinner/snack)
5. "record_wellbeing" - User reports how they feel. Extract: mood (good/okay/not_well), painArea (head/chest/stomach/back/legs/other, only if they mention pain)
6. "check_medicines" - User asks what medicines they need to take. No params needed.
7. "check_status" - User asks about their overall status. No params needed.
8. "unknown" - Cannot understand the command.

IMPORTANT: Be flexible with natural language. Users may say things like:
- "I had my morning pill" → mark_medicine_taken
- "Add crocin 500mg two times a day after food" → add_medicine
- "Remind me later atorvastatin 10mg" / "I'll take it later" / "I will take Omeprazole later" / "Snooze medicine" → snooze_medicine
- "I ate breakfast" / "I've had lunch" → log_meal
- "I'm feeling good" / "My head hurts" / "I'm not well" → record_wellbeing
- "What medicines do I need?" / "Show my pills" → check_medicines
- "Maine dawai kha li" (Hindi: I took medicine) → mark_medicine_taken
- "Baad mein yaad dilao" (Hindi: remind me later) → snooze_medicine
- "Mujhe sir mein dard hai" (Hindi: I have headache) → record_wellbeing

SPEECH RECOGNITION ERRORS: This app is voice-only. Speech recognition often mishears medicine names. If someone says "I have taken [anything]" or "I took [anything]", assume they mean they took a medicine (mark_medicine_taken) unless the context clearly indicates otherwise. The misheard word is likely a medicine name.

Respond with ONLY valid JSON in this exact format:
{
  "intent": "the_intent",
  "confidence": 0.0-1.0,
  "params": { "key": "value" },
  "response_en": "Short confirmation in English for the senior",
  "response_hi": "Short confirmation in Hindi for the senior"
}`;

async function callLLM(userMessage: string): Promise<LLMAgentResponse> {
  // Try Groq first
  const groqKey = import.meta.env.VITE_GROQ_API_KEY;
  if (groqKey) {
    try {
      return await callGroq(groqKey, userMessage);
    } catch (e) {
      console.warn('Voice agent: Groq failed, trying OpenRouter:', e);
    }
  }

  // Fallback to OpenRouter
  const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (openRouterKey) {
    try {
      return await callOpenRouter(openRouterKey, userMessage);
    } catch (e) {
      console.warn('Voice agent: OpenRouter failed, using local fallback:', e);
    }
  }

  // Local rule-based fallback
  return localFallback(userMessage);
}

async function callGroq(apiKey: string, userMessage: string): Promise<LLMAgentResponse> {
  const model = import.meta.env.VITE_GROQ_MODEL || 'llama-3.1-8b-instant';

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.1,
      max_tokens: 500,
    }),
  });

  if (!response.ok) throw new Error(`Groq API error: ${response.status}`);

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '';
  return JSON.parse(content);
}

async function callOpenRouter(apiKey: string, userMessage: string): Promise<LLMAgentResponse> {
  const model = import.meta.env.VITE_OPENROUTER_MODEL || 'openai/gpt-4o';

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Guardian Care Voice Agent',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.1,
    }),
  });

  if (!response.ok) throw new Error(`OpenRouter API error: ${response.status}`);

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '';
  return JSON.parse(content);
}

// Rule-based fallback when no LLM API keys are configured
function localFallback(text: string): LLMAgentResponse {
  const lower = text.toLowerCase();

  // Check for wellbeing
  if (lower.match(/feel(ing)?\s+(good|great|fine|happy|wonderful)/)) {
    return {
      intent: 'record_wellbeing',
      confidence: 0.8,
      params: { mood: 'good' },
      response_en: 'Glad to hear you\'re feeling good! I\'ve recorded that.',
      response_hi: 'अच्छा सुनकर खुशी हुई! मैंने दर्ज कर लिया।',
    };
  }
  if (lower.match(/feel(ing)?\s+(okay|ok|so.so|alright)/)) {
    return {
      intent: 'record_wellbeing',
      confidence: 0.8,
      params: { mood: 'okay' },
      response_en: 'Noted. You\'re feeling okay today.',
      response_hi: 'ठीक है। आप आज ठीक महसूस कर रहे हैं।',
    };
  }
  if (lower.match(/(not\s+well|not\s+good|sick|unwell|bad|pain|hurt|ache|दर्द)/)) {
    const painAreas: Record<string, string> = {
      head: 'head', sir: 'head', headache: 'head',
      chest: 'chest', seena: 'chest',
      stomach: 'stomach', pet: 'stomach', tummy: 'stomach',
      back: 'back', kamar: 'back',
      leg: 'legs', legs: 'legs', pair: 'legs', knee: 'legs',
    };
    let painArea = '';
    for (const [keyword, area] of Object.entries(painAreas)) {
      if (lower.includes(keyword)) {
        painArea = area;
        break;
      }
    }
    return {
      intent: 'record_wellbeing',
      confidence: 0.75,
      params: { mood: 'not_well', ...(painArea ? { painArea } : {}) },
      response_en: `I'm sorry to hear that. I've recorded that you're not feeling well${painArea ? ` (${painArea} pain)` : ''}. Your caregiver will be notified.`,
      response_hi: `यह सुनकर दुख हुआ। मैंने दर्ज कर लिया${painArea ? ` (${painArea} में दर्द)` : ''}। आपके देखभालकर्ता को सूचित किया जाएगा।`,
    };
  }

  // ── Snooze / remind later ──────────────────────────────────────────────────
  // Must be checked BEFORE mark_medicine_taken because future-tense "will take"
  // overlaps with taken keywords.
  //
  // Signals: future tense around a medicine, explicit "later/baad mein", snooze
  // keywords, "not now", time-based deferral, or any remind/reminder request.
  const snoozeSignals = [
    // explicit remind requests
    /remind\s+me\b/i,
    /set\s+(a\s+)?reminder/i,
    /reminder\s+(for|about|de\s*do|lagao)/i,
    // "later" paired with a take-action word or standalone
    /\b(will\s+take|gonna\s+take|going\s+to\s+take|want\s+to\s+take|i'll\s+take)\b.*\blater\b/i,
    /\btake\b.*\blater\b/i,
    /\blater\b.*(le\s*(loonga|loongi|lunga|lungi)|kha\s*(loonga|loongi|lunga|lungi))/i,
    // snooze / skip keywords
    /\bsnooze\b/i,
    /\bskip\s+for\s+now\b/i,
    // not now variants (English & Hindi)
    /\bnot\s+now\b/i,
    /\babhi\s+nahi\b/i,
    /\babhi\s+mat\b/i,
    // Hindi "later" phrases
    /\bbaad\s*mein\b/i,
    /\bthodi\s*der\s*(mein|baad|ke\s*baad)?\b/i,
    /\bkuch\s*der\s*(mein|baad)?\b/i,
    /\bbaad\s+mein\s+yaad/i,
    /\byaad\s+dila(o|na|do)\b/i,
    // time-of-day deferral: "after dinner", "in the evening", "at night"
    /\b(after|before)\s+(dinner|lunch|breakfast|khana|nashta)\b/i,
    /\b(tonight|this\s+evening|in\s+the\s+evening|raat\s+ko|shaam\s+ko)\b/i,
    // "in X minutes / hours"
    /\bin\s+\d+\s*(minute|min|hour|ghante)/i,
    /\b\d+\s*(minute|min|ghante)\s+(mein|baad)\b/i,
  ];
  const isSnooze = snoozeSignals.some(re => re.test(lower));

  if (isSnooze) {
    // Extract medicine name — try multiple phrasings in priority order
    const snoozeNamePatterns = [
      /remind\s+me\s+(?:later\s+)?(?:about\s+)?([a-z][a-z0-9]+)(?:\s+\d+\s*(?:mg|ml|g))?/i,
      /reminder\s+(?:for|about)\s+([a-z][a-z0-9]+)(?:\s+\d+\s*(?:mg|ml|g))?/i,
      /(?:will\s+take|gonna\s+take|i'll\s+take|take)\s+([a-z][a-z0-9]+)(?:\s+\d+\s*(?:mg|ml|g))?\s+later/i,
      /snooze\s+([a-z][a-z0-9]+)/i,
      /(?:i\s+will\s+take|i'll\s+take)\s+([a-z][a-z0-9]+)/i,
    ];
    let medicineName = '';
    for (const pat of snoozeNamePatterns) {
      const m = lower.match(pat);
      if (m?.[1] && !['my', 'the', 'it', 'this', 'that'].includes(m[1])) {
        medicineName = m[1];
        break;
      }
    }

    // Extract delay — hours take priority, then minutes, then named times
    let snoozeMinutes = '30';
    const hourMatch = lower.match(/(\d+)\s*(?:hour|hr|ghante)/i);
    const minMatch = lower.match(/(\d+)\s*(?:minute|min)/i);
    if (hourMatch) snoozeMinutes = String(parseInt(hourMatch[1], 10) * 60);
    else if (minMatch) snoozeMinutes = minMatch[1];
    else if (/tonight|raat\s+ko|shaam\s+ko|this\s+evening|in\s+the\s+evening/i.test(lower)) snoozeMinutes = '120';
    else if (/after\s+(dinner|khana)/i.test(lower)) snoozeMinutes = '120';
    else if (/after\s+(lunch)/i.test(lower)) snoozeMinutes = '60';
    else if (/after\s+(breakfast|nashta)/i.test(lower)) snoozeMinutes = '60';

    return {
      intent: 'snooze_medicine',
      confidence: 0.85,
      params: { medicineName, snoozeMinutes },
      response_en: `OK, I'll remind you about ${medicineName || 'your medicine'} in ${snoozeMinutes} minutes.`,
      response_hi: `ठीक है, मैं आपको ${snoozeMinutes} मिनट बाद ${medicineName || 'दवाई'} की याद दिलाऊंगा।`,
    };
  }

  // ── Medicine taken ─────────────────────────────────────────────────────────
  // Covers past-tense / completion signals in English and Hindi.
  // NOTE: snooze check above already filtered out future-tense statements.
  const takenSignals = [
    // English past-tense action + medicine keyword
    /(took|taken|had|consumed|swallowed|finished|completed|done\s+with)\s.*(medicine|pill|tablet|capsule|dose|drug)/i,
    /(medicine|pill|tablet|capsule|dose)\s.*(took|taken|had|consumed|swallowed|finished|done)/i,
    // "already took/taken"
    /already\s+(took|taken|had)/i,
    // "just took/had"
    /just\s+(took|had|taken)/i,
    // "all done" / "all medicines taken" / "done"
    /all\s+(medicines?|pills?|tablets?|done)/i,
    /medicines?\s+done/i,
    // Hindi explicit
    /(kha\s*li|kha\s*liya|kha\s*liya\s*hai|le\s*li|le\s*liya|pi\s*li|pi\s*liya)\s.*(dawai|goli|tablet|medicine)/i,
    /(dawai|goli|tablet|medicine)\s.*(kha\s*li|kha\s*liya|le\s*li|le\s*liya|pi\s*li|pi\s*liya|ho\s*gayi|ho\s*gyi)/i,
    // Hindi standalone completions
    /dawai\s+(kha\s*li|le\s*li|ho\s*gayi|ho\s*gyi)/i,
    /goli\s+(kha\s*li|le\s*li|ho\s*gayi)/i,
    /maine\s+.*(dawai|goli|tablet|medicine|le\s*li|kha\s*li)/i,
    // "meri dawai ho gayi"
    /meri\s+(dawai|goli)\s+(ho\s*gayi|kha\s*li|le\s*li)/i,
    // time-prefixed Hindi: "subah ki dawai kha li"
    /(subah|raat|dopahar|shaam)\s+ki\s+(dawai|goli)\s+(kha\s*li|le\s*li)/i,
  ];
  const isTaken = takenSignals.some(re => re.test(lower));

  // Broad fallback: "I took/have taken/I've taken [anything]" — catches speech
  // recognition errors where the medicine name is garbled
  const broadTakenMatch = !isTaken
    ? lower.match(/\b(?:i\s+(?:have\s+)?took|i\s+have\s+taken|i\s+took|i've\s+taken|maine\s+(?:le\s*li|kha\s*li|pi\s*li))\s+(?:my\s+)?([a-z0-9][a-z0-9\s]*?)(?:\s*\d+\s*(?:mg|ml|g))?\s*$/i)
    : null;

  if (isTaken || broadTakenMatch) {
    // Extract medicine name
    const namePatterns = [
      /(?:took|taken|had|consumed|swallowed)\s+(?:my\s+)?([a-z][a-z0-9]+)(?:\s+\d+\s*(?:mg|ml|g))?/i,
      /([a-z][a-z0-9]+)\s+(?:\d+\s*(?:mg|ml|g)\s+)?(?:le\s*li|le\s*liya|kha\s*li|kha\s*liya|pi\s*li)/i,
      /(?:maine|i)\s+(?:apni\s+)?([a-z][a-z0-9]+)\s+(?:le\s*li|kha\s*li|taken)/i,
    ];
    let medicineName = broadTakenMatch?.[1]?.trim() || 'all';
    for (const pat of namePatterns) {
      const m = lower.match(pat);
      if (m?.[1] && !['my', 'the', 'all', 'medicine', 'pill', 'tablet', 'capsule', 'dawai', 'goli', 'just', 'already'].includes(m[1])) {
        medicineName = m[1];
        break;
      }
    }
    // "all done" / "all medicines" → mark all
    if (/\ball\b/.test(lower) || /sab\s+(kha|le)\s*li/i.test(lower)) medicineName = 'all';

    return {
      intent: 'mark_medicine_taken',
      confidence: isTaken ? 0.85 : 0.55,
      params: { medicineName },
      response_en: 'Got it! Marking your medicine as taken.',
      response_hi: 'ठीक है! आपकी दवाई ली गई के रूप में अंकित कर रहा हूँ।',
    };
  }

  // Check for add medicine
  if (lower.match(/(add|new|start|शुरू).*(medicine|pill|tablet|dawai|goli)/i) ||
      lower.match(/(medicine|pill|tablet|dawai|goli).*(add|new|start|जोड़)/i)) {
    // Try to extract name and dosage
    const medMatch = lower.match(/(?:add|new|start)\s+(?:medicine\s+)?(\w+)\s*(\d+\s*(?:mg|ml|g)?)?/i);
    const name = medMatch?.[1] || '';
    const dosage = medMatch?.[2] || '';

    // Frequency
    let frequency = 'once daily';
    if (lower.includes('twice') || lower.includes('two times') || lower.includes('2 times')) frequency = 'twice daily';
    if (lower.includes('thrice') || lower.includes('three times') || lower.includes('3 times')) frequency = 'thrice daily';

    // Food instruction
    let beforeAfterFood = 'any';
    if (lower.includes('before food') || lower.includes('before meal')) beforeAfterFood = 'before';
    if (lower.includes('after food') || lower.includes('after meal')) beforeAfterFood = 'after';
    if (lower.includes('with food') || lower.includes('with meal')) beforeAfterFood = 'with';

    return {
      intent: 'add_medicine',
      confidence: 0.65,
      params: { name, dosage, frequency, beforeAfterFood },
      response_en: name ? `Adding ${name} ${dosage} to your medicines.` : 'Please tell me the medicine name and dosage.',
      response_hi: name ? `${name} ${dosage} आपकी दवाइयों में जोड़ रहा हूँ।` : 'कृपया दवाई का नाम और खुराक बताएं।',
    };
  }

  // Check for meal logging
  if (lower.match(/(ate|eaten|had|finished|done).*(breakfast|lunch|dinner|snack|food|meal|khana|nashta)/i) ||
      lower.match(/(breakfast|lunch|dinner|snack|khana|nashta).*(ate|eaten|had|finished|done|kha)/i)) {
    let mealType = 'meal';
    if (lower.includes('breakfast') || lower.includes('nashta')) mealType = 'breakfast';
    else if (lower.includes('lunch')) mealType = 'lunch';
    else if (lower.includes('dinner') || lower.includes('khana')) mealType = 'dinner';
    else if (lower.includes('snack')) mealType = 'snack';

    return {
      intent: 'log_meal',
      confidence: 0.8,
      params: { mealType },
      response_en: `Great! I've noted that you had ${mealType}.`,
      response_hi: `बहुत अच्छा! मैंने नोट कर लिया कि आपने ${mealType} खा लिया।`,
    };
  }

  // Check for medicine query
  if (lower.match(/(what|which|show|list|pending|remaining).*(medicine|pill|tablet|dawai|goli)/i) ||
      lower.match(/(medicine|pill|dawai).*(what|show|list|pending|remaining|left)/i)) {
    return {
      intent: 'check_medicines',
      confidence: 0.8,
      params: {},
      response_en: 'Let me check your medicines.',
      response_hi: 'मैं आपकी दवाइयाँ देखता हूँ।',
    };
  }

  // Check for status query
  if (lower.match(/(how|status|summary|today|report|kaisa)/i)) {
    return {
      intent: 'check_status',
      confidence: 0.6,
      params: {},
      response_en: 'Let me check your status.',
      response_hi: 'मैं आपकी स्थिति देखता हूँ।',
    };
  }

  return {
    intent: 'unknown',
    confidence: 0,
    params: {},
    response_en: 'Sorry, I didn\'t understand that. You can say things like "I took my medicine", "Add paracetamol 500mg", "I had breakfast", or "I\'m feeling good".',
    response_hi: 'माफ़ कीजिए, मैं समझ नहीं पाया। आप कह सकते हैं "मैंने दवाई खा ली", "पैरासिटामोल 500mg जोड़ो", "मैंने खाना खा लिया", या "मैं ठीक हूँ"।',
  };
}

// Main function: process voice command and return the action to take
export async function processVoiceCommand(transcript: string): Promise<AgentAction> {
  try {
    const result = await callLLM(transcript);
    return {
      intent: result.intent,
      confidence: result.confidence,
      params: result.params,
      responseEn: result.response_en,
      responseHi: result.response_hi,
    };
  } catch (e) {
    console.error('Voice agent error:', e);
    return {
      intent: 'unknown',
      confidence: 0,
      params: {},
      responseEn: 'Sorry, something went wrong. Please try again.',
      responseHi: 'माफ़ कीजिए, कुछ गलत हो गया। कृपया फिर से कोशिश करें।',
    };
  }
}
