export type ChatMessage = {
  role: 'bot' | 'user';
  text: string;
  /** Optional GIF/image URL to render inside the message bubble. */
  image?: string;
};

export type LanguageOption = {
  code: string;
  name: string;
}

export const languageOptions: LanguageOption[] = [
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
];

export interface SuriPreferences {
  language: 'en' | 'vi' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ko' | 'ru' | 'ar';
  tone:
    | 'friendly'
    | 'professional'
    | 'casual'
    | 'direct'
    | 'technical'
    | 'humorous';

  responseLength:
    | 'minimal'
    | 'short'
    | 'balanced'
    | 'detailed'
    | 'very_detailed';

  responseFormat:
    | 'plain_text'
    | 'markdown'
    | 'structured'
    | 'conversational';

  technicalLevel:
    | 'beginner'
    | 'intermediate'
    | 'advanced'
    | 'expert'
    | 'adaptive';

  proactivity:
    | 'passive'
    | 'normal'
    | 'proactive';

  personality: string;
}