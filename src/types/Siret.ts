export type SiretAPI = {
  etablissement: {
    uniteLegale: { denominationUniteLegale: string; nomUniteLegale: string; prenom1UniteLegale: string }
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
