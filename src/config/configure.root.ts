import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

// TODO посмотреть конфиг модуль, как его лучше написать
export const configModule = ConfigModule.forRoot({
    load: [configuration],
});
