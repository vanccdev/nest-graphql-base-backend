import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { UserEstado } from '../constant';
import { TextService } from 'src/common/lib/text.service';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { CreateUserDTO } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private dataSource: DataSource) {}

  runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
    return this.dataSource.manager.transaction<T>(op);
  }

  async recuperar() {
    return await this.dataSource
      .getRepository(User)
      .createQueryBuilder('users')
      .getMany();
  }

  async buscarUser(users: string) {
    return await this.dataSource
      .getRepository(User)
      .createQueryBuilder('users')
      .where({ users: users })
      .getOne();
  }

  async buscarPorId(id: string, transaction?: EntityManager) {
    return await (
      transaction?.getRepository(User) ?? this.dataSource.getRepository(User)
    )
      .createQueryBuilder('users')
      .where({ id: id })
      .getOne();
  }

  async buscarUserPorCorreo(email: string, transaction?: EntityManager) {
    return await (
      transaction?.getRepository(User) ?? this.dataSource.getRepository(User)
    )
      .createQueryBuilder('users')
      .where('users.email = :email', { email })
      .getOne();
  }

  /* async crear(
    usuarioDto: CreateUserDTO,
    usuarioAuditoria: string,
    transaction: EntityManager,
  ) {
    return await transaction.getRepository(User).save(
      new User({
        userName: usuarioDto.userName,
        estado: UserEstado.CREATE,
        email: usuarioDto?.email,
        password:
          usuarioDto?.password ??
          (await TextService.encrypt(TextService.generateUuid())),
        usuarioCreacion: usuarioAuditoria,
      }),
    );
  } */

  async crear(
    usuarioDto: CreateUserDTO,
    usuarioAuditoria: string,
    transaction: EntityManager,
  ) {
    const repo = transaction.getRepository(User);

    return await repo.save(
      repo.create({
        userName: usuarioDto.userName,
        estado: UserEstado.ACTIVE,
        email: usuarioDto?.email,
        password:
          usuarioDto?.password ??
          (await TextService.encrypt(TextService.generateUuid())),
        usuarioCreacion: usuarioAuditoria,
      }),
    );
  }

  async actualizar(
    idUser: string,
    usuarioDto: UpdateUserDTO,
    usuarioAuditoria: string,
    transaction?: EntityManager,
  ) {
    const repo = transaction
      ? transaction.getRepository(User)
      : this.dataSource.getRepository(User);

    const datosActualizar = new User({
      // estado: usuarioDto.estado || undefined,
      // email: usuarioDto.email || undefined,
      // password: usuarioDto.password || undefined,
      attempts: usuarioDto.attempts || undefined,
      usuarioModificacion: usuarioAuditoria,
    });
    return await repo.update(idUser, datosActualizar);
  }
}
