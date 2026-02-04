import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common'
import { EntityManager } from 'typeorm'

// import { UserEstado } from './constant';
import { TextService } from 'src/common/lib/text.service'
import { Messages } from 'src/common/constants/response-messages'
import { CreateUserDTO, FiltrosUsuarioDto, UpdateUserDTO } from '../dto'
import { UserRepository } from '../repository/user.repository'

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findFilterUser(paginacionQueryDto: FiltrosUsuarioDto) {
    return await this.userRepository.findFilterUser(paginacionQueryDto)
  }

  async findAll() {
    return await this.userRepository.findAll()
  }

  async findOne(id: string) {
    const user = await this.userRepository.findByIdUser(id)
    if (!user) {
      throw new NotFoundException(Messages.INVALID_USER)
    }
    return user
  }

  async create(usuarioDto: CreateUserDTO, usuarioAuditoria: string) {
    const correo = await this.userRepository.findByUserEmail(usuarioDto.email)

    if (correo) {
      throw new PreconditionFailedException(Messages.EXISTING_EMAIL)
    }

    const op = async (transaction: EntityManager) => {
      const userNew = await this.userRepository.create(
        {
          ...usuarioDto,
          password: await TextService.encrypt(usuarioDto.password),
        },
        usuarioAuditoria,
        transaction
      )

      return userNew
    }

    return await this.userRepository.runTransaction(op)
  }

  async update(
    idUser: string,
    usuarioDto: UpdateUserDTO,
    usuarioAuditoria: string
  ) {
    const op = async (transaction: EntityManager) => {
      const user = await this.userRepository.findByIdUser(idUser, transaction)

      if (!user) {
        throw new NotFoundException(Messages.INVALID_USER)
      }

      await this.userRepository.update(
        idUser,
        usuarioDto,
        usuarioAuditoria,
        transaction
      )
      const userUpdate = await this.userRepository.findByIdUser(
        idUser,
        transaction
      )

      return userUpdate
    }

    return await this.userRepository.runTransaction(op)
  }

  async delete(idUser: string, usuarioAuditoria: string) {
    const op = async (transaction: EntityManager) => {
      const user = await this.userRepository.findByIdUser(idUser, transaction)

      if (!user) {
        throw new NotFoundException(Messages.INVALID_USER)
      }

      await this.userRepository.delete(idUser, usuarioAuditoria, transaction)

      return { idUser: idUser }
    }

    return await this.userRepository.runTransaction(op)
  }
}
