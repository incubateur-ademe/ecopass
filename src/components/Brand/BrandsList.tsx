"use client"
import { useState, useMemo } from "react"
import Fuse from "fuse.js"
import Table from "../Table/Table"
import { Pagination } from "@codegouvfr/react-dsfr/Pagination"
import { formatDate } from "../../services/format"
import SearchInput from "../Search/SearchInput"
import Alert from "@codegouvfr/react-dsfr/Alert"
import Block from "../Block/Block"
import Image from "next/image"
import styles from "./BrandsList.module.css"
import Badge from "@codegouvfr/react-dsfr/Badge"
import Link from "next/link"

type Brand = {
  id: string
  name: string
  productCount: number
  lastDeclarationDate: Date
}

const BrandsList = ({ brands }: { brands: Brand[] }) => {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const fuse = useMemo(
    () =>
      new Fuse(brands, {
        keys: ["name"],
        threshold: 0.3,
      }),
    [brands],
  )

  const filteredBrands = useMemo(() => {
    if (!search.trim()) {
      return brands
    }
    return fuse.search(search).map((result) => result.item)
  }, [search, brands, fuse])

  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage)
  const paginatedBrands = filteredBrands.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  return (
    <>
      <Block home>
        <h1>Liste des marques ayant déclaré au moins un produit</h1>
        <div className={styles.headerContainer}>
          <div className={styles.content}>
            <SearchInput
              label='Rechercher une marque'
              placeholder='Rechercher une marque'
              value={search}
              onChange={handleSearchChange}
            />
            <Alert
              className='fr-mt-2w'
              severity='info'
              small
              description={
                <>
                  <b>{brands.length}</b> marques ont déclaré{" "}
                  <b>{brands.reduce((acc, brand) => acc + brand.productCount, 0).toLocaleString("fr-FR")}</b> produits.
                </>
              }
            />
          </div>
          <Image src='/images/information.png' alt='Information' width={200} height={200} className={styles.image} />
        </div>
      </Block>
      <Block>
        <Table
          fixed
          caption='Liste des marques'
          noCaption
          headers={["Marques", "Nombre de produits déclarés", "Date de la dernière déclaration"]}
          data={paginatedBrands.map((brand) => [
            <Link className={styles.link} href={`/marques/${brand.id}`} key={brand.id}>
              {brand.name} <span className='fr-icon-arrow-right-line' aria-hidden='true'></span>
            </Link>,
            <Badge key={brand.id} severity='info' noIcon>
              {brand.productCount.toString()}
            </Badge>,
            formatDate(brand.lastDeclarationDate),
          ])}
        />

        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            defaultPage={currentPage}
            getPageLinkProps={(page) => ({
              onClick: (e) => {
                e.preventDefault()
                setCurrentPage(page)
              },
              href: "#",
            })}
            showFirstLast
          />
        )}
      </Block>
    </>
  )
}

export default BrandsList
