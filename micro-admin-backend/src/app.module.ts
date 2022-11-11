import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriasSchema } from './interfaces/categorias/categoria.schema';
import { JogadorSchema } from './interfaces/jogadores/jogador.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:ii1eLNKOnZSB9P2m@cluster0.e0oiaub.mongodb.net/sradmbackend?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      { name: 'Categoria', schema: CategoriasSchema },
      { name: 'Jogador', schema: JogadorSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
