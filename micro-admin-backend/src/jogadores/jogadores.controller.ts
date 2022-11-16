import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Jogador } from './interfaces/jogador.interface';

const ackErrors: string[] = ['E11000']

@Controller()
export class JogadoresController {

    logger = new Logger(JogadoresController.name)

    @EventPattern('criar-jogador')
    async criarJogar(@Payload() jogador: Jogador, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef()
        const message = context.getMessage()

        this.logger.log(`jogador ${JSON.stringify(jogador)}`)
    }
}
