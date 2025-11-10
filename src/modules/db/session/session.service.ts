// src/modules/session/session.service.ts
import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class SessionService {
  constructor(
    @Inject('POSTGRES_POOL')
    private readonly pgPool: Pool,
  ) { }

  async findByUser(userId: string) {
    try {
      const result = await this.pgPool.query(
        `SELECT id, user_id, channel, created_at
         FROM session
         WHERE user_id = $1`,
        [userId],
      );
      return result.rows[0] ?? null;
    } catch (error) {
      console.error('Error findByUser:', error);
      throw new HttpException(
        'Error al consultar sesión en Postgres',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    const result = await this.pgPool.query(
      'SELECT id, user_id, channel, created_at FROM session ORDER BY created_at DESC',
    );
    return result.rows;
  }
}
