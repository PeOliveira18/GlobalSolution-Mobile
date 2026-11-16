export type * from './cidadao';
export type * from './telemetria';

/** Formato de erro das duas APIs: ProblemDetails (RFC 7807), conforme a B5. */
export type ProblemDetails = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  /** Erros de validação por campo (400). */
  errors?: Record<string, string[]>;
};
