import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { getAddressCoords } from 'App/AddressApi'
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

    const getCoordinates = await getAddressCoords(
      `${payload.street} ${payload.zipCode} ${payload.city} ${payload.country}`
    )

    const address = await Address.create({
      ...payload,
      lat: getCoordinates.lat,
      lon: getCoordinates.lon,
      userId,
    })

    return {
      ...address.toJSON(),
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
      ...address.toJSON(),
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

    const getCoordinates = await getAddressCoords(
      `${payload.street} ${payload.zipCode} ${payload.city} ${payload.country}`
    )

    address.lat = getCoordinates.lat
    address.lon = getCoordinates.lon

    await address.save()

    return {
      ...address.toJSON(),
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

    address.userId = 'deleted'
    address.save()

    return {
      success: true,
    }
  }
}
