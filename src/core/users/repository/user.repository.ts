import { Injectable } from '@nestjs/common'
import { Brackets, DataSource, EntityManager } from 'typeorm'
import { UserEstado } from '../constant'
import { TextService } from 'src/common/lib/text.service'
import { UpdateUserDTO } from '../dto/update-user.dto'
import { CreateUserDTO } from '../dto/create-user.dto'
import { User } from '../entities/user.entity'
import { Transaccion } from '@/common/constants'
import { FiltrosUsuarioDto } from '../dto'

@Injectable()
export class UserRepository {
  constructor(private dataSource: DataSource) {}

  runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
    return this.dataSource.manager.transaction<T>(op)
  }

  async findFilterUser(paginacionQueryDto: FiltrosUsuarioDto) {
    const { limite, saltar, filtro, orden, sentido } = paginacionQueryDto

    const query = this.dataSource
      .getRepository(User)
      .createQueryBuilder('users')
      .select([
        'users.id',
        'users.userName',
        'users.email',
        'users.status',
        'users.attempts',
        'users.dateCreation',
        'users.dateModification',
      ])
      .take(limite)
      .skip(saltar)

    // Ordenamiento dinámico
    switch (orden) {
      case 'userName':
        query.addOrderBy('users.userName', sentido)
        break
      case 'email':
        query.addOrderBy('users.email', sentido)
        break
      case 'status':
        query.addOrderBy('users.status', sentido)
        break
      case 'dateCreation':
        query.addOrderBy('users.dateCreation', sentido)
        break
      default:
        query.addOrderBy('users.id', sentido)
    }

    // Filtro de búsqueda en múltiples campos
    if (filtro) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('users.userName ILIKE :filtro', { filtro: `%${filtro}%` })
          qb.orWhere('users.email ILIKE :filtro', { filtro: `%${filtro}%` })
        })
      )
    }

    // Opcional: Excluir registros eliminados lógicamente
    query.andWhere('users.dateDelete IS NULL')

    return await query.getManyAndCount()
  }

  async findAll() {
    return await this.dataSource
      .getRepository(User)
      .createQueryBuilder('users')
      .getManyAndCount()
    // .getMany()
  }

  async findUserName(userName: string) {
    return await this.dataSource
      .getRepository(User)
      .createQueryBuilder('users')
      .where({ userName: userName })
      .getOne()
  }

  async findByIdUser(idUser: string, transaction?: EntityManager) {
    return await (
      transaction?.getRepository(User) ?? this.dataSource.getRepository(User)
    )
      .createQueryBuilder('users')
      .where({ id: idUser })
      .getOne()
  }

  async findByUserEmail(email: string, transaction?: EntityManager) {
    return await (
      transaction?.getRepository(User) ?? this.dataSource.getRepository(User)
    )
      .createQueryBuilder('users')
      .where('users.email = :email', { email })
      .getOne()
  }

  async create(
    usuarioDto: CreateUserDTO,
    usuarioAuditoria: string,
    transaction: EntityManager
  ) {
    return await transaction.getRepository(User).save(
      new User({
        userName: usuarioDto.userName,
        status: UserEstado.ACTIVE,
        email: usuarioDto?.email,
        password:
          usuarioDto?.password ??
          (await TextService.encrypt(TextService.generateUuid())),
        userCreation: usuarioAuditoria,
      })
    )
  }

  async update(
    idUser: string,
    usuarioDto: UpdateUserDTO,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    const repo = transaction
      ? transaction.getRepository(User)
      : this.dataSource.getRepository(User)

    const datosActualizar = new User({
      status: usuarioDto.status || undefined,
      email: usuarioDto.email || undefined,
      password: usuarioDto.password || undefined,
      attempts: usuarioDto.attempts || undefined,
      userModification: usuarioAuditoria,
    })
    return await repo.update(idUser, datosActualizar)
  }

  async delete(
    idUser: string,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    const repo = transaction
      ? transaction.getRepository(User)
      : this.dataSource.getRepository(User)

    await repo.update(idUser, {
      userModification: usuarioAuditoria,
      status: UserEstado.DELETED,
      transaction: Transaccion.ACTUALIZAR,
    })
    return repo.softDelete(idUser)
  }
}
