import ffmpeg from "fluent-ffmpeg";

/**
 * Extracts a thumbnail from a video file at 00:01.
 *
 * @param inputFile The input file path.
 * @param outputFile The output file path.
 */
export function extractVideoThumbnail(inputFile: string, outputFile: string) {
  return new Promise((resolve, reject) => {
    const command = ffmpeg();
    command
      .input(inputFile)
      .output(outputFile)
      .outputOptions(["-ss 00:00:01.000", "-vframes 1", "-c:v libwebp"])
      .on("error", err => {
        console.error(
          `An error occurred while extracting the thumbnail for ${inputFile}: ${err.message}`
        );
        reject(err);
      })
      .on("end", () => {
        resolve(true);
      })
      .run();
  });
}
