import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type AppConfig = {
  PORT: string;

  DB_HOST: string;
  DB_PORT: string;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
};

@Injectable()
export class AppConfigService extends ConfigService<AppConfig> {}
