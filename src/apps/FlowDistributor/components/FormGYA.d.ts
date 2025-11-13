// Type declarations for FormGYA
declare module './FormGYA' {
  import type { FC } from 'react';

  export interface GYAFormData {
    id?: string;
    fecha: string | Date;
    tipo: 'Ingreso' | 'Gasto' | 'Abono';
    destino: string;
    valor: number;
    origen?: string;
    concepto?: string;
    pesos?: number;
    observaciones?: string;
    tc?: number;
  }

  interface FormGYAProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: GYAFormData) => void | Promise<void>;
    initialData?: GYAFormData | null;
    mode?: 'create' | 'edit';
  }

  const FormGYA: FC<FormGYAProps>;
  export default FormGYA;
}
