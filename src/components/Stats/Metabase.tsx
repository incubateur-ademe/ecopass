import Script from "next/script"

const Metabase = ({ token, type }: { token?: string; type: "question" | "dashboard" }) => {
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
      {type === "question" && (
        <>
          {/* @ts-expect-error custom element from Metabase embed */}
          <metabase-question token={token} with-title='false' with-downloads='false' />
        </>
      )}
      {type === "dashboard" && (
        <>
          {/* @ts-expect-error custom element from Metabase embed */}
          <metabase-dashboard token={token} with-title='false' with-downloads='false' />
        </>
      )}
    </>
  )
}

export default Metabase
