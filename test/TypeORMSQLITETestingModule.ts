import { TypeOrmModule } from '@nestjs/typeorm';

export const TypeOrmSQLITETestingModule = (entities) => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities,
    synchronize: true,
  }),
  TypeOrmModule.forFeature(entities),
];
