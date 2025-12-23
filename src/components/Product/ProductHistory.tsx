"use client"
import { useCallback, useState } from "react"
import { ProductWithScore } from "../../db/product"
import { formatDate } from "../../services/format"
import Table from "../Table/Table"
import { getProductHistory } from "../../serverFunctions/product"
import LoadingButton from "../Button/LoadingButton"
import { Pagination } from "@codegouvfr/react-dsfr/Pagination"
import Button from "@codegouvfr/react-dsfr/Button"

const ProductHistory = ({ gtin }: { gtin: string }) => {
  const [history, setHistory] = useState<ProductWithScore[] | null>(null)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  const loadHistory = useCallback(
    async (page: number) => {
      setLoading(true)
      try {
        const result = await getProductHistory(gtin, page, 10)
        setHistory(result.products)
        setTotal(result.total)
        setCurrentPage(page)
      } finally {
        setLoading(false)
      }
    },
    [gtin],
  )

  if (!history) {
    return (
      <LoadingButton loading={loading} onClick={() => loadHistory(0)}>
        Voir l'historique du produit
      </LoadingButton>
    )
  }

  return (
    <div data-testid='history-table' className='fr-mt-8w'>
      <Table
        caption='Historique des versions'
        fixed
        headers={["Déposé le", "Par", "Version Ecobalyse", "Score", ""]}
        data={history.map((version) => [
          formatDate(version.createdAt),
          version.upload.createdBy.organization?.displayName,
          version.upload.version,
          version.score === null ? "" : Math.round(version.score),
          <Button linkProps={{ href: `/produits/${version.gtins[0]}/${version.id}` }} key={version.id}>
            Voir le détail
          </Button>,
        ])}
      />
      {total > 10 && (
        <Pagination
          count={Math.ceil(total / 10)}
          defaultPage={currentPage + 1}
          getPageLinkProps={(page) => ({
            href: `#page-${page - 1}`,
            onClick: (e) => {
              e.preventDefault()
              loadHistory(page - 1)
            },
          })}
          showFirstLast
        />
      )}
    </div>
  )
}

export default ProductHistory
