import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Test } from './entities/Test.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Test) private readonly testRepository: Repository<Test>,
  ) {}

  async getHello(): Promise<string> {
    const test = { name: 'hihiha' };
    await this.testRepository.save(test);
    return 'Hello World!';
  }
}
