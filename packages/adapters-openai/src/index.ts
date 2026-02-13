import OpenAI from 'openai';
import { GenerationInput, GenerationResult, ModelAdapter, ToolCallRecord } from '@guardforge/core';

export interface OpenAIAdapterOptions {
  apiKey?: string;
  timeoutMs?: number;
  retries?: number;
  client?: {
    responses: {
      create: (args: unknown) => Promise<any>;
    };
  };
}

export class OpenAIResponsesAdapter implements ModelAdapter {
  private readonly client: {
    responses: {
      create: (args: unknown) => Promise<any>;
    };
  };
  private readonly retries: number;

  constructor(options: OpenAIAdapterOptions = {}) {
    if (options.client) {
      this.client = options.client;
      this.retries = options.retries ?? 0;
      return;
    }

    const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required for OpenAI adapter');
    }

    this.client = new OpenAI({
      apiKey,
      timeout: options.timeoutMs,
      maxRetries: options.retries ?? 0,
    }) as any;
    this.retries = options.retries ?? 0;
  }

  async generate(input: GenerationInput): Promise<GenerationResult> {
    let attempts = 0;
    let lastError: unknown;

    while (attempts <= this.retries) {
      try {
        const request: Record<string, unknown> = {
          model: input.model.id,
          max_output_tokens: input.model.maxOutputTokens,
          input: buildInput(input),
          tools: (input.toolMetadata ?? []).map((tool) => ({
            type: 'function',
            name: tool.name,
            description: tool.description,
            parameters: tool.inputSchema,
            strict: false,
          })),
        };

        // GPT-5 models reject temperature; only send it where supported.
        if (input.model.temperature !== undefined && !input.model.id.startsWith('gpt-5')) {
          request.temperature = input.model.temperature;
        }

        const response = await this.client.responses.create(request as any);

        return normalizeResponse(response);
      } catch (error) {
        lastError = error;
        attempts += 1;
      }
    }

    throw new Error(
      `OpenAI response generation failed after ${this.retries + 1} attempts: ${
        lastError instanceof Error ? lastError.message : String(lastError)
      }`,
    );
  }
}

function buildInput(input: GenerationInput): Array<Record<string, unknown>> {
  const parts: Array<Record<string, unknown>> = [];
  if (input.systemInstructions) {
    parts.push({ role: 'system', content: input.systemInstructions });
  }

  if (input.context?.length) {
    parts.push({
      role: 'system',
      content: `Context: ${JSON.stringify(input.context)}`,
    });
  }

  parts.push({ role: 'user', content: input.userPrompt });
  return parts;
}

function normalizeResponse(response: any): GenerationResult {
  const outputText = response.output_text ?? extractTextFromOutput(response.output ?? []) ?? '';

  const toolCalls = extractToolCalls(response.output ?? []);

  return {
    outputText,
    structuredOutput: response.output,
    toolCalls,
    metadata: {
      id: response.id,
      usage: response.usage,
      model: response.model,
    },
  };
}

function extractTextFromOutput(output: any[]): string {
  const textParts: string[] = [];
  for (const item of output) {
    if (Array.isArray(item?.content)) {
      for (const content of item.content) {
        if (content?.type === 'output_text' && typeof content.text === 'string') {
          textParts.push(content.text);
        }
      }
    }
  }
  return textParts.join('\n').trim();
}

function extractToolCalls(output: any[]): ToolCallRecord[] {
  const calls: ToolCallRecord[] = [];

  for (const item of output) {
    if (item?.type === 'function_call') {
      let args: Record<string, unknown> = {};
      if (typeof item.arguments === 'string') {
        try {
          args = JSON.parse(item.arguments) as Record<string, unknown>;
        } catch {
          args = {};
        }
      } else if (item.arguments && typeof item.arguments === 'object') {
        args = item.arguments as Record<string, unknown>;
      }

      calls.push({
        name: item.name,
        arguments: args,
        status: 'attempted',
      });
    }
  }

  return calls;
}
