import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { DeliveryStatus } from 'App/Enums/DeliveryStatus'

export default class extends BaseSchema {
  protected tableName = 'deliveries'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()

      table
        .enum('status', Object.values(DeliveryStatus))
        .defaultTo(DeliveryStatus.PENDING)
        .notNullable()
      table.string('address_id').references('id').inTable('addresses').notNullable()
      table.string('deliverer_id').nullable()
      table.string('order_id').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
