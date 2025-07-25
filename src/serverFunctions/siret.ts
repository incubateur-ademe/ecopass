"use server"

import axios from "axios"
import { SiretAPI } from "../types/Siret"
import { auth } from "../services/auth/auth"

export const getSiretInfo = async (siret: string) => {
  const session = await auth()
  if (!session || !session.user) {
    return null
  }
  try {
    const result = await axios.get<SiretAPI>(`https://api.insee.fr/api-sirene/3.11/siret/${siret}`, {
      headers: { "X-INSEE-Api-Key-Integration": process.env.INSEE_API_KEY },
    })
    if (result.status !== 200) {
      throw new Error("Failed to fetch SIRET information from API")
    }

    return result.data
  } catch {
    return null
  }
}
