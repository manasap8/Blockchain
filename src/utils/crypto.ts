/**
 * Cryptographic utility functions for BLOCKSHIELD
 * Utilizes standard Web Crypto API (SubtleCrypto)
 */

export async function computeSha256(data: string | ArrayBuffer): Promise<string> {
  let buffer: ArrayBuffer;
  if (typeof data === 'string') {
    const encoder = new TextEncoder();
    buffer = encoder.encode(data).buffer;
  } else {
    buffer = data;
  }

  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `0x${hex}`;
}

export function formatTruncated(text: string, frontChars = 8, backChars = 6): string {
  if (!text) return '';
  if (text.length <= frontChars + backChars + 3) return text;
  return `${text.slice(0, frontChars)}...${text.slice(-backChars)}`;
}

export function generateRandomHex(bytes = 32): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return '0x' + Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

export function generateSimulatedZkProof(input: {
  isFinanceManager: boolean;
  department: string;
  minimumClearanceMet: boolean;
}) {
  const seed = `${input.department}-${input.isFinanceManager}-${Date.now()}`;
  const h1 = generateRandomHex(32);
  const h2 = generateRandomHex(32);
  const h3 = generateRandomHex(32);
  const h4 = generateRandomHex(32);

  return {
    circuit: 'selective_disclosure_manager_auth.circom',
    protocol: 'Groth16 / BN128' as const,
    pi_a: [
      `0x${h1.slice(2, 34)}`,
      `0x${h1.slice(34, 66)}`
    ] as [string, string],
    pi_b: [
      [`0x${h2.slice(2, 34)}`, `0x${h2.slice(34, 66)}`],
      [`0x${h3.slice(2, 34)}`, `0x${h3.slice(34, 66)}`]
    ] as [[string, string], [string, string]],
    pi_c: [
      `0x${h4.slice(2, 34)}`,
      `0x${h4.slice(34, 66)}`
    ] as [string, string],
    publicSignals: [
      input.isFinanceManager ? '0x0000000000000000000000000000000000000001' : '0x0000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000002', // Department code hash
      '0x0000000000000000000000000000000000000001'  // Active credential valid status
    ],
    verificationStatus: input.isFinanceManager ? ('VALID' as const) : ('INVALID' as const),
    verifiedAt: new Date().toISOString()
  };
}

export function computeMerkleRoot(hashes: string[]): string {
  if (hashes.length === 0) return '0x0000000000000000000000000000000000000000000000000000000000000000';
  let layer = [...hashes];
  while (layer.length > 1) {
    const nextLayer: string[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i];
      const right = i + 1 < layer.length ? layer[i + 1] : left;
      // Simple deterministic pair hash
      let combined = 0;
      for (let c = 0; c < 16; c++) {
        combined = (combined * 31 + left.charCodeAt(c % left.length) + right.charCodeAt(c % right.length)) >>> 0;
      }
      nextLayer.push('0x' + combined.toString(16).padStart(8, '0') + left.slice(10, 34));
    }
    layer = nextLayer;
  }
  return layer[0];
}

/**
 * Generate a deterministic SVG QR-style visual matrix from any string
 * Lightweight, zero-dependency, works completely offline
 */
export function generateSvgQrMatrix(value: string, size = 160): string {
  const hash = Math.abs(
    value.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  );

  const gridSize = 19;
  const cellSize = size / gridSize;
  const cells: { x: number; y: number }[] = [];

  // Corner finder patterns (7x7)
  const isCorner = (r: number, c: number) => {
    // Top-left
    if (r < 7 && c < 7) {
      return r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
    }
    // Top-right
    if (r < 7 && c >= gridSize - 7) {
      const ac = c - (gridSize - 7);
      return r === 0 || r === 6 || ac === 0 || ac === 6 || (r >= 2 && r <= 4 && ac >= 2 && ac <= 4);
    }
    // Bottom-left
    if (r >= gridSize - 7 && c < 7) {
      const ar = r - (gridSize - 7);
      return ar === 0 || ar === 6 || c === 0 || c === 6 || (ar >= 2 && ar <= 4 && c >= 2 && c <= 4);
    }
    return false;
  };

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (isCorner(r, c)) {
        cells.push({ x: c * cellSize, y: r * cellSize });
      } else {
        // Deterministic pseudo-random fill
        const bit = ((hash ^ (r * 37 + c * 17)) + (r * c)) % 3 === 0;
        if (bit) {
          cells.push({ x: c * cellSize, y: r * cellSize });
        }
      }
    }
  }

  const rects = cells
    .map(cell => `<rect x="${cell.x.toFixed(1)}" y="${cell.y.toFixed(1)}" width="${cellSize.toFixed(1)}" height="${cellSize.toFixed(1)}" fill="currentColor" />`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${rects}</svg>`;
}
