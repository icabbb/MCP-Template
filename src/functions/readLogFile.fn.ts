import { readFile } from "fs/promises";

const logFilePath = "/Volumes/SSD_EVO/sample_data/app_sample.log";

export async function readLogFile() {
  try {
    //const filePath = fileURLToPath(uri);
    const logContents = await readFile(logFilePath, "utf-8");
    return {
      contents: [
        {
          uri: "log://app_sample",
          mimeType: "text/plain",
          text: logContents,
        },
      ],
    };
  } catch (error) {
    return {
      contents: [
        {
          uri: "log://app_sample",
          mimeType: "text/plain",
          text: "Error reading log file",
        },
      ],
      isError: true,
    };
  }
}
