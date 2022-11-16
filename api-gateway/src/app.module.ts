import { Module } from '@nestjs/common';
import { CategoriaModule } from './categoria/categoria.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { CommonModule } from './common/common.module';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';


@Module({
  imports: [CategoriaModule, JogadoresModule, CommonModule, ProxyrmqModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
