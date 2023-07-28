const QUEUE_NAME = 'delivery.create'

import Rabbit from '@ioc:Adonis/Addons/Rabbit'
import { validator, schema } from '@ioc:Adonis/Core/Validator'
import Delivery from 'App/Models/Delivery'

const createDeliverySchema = schema.create({
  orderId: schema.string({}, []),
  addressId: schema.string({}, []),
  restaurantId: schema.string({}, []),
})

async function listen() {
  console.log('Mailing queue started')

  await Rabbit.assertQueue(QUEUE_NAME)

  await Rabbit.consumeFrom(QUEUE_NAME, async (message) => {
    try {
      const payload = await validator.validate({
        schema: createDeliverySchema,
        data: JSON.parse(message.content),
      })

      await Delivery.create({
        orderId: payload.orderId,
        addressId: payload.addressId,
        restaurantId: payload.restaurantId,
      })
    } catch (e) {
      console.log('CreateDelivery payload not valid', e.message)
    }

    message.ack()
  })
}

listen()
