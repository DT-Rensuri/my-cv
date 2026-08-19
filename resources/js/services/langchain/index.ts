import { createAgent } from 'langchain';
import { ChatOllama } from '@langchain/ollama';
import { ChatOpenAI } from '@langchain/openai';
import { braveSearchTool } from './tools/braveSearchTool';
import { customThemeColorTool } from './tools/customThemeColorTool';
import { chatBotTools } from './tools/chatBotToolsIndex';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { MemorySaver } from '@langchain/langgraph';

const provider = (import.meta.env.VITE_LLM_PROVIDER ?? 'ollama').toLowerCase();
const checkpointer = new MemorySaver();

function resolveModel(): BaseChatModel {
    if (provider === 'ollama') {
        return new ChatOllama({
            baseUrl:
                import.meta.env.VITE_LLM_BASE_URL || 'http://127.0.0.1:11434',
            model: import.meta.env.VITE_LLM_OLLAMA_MODEL || 'qwen3.6:latest',
            numCtx: 32768,
        });
    }

    if (provider === 'laravel') {
        return new ChatOpenAI({
            apiKey: 'laravel-proxy',
            configuration: {
                baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/openrouter`,
            },
        });
    }

    return new ChatOpenAI({
        apiKey: 'laravel-proxy',
        configuration: {
            baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/openrouter`,
        },
    });
}

const agent = createAgent({
    model: resolveModel(),
    tools: [braveSearchTool, customThemeColorTool, ...chatBotTools],
    checkpointer,
});

export { agent, provider };
