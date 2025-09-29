import { Test, TestingModule } from '@nestjs/testing';
import { AulasService } from './aulas.service';

describe('AulasService', () => {
  let service: AulasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AulasService],
    }).compile();

    service = module.get<AulasService>(AulasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
