import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Delivery from 'App/Models/Delivery'
import CreateDeliveryValidator from 'App/Validators/CreateDeliveryValidator'
import UpdateDeliveryValidator from 'App/Validators/UpdateDeliveryValidator'

export default class DeliveriesController {
  public async store({ request }: HttpContextContract) {
    try {
      const payload = await request.validate(CreateDeliveryValidator)

      const delivery = await Delivery.create({
        ...payload,
      })

      return {
        ...delivery,
      }
    } catch (error) {
      console.log(error)
      return {
        error: error.message,
      }
    }
  }

  public async show({ request }: HttpContextContract) {
    try {
      const deliveryId = request.param('id')

      const delivery = await Delivery.find(deliveryId)

      if (!delivery) {
        throw new Error('Delivery not found')
      }

      return {
        ...delivery,
      }
    } catch (error) {
      console.log(error)
      return {
        error: error.message,
      }
    }
  }

  public async update({ request }: HttpContextContract) {
    try {
      const deliveryId = request.param('id')
      const payload = await request.validate(UpdateDeliveryValidator)

      const delivery = await Delivery.find(deliveryId)

      if (!delivery) {
        throw new Error('Delivery not found')
      }

      delivery.status = payload.status
      await delivery.save()

      return {
        ...delivery,
      }
    } catch (error) {
      console.log(error)
      return {
        error: error.message,
      }
    }
  }
}
