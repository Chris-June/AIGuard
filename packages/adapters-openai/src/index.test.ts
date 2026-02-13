import { describe, expect, it } from 'vitest';
import { OpenAIResponsesAdapter } from './index';

describe('OpenAIResponsesAdapter', () => {
  it('normalizes output text and tool calls', async () => {
    const adapter = new OpenAIResponsesAdapter({
      client: {
        responses: {
          create: async () => ({
            id: 'resp_1',
            model: 'gpt-5-mini',
            output_text: 'Safe response',
            output: [
              {
                type: 'function_call',
                name: 'getWeather',
                arguments: '{"city":"Austin"}',
              },
            ],
            usage: { total_tokens: 10 },
          }),
        },
      },
    });

    const result = await adapter.generate({
      userPrompt: 'hello',
      model: { id: 'gpt-5-mini' },
      toolMetadata: [{ name: 'getWeather' }],
    });

    expect(result.outputText).toBe('Safe response');
    expect(result.toolCalls[0].name).toBe('getWeather');
    expect(result.toolCalls[0].arguments.city).toBe('Austin');
  });
});
