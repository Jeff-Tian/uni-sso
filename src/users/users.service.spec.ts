import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from 'nestjs-typegoose';
import { User } from './user.model';
import { User as UserEntity } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserAttribute } from './user-attribute.entity';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getModelToken('User'), useValue: User },
        { provide: getRepositoryToken(UserEntity), useValue: {} },
        { provide: getRepositoryToken(UserAttribute), useValue: {} },
        UsersService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
