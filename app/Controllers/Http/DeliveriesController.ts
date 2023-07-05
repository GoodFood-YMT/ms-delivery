import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Delivery from 'App/Models/Delivery'
import CreateDeliveryValidator from 'App/Validators/CreateDeliveryValidator'
import UpdateDeliveryValidator from 'App/Validators/UpdateDeliveryValidator'

export default class DeliveriesController {
  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(CreateDeliveryValidator)

    const delivery = await Delivery.create({
      ...payload,
    })

    return {
      ...delivery.toJSON(),
    }
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

  public async update({ request }: HttpContextContract) {
    const deliveryId = request.param('id')
    const payload = await request.validate(UpdateDeliveryValidator)

    const delivery = await Delivery.find(deliveryId)

    if (!delivery) {
      throw new Error('Delivery not found')
    }

    delivery.status = payload.status
    await delivery.save()

    return {
      ...delivery.toJSON(),
    }
  }
}
