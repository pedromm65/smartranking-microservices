import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ClientProxySmartRanking {

    getClientProxyAdminBackendInstance(): ClientProxy {        

            return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: ['amqp://user:GtlwqpmsPK00@3.94.160.160:5672/smartranking'],
              queue: 'admin-backend'
            }
          })
    }
}
