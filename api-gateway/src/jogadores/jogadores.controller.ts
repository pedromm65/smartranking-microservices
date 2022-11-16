import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AtualizarCategoriaDto } from '../categoria/dtos/atualizar-categoria.dto';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';
import { CriarJogadorDto } from './dtos/criar-jogadorDto';

@Controller('api/v1/jogadores')
export class JogadoresController {

    constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

    private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance()

    @Post()
    @UsePipes(ValidationPipe)
    async criarJogador(
        @Body() criarJogadorDto: CriarJogadorDto
    ) {
        this.clientAdminBackend.emit('criar-jogador', criarJogadorDto)
    }

    @Get()
    async consultarJogadores(@Query('idJogador') _id: string) {
        this.clientAdminBackend.send('consultar-jogadores', _id ? _id : '')
    }

    @Put('/:id')
    @UsePipes(ValidationPipe)
    async atualizarJogador(
        @Body() atualizarJogadorDto: AtualizarCategoriaDto,
        @Param('_id', ValidacaoParametrosPipe) _id: string
    ) {
        this.clientAdminBackend.emit('atualizar-jogador', 
        { id: _id, jogador: atualizarJogadorDto })
    }

    @Delete('/:id')
    async deletarJogador(
        @Param('_id', ValidacaoParametrosPipe) _id: String) {
            this.clientAdminBackend.emit('deletar-jogador', _id)
        }
}
