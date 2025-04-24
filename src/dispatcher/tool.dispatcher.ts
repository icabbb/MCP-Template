import { CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { handleSii } from "../apis/index";

export async function toolDispatcher(
  request: typeof CallToolRequestSchema._type
) {
  try {
    switch (request.params.name) {
      case "fetch-sii": {
        const { rut } = request.params.arguments as { rut: string };
        const resultado = await handleSii(rut);
        return {
          content: [
            {
              type: "text",
              text: `🔎 Resultado:
            RUT: ${resultado.rut}
            Razón Social: ${resultado.razon_social}
            Inicio Actividades: ${resultado.inicio_actividades} (${resultado.fecha_inicio_actividades})
            Empresa Menor Tamaño: ${resultado.empresa_menor_tamano}
            Aut. Moneda Extranjera: ${resultado.aut_moneda_extranjera}
    
            Giros:
              ${resultado.actividades.map((a: { giro: string; codigo: number; categoria: string; afecta: boolean; }) =>
                `- ${a.giro} (${a.codigo}) — ${a.categoria} — Afecta IVA: ${a.afecta ? 'Sí' : 'No'}`
              ).join('\n')}
    
            Documentos Timbrados:
              ${resultado.documentos_timbrados.map((d: { Documento: string; 'Año último timbraje': string }) =>
                `- ${d.Documento}: ${d['Año último timbraje']}`
              ).join('\n')}`
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
