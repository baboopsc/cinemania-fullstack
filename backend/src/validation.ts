import { BadRequestException } from '@nestjs/common';

// Basit girdi doğrulama yardımcıları (ek paket gerektirmez)

export function requireString(
  value: unknown,
  field: string,
  maxLength = 255,
): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new BadRequestException(`${field} is required`);
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new BadRequestException(
      `${field} must be at most ${maxLength} characters`,
    );
  }
  return trimmed;
}

export function requirePositiveInt(value: unknown, field: string): number {
  const num = typeof value === 'string' ? Number(value) : value;
  if (typeof num !== 'number' || !Number.isInteger(num) || num <= 0) {
    throw new BadRequestException(`${field} must be a positive integer`);
  }
  return num;
}

export function requireEmail(value: unknown): string {
  const email = requireString(value, 'email').toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new BadRequestException('email is not valid');
  }
  return email;
}

export function optionalRating(value: unknown): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'number' || Number.isNaN(value) || value < 0 || value > 10) {
    throw new BadRequestException('rating must be a number between 0 and 10');
  }
  return value;
}
