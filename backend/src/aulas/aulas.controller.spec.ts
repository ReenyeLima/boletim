import { Test, TestingModule } from '@nestjs/testing';
import { AulasController } from './aulas.controller';
import { AulasService } from './aulas.service';

describe('AulasController', () => {
  let controller: AulasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AulasController],
      providers: [AulasService],
    }).compile();

    controller = module.get<AulasController>(AulasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
