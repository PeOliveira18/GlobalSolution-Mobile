export type * from '@/types/cidadao';
export type * from '@/types/telemetria';

export type ProblemDetails = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string[]>;
};
