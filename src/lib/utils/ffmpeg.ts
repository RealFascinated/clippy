import childProcess from "child_process";

/**
 * Extracts a thumbnail from a video file at 00:01.
 *
 * @param inputFile The input file path.
 * @param outputFile The output file path.
 */
export function extractVideoThumbnail(inputFile: string, outputFile: string) {
  return new Promise((resolve, reject) => {
    const command = childProcess.spawn("ffmpeg", [
      "-i",
      inputFile,
      "-vframes",
      "1",
      "-filter:v",
      "thumbnail",
      "-c:v",
      "mjpeg",
      outputFile,
    ]);

    command.on("error", (err) => {
      console.error(
        `An error occurred while extracting the thumbnail for ${inputFile}: ${err.message}`
      );
      reject(err);
    });

    command.on("close", () => {
      resolve(true);
    });
  });
}
