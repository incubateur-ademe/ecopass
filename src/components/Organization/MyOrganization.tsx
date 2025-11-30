import { OrganizationType } from "../../../prisma/src/prisma"
import { UserOrganization } from "../../db/user"
import Block from "../Block/Block"
import BrandOrganization from "./Brand/BrandOrganization"
import ConsultancyOrganization from "./ConsultancyOrganization"
import DistributorOrganization from "./DistributorOrganization"
import Informations from "./Informations"
import OtherOrganization from "./OtherOrganization"

const MyOrganization = ({ organization }: { organization: UserOrganization }) => {
  return (
    <Block>
      {organization.type === OrganizationType.Other ? (
        <OtherOrganization />
      ) : (
        <>
          <h1>Mon organisation</h1>
          <div className='fr-grid-row fr-grid-row--gutters'>
            <div className='fr-col-12 fr-col-md-4'>
              <Informations organization={organization} />
            </div>
            <div className='fr-col-12 fr-col-md-8'>
              {organization.type === OrganizationType.Brand ||
              organization.type === OrganizationType.BrandAndDistributor ? (
                <BrandOrganization organization={organization} />
              ) : organization.type === OrganizationType.Consultancy ? (
                <ConsultancyOrganization organization={organization} />
              ) : organization.type === OrganizationType.Distributor ? (
                <DistributorOrganization />
              ) : null}
            </div>
          </div>
        </>
      )}
    </Block>
  )
}

export default MyOrganization
