import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AtualizarCategoriaDto } from '../categoria/dtos/atualizar-categoria.dto';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';
import { AtualizarJogadorDto } from './dtos/autializar-jogador.dto';
import { CriarJogadorDto } from './dtos/criar-jogadorDto';

@Controller('api/v1/jogadores')
export class JogadoresController {

    constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

    private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance()

    @Post()
    @UsePipes(ValidationPipe)
    async criarJogador(
        @Body() criarJogadorDto: CriarJogadorDto) {

        //Checando se a categoria existe
        const categoria = await this.clientAdminBackend.send('consultar-categorias', criarJogadorDto.categoria).toPromise()

        if(categoria) {
            this.clientAdminBackend.emit('criar-jogador', criarJogadorDto)
        } else {
            throw new BadRequestException(`Categoria não cadastrada!`)
        }
    }

    @Get()
    consultarJogadores(@Query('idJogador') _id: string) {
        return this.clientAdminBackend.send('consultar-jogadores', _id ? _id : '')
    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async atualizarJogador(
        @Body() atualizarJogadorDto: AtualizarJogadorDto,
        @Param('_id', ValidacaoParametrosPipe) _id: string) {
            
        //Checando se a categoria existe
        const categoria = await this.clientAdminBackend.send('consultar-categorias', atualizarJogadorDto.categoria).toPromise()

        if(categoria) {
            this.clientAdminBackend.emit('atualizar-jogador', 
        { id: _id, jogador: atualizarJogadorDto })
        } else {
            throw new BadRequestException(`Categoria não cadastrada!`)
        }
        
    }

    @Delete('/:_id')
    async deletarJogador(
        @Param('_id', ValidacaoParametrosPipe) _id: String) {
            this.clientAdminBackend.emit('deletar-jogador', _id)
        }
}
