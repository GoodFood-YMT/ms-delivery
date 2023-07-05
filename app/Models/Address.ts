import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { cuid } from '@ioc:Adonis/Core/Helpers'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public street: string

  @column()
  public zipCode: string

  @column()
  public city: string

  @column()
  public country: string

  @column()
  public userId: string

  @beforeCreate()
  public static async setId(address: Address) {
    address.id = cuid()
  }
}
