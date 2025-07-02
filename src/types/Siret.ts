export type SiretAPI = {
  etablissement: {
    uniteLegale: { denominationUniteLegale: string }
    siret: string
    adresseEtablissement: {
      numeroVoieEtablissement: string
      indiceRepetitionEtablissement?: string
      typeVoieEtablissement: string
      libelleVoieEtablissement: string
      codePostalEtablissement: string
      libelleCommuneEtablissement: string
    }
  }
}
