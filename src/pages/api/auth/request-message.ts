import { authConfig } from '../../../config'
import Moralis from 'moralis'

export default async function handler(req, res): Promise<void> {
  const { address, chain, network } = req.body

  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY })

  try {
    const message = await Moralis.Auth.requestMessage({
      address,
      chain,
      network,
      ...authConfig
    })

    res.status(200).json(message)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error })
  }
}
