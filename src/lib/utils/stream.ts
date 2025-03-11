import internal, { Readable } from "stream";

/**
 * Gets the full buffer from the stream.
 *
 * @param readable the readable stream
 * @returns a buffer from the stream
 */
export async function readableToBuffer(
  readable: internal.Readable
): Promise<Buffer> {
  if (!readable || typeof readable.on !== "function") {
    throw new TypeError("Input must be a Readable stream");
  }

  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    readable.on("data", (chunk: Buffer) => chunks.push(chunk));
    readable.on("end", () => resolve(Buffer.concat(chunks)));
    readable.on("error", reject);
  });
}

/**
 * Converts a ReadableStream to a Node.js Readable stream
 *
 * @param readableStream the readable stream
 * @returns a node stream
 */
export function readableStreamToNodeStream(
  readableStream: ReadableStream<Uint8Array>
): Readable {
  const reader = readableStream.getReader();
  const nodeStream = new Readable({
    read() {
      reader.read().then(
        ({ value, done }) => {
          if (done) {
            this.push(null);
          } else {
            this.push(Buffer.from(value));
          }
        },
        (error) => {
          this.destroy(error);
        }
      );
    },
  });

  return nodeStream;
}
