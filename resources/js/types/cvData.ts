export type Experience = {
  role: string;
  company: string;
  time: string;
  current?: boolean;
  summary?: string;
  projects?: {
    name: string;
    points: string[];
    highlights?: string[];
  }[];
};

export type SkillGroup = {
  label: string;
  icon: 'server' | 'layout' | 'sparkles' | 'cpu';
  skills: string[];
};

export type Highlight = {
  title: string;
  detail: string;
};