
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateUserInput {
    userName: string;
    password: string;
    email: string;
    userCreation?: Nullable<string>;
}

export class UpdateUserInput {
    password?: Nullable<string>;
    email?: Nullable<string>;
    attempts?: Nullable<number>;
    status?: Nullable<string>;
    userModification?: Nullable<string>;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract users(): SuccessResponseUsers | Promise<SuccessResponseUsers>;

    abstract user(idUser: string): SuccessResponseUser | Promise<SuccessResponseUser>;

    abstract filterUsers(limite?: Nullable<number>, saltar?: Nullable<number>, filtro?: Nullable<string>, orden?: Nullable<string>, sentido?: Nullable<string>): SuccessResponseUsers | Promise<SuccessResponseUsers>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract createUser(createUserInput: CreateUserInput): SuccessResponseUser | Promise<SuccessResponseUser>;

    abstract updateUser(idUser: string, updateUserInput: UpdateUserInput): SuccessResponseUser | Promise<SuccessResponseUser>;

    abstract deleteUser(idUser: string): SuccessResponseDelete | Promise<SuccessResponseDelete>;
}

export class SuccessResponseUser {
    __typename?: 'SuccessResponseUser';
    finalizado: boolean;
    mensaje: string;
    datos: User;
}

export class SuccessResponseUsers {
    __typename?: 'SuccessResponseUsers';
    finalizado: boolean;
    mensaje: string;
    datos: PaginatedUsersData;
}

export class SuccessResponseDelete {
    __typename?: 'SuccessResponseDelete';
    finalizado: boolean;
    mensaje: string;
    datos: DeleteUserData;
}

export class DeleteUserData {
    __typename?: 'DeleteUserData';
    idUser: string;
}

export class PaginatedUsersData {
    __typename?: 'PaginatedUsersData';
    filas: User[];
    total: number;
}

export class User {
    __typename?: 'User';
    id?: Nullable<string>;
    userName?: Nullable<string>;
    email?: Nullable<string>;
    attempts?: Nullable<number>;
    status?: Nullable<string>;
    transaction?: Nullable<string>;
    userCreation?: Nullable<string>;
    dateCreation?: Nullable<string>;
    userModification?: Nullable<string>;
    dateModification?: Nullable<string>;
    dateDelete?: Nullable<string>;
}

type Nullable<T> = T | null;
