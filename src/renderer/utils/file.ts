export async function convertBlobToArrayBuffer(
  blob: Blob
): Promise<ArrayBuffer> {
  return blob.arrayBuffer();
}
