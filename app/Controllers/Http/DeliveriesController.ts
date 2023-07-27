import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Delivery from 'App/Models/Delivery'

export default class DeliveriesController {
  public async show({ request }: HttpContextContract) {
    const deliveryId = request.param('id')

    const delivery = await Delivery.find(deliveryId)

    if (!delivery) {
      throw new Error('Delivery not found')
    }

    return {
      ...delivery.toJSON(),
    }
  }
}
