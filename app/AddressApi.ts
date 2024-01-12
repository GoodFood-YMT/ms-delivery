import Env from '@ioc:Adonis/Core/Env'

export async function getAddressCoords(address: string) {
  const requestOptions = {
    method: 'GET',
  }

  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${address}&format=json&apiKey=${Env.get(
      'GEOAPIFY_TOKEN'
    )}`,
    requestOptions
  )

  const data = (await response.json()) as Root

  let lat = 0
  let lon = 0

  if (data.results.length > 0) {
    lat = data.results[0].lat
    lon = data.results[0].lon
  }

  return { lat, lon }
}

export interface Root {
  results: Array<{
    lat: number
    lon: number
  }>
}
