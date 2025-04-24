import { CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { handleSii } from "../apis/index";

function getGiros(results: any){
  const giros: { giro: string; codigo: number; categoria: string; afecta: boolean; }[] = [];
  results.actividades.forEach((a: { giro: string; codigo: number; categoria: string; afecta: boolean; }) => {
    giros.push({
      giro: a.giro,
      codigo: a.codigo,
      categoria: a.categoria,
      afecta: a.afecta
    })
  })
  return giros
}

function getDocumentosTimbrados(results: any){
  const documentosTimbrados: { Documento: string; 'Año último timbraje': string }[] = [];
  results.documentos_timbrados.forEach((d: { Documento: string; 'Año último timbraje': string }) => {
    documentosTimbrados.push(d)
  })
  return documentosTimbrados
} 


export async function toolDispatcher(
  request: typeof CallToolRequestSchema._type
) {
  try {
    switch (request.params.name) {
      case "fetch-sii": {
        const { rut } = request.params.arguments as { rut: string };
        const results = await handleSii(rut);
        const jsonResponse = {
          "rut": results.rut,
          "razon_social": results.razon_social,
          "inicio_actividades": results.inicio_actividades,
          "fecha_inicio_actividades": results.fecha_inicio_actividades,
          "empresa_menor_tamano": results.empresa_menor_tamano,
          "aut_moneda_extranjera": results.aut_moneda_extranjera,

          "giros": getGiros(results),

          "documentos_timbrados": getDocumentosTimbrados(results),
        }
        return {

          content: [
            {
              type: "text",
              text: JSON.stringify(jsonResponse),
          },
        ]
        };
      }

      case "example_tool": {
        const { data } = request.params.arguments as { data: string };
        return {
          content: [
            {
              type: "text",
              text: `Example tool called with data: ${data}`,
            },
          ],
        };
      }
      default:
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${request.params.name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
}
