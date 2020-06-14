import { Injectable } from '@nestjs/common';
import { ConfigService } from './config/config.service';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }

  getConfig(): string {
    return this.configService.get('env') as string;
  }
}
