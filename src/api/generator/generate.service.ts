import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { GenerateDto } from './dto/generate.dto';

@Injectable()
export class GenerateService {
  constructor(@InjectQueue('generate-queue') private queue: Queue) {}

  async enqueue(dto: GenerateDto) {
    const job = await this.queue.add('generate-crud', dto);
    return { jobId: job.id };
  }
}
