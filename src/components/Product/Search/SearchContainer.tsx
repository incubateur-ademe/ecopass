"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Block from "../../Block/Block"
import { Products } from "../../../db/product"
import SearchFilters from "./SearchFilters"
import SearchActions from "./SearchActions"
import SearchResults from "./SearchResults"
import styles from "./SearchContainer.module.css"
import Image from "next/image"

const SearchContainer = ({
  page,
  size,
  total,
  products,
  brands,
  selectedBrandId,
  searchQuery,
  selectedCategory,
}: {
  page: number
  size: number
  total: number
  products: Products
  brands: { name: string; id: string }[]
  selectedBrandId?: string
  searchQuery?: string
  selectedCategory?: string
}) => {
  const router = useRouter()
  const [brandId, setBrandId] = useState(selectedBrandId || "")
  const [search, setSearch] = useState(searchQuery || "")
  const [category, setCategory] = useState(selectedCategory || "")

  const handleSearch = (newPage?: number) => {
    const params = new URLSearchParams()
    if (brandId) {
      params.set("brandId", brandId)
    }
    if (search.trim()) {
      params.set("search", search.trim())
    }
    if (category) {
      params.set("category", category)
    }
    params.set("page", newPage ? newPage.toString() : "1")
    router.push(`/recherche?${params.toString()}`)
  }

  const handleReset = () => {
    setBrandId("")
    setSearch("")
    setCategory("")
    router.push("/recherche")
  }

  const totalPages = Math.ceil(total / size)

  return (
    <>
      <Block home>
        <h1>Recherchez un produit par marque, code-barres ou catégorie</h1>
        <div className={styles.filter}>
          <div className={styles.box}>
            <SearchFilters
              brandId={brandId}
              category={category}
              search={search}
              brands={brands}
              onBrandChange={setBrandId}
              onCategoryChange={setCategory}
              onSearchChange={setSearch}
              onSearchSubmit={() => handleSearch()}
            />
            <SearchActions onSearch={() => handleSearch()} onReset={handleReset} />
          </div>
          <Image src='/images/searchicon.svg' alt='' width={252} height={175} />
        </div>
      </Block>
      {(selectedBrandId || searchQuery || selectedCategory) && (
        <Block>
          <h2>Résultats de recherche</h2>
          <SearchResults
            products={products}
            total={total}
            page={page}
            totalPages={totalPages}
            onPageChange={handleSearch}
          />
        </Block>
      )}
    </>
  )
}

export default SearchContainer
