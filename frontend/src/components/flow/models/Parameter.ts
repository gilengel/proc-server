import { ControlSchema } from './Control'

export interface ParameterSchema {
  type: string;
  id?: string;
  mandatory: boolean;
  label: string;
  value?: unknown;
  control?: ControlSchema;
}
