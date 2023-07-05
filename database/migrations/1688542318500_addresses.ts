import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()

      table.string('name').notNullable()
      table.string('street').notNullable()
      table.string('zip_code').notNullable()
      table.string('city').notNullable()
      table.string('country').notNullable()

      table.string('user_id').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
