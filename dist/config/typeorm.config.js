"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
exports.typeOrmConfig = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    autoLoadEntities: true,
    synchronize: true,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
};
//# sourceMappingURL=typeorm.config.js.map