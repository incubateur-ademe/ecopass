import { OrganizationType } from "@prisma/enums"
import { UserOrganization } from "../../db/user"
import Block from "../Block/Block"
import BrandOrganization from "./Brand/BrandOrganization"
import ConsultancyOrganization from "./ConsultancyOrganization"
import Informations from "./Informations"
import OtherOrganization from "./OtherOrganization"
import { OrganizationMember } from "../../db/organization"

const MyOrganization = ({
  organization,
  isAdmin,
  members,
  brands,
}: {
  organization: UserOrganization
  isAdmin: boolean
  members: OrganizationMember[]
  brands: { id: string; name: string }[]
}) => {
  return (
    <Block>
      <h1>Mon organisation</h1>
      <div className='fr-grid-row fr-grid-row--gutters'>
        <div className='fr-col-12 fr-col-md-4'>
          <Informations organization={organization} isAdmin={isAdmin} />
        </div>
        <div className='fr-col-12 fr-col-md-8'>
          {organization.type === OrganizationType.Brand ||
          organization.type === OrganizationType.BrandAndDistributor ? (
            <BrandOrganization organization={organization} isAdmin={isAdmin} members={members} brands={brands} />
          ) : organization.type === OrganizationType.Consultancy ? (
            <ConsultancyOrganization organization={organization} isAdmin={isAdmin} members={members} brands={brands} />
          ) : organization.type === OrganizationType.Distributor ? (
            <OtherOrganization organization={organization} isAdmin={isAdmin} members={members} brands={brands} />
          ) : organization.type === OrganizationType.Other ? (
            <OtherOrganization organization={organization} isAdmin={isAdmin} members={members} brands={brands} />
          ) : null}
        </div>
      </div>
    </Block>
  )
}

export default MyOrganization
