import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Veritabanı ayarları:
 * - DATABASE_URL varsa PostgreSQL'e bağlanır (ör. Neon). Neon adresindeki
 *   `sslmode=require` sayesinde SSL otomatik açılır.
 * - Yoksa yerel geliştirme için SQLite dosyası kullanılır (kurulum gerekmez).
 */
export function buildDatabaseOptions(
  env: NodeJS.ProcessEnv = process.env,
): TypeOrmModuleOptions {
  if (env.DATABASE_URL) {
    return {
      type: 'postgres',
      url: env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: env.DB_SYNCHRONIZE !== 'false',
    };
  }

  return {
    type: 'sqlite',
    database: env.SQLITE_PATH || 'database.sqlite',
    autoLoadEntities: true,
    synchronize: true,
  };
}
