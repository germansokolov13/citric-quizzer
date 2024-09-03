import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'node:path';

dotenv.config({
  path: path.join(__dirname, '..', '.env'),
});

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  logging: true,
  logger: 'advanced-console',
});

export default dataSource;
