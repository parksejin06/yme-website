import fs from "node:fs";
import zlib from "node:zlib";

// Minimal ZIP central-directory reader (no external dependency). Needed
// because ExcelJS's drawing-reconcile step throws on this particular
// workbook's drawing relationships (`Cannot read properties of undefined
// (reading 'anchors')`), so we read the xlsx (which is just a zip of XML
// parts) directly instead.
export function readZip(filePath) {
  const buf = fs.readFileSync(filePath);

  let eocdOffset = -1;
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset === -1) throw new Error(`ZIP end-of-central-directory not found in ${filePath}`);

  const cdEntries = buf.readUInt16LE(eocdOffset + 10);
  let offset = buf.readUInt32LE(eocdOffset + 16);

  const entries = new Map();
  for (let i = 0; i < cdEntries; i++) {
    if (buf.readUInt32LE(offset) !== 0x02014b50) throw new Error(`Bad ZIP central directory entry in ${filePath}`);
    const compMethod = buf.readUInt16LE(offset + 10);
    const compSize = buf.readUInt32LE(offset + 20);
    const nameLen = buf.readUInt16LE(offset + 28);
    const extraLen = buf.readUInt16LE(offset + 30);
    const commentLen = buf.readUInt16LE(offset + 32);
    const localHeaderOffset = buf.readUInt32LE(offset + 42);
    const name = buf.toString("utf-8", offset + 46, offset + 46 + nameLen);
    entries.set(name, { compMethod, compSize, localHeaderOffset });
    offset += 46 + nameLen + extraLen + commentLen;
  }

  function getFile(name) {
    const meta = entries.get(name);
    if (!meta) return null;
    const lh = meta.localHeaderOffset;
    const nameLen = buf.readUInt16LE(lh + 26);
    const extraLen = buf.readUInt16LE(lh + 28);
    const dataStart = lh + 30 + nameLen + extraLen;
    const raw = buf.subarray(dataStart, dataStart + meta.compSize);
    if (meta.compMethod === 0) return Buffer.from(raw);
    if (meta.compMethod === 8) return zlib.inflateRawSync(raw);
    throw new Error(`Unsupported ZIP compression method ${meta.compMethod} for ${name} in ${filePath}`);
  }

  return { names: [...entries.keys()], getFile };
}
