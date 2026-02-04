import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Transaccion } from '../constants'

export abstract class AuditoriaEntity extends BaseEntity {
  @Column({
    name: '_status',
    length: 30,
    type: 'varchar',
    nullable: false,
    comment: 'Estado del registro',
  })
  status: string

  @Column('varchar', {
    name: '_transaction',
    length: 30,
    nullable: false,
    comment: 'Tipo de operación ejecutada',
  })
  transaction: string

  @Column('bigint', {
    name: '_user_creation',
    nullable: false,
    comment: 'Id de usuario que creó el registro',
  })
  userCreation: string

  @CreateDateColumn({
    name: '_date_creation',
    type: 'timestamp without time zone',
    nullable: false,
    default: () => 'now()',
    comment: 'Fecha de creación',
  })
  dateCreation: Date

  @Column('bigint', {
    name: '_user_modification',
    nullable: true,
    comment: 'Id de usuario que realizo una modificación',
  })
  userModification?: string | null

  @UpdateDateColumn({
    name: '_date_modification',
    type: 'timestamp without time zone',
    nullable: true,
    comment: 'Fecha en que se realizó una modificación',
  })
  dateModification?: Date | null

  @DeleteDateColumn({
    name: '_date_delete',
    type: 'timestamp without time zone',
    nullable: true,
    comment: 'Fecha de eliminación lógica',
  })
  dateDelete?: Date

  @BeforeInsert()
  insertarTransaccion() {
    this.transaction = this.transaction || Transaccion.CREAR
  }

  @BeforeUpdate()
  actualizarTransaccion() {
    this.transaction = this.transaction || Transaccion.ACTUALIZAR
  }

  protected constructor(data?: Partial<AuditoriaEntity>) {
    super()
    if (data) Object.assign(this, data)
  }
}
