import { Module } from '@nestjs/common';
import { CategoriaService } from './categorias.service';
import { CategoriaController } from './categorias.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasSchema } from './interfaces/categoria.schema';
import { JogadorSchema } from '../jogadores/interfaces/jogador.schema';


@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Categoria', schema: CategoriasSchema },
    { name: 'Jogador', schema: JogadorSchema },
  ]),],
  providers: [CategoriaService],
  controllers: [CategoriaController]
})
export class CategoriasModule {}
