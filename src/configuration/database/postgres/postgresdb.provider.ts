import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const PostgresdbProvider = {
  provide: 'POSTGRES_POOL',
  useFactory: async (configService: ConfigService) => {
    try {
      const pool = new Pool({
        host: configService.get<string>('PG_HOST'),
        port: parseInt(configService.get<string>('PG_PORT') || '5432', 10),
        user: configService.get<string>('PG_USER'),
        password: configService.get<string>('PG_PASSWORD'),
        database: configService.get<string>('PG_DATABASE'),
        max: parseInt(configService.get<string>('PG_POOL_MAX') || '20', 10),
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 20000,
        ssl:
          configService.get<string>('PG_SSL') === 'true'
            ? { rejectUnauthorized: false }
            : undefined,
      });

      // probar que conecta
      const client = await pool.connect();
      console.log('✅ Pool de Postgres creado');
      client.release();

      return pool;
    } catch (err) {
      console.error('❌ Error creando el pool de Postgres:', err);
      throw err;
    }
  },
  inject: [ConfigService],
};
