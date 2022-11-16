import { Module } from '@nestjs/common';
import { ProxyrmqModule } from '../proxyrmq/proxyrmq.module';
import { CategoriaController } from './categoria.controller';

@Module({
  imports: [ProxyrmqModule],
  controllers: [CategoriaController]
})
export class CategoriaModule {}
