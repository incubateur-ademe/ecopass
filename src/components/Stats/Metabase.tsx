import Script from "next/script"

const Metabase = ({ token }: { token?: string }) => {
  return (
    <>
      <Script
        id='metabase-embed'
        src='https://ecobalyse-ecopass-metabase.osc-fr1.scalingo.io/app/embed.js'
        strategy='afterInteractive'
      />
      <Script id='metabase-config' strategy='afterInteractive'>
        {`window.metabaseConfig = {
  theme: { preset: "light" },
  isGuest: true,
  instanceUrl: "https://ecobalyse-ecopass-metabase.osc-fr1.scalingo.io"
};`}
      </Script>
      <h2>Statistiques par catégorie de produit</h2>
      {/* @ts-expect-error custom element from Metabase embed */}
      <metabase-question token={token} with-title='false' with-downloads='false'></metabase-question>
    </>
  )
}

export default Metabase
