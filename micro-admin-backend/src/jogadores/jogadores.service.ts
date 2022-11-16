import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
    constructor(
        @InjectModel('Jogador') private readonly jogadoresModel: Model<Jogador>
    ) {}

    private readonly logger = new Logger(JogadoresService.name)

    async criarJogador(jogador: Jogador): Promise<Jogador> {

        try {
            const jogadorCriado = new this.jogadoresModel(jogador)
            return await jogadorCriado.save()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async consultarTodosJogadores(): Promise<Array<Jogador>> {
        try {
            return await this.jogadoresModel.find().exec()
        } catch(error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async consultarJogadorPeloId(_id: string): Promise<Jogador> {
        try {
            return await this.jogadoresModel.findOne({ _id }).exec()
        } catch(error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async atualizarJogador(_id: string, jogador: Jogador) {
        try {
            await this.jogadoresModel.findOneAndUpdate({ _id }, { $set: jogador }).exec()
        } catch(error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async deletarJogador(_id: string) {
        try {
            await this.jogadoresModel.findOneAndDelete({ _id }).exec()
        } catch(error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }
}
