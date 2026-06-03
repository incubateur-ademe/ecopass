"use client"
import Image from "next/image"
import classNames from "classnames"
import Input from "@codegouvfr/react-dsfr/Input"
import { useEffect, useRef, useState } from "react"
import searchStyles from "../Product/Search/SearchContainer.module.css"
import { OrganizationAndBrands } from "../../serverFunctions/dgccrf"
import Block from "../Block/Block"
import SearchResult from "./SearchResult"
import { useRouter } from "next/navigation"
import LoadingButton from "../Button/LoadingButton"

const Search = ({ organizationsAndBrands }: { organizationsAndBrands: OrganizationAndBrands | null }) => {
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!search.trim()) {
      return
    }

    setLoading(true)
    router.push(`?search=${search.trim()}`)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false)
    if (organizationsAndBrands !== null && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [organizationsAndBrands, ref])

  return (
    <>
      <Block large home>
        <h1>Bienvenue sur le portail de déclaration de l’affichage environnemental</h1>
        <div className={searchStyles.filter}>
          <div>
            <h2>Rechercher un etablissement</h2>
            <div className={searchStyles.box}>
              <form className={classNames("fr-grid-row", "fr-grid-row--gutters")} onSubmit={handleSearch}>
                <div className='fr-col-12'>
                  <Input
                    label="Saisissez un SIRET, un nom d'etablissement, de marque ou de bureau d'etude"
                    nativeInputProps={{
                      value: search,
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
                      placeholder: "ex: SIRET, etablissement, Kiabi...",
                    }}
                  />
                  <LoadingButton loading={loading} iconId='ri-search-line' type='submit'>
                    Rechercher
                  </LoadingButton>
                </div>
              </form>
            </div>
          </div>
          <Image src='/images/searchicon.svg' alt='' width={252} height={175} />
        </div>
      </Block>
      {organizationsAndBrands !== null && (
        <div ref={ref}>
          <SearchResult organizations={organizationsAndBrands.organizations} brands={organizationsAndBrands.brands} />
        </div>
      )}
    </>
  )
}

export default Search
