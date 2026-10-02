"use client"

import { useSearchParams } from "next/navigation"
import { Pagination } from "@codegouvfr/react-dsfr/Pagination"

export const ProductsPagination = ({ count, defaultPage }: { count: number; defaultPage: number }) => {
  const searchParams = useSearchParams()

  return (
    <Pagination
      count={count}
      defaultPage={defaultPage}
      getPageLinkProps={(pageNum) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", pageNum.toString())
        return {
          href: `/produits?${params.toString()}`,
        }
      }}
      showFirstLast
    />
  )
}
