export type ScoreInterpretation = {
  level: string;
  range: number[];
  description: string;
  color: string;
  needHelpFromPsychologist: boolean;
};

export type SubscaleScore = {
  name: string;
  score: number;
  description: string;
  interpretation?: {
    level: string;
    range: number[];
    description: string;
    color: string;
  };
};

export type AssessmentResult = {
  totalScore: number;
  interpretation: ScoreInterpretation;
  subscales?: SubscaleScore[];
};

export type DASS21SubscaleResult = {
  depression: {
    name: string;
    label: string;
    color: string;
    level: string;
    score: number;
    description: string;
    needHelpFromPsychologist: boolean;
    range: number[];
  };
  anxiety: {
    name: string;
    label: string;
    color: string;
    level: string;
    score: number;
    description: string;
    needHelpFromPsychologist: boolean;
    range: number[];
  };
  stress: {
    name: string;
    label: string;
    color: string;
    level: string;
    score: number;
    description: string;
    needHelpFromPsychologist: boolean;
    range: number[];
  };
};
