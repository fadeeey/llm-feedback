export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Password should not be stored in plaintext in a real app
}

export interface Survey {
  id: string;
  employeeName: string;
  createdAt: string; // Stored as ISO string for localStorage compatibility
  createdBy: string;
  feedback: string[];
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