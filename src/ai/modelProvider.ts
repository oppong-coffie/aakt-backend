interface ModelMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionChoice {
  message?: {
    content?: string;
  };
}

interface ChatCompletionResponse {
  choices?: ChatCompletionChoice[];
}

const DEFAULT_MODEL = 'gpt-4o-mini';
const DEFAULT_BASE_URL = 'https://api.openai.com/v1';

interface GenerateModelOptions {
  maxTokens?: number;
  responseFormat?: boolean;
  temperature?: number;
}

function getApiKey(): string {
  return (
    process.env.AAKT_AI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.AI_API_KEY ||
    ''
  ).trim();
}

function getBaseUrl(): string {
  return (process.env.AAKT_AI_BASE_URL || process.env.AI_BASE_URL || DEFAULT_BASE_URL)
    .trim()
    .replace(/\/$/, '');
}

export function isAiConfigured(): boolean {
  return getApiKey().length > 0;
}

export async function generateModelText(
  messages: ModelMessage[],
  options: GenerateModelOptions = {}
): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }

  const model = (process.env.AAKT_AI_MODEL || process.env.AI_MODEL || DEFAULT_MODEL).trim();
  const body = {
    model,
    messages,
    temperature: options.temperature ?? 0.2,
    max_tokens: options.maxTokens ?? 1200,
    ...(options.responseFormat === false
      ? {}
      : { response_format: { type: 'json_object' } }),
  };

  const response = await fetch(`${getBaseUrl()}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    const shouldRetryWithoutJsonMode =
      options.responseFormat !== false &&
      response.status === 400 &&
      /response_format|json_object|json mode/i.test(text);

    if (shouldRetryWithoutJsonMode) {
      return generateModelText(messages, { ...options, responseFormat: false });
    }

    throw new Error(`AI provider request failed (${response.status}): ${text.slice(0, 300)}`);
  }

  const data = (await response.json()) as ChatCompletionResponse;
  return data.choices?.[0]?.message?.content ?? null;
}
