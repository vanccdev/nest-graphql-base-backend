import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'

import { CreateUserDTO, FiltrosUsuarioDto, UpdateUserDTO } from '../dto'
import { UsersService } from '../service/users.service'
import { ConfigService } from '@nestjs/config'
import { BaseController } from '@/common/base'
import { Order } from '@/common/constants'

@Resolver('User')
export class UsersResolver extends BaseController {
  constructor(private usersService: UsersService) {
    super()
  }

  @Query('filterUsers')
  async findFilterUser(
    @Args('limite') limite?: number,
    @Args('saltar') saltar?: number,
    @Args('filtro') filtro?: string,
    @Args('orden') orden?: string,
    @Args('sentido') sentido?: 'ASC' | 'DESC'
  ) {
    const paginacionQueryDto = {
      limite: limite || 10,
      saltar: saltar || 0,
      filtro,
      orden,
      sentido: (sentido as Order) || Order.ASC,
    } as FiltrosUsuarioDto

    const result = await this.usersService.findFilterUser(paginacionQueryDto)

    return this.successListRows(result)
  }

  @Query('users')
  async findAll() {
    const result = await this.usersService.findAll()
    return this.successListRows(result)
  }

  @Query('user')
  async findOne(@Args('idUser') idUser: string) {
    const result = await this.usersService.findOne(idUser)
    console.log('111', result)

    return this.successList(result)
  }

  @Mutation('createUser')
  async create(@Args('createUserInput') createUserDTO: CreateUserDTO) {
    // const usuarioAuditoria = this.getUser(req);
    const usuarioAuditoria = '123'
    // return this.usersService.create(createUserDTO, usuarioAuditoria)
    const result = await this.usersService.create(
      createUserDTO,
      usuarioAuditoria
    )
    return this.successCreate(result)
  }

  @Mutation('updateUser')
  async update(
    @Args('idUser') idUser: string,
    @Args('updateUserInput') updateUserDTO: UpdateUserDTO
  ) {
    // const usuarioAuditoria = this.getUser(req);
    const usuarioAuditoria = '123'
    // return this.usersService.update(idUser, updateUserDTO, usuarioAuditoria)
    const result = await this.usersService.update(
      idUser,
      updateUserDTO,
      usuarioAuditoria
    )
    return this.successUpdate(result)
  }

  @Mutation('deleteUser')
  async delete(@Args('idUser') idUser: string) {
    const usuarioAuditoria = '123'
    // return this.usersService.delete(idUser, usuarioAuditoria)
    const result = await this.usersService.delete(idUser, usuarioAuditoria)
    return this.successDelete(result)
  }
}
