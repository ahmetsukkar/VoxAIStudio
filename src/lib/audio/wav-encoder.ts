/**
 * Encodes raw PCM audio chunks into a single WAV file buffer.
 *
 * @param pcmChunks - Array of raw PCM audio chunks (Uint8Array or Buffer)
 * @param sampleRate - Audio sample rate in Hz (default: 24000 — Gemini's output rate)
 * @param channels   - Number of audio channels (default: 1 — mono)
 * @param bitDepth   - Bits per sample (default: 16)
 */
export function encodeWav(
  pcmChunks: Uint8Array[],
  sampleRate = 24000,
  channels = 1,
  bitDepth = 16,
): Buffer {
  const totalPcmLength = pcmChunks.reduce((sum, c) => sum + c.byteLength, 0);
  const fileSize = 44 + totalPcmLength;
  const buffer = Buffer.alloc(fileSize);
  let offset = 0;

  // RIFF header
  buffer.write("RIFF", offset);           offset += 4;
  buffer.writeUInt32LE(fileSize - 8, offset); offset += 4;
  buffer.write("WAVE", offset);           offset += 4;

  // fmt chunk
  buffer.write("fmt ", offset);           offset += 4;
  buffer.writeUInt32LE(16, offset);       offset += 4; // chunk size
  buffer.writeUInt16LE(1, offset);        offset += 2; // PCM format
  buffer.writeUInt16LE(channels, offset); offset += 2;
  buffer.writeUInt32LE(sampleRate, offset); offset += 4;
  buffer.writeUInt32LE(sampleRate * channels * (bitDepth / 8), offset); offset += 4;
  buffer.writeUInt16LE(channels * (bitDepth / 8), offset); offset += 2;
  buffer.writeUInt16LE(bitDepth, offset); offset += 2;

  // data chunk
  buffer.write("data", offset);           offset += 4;
  buffer.writeUInt32LE(totalPcmLength, offset); offset += 4;

  for (const chunk of pcmChunks) {
    Buffer.from(chunk).copy(buffer, offset);
    offset += chunk.byteLength;
  }

  return buffer;
}
