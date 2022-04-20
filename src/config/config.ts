import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Pool } from 'pg';
import { Users } from 'src/users/entities/users.entity';
import { UsersTranscript } from 'src/users-transcript/entities/users-transcript.entity'
import { Events } from 'src/collectibles/entities/events.entity';
import { Collectibles } from '../collectibles/entities/collectibles.entity';
import { Wallet } from '../wallet/entities/wallet.entity'

require('dotenv').config();

class ConfigService {
    constructor(private env: { [k: string]: string | undefined }) {}
  
    public getValue(key: string, throwOnMissing = true): string {
      const value = this.env[key];
      if (!value && throwOnMissing) { 
        throw new Error(`config error - missing env.${key}`);
      }
  
      return value;
    }
  
    public ensureValues(keys: string[]) {
      keys.forEach(k => this.getValue(k, true));
      return this;
    }
  
    public getPort() {
      return this.getValue('PORT', true);
    }
  
    public isProduction() {
      const mode = this.getValue('MODE', false);
      return mode != 'DEV';
    }
  
    public getTypeOrmConfig(): TypeOrmModuleOptions {
      return {
        type: 'postgres',
        host: this.getValue('POSTGRES_HOST'),
        port: parseInt(this.getValue('POSTGRES_PORT')),
        username: this.getValue('POSTGRES_USER'),
        password: this.getValue('POSTGRES_PASSWORD'),
        database: this.getValue('POSTGRES_DATABASE'),
        synchronize: !this.isProduction(),
        entities: [
          Users,
          UsersTranscript,
          Events,
          Collectibles,
          Wallet,
        ],
        migrationsTableName: 'migration',
        migrations: ['src/migration/*.ts'],
        cli: {
          migrationsDir: 'src/migration',
        },
        ssl: false,
      };
    }
  
    public getPoolPg() {
      return new Pool({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DATABASE,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432,
      });
    }
  }
  
  const configService = new ConfigService(process.env).ensureValues([
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DATABASE'
  ]);
  
  export { configService };