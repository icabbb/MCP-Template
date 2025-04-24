import * as cheerio from 'cheerio';
import { SituacionTributaria } from 'src/types/sii.type';

async function getCaptcha(abort: AbortController) {
  const captchaRes = await fetch(
    'https://zeus.sii.cl/cvc_cgi/stc/CViewCaptcha.cgi',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'oper=0',
      signal: abort.signal,
    },
  );
  const { txtCaptcha } = (await captchaRes.json()) as { txtCaptcha: string };
  return {
    txtCaptcha,
    captchaCode: Buffer.from(txtCaptcha, 'base64')
      .toString('utf-8')
      .substring(36, 40),
  };
}
async function getPageStc(rut: string, dv: string, captcha: { captchaCode: string; txtCaptcha: string }, abort: AbortController) {
  const queryParams = new URLSearchParams({
    RUT: rut,
    DV: dv,
    PRG: 'STC',
    OPC: 'NOR',
    txt_code: captcha.captchaCode,
    txt_captcha: captcha.txtCaptcha,
  }).toString();

  const res = await fetch('https://zeus.sii.cl/cvc_cgi/stc/getstc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: queryParams,
    signal: abort.signal,
  });
  return await res.text();
}

function scrapingPage(html: string) {
  const $ = cheerio.load(html);
  const razon_social = $('strong:contains("Nombre o Razón Social")')
      .parent()
      .next()
      .text()
      .trim();
    const inicio_actividades = $('span:contains("Contribuyente presenta Inicio de Actividades")')
      .text()
      .split(':')
      .pop()
      ?.trim() ?? '';
    const fecha_inicio_actividades = $('span:contains("Fecha de Inicio de Actividades")')
      .text()
      .split(':')
      .pop()
      ?.trim() ?? '';
    const empresa_menor_tamano = $('span:contains("Empresa de Menor Tama")')
      .last()
      .text()
      .split(':')
      .pop()
      ?.trim() ?? '';
    const aut_moneda_extranjera = $('span:contains("moneda extranjera")')
      .text()
      .split(':')
      .pop()
      ?.trim() ?? '';

    const actividades = $('table')
      .first()
      .find('tr')
      .slice(1)
      .map((_, el) => {
        const tds = $(el).find('td font');
        return {
          giro: $(tds[0]).text().trim(),
          codigo: Number($(tds[1]).text().trim()),
          categoria: $(tds[2]).text().trim(),
          afecta: $(tds[3]).text().trim() === 'Si',
        };
      })
      .get();

    const documentos_timbrados = $('table.tabla tr')
      .slice(1)
      .map((_, el) => {
        const tds = $(el).find('td font');
        return {
          Documento: $(tds[0]).text().trim(),
          'Año último timbraje': $(tds[1]).text().trim(),
        };
      })
      .get();

    return {
      razon_social,
      inicio_actividades,
      fecha_inicio_actividades,
      empresa_menor_tamano,
      aut_moneda_extranjera,
      actividades,
      documentos_timbrados,
    };
}


export async function handleSii(fullRut: string): Promise<SituacionTributaria> {
  const [rut, dv] = fullRut.toUpperCase().split('-');
  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), 10_000);

  try {
    const captcha = await getCaptcha(abort);

    const htmlScraper = await getPageStc(rut, dv, captcha, abort);
    const data = scrapingPage(htmlScraper);

    return {...data, rut: fullRut};

  } 
  catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return {
        rut: fullRut,
        razon_social: '',
        inicio_actividades: '',
        fecha_inicio_actividades: '',
        empresa_menor_tamano: '',
        aut_moneda_extranjera: '',
        actividades: [],
        documentos_timbrados: [],
      };
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

}
