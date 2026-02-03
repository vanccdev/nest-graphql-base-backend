import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { CreateUserDTO, UpdateUserDTO } from '../dto';
import { UsersService } from '../service/users.service';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation('createUser')
  create(@Args('createUserInput') createUserDTO: CreateUserDTO) {
    // console.log(createUserDTO);
    // const usuarioAuditoria = this.getUser(req);
    const usuarioAuditoria = '123';
    return this.usersService.crear(createUserDTO, usuarioAuditoria);
  }

  @Query('users')
  findAll() {
    return this.usersService.findAll();
  }

  @Query('user')
  findOne(@Args('idUser') idUser: string) {
    return this.usersService.findOne(idUser);
  }

  @Mutation('updateUser')
  update(
    @Args('idUser') idUser: string,
    @Args('updateUserInput') updateUserDTO: UpdateUserDTO,
  ) {
    // const usuarioAuditoria = this.getUser(req);
    const usuarioAuditoria = '123';
    return this.usersService.actualizar(
      idUser,
      updateUserDTO,
      usuarioAuditoria,
    );
  }

  /* @Mutation('removeUser')
  remove(@Args('idUser') idUser: number) {
    return this.usersService.remove(idUser);
  } */
}
