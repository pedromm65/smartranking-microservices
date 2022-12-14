import { Controller, Get, Logger, Post } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CategoriaService } from './categorias.service';
import { Categoria } from './interfaces/categoria.interface';


const ackErrors: string[] = ['E11000']

@Controller()
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  logger = new Logger(CategoriaController.name)


  @EventPattern('criar-categoria')
  async criarCategoria(
    @Payload() categoria: Categoria, @Ctx() context: RmqContext ) {

    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()

    this.logger.log(`categoria ${JSON.stringify(categoria)}`)

    try {   
      await this.categoriaService.criarCategoria(categoria)
      await channel.ack(originalMsg)

    } catch(error) {

      this.logger.error(`error: ${JSON.stringify(error.message)}`)

      const filterAckError = ackErrors.filter(
        ackError => error.message.includes(ackError))

      if(filterAckError) {
        await channel.ack(originalMsg)
      }
    }

  }

  @MessagePattern('consultar-categorias')
  async consultarCategorias(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    try {
      if(_id) {
        return await this.categoriaService.consultarCategoriaPeloId(_id)
      } else {
        return await this.categoriaService.consultarTodasCategorias()
      }
    } finally {
      await channel.ack(originalMsg)
    }
  }

  @EventPattern('atualizar-categoria')
  async atualizarCategoria(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()

    this.logger.log(`data: ${JSON.stringify(data)}`)

    try {
      const _id: string = data._id
      const categoria: Categoria = data.categoria
      await this.categoriaService.atualizarCategoria(_id, categoria)
      await channel.ack(originalMsg)
    } catch(error) {

      this.logger.error(`error: ${JSON.stringify(error.message)}`)

      const filterAckError = ackErrors.filter(
        ackError => error.message.includes(ackError))

      if(filterAckError) {
        await channel.ack(originalMsg)
      }
    }
  }
}
