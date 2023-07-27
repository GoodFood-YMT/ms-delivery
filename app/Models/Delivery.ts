import { DateTime } from 'luxon'
import { BaseModel, afterCreate, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import Rabbit from '@ioc:Adonis/Addons/Rabbit'
import { DeliveryStatus } from 'App/Enums/DeliveryStatus'

export default class Delivery extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public status: DeliveryStatus

  @column()
  public addressId: string

  @column()
  public delivererId: string

  @column()
  public orderId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async setId(delivery: Delivery) {
    delivery.id = cuid()
  }

  @afterCreate()
  public static async createDelivery(delivery: Delivery) {
    await Rabbit.assertQueue('delivery.created')
    await Rabbit.sendToQueue(
      'delivery.created',
      JSON.stringify({
        id: delivery.id,
        orderId: delivery.orderId,
      })
    )
  }
}
