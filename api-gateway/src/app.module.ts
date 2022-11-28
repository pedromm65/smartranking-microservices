import { Module } from '@nestjs/common';
import { CategoriaModule } from './categoria/categoria.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { CommonModule } from './common/common.module';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';
import { AwsModule } from './aws/aws.module';
import { ClientProxySmartRanking } from './proxyrmq/client-proxy';
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [CategoriaModule, JogadoresModule, CommonModule, ProxyrmqModule, AwsModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [ClientProxySmartRanking],
})
export class AppModule {}
