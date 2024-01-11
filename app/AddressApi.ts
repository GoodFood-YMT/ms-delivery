import Env from '@ioc:Adonis/Core/Env'

export async function getAddressCoords(address: string) {
  const requestOptions = {
    method: 'GET',
  }

  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=${Env.get(
      'GEOAPIFY_TOKEN'
    )}`,
    requestOptions
  )

  const data = (await response.json()) as Root

  let lat = 0
  let lon = 0

  if (data.features.length > 0) {
    lat = data.features[0].properties.lat
    lon = data.features[0].properties.lon
  }

  return { lat, lon }
}

export interface Root {
  features: Array<{
    properties: {
      lat: number
      lon: number
    }
  }>
}
