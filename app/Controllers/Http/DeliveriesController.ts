import Rabbit from '@ioc:Adonis/Addons/Rabbit'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DeliveryStatus } from 'App/Enums/DeliveryStatus'
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
    const restaurantId = request.header('RestaurantID')

    if (!restaurantId) {
      throw new Error('Unauthorized')
    }

    const deliveryId = request.param('id')

    const delivery = await Delivery.find(deliveryId)

    if (!delivery) {
      throw new Error('Delivery not found')
    }

    if (delivery.restaurantId !== restaurantId) {
      throw new Error('Unauthorized')
    }

    return {
      ...delivery.toJSON(),
    }
  }

  public async takeDelivery({ request }: HttpContextContract) {
    const restaurantId = request.header('RestaurantID')

    if (!restaurantId) {
      throw new Error('Unauthorized')
    }

    const deliveryId = request.param('id')

    const delivery = await Delivery.find(deliveryId)

    if (!delivery) {
      throw new Error('Delivery not found')
    }

    if (delivery.restaurantId !== restaurantId) {
      throw new Error('Unauthorized')
    }

    if (delivery.status !== DeliveryStatus.PENDING) {
      throw new Error('Delivery already taken')
    }

    delivery.status = DeliveryStatus.DELIVERING

    return delivery
  }

  public async completeDelivery({ request }: HttpContextContract) {
    const restaurantId = request.header('RestaurantID')
    const userId = request.header('UserID')

    if (!restaurantId || !userId) {
      throw new Error('Unauthorized')
    }

    const deliveryId = request.param('id')

    const delivery = await Delivery.find(deliveryId)

    if (!delivery) {
      throw new Error('Delivery not found')
    }

    if (delivery.restaurantId !== restaurantId) {
      throw new Error('Unauthorized')
    }

    if (delivery.delivererId !== userId) {
      throw new Error('Unauthorized')
    }

    if (delivery.status !== DeliveryStatus.DELIVERING) {
      throw new Error('Delivery already delivered')
    }

    delivery.status = DeliveryStatus.DELIVERED
    delivery.save()

    // publish message for marketing
    await Rabbit.assertQueue('marketing.delivery.delivered')
    await Rabbit.sendToQueue(
      'marketing.delivery.delivered',
      JSON.stringify({
        deliveryId: delivery.id,
        orderId: delivery.orderId,
        createdAt: delivery.createdAt,
      })
    )

    return delivery
  }
}
