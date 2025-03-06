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
      .outputOptions([
        "-vframes 1", // Get the first frame
        "-q:v 2", // High-quality output
        "-c:v mjpeg", // Use MJPEG for thumbnail
        "-f image2", // Force image format
      ])
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
