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

  const data = await response.json()

  return data as Result
}

export interface Root {
  results: Result[]
}

export interface Result {
  lon: number
  lat: number
}
