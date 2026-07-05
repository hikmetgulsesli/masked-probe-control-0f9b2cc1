import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

const rafHandles = new Set<number>();
const intervalHandles = new Set<ReturnType<typeof globalThis.setInterval>>();
const timeoutHandles = new Set<ReturnType<typeof globalThis.setTimeout>>();
const realRequestAnimationFrame = globalThis.requestAnimationFrame;
const realCancelAnimationFrame = globalThis.cancelAnimationFrame;
const realSetInterval = globalThis.setInterval;
const realClearInterval = globalThis.clearInterval;
const realSetTimeout = globalThis.setTimeout;
const realClearTimeout = globalThis.clearTimeout;

globalThis.requestAnimationFrame = ((callback: FrameRequestCallback) => {
  const handle = (realRequestAnimationFrame
    ? realRequestAnimationFrame(callback)
    : globalThis.setTimeout(() => callback(Date.now()), 16)) as number;
  rafHandles.add(handle);
  return handle;
}) as typeof requestAnimationFrame;

globalThis.cancelAnimationFrame = ((handle: number) => {
  rafHandles.delete(handle);
  if (realCancelAnimationFrame) realCancelAnimationFrame(handle);
  else globalThis.clearTimeout(handle);
}) as typeof cancelAnimationFrame;

globalThis.setInterval = ((handler: TimerHandler, timeout?: number, ...args: any[]) => {
  const handle = realSetInterval(handler, timeout, ...args);
  intervalHandles.add(handle);
  return handle;
}) as typeof setInterval;

globalThis.clearInterval = ((handle: ReturnType<typeof setInterval>) => {
  intervalHandles.delete(handle);
  realClearInterval(handle);
}) as typeof clearInterval;

globalThis.setTimeout = ((handler: TimerHandler, timeout?: number, ...args: any[]) => {
  const handle = realSetTimeout(handler, timeout, ...args);
  timeoutHandles.add(handle);
  return handle;
}) as typeof setTimeout;

globalThis.clearTimeout = ((handle: ReturnType<typeof setTimeout>) => {
  timeoutHandles.delete(handle);
  realClearTimeout(handle);
}) as typeof clearTimeout;

afterEach(() => {
  cleanup();
  for (const handle of Array.from(rafHandles)) {
    globalThis.cancelAnimationFrame(handle);
  }
  rafHandles.clear();
  for (const handle of Array.from(intervalHandles)) {
    globalThis.clearInterval(handle);
  }
  intervalHandles.clear();
  for (const handle of Array.from(timeoutHandles)) {
    globalThis.clearTimeout(handle);
  }
  timeoutHandles.clear();
});
