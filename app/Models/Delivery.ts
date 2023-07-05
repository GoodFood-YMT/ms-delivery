import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { cuid } from '@ioc:Adonis/Core/Helpers'

export default class Delivery extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public status: string

  @column()
  public addressId: string

  @column()
  public delivererId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async setId(delivery: Delivery) {
    delivery.id = cuid()
  }
}
