"use client"
import Button from "@codegouvfr/react-dsfr/Button"
import Input from "@codegouvfr/react-dsfr/Input"
import { addNewBrand } from "../../serverFunctions/brand"
import { useRouter } from "next/navigation"

const NewBrand = () => {
  const router = useRouter()

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const brandName = formData.get("name") as string
    addNewBrand(brandName).then(() => {
      form.reset()
      router.refresh()
    })
  }
  return (
    <>
      <h3 className='fr-mt-2w'>Ajouter une nouvelle marque</h3>
      <form onSubmit={submit}>
        <Input label='Nom de la marque' nativeInputProps={{ required: true, name: "name" }} />
        <Button type='submit'>Ajouter une nouvelle marque</Button>
      </form>
    </>
  )
}

export default NewBrand
