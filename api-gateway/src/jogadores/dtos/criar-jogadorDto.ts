import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CriarJogadorDto {

    @IsNotEmpty()
    readonly telefoneCelular: string;

    @IsEmail()
    readonly email: string;
    
    @IsNotEmpty()
    readonly nome: string;

    @IsNotEmpty()
    readonly categoria: string;

    @IsOptional()
    urlFotoJogador?: string

}