import { USUARIO_SISTEMA } from '@/common/constants'
import { TextService } from '@/common/lib/text.service'
import { User } from '@/core/users/entities/user.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class Users1770170646545 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const DEFAULT_PASS = '123qweASD'
    const pass = await TextService.encrypt(DEFAULT_PASS)
    const items = [
      {
        userName: 'juan.perez',
        email: 'juan.perez@mail.com',
      },
      {
        userName: 'maria.gomez',
        email: 'maria.gomez@mail.com',
      },
      {
        userName: 'carlos.rodriguez',
        email: 'carlos.rodriguez@mail.com',
      },
      {
        userName: 'ana.mamani',
        email: 'ana.mamani@mail.com',
      },
      {
        userName: 'luis.fernandez',
        email: 'luis.fernandez@mail.com',
      },
      {
        userName: 'sofia.vargas',
        email: 'sofia.vargas@mail.com',
      },
      {
        userName: 'diego.choque',
        email: 'diego.choque@mail.com',
      },
      {
        userName: 'valeria.torrez',
        email: 'valeria.torrez@mail.com',
      },
      {
        userName: 'jose.quispe',
        email: 'jose.quispe@mail.com',
      },
      {
        userName: 'camila.rivera',
        email: 'camila.rivera@mail.com',
      },
      {
        userName: 'andres.lopez',
        email: 'andres.lopez@mail.com',
      },
      {
        userName: 'paola.mendoza',
        email: 'paola.mendoza@mail.com',
      },
      {
        userName: 'ricardo.suarez',
        email: 'ricardo.suarez@mail.com',
      },
      {
        userName: 'gabriela.arias',
        email: 'gabriela.arias@mail.com',
      },
      {
        userName: 'fernando.castro',
        email: 'fernando.castro@mail.com',
      },
      {
        userName: 'daniela.soto',
        email: 'daniela.soto@mail.com',
      },
      {
        userName: 'miguel.herrera',
        email: 'miguel.herrera@mail.com',
      },
      {
        userName: 'lucia.navarro',
        email: 'lucia.navarro@mail.com',
      },
      {
        userName: 'sergio.romero',
        email: 'sergio.romero@mail.com',
      },
      {
        userName: 'elena.silva',
        email: 'elena.silva@mail.com',
      },
      {
        userName: 'martin.paredes',
        email: 'martin.paredes@mail.com',
      },
      {
        userName: 'karla.ramos',
        email: 'karla.ramos@mail.com',
      },
      {
        userName: 'roberto.gutierrez',
        email: 'roberto.gutierrez@mail.com',
      },
      {
        userName: 'patricia.flores',
        email: 'patricia.flores@mail.com',
      },
      {
        userName: 'oscar.morales',
        email: 'oscar.morales@mail.com',
      },
      {
        userName: 'veronica.aguilar',
        email: 'veronica.aguilar@mail.com',
      },
      {
        userName: 'alberto.vega',
        email: 'alberto.vega@mail.com',
      },
      {
        userName: 'monica.reyes',
        email: 'monica.reyes@mail.com',
      },
      {
        userName: 'julio.cespedes',
        email: 'julio.cespedes@mail.com',
      },
      {
        userName: 'adriana.sanchez',
        email: 'adriana.sanchez@mail.com',
      },
    ]

    for (const item of items) {
      const usuario = new User({
        userName: item.userName,
        email: item.email,
        password: pass,
        status: 'ACTIVO',
        transaction: 'SEEDS',
        userCreation: USUARIO_SISTEMA,
      })
      await queryRunner.manager.save(usuario)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
