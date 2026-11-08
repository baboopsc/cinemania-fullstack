import { BadRequestException } from '@nestjs/common';
import {
  optionalRating,
  requireEmail,
  requirePositiveInt,
  requireString,
} from './validation';

describe('validation helpers', () => {
  it('trims and accepts a normal string', () => {
    expect(requireString('  hello  ', 'content')).toBe('hello');
  });

  it('rejects empty or too long strings', () => {
    expect(() => requireString('   ', 'content')).toThrow(BadRequestException);
    expect(() => requireString('a'.repeat(11), 'content', 10)).toThrow(
      BadRequestException,
    );
  });

  it('normalises and validates emails', () => {
    expect(requireEmail('Ali@Example.com')).toBe('ali@example.com');
    expect(() => requireEmail('not-an-email')).toThrow(BadRequestException);
  });

  it('accepts only positive integers for ids', () => {
    expect(requirePositiveInt(5, 'userId')).toBe(5);
    expect(requirePositiveInt('7', 'movieId')).toBe(7);
    expect(() => requirePositiveInt(0, 'userId')).toThrow(BadRequestException);
    expect(() => requirePositiveInt(1.5, 'userId')).toThrow(BadRequestException);
  });

  it('allows a missing rating but rejects out-of-range values', () => {
    expect(optionalRating(undefined)).toBeNull();
    expect(optionalRating(7)).toBe(7);
    expect(() => optionalRating(11)).toThrow(BadRequestException);
    expect(() => optionalRating('5')).toThrow(BadRequestException);
  });
});
