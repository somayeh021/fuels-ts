import { ErrorCode } from '@fuel-ts/errors';
import { bn, toHex } from '@fuel-ts/math';
import { getBytes } from 'ethers';

import { Coder } from './abstract-coder';

export class AssetIdCoder extends Coder<string, string> {
  constructor() {
    super('AssetId', 'struct AssetId', 32);
  }

  encode(value: string): Uint8Array {
    let encodedValue;
    try {
      encodedValue = getBytes(value);
    } catch (error) {
      this.throwError(ErrorCode.ENCODE_ERROR, `Invalid ${this.type}.`);
    }
    if (encodedValue.length !== 32) {
      this.throwError(ErrorCode.ENCODE_ERROR, `Invalid ${this.type}.`);
    }
    return encodedValue;
  }

  decode(data: Uint8Array, offset: number): [string, number] {
    let bytes = data.slice(offset, offset + 32);
    const decoded = bn(bytes);
    if (decoded.isZero()) {
      bytes = new Uint8Array(32);
    }
    if (bytes.length !== 32) {
      this.throwError(ErrorCode.DECODE_ERROR, `Invalid size for AssetId.`);
    }
    return [toHex(bytes, 32), offset + 32];
  }
}
