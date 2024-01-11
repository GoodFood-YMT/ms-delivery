import env from 'env'
import fetch from 'node-fetch'

export async function getAddressCoords(address: string) {
  var requestOptions = {
    method: 'GET',
  }

  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=${env.GEOAPIFY_TOKEN}`,
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
