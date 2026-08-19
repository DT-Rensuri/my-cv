import { getCvDataTool, navigateToSectionTool, highlightSectionTool } from './guides/cvKnowledgeTools';
import { avatarEmoteTool } from './guides/avatarTools';
import { makeChoicesOptionsTool } from './guides/makeOptions';

export const chatBotTools = [
  getCvDataTool,
  navigateToSectionTool,
  highlightSectionTool,
  makeChoicesOptionsTool,
  avatarEmoteTool,
];