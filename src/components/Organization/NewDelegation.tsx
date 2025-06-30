"use client"
import Button from "@codegouvfr/react-dsfr/Button"
import Input from "@codegouvfr/react-dsfr/Input"

const NewDelegation = () => {
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }
  return (
    <>
      <h3 className='fr-mt-2w'>Déléguer mes droits</h3>
      <form onSubmit={submit}>
        <Input label='Organisation' nativeInputProps={{ required: true, name: "name" }} />
        <Button type='submit'>Déléguer mes droits</Button>
      </form>
    </>
  )
}

export default NewDelegation
