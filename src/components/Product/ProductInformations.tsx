"use client"

import { useCallback, useState } from "react"
import LoadingButton from "../Button/LoadingButton"
import { getProductInformations } from "../../serverFunctions/product"
import { ProductInformations as ProductInformationsType } from "../../db/product"
import { businesses } from "../../utils/types/business"
import { getValue } from "../../utils/types/mapping"
import { countries } from "../../utils/types/country"
import { impressions } from "../../utils/types/impression"
import { materials } from "../../utils/types/material"
import { accessories } from "../../utils/types/accessory"

const ProductInformations = ({ id }: { id: string }) => {
  const [informations, setInformations] = useState<ProductInformationsType | null>(null)
  const [loading, setLoading] = useState(false)

  const loadInformations = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getProductInformations(id)

      setInformations(result)
    } finally {
      setLoading(false)
    }
  }, [id])

  if (!informations) {
    return (
      <LoadingButton loading={loading} onClick={() => loadInformations()}>
        Voir les informations du produit
      </LoadingButton>
    )
  }

  return (
    <>
      <p>
        Poids : <b>{Math.round(informations.mass * 100) / 100} kg</b>
      </p>
      {informations.upcycled !== undefined && (
        <p>
          Remanufacturé : <b>{informations.upcycled ? "Oui" : "Non"}</b>
        </p>
      )}
      {informations.numberOfReferences !== undefined && (
        <p>
          Nombre de références : <b>{informations.numberOfReferences}</b>
        </p>
      )}
      {informations.price !== undefined && (
        <p>
          Prix : <b>{Math.round(informations.price * 100) / 100} €</b>
        </p>
      )}
      {informations.business && (
        <p>
          Taille de l'entreprise : <b>{getValue(businesses, informations.business)}</b>
        </p>
      )}
      {informations.countrySpinning && (
        <p>
          Origine de filature : <b>{getValue(countries, informations.countrySpinning)}</b>
        </p>
      )}
      {informations.countryFabric && (
        <p>
          Origine de tissage/tricotage : <b>{getValue(countries, informations.countryFabric)}</b>
        </p>
      )}
      {informations.countryDyeing && (
        <p>
          Origine de l'ennoblissement/impression : <b>{getValue(countries, informations.countryDyeing)}</b>
        </p>
      )}
      {informations.countryMaking && (
        <p>
          Origine de confection : <b>{getValue(countries, informations.countryMaking)}</b>
        </p>
      )}
      {informations.impression && (
        <p>
          Type d'impression :{" "}
          <b>
            {getValue(impressions, informations.impression)}{" "}
            {Math.round(informations.impressionPercentage * 10000) / 100}%
          </b>
        </p>
      )}
      {informations.fading !== undefined && (
        <p>
          Délavage : <b>{informations.fading ? "Oui" : "Non"}</b>
        </p>
      )}
      {informations.airTransportRatio !== undefined && (
        <p>
          Part du transport aérien : <b>{Math.round(informations.airTransportRatio * 10000) / 100}%</b>
        </p>
      )}
      <p className='fr-mt-1w'>Matière(s) :</p>
      <ul>
        {informations.materials
          .sort((a, b) => b.share - a.share)
          .map((material) => (
            <li key={material.slug}>
              <b>
                {getValue(materials, material.slug)} {Math.round(material.share * 10000) / 100}%
                {material.country ? ` (${getValue(countries, material.country)})` : ""}
              </b>
            </li>
          ))}
      </ul>
      {informations.accessories.length > 0 && (
        <>
          {" "}
          <p className='fr-mt-1w'>Accessoire(s) :</p>
          <ul>
            {informations.accessories
              .sort((a, b) => b.quantity - a.quantity)
              .map((accessory) => (
                <li key={accessory.slug}>
                  <b>
                    {getValue(accessories, accessory.slug)} : {accessory.quantity}
                  </b>
                </li>
              ))}
          </ul>
        </>
      )}
    </>
  )
}

export default ProductInformations
