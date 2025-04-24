export interface SituacionTributaria {
    rut: string;
    razon_social: string;
    inicio_actividades: string;
    fecha_inicio_actividades: string;
    empresa_menor_tamano: string;
    aut_moneda_extranjera: string;
    actividades: {
      giro: string;
      codigo: number;
      categoria: string;
      afecta: boolean;
    }[];
    documentos_timbrados: {
      Documento: string;
      'Año último timbraje': string;
    }[];
  }