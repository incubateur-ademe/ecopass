"use client"
import Image from "next/image"
import classNames from "classnames"
import Input from "@codegouvfr/react-dsfr/Input"
import { useState } from "react"
import searchStyles from "../Product/Search/SearchContainer.module.css"
import LoadingButton from "../Button/LoadingButton"

const Search = () => {
  const [search, setSearch] = useState("")
  return (
    <div className={searchStyles.filter}>
      <div>
        {" "}
        <h2>Rechercher un établissement</h2>
        <div className={searchStyles.box}>
          <div className={classNames("fr-grid-row", "fr-grid-row--gutters")}>
            <div className='fr-col-12'>
              <Input
                label='Saisissez un siret, un nom d’établissement, de marque ou de bureau d’étude'
                nativeInputProps={{
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  placeholder: "ex: siret, établissement, Kiabi...",
                }}
              />
              <LoadingButton loading={false} className='fr-col-4' iconId='ri-search-line'>
                Rechercher
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
      <Image src='/images/searchicon.svg' alt='' width={252} height={175} />
    </div>
  )
}

export default Search
