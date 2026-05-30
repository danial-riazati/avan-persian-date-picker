import { describe, it, expect } from 'vitest';
import { toJalali } from '../src/convert';

describe('@avan/core', () => {
  it('scaffold: Phase 1 tests go here', () => {
    expect(() => toJalali(new Date())).toThrow(/Phase 1/);
  });
});
