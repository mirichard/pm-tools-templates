/**
 * LLM Client
 *
 * Multi-provider LLM wrapper. Supports three provider types:
 *
 *   gemini      — Google Gemini SDK (free tier available)
 *   anthropic   — Anthropic Claude native API
 *   openai      — Any OpenAI-compatible API (OpenAI, Ollama, Together, Groq,
 *                 Azure OpenAI, Mistral, LM Studio, etc.)
 *
 * Provider is auto-detected from whichever API key is set, or can be forced
 * via LLM_PROVIDER. The openai provider uses LLM_BASE_URL so it works with
 * any service that implements the /v1/chat/completions endpoint.
 */

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { validateStructuredResponse, sanitizeErrorPayload, buildSafeOutputPath, buildContainedChildPath, safeWriteJSON } = require('./security');

// ─── Provider defaults ──────────────────────────────────────────────────────
const PROVIDER_DEFAULTS = {
  gemini: {
    model: 'gemini-2.5-flash',
    keyEnv: 'GEMINI_API_KEY',
    label: 'Google Gemini',
    keyUrl: 'https://aistudio.google.com/apikey',
  },
  anthropic: {
    model: 'claude-sonnet-4-20250514',
    baseUrl: 'https://api.anthropic.com/v1/messages',
    keyEnv: 'ANTHROPIC_API_KEY',
    label: 'Anthropic Claude',
    keyUrl: 'https://console.anthropic.com/settings/keys',
  },
  openai: {
    model: 'gpt-4',
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    keyEnv: 'OPENAI_API_KEY',
    label: 'OpenAI-compatible',
    keyUrl: 'https://platform.openai.com/api-keys',
  },
};

class LLMClient {
  constructor() {
    // ── Resolve provider ──────────────────────────────────────────────────
    this.provider = (process.env.LLM_PROVIDER || '').toLowerCase() || this._detectProvider();

    const defaults = PROVIDER_DEFAULTS[this.provider] || PROVIDER_DEFAULTS.openai;

    // ── API key: check provider-specific env first, then generic LLM_API_KEY
    this.apiKey = process.env[defaults.keyEnv] || process.env.LLM_API_KEY || '';

    // ── Model: LLM_MODEL overrides everything, then provider-specific, then default
    this.model = process.env.LLM_MODEL
      || (this.provider && process.env[`${this.provider.toUpperCase()}_MODEL`])
      || defaults.model;

    // ── Base URL for openai-compatible providers
    this.baseUrl = process.env.LLM_BASE_URL || defaults.baseUrl || '';

    // ── Generation params
    this.maxTokens = parseInt(process.env.LLM_MAX_TOKENS || '16384', 10);
    this.temperatureStructure = parseFloat(process.env.LLM_TEMPERATURE_STRUCTURE || '0.2');
    this.temperatureCreative = parseFloat(process.env.LLM_TEMPERATURE_CREATIVE || '0.5');
    this.timeout = parseInt(process.env.LLM_TIMEOUT || '120000', 10);

    // ── Tracing
    this.saveTraces = process.env.SAVE_LLM_TRACES === 'true';
    this.traceDir = process.env.LLM_TRACE_DIR || './traces';

    // ── Lazy-loaded Gemini client
    this._geminiModel = null;
  }

  // ─── Auto-detect provider from available keys ───────────────────────────
  _detectProvider() {
    if (process.env.GEMINI_API_KEY) return 'gemini';
    if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
    if (process.env.OPENAI_API_KEY || process.env.LLM_API_KEY) return 'openai';
    return null;
  }

  /**
   * Validate that an API key is configured
   */
  validate() {
    if (!this.provider) {
      throw new Error(
        'No LLM provider configured. Set one of these in your .env file:\n'
        + '  GEMINI_API_KEY    — Google Gemini (free: https://aistudio.google.com/apikey)\n'
        + '  ANTHROPIC_API_KEY — Anthropic Claude\n'
        + '  OPENAI_API_KEY    — OpenAI\n'
        + '  LLM_API_KEY       — Any OpenAI-compatible endpoint (set LLM_BASE_URL too)'
      );
    }
    if (!this.apiKey) {
      const defaults = PROVIDER_DEFAULTS[this.provider] || PROVIDER_DEFAULTS.openai;
      throw new Error(
        `${defaults.label} API key not set. Add ${defaults.keyEnv} to your .env file.\n`
        + (defaults.keyUrl ? `  Get a key at: ${defaults.keyUrl}` : '')
      );
    }
  }

  /**
   * Get or create the Gemini generative model instance
   */
  _getGeminiModel() {
    if (!this._geminiModel) {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(this.apiKey);
      this._geminiModel = genAI.getGenerativeModel({ model: this.model });
    }
    return this._geminiModel;
  }

  /**
   * Load a prompt template from the prompts/ directory
   * @param {string} promptName - Filename in prompts/ (e.g., '01-structure-requirements.md')
   * @returns {string} The prompt template content
   */
  async loadPrompt(promptName) {
    const promptPath = path.resolve(__dirname, '..', 'prompts', promptName);
    if (!(await fs.pathExists(promptPath))) {
      throw new Error(`Prompt template not found: ${promptPath}`);
    }
    return fs.readFile(promptPath, 'utf8');
  }

  /**
   * Send a chat completion request to the configured LLM provider
   * @param {object} options
   * @param {string} options.systemPrompt - System message content
   * @param {string} options.userPrompt - User message content
   * @param {string} [options.mode='structure'] - 'structure' (low temp) or 'creative' (higher temp)
   * @returns {string} The assistant's response content
   */
  async chat({ systemPrompt, userPrompt, mode = 'structure' }) {
    this.validate();

    const temperature = mode === 'creative'
      ? this.temperatureCreative
      : this.temperatureStructure;

    let content;
    switch (this.provider) {
      case 'gemini':
        content = await this._chatGemini({ systemPrompt, userPrompt, temperature });
        break;
      case 'anthropic':
        content = await this._chatAnthropic({ systemPrompt, userPrompt, temperature });
        break;
      default:
        content = await this._chatOpenAI({ systemPrompt, userPrompt, temperature });
    }

    if (this.saveTraces) {
      await this._saveTrace(
        [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
        content
      );
    }

    return content;
  }

  // ─── Google Gemini ──────────────────────────────────────────────────────
  async _chatGemini({ systemPrompt, userPrompt, temperature }) {
    try {
      const model = this._getGeminiModel();
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { temperature, maxOutputTokens: this.maxTokens },
      });
      return result.response.text();
    } catch (error) {
      throw new Error(`Gemini API error: ${error.message || error}`);
    }
  }

  // ─── Anthropic Claude (native API) ─────────────────────────────────────
  async _chatAnthropic({ systemPrompt, userPrompt, temperature }) {
    try {
      const response = await axios.post(
        this.baseUrl,
        {
          model: this.model,
          max_tokens: this.maxTokens,
          temperature,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
          timeout: this.timeout,
        }
      );
      return response.data.content[0].text;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const body = sanitizeErrorPayload(error.response.data || {});
        const msg = body?.error?.message || body?.message || JSON.stringify(body).slice(0, 400);
        throw new Error(`Anthropic API error (${status}): ${msg}`);
      }
      throw new Error(`Anthropic API request failed: ${sanitizeErrorPayload(error && error.message ? error.message : String(error))}`);
    }
  }

  // ─── OpenAI-compatible (OpenAI, Ollama, Together, Groq, etc.) ──────────
  async _chatOpenAI({ systemPrompt, userPrompt, temperature }) {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    try {
      const response = await axios.post(
        this.baseUrl,
        { model: this.model, messages, temperature, max_tokens: this.maxTokens },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: this.timeout,
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const payload = sanitizeErrorPayload(error.response.data || {});
        const msg = payload?.error?.message || payload?.message || JSON.stringify(payload).slice(0, 400) || 'Unknown API error';
        throw new Error(`LLM API error (${status}): ${msg}`);
      }
      throw new Error(`LLM API request failed: ${sanitizeErrorPayload(error && error.message ? error.message : String(error))}`);
    }
  }

  /**
   * Send a chat request and parse the response as JSON
   * @param {object} options - Same as chat()
   * @returns {object} Parsed JSON from the response
   */
  async chatJSON(options = {}) {
    const raw = await this.chat(options);
    const expectedRoot = options.expectedRoot || 'object';

    const fencedMatch = raw.match(/```(?:json)?\s*\n([\s\S]*?)(?:\n```|$)/);
    let jsonString;
    if (fencedMatch) {
      jsonString = fencedMatch[1].trim();
    } else {
      const openFenceMatch = raw.match(/```(?:json)?\s*\n([\s\S]+)/);
      jsonString = openFenceMatch ? openFenceMatch[1].trim() : String(raw).trim();
    }

    try {
      const parsed = validateStructuredResponse(jsonString, {
        expectedRoot,
        requiredKeys: Array.isArray(options.requiredKeys) ? options.requiredKeys : [],
      });
      return parsed;
    } catch (err) {
      throw new Error(
        `Failed to parse validated LLM response as JSON: ${err.message}`
      );
    }
  }

  /**
   * Save prompt/response traces for debugging
   */
  async _saveTrace(messages, response) {
    const safeTraceDir = buildSafeOutputPath(this.traceDir);
    await fs.ensureDir(safeTraceDir);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const trace = {
      timestamp: new Date().toISOString(),
      provider: this.provider,
      model: this.model,
      messages: JSON.parse(JSON.stringify(messages, null, 2)),
      response: sanitizeErrorPayload(response),
    };
    const tracePath = buildContainedChildPath(safeTraceDir, `trace-${timestamp}.json`);
    await safeWriteJSON(tracePath, trace, { spaces: 2, rootDir: safeTraceDir });
  }
}

module.exports = LLMClient;
