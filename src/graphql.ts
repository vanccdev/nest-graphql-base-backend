
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
    email?: Nullable<string>;
}

export class UpdateUserInput {
    password?: Nullable<string>;
    email?: Nullable<string>;
    attempts?: Nullable<number>;
    estado?: Nullable<string>;
}

export abstract class IQuery {
    abstract users(): Nullable<User>[] | Promise<Nullable<User>[]>;

    abstract user(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
    abstract createUser(createUserInput: CreateUserInput): User | Promise<User>;

    abstract updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;

    abstract removeUser(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export class User {
    id: string;
    userName: string;
    email?: Nullable<string>;
    attempts: number;
    estado: string;
    transaccion: string;
    usuarioCreacion: string;
    fechaCreacion: string;
    usuarioModificacion?: Nullable<string>;
    fechaModificacion?: Nullable<string>;
}

type Nullable<T> = T | null;
