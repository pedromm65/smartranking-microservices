import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Jogador } from '../jogadores/interfaces/jogador.interface';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';

@Controller('api/v1/desafios')
export class DesafiosController {
    constructor(
        private clientProxySmartRanking: ClientProxySmartRanking,
    ) {}
    
    private clientDesafios = this.clientProxySmartRanking.getClientProxyDesafioInstance()
    private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance()
    

    @Post()
    async criarDesafio(@Body() data: CriarDesafioDto) {
        const jogadores: Jogador[] = await this.clientAdminBackend.send('consultar-jogadores', '').toPromise()
        
        data.jogadores.map(jogadorDto => {
            const jogadorFilter: Jogador[] = jogadores.filter(jogador => jogador._id == jogadorDto._id)

            if (jogadorFilter.length == 0) {
                throw new BadRequestException(`O id ${jogadorDto._id} não é de um jogador!`)
            }

            if (jogadorFilter[0].categoria != data.categoria) {
                throw new BadRequestException(`O jogador ${jogadorFilter[0]._id} não faz parte da categoria informada!`)
            }
        })

        const solicitanteEhJogadorDaPartida: Jogador[] = data.jogadores.filter(jogador => jogador._id == data.solicitante )


            if(solicitanteEhJogadorDaPartida.length == 0) {
                throw new BadRequestException(`O solicitante deve ser um jogador da partida!`)
            }

            const categoria = await this.clientAdminBackend.send('consultar-categorias', data.categoria).toPromise()

            if (!categoria) {
                throw new BadRequestException(`Categoria informada não existe!`)
            }

            this.clientDesafios.emit('criar-desafio', data)
    }

    @Get()
    async consultarDesafios(@Query('idJogador') idJogador: string): Promise<any> {
        if ( idJogador ) {
            const jogador: Jogador = await this.clientAdminBackend.send('consultar-jogadores', idJogador ).toPromise()
            if (!jogador) {
                throw new BadRequestException(`Jogador não cadastrado!`)

            }
        }

        return this.clientDesafios.send('consultar-desafios', { idJogador: idJogador , _id: '' }).toPromise()
    }

}
