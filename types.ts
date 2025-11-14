
export interface Survey {
  id: string;
  employeeName: string;
  createdAt: Date;
}

export interface Rubric {
  communication: number;
  deadlines: number;
  quality: number;
  initiative: number;
}

export interface AIReport {
  bullets: string[];
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  rubric: Rubric;
  summary: string;
  generated_at: string;
}
