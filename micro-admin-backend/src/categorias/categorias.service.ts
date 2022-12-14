import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jogador } from '../jogadores/interfaces/jogador.interface';
import { Categoria } from './interfaces/categoria.interface';


@Injectable()
export class CategoriaService {

  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>
  ) {}

  private readonly logger = new Logger(CategoriaService.name)


  async criarCategoria(categoria: Categoria): Promise<Categoria> {

    try {
      const categoriaCriada = new this.categoriaModel(categoria)
      return await categoriaCriada.save()
  } catch(error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

  async consultarTodasCategorias(): Promise<Array<Categoria>> {
    try {
      return await this.categoriaModel.find().populate("jogadores").exec();
    } catch(error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
}

  async consultarCategoriaPeloId(_id: string): Promise<Categoria> {

    try {
      return await this.categoriaModel.findOne({ _id }).exec();
    } catch(error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

  async atualizarCategoria(_id: string, categoria: Categoria): Promise<void> {
    try {
      await this.categoriaModel.findOneAndUpdate({ _id }, { $set: categoria }).exec()
    } catch(error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

}
