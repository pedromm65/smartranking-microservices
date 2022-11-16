import { Module } from '@nestjs/common';
import { AwsModule } from '../aws/aws.module';
import { ProxyrmqModule } from '../proxyrmq/proxyrmq.module';
import { JogadoresController } from './jogadores.controller';

@Module({
    imports: [ProxyrmqModule, AwsModule],
    controllers: [JogadoresController],
})
export class JogadoresModule {}
