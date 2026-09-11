import { createAgent } from 'langchain';
import { ChatOpenAI } from '@langchain/openai';
import { braveSearchTool } from './tools/braveSearchTool';
import { customThemeColorTool } from './tools/customThemeColorTool';
import { chatBotTools } from './tools/chatBotToolsIndex';
import { meetingNotesTools } from './tools/meeting';
import { MemorySaver } from '@langchain/langgraph';
import { getCvDataTool } from './tools/guides/cvKnowledgeTools';

const provider = (import.meta.env.VITE_LLM_PROVIDER ?? 'ollama').toLowerCase();
const checkpointer = new MemorySaver();
const voiceMeetingCheckpointer = new MemorySaver();

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/openrouter`;
const API_KEY = 'laravel-proxy';
const MAX_RETRIES = 2;
const API_USERNAME = import.meta.env.VITE_BASIC_AUTH_USERNAME;
const API_PASSWORD = import.meta.env.VITE_BASIC_AUTH_PASSWORD;

const BASIC_AUTH = btoa(`${API_USERNAME}:${API_PASSWORD}`);

const agent = createAgent({
    model: new ChatOpenAI({
        model: 'default',
        apiKey: API_KEY,
        configuration: {
            baseURL: BASE_URL,
            defaultHeaders: {
                Authorization: `Basic ${BASIC_AUTH}`,
            }
        },
        maxRetries: MAX_RETRIES,
    }),
    tools: [braveSearchTool, customThemeColorTool, ...chatBotTools],
    checkpointer,
});

const voiceMeetingAgent = createAgent({
    model: new ChatOpenAI({
        model: 'voice-meeting-ai',
        apiKey: API_KEY,
        configuration: {
            baseURL: BASE_URL,
            defaultHeaders: {
                Authorization: `Basic ${BASIC_AUTH}`,
            }
        },
        maxRetries: MAX_RETRIES,
    }),
    tools: [braveSearchTool, ...meetingNotesTools],
    checkpointer: voiceMeetingCheckpointer,
});

const suriVTubeAgent = createAgent({
    model: new ChatOpenAI({
        model: 'suri-vtube',
        apiKey: API_KEY,
        configuration: {
            baseURL: BASE_URL,
            defaultHeaders: {
                Authorization: `Basic ${BASIC_AUTH}`,
            }
        },
        maxRetries: MAX_RETRIES,
    }),
    tools: [braveSearchTool, getCvDataTool],
    checkpointer,
});

export { agent, voiceMeetingAgent, suriVTubeAgent, provider };
