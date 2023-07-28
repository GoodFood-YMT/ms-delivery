import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Delivery from 'App/Models/Delivery'

export default class DeliveriesController {
  public async index({ request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const restaurantId = request.header('RestaurantID')

    if (!restaurantId) {
      throw new Error('Unauthorized')
    }

    const deliveries = await Delivery.query()
      .where('restaurant_id', restaurantId)
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return deliveries
  }

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
