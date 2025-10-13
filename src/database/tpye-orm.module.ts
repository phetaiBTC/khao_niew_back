import { Module } from "@nestjs/common";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { baseEnv } from "src/besa.env";


@Module({
    imports: [TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            return {
                type: 'mysql',
                host: baseEnv.DB_HOST,
                port: baseEnv.DB_PORT as number,
                username: baseEnv.DB_USERNAME,
                password: baseEnv.DB_PASSWORD,
                database: baseEnv.DB_NAME,
                autoLoadEntities: true,
                synchronize: true
            }
        }
    })],
})
export class TypeOrmConfig { }