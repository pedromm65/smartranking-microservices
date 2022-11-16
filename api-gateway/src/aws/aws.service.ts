import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk'
@Injectable()
export class AwsService {

    private logger = new Logger(AwsService.name)

    public async uploadArquivo(file: any, id: string) {
        const s3 = new AWS.S3({ 
            region: 'sa-east-1',
            accessKeyId: 'AKIAWETHDTFSGVFNWURG',
            secretAccessKey: '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',
         })
        
         const fileExtension = file.originalname.split('.')[1]

         const urlKey = `${id}.${fileExtension}`

         this.logger.log(`urlKey: ${urlKey}`)

         const params = {
            Body: file.buffer,
            Bucket: 'smtartranking',
            Key: urlKey
         }

        const data =  s3
                        .putObject(params)
                        .promise()
                        .then(
                            data => {
                                return {
                                    url: `https://smtartranking.s3.sa-east-1.amazonaws.com/${urlKey}`
                                }
                            },
                        err => {
                            this.logger.log(err)
                            return err
                        }
                        )
        
        return data;
        
    }
}
