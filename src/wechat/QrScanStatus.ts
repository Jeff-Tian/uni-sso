import { EventEmitter } from 'events';

export default class QrScanStatus implements EventEmitter {
  addListener(event: string | symbol, listener: (...args: any[]) => void): this;
  addListener(event: string | symbol, listener: (...args: any[]) => void): this;
  addListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return undefined;
  }

  emit(event: string | symbol, ...args: any[]): boolean {
    return false;
  }

  eventNames(): Array<string | symbol> {
    return undefined;
  }

  getMaxListeners(): number {
    return 0;
  }

  listenerCount(type: string | symbol): number {
    return 0;
  }

  // tslint:disable-next-line:ban-types
  listeners(event: string | symbol): Function[] {
    return [];
  }

  off(event: string | symbol, listener: (...args: any[]) => void): this;
  off(event: string | symbol, listener: (...args: any[]) => void): this;
  off(event: string | symbol, listener: (...args: any[]) => void): this {
    return undefined;
  }

  on(event: string | symbol, listener: (...args: any[]) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this {
    return undefined;
  }

  once(event: string | symbol, listener: (...args: any[]) => void): this;
  once(event: string | symbol, listener: (...args: any[]) => void): this;
  once(event: string | symbol, listener: (...args: any[]) => void): this {
    return undefined;
  }

  prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
  prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
  prependListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return undefined;
  }

  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return undefined;
  }

  // tslint:disable-next-line:ban-types
  rawListeners(event: string | symbol): Function[] {
    return [];
  }

  removeAllListeners(event?: string | symbol): this;
  removeAllListeners(event?: string | symbol): this;
  removeAllListeners(event?: string | symbol): this {
    return undefined;
  }

  removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
  removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
  removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return undefined;
  }

  setMaxListeners(n: number): this;
  setMaxListeners(n: number): this;
  setMaxListeners(n: number): this {
    return undefined;
  }

}
