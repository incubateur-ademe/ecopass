import Block from "../components/Block/Block"
import HomeBanner from "../components/Home/HomeBanner"
import KeyResults from "../components/Home/KeyResults"
import SearchBanner from "../components/Home/SearchBanner"
import { isTestEnvironment } from "../utils/test"
import { OrganizationType, UserType } from "@prisma/enums"
import InformationBanner from "../components/Home/InformationBanner"
import InformationProBanner from "../components/Home/InformationProBanner"
import ContributionBanner from "../components/Home/ContributionBanner"

const Home = ({
  connected,
  userType,
  isPro,
}: {
  connected?: boolean
  organizationType?: OrganizationType | null
  userType?: UserType
  isPro?: boolean
}) => {
  return (
    <>
      <HomeBanner connected={connected} isPro={isPro} userType={userType} />
      {(connected || !isTestEnvironment()) && (
        <>
          {isPro && (
            <Block type='blue'>
              <ContributionBanner pro />
            </Block>
          )}
          <Block large>
            <SearchBanner />
          </Block>
          {!isPro && (
            <Block type='blue'>
              <ContributionBanner />
            </Block>
          )}
          {isPro ? (
            <Block large type='grey'>
              <InformationProBanner />
            </Block>
          ) : (
            <>
              <InformationBanner />
              {/*<FAQ />*/}
              <Block>
                <KeyResults />
              </Block>
            </>
          )}
        </>
      )}
    </>
  )
}

export default Home
