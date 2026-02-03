import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import dotenv from 'dotenv';
import { AuditoriaEntity } from 'src/common/entity/auditoria.entity';
import { UserEstado } from '../constant';
dotenv.config();

@Entity({ name: 'users', schema: process.env.DB_SCHEMA_USERS })
export class User extends AuditoriaEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: 'Clave primaria de la tabla Usuario',
  })
  id: string;

  @Column({
    name: 'user_name',
    length: 50,
    type: 'varchar',
    unique: true,
    comment: 'nombre de usuario, usualmente carnet de identidad',
  })
  userName: string;

  @Column({
    length: 255,
    type: 'varchar',
    comment: 'contraseña del usuario',
  })
  password: string;

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: true,
    comment: 'correo electrónico del usuario',
  })
  email?: string | null;

  @Column({
    name: 'attempts',
    type: 'integer',
    default: 0,
    comment: 'número de intentos de inicio de sesión fallidos',
  })
  attempts: number;

  constructor(data?: Partial<User>) {
    super(data);
  }
  /* constructor(data?: Partial<User>) {
    super(); // solo inicializa BaseEntity
    if (data) Object.assign(this, data); // asigna TODO aquí
  } */

  @BeforeInsert()
  insertarEstado() {
    this.estado = this.estado || UserEstado.ACTIVE;
  }
}
