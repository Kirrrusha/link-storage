"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmSQLITETestingModule = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const TypeOrmSQLITETestingModule = (entities) => [
    typeorm_1.TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities,
        synchronize: true,
    }),
    typeorm_1.TypeOrmModule.forFeature(entities),
];
exports.TypeOrmSQLITETestingModule = TypeOrmSQLITETestingModule;
//# sourceMappingURL=TypeORMSQLITETestingModule.js.map