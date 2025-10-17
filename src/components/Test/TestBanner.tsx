"use client"
import Notice from "@codegouvfr/react-dsfr/Notice"

const TestBanner = () => {
  return (
    <Notice
      title='Attention'
      description='Vous êtes sur la zone de test du portail de déclaration'
      iconDisplayed
      link={{
        linkProps: {
          href: "https://affichage-environnemental.ecobalyse.beta.gouv.fr/",
        },
        text: "Pour une déclaration officielle, rendez-vous sur le site dédié.",
      }}
      severity='warning'
    />
  )
}

export default TestBanner
