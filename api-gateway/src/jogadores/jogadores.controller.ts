import { BadRequestException, Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from '../aws/aws.service';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { CriarJogadorDto } from './dtos/criar-jogadorDto';

@Controller('api/v1/jogadores')
export class JogadoresController {

    private logger = new Logger(JogadoresController.name)
    constructor(
        private clientProxySmartRanking: ClientProxySmartRanking,
        private awsService: AwsService ) {}

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

    @Post('/:_id/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadArquivo(
        @UploadedFile() file,
        @Param('_id') _id: string) {
            // this.logger.log(file)

            const jogador = await this.clientAdminBackend.send('consultar-jogadores', _id).toPromise()

            if (!jogador) {
                throw new BadRequestException(`Jogador não encontrado!`)
            }

            const urlFotoJogador = await this.awsService.uploadArquivo(file, _id)

            const atualizarJogadorDto: AtualizarJogadorDto = {}
            atualizarJogadorDto.urlFotoJogador = urlFotoJogador.url

            this.clientAdminBackend.emit('atualizar-jogador', { id: _id, jogador: atualizarJogadorDto })

            return this.clientAdminBackend.send('consultar-jogadores', _id)

            
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
