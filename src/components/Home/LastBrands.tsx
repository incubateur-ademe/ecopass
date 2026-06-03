"use server"

import Tile from "@codegouvfr/react-dsfr/Tile"
import Badge from "@codegouvfr/react-dsfr/Badge"
import { getLastBrands } from "../../db/product"

const LastBrands = async () => {
  const brands = await getLastBrands()
  return (
    <Tile
      orientation='horizontal'
      title='Les 5 dernières marques qui ont déclaré des produits'
      imageUrl='/icons/coat.svg'
      imageAlt=''
      desc={
        <ul>
          {brands.map((brand) => (
            <li key={brand.id}>{brand.name}</li>
          ))}
        </ul>
      }
      linkProps={{ href: "/marques" }}
      start={<Badge>Marques</Badge>}
      detail='Retrouvez la liste complète des marques qui ont déclaré.'
    />
  )
}

export default LastBrands
