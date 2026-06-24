import Block from "../components/Block/Block"
import HomeBanner from "../components/Home/HomeBanner"
import KeyResults from "../components/Home/KeyResults"
import SearchBanner from "../components/Home/SearchBanner"
import { isTestEnvironment } from "../utils/test"
import { OrganizationType } from "@prisma/enums"
import { organizationTypesAllowedToDeclare } from "../utils/organization/canDeclare"
import InformationBanner from "../components/Home/InformationBanner"
import InformationProBanner from "../components/Home/InformationProBanner"
import ContributionBanner from "../components/Home/ContributionBanner"

const Home = ({ connected, type, isPro }: { connected?: boolean; type: OrganizationType | null; isPro?: boolean }) => {
  const isAllowedToDeclare = !!(type && organizationTypesAllowedToDeclare.includes(type))
  return (
    <>
      <HomeBanner connected={connected} isPro={isPro} isAllowedToDeclare={isAllowedToDeclare} />
      {(connected || !isTestEnvironment()) && (
        <>
          <Block large>
            <SearchBanner />
          </Block>
          {!isPro && (
            <Block type='blue'>
              <ContributionBanner />
            </Block>
          )}
          {isPro || isAllowedToDeclare ? (
            <Block large type='yellow'>
              <InformationProBanner />
            </Block>
          ) : (
            <>
              <InformationBanner />
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
