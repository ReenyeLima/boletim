import { Test, TestingModule } from '@nestjs/testing';
import { AtividadesService } from './atividades.service';

describe('AtividadesService', () => {
  let service: AtividadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtividadesService],
    }).compile();

    service = module.get<AtividadesService>(AtividadesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
