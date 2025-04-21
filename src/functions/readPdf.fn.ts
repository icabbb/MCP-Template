import { fileURLToPath } from "url";
import { PdfReader } from "pdfreader";

const pdfFilePath = "file:///Volumes/SSD_EVO/sample_data/cobol-es.pdf";

function parsePdf(pdfFilePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const lines: string[] = [];
    new PdfReader().parseFileItems(pdfFilePath, (err, item) => {
      if (err) {
        return reject(err);
      }
      if (!item) {
        return resolve(lines.join(" "));
      }
      if (item.text) {
        lines.push(item.text);
      }
    });
  });
}

export async function readPdf(uri: string) {
  try {
    const filePath = fileURLToPath(pdfFilePath);
    //const buffer = await readFile(filePath);
    console.error(filePath);
    const data = await parsePdf(filePath);
    console.error(data);
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: data, //buffer.toString("base64"),
        },
      ],
    };
  } catch (error) {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: "Error reading Pdf file",
        },
      ],
      isError: true,
    };
  }
}
