export type CriteriaOperator = '=' | 'ILIKE';

export interface FilterConfig {
  column: string;
  operator: CriteriaOperator;
}

export type CriteriaConfig = Record<string, FilterConfig>;
