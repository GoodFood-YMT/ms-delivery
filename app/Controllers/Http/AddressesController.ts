import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Address from 'App/Models/Address'
import CreateAddressValidator from 'App/Validators/CreateAddressValidator'
import UpdateAddressValidator from 'App/Validators/UpdateAddressValidator'

export default class AddressesController {
  public async index({ request }: HttpContextContract) {
    const userId = request.header('UserID')

    if (!userId) {
      throw new Error('User not found')
    }

    const addresses = await Address.query().where('user_id', userId)

    return {
      addresses,
    }
  }

  public async store({ request }: HttpContextContract) {
    const userId = request.header('UserID')

    if (!userId) {
      throw new Error('User not found')
    }

    const payload = await request.validate(CreateAddressValidator)

    const address = await Address.create({
      ...payload,
      userId,
    })

    return {
      ...address,
    }
  }

  public async show({ request }: HttpContextContract) {
    const userId = request.header('UserID')

    if (!userId) {
      throw new Error('User not found')
    }

    const addressId = request.param('id')

    const address = await Address.query().where('user_id', userId).where('id', addressId).first()

    if (!address) {
      throw new Error('Address not found')
    }

    return {
      ...address,
    }
  }

  public async update({ request }: HttpContextContract) {
    const userId = request.header('UserID')

    if (!userId) {
      throw new Error('User not found')
    }

    const payload = await request.validate(UpdateAddressValidator)
    const addressId = request.param('id')

    const address = await Address.query().where('user_id', userId).where('id', addressId).first()

    if (!address) {
      throw new Error('Address not found')
    }

    if (payload.name) {
      address.name = payload.name
    }

    if (payload.street) {
      address.street = payload.street
    }

    if (payload.zipCode) {
      address.zipCode = payload.zipCode
    }

    if (payload.city) {
      address.city = payload.city
    }

    if (payload.country) {
      address.country = payload.country
    }

    await address.save()

    return {
      ...address,
    }
  }

  public async destroy({ request }: HttpContextContract) {
    const userId = request.header('UserID')

    if (!userId) {
      throw new Error('User not found')
    }

    const addressId = request.param('id')

    const address = await Address.query().where('user_id', userId).where('id', addressId).first()

    if (!address) {
      throw new Error('Address not found')
    }

    await address.delete()

    return {
      success: true,
    }
  }
}
