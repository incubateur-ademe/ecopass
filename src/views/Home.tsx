import Block from "../components/Block/Block"
import HomeBanner from "../components/Home/HomeBanner"
import KeyResults from "../components/Home/KeyResults"
import SearchBanner from "../components/Home/SearchBanner"
import { isTestEnvironment } from "../utils/test"
import { OrganizationType, UserType } from "@prisma/enums"
import { organizationTypesAllowedToDeclare } from "../utils/organization/canDeclare"
import InformationBanner from "../components/Home/InformationBanner"
import InformationProBanner from "../components/Home/InformationProBanner"
import ContributionBanner from "../components/Home/ContributionBanner"
import FAQ from "../components/Home/FAQ"

const Home = ({
  connected,
  organizationType,
  userType,
  isPro,
}: {
  connected?: boolean
  organizationType?: OrganizationType | null
  userType?: UserType
  isPro?: boolean
}) => {
  const isAllowedToDeclare = !!(organizationType && organizationTypesAllowedToDeclare.includes(organizationType))
  return (
    <>
      <HomeBanner connected={connected} isPro={isPro} isAllowedToDeclare={isAllowedToDeclare} userType={userType} />
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
          {isPro || isAllowedToDeclare ? (
            <Block large type='grey'>
              <InformationProBanner />
            </Block>
          ) : (
            <>
              <InformationBanner />
              <FAQ />
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
