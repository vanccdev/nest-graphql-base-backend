import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

// import { UserEstado } from './constant';
import { TextService } from 'src/common/lib/text.service';
import { Messages } from 'src/common/constants/response-messages';
import { CreateUserDTO, UpdateUserDTO } from '../dto';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async crear(usuarioDto: CreateUserDTO, usuarioAuditoria: string) {
    const correo = await this.userRepository.buscarUserPorCorreo(
      usuarioDto.email,
    );

    if (correo) {
      throw new PreconditionFailedException(Messages.EXISTING_EMAIL);
    }

    const op = async (transaction: EntityManager) => {
      const usuarioNuevo = await this.userRepository.crear(
        {
          ...usuarioDto,
          password: await TextService.encrypt(usuarioDto.password),
        },
        usuarioAuditoria,
        transaction,
      );

      return usuarioNuevo;
    };

    return await this.userRepository.runTransaction(op);
  }

  async findAll() {
    return await this.userRepository.recuperar();
  }

  async findOne(id: string) {
    return await this.userRepository.buscarPorId(id);
  }

  async actualizar(
    idUser: string,
    usuarioDto: UpdateUserDTO,
    usuarioAuditoria: string,
  ) {
    const op = async (transaction: EntityManager) => {
      await this.userRepository.actualizar(
        idUser,
        usuarioDto,
        usuarioAuditoria,
        transaction,
      );

      return { message: 'Usuario actualizado correctamente' };
    };

    return await this.userRepository.runTransaction(op);
  }

  /* async remove(id: string) {
    return await this.userRepository.eliminar(id);
  } */
}
