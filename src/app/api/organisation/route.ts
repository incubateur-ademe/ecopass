import { NextResponse } from "next/server"
import { getUserOrganization } from "../../../db/user"
import { getApiUser } from "../../../services/auth/auth"

export async function GET(req: Request) {
  try {
    const api = await getApiUser(req.headers)
    if (!api || !api.user || !api.user.organization) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organization = await getUserOrganization(api.user.id)

    if (!organization) {
      return NextResponse.json({ error: "No organization found for this user" }, { status: 404 })
    }

    return NextResponse.json({
      name: organization.name,
      brands: organization.brands,
      authorizedBy: organization.authorizedBy.map((auth) => ({
        createdAt: auth.createdAt,
        name: auth.from.name,
        siret: auth.from.siret,
        brands: auth.from.brands.filter((brand) => brand.active).map((brand) => ({ id: brand.id, name: brand.name })),
      })),
      authorizeOrganization: organization.authorizedOrganizations.map((auth) => ({
        createdAt: auth.createdAt,
        name: auth.to.name,
        siret: auth.to.siret,
      })),
    })
  } catch (error) {
    console.error("Error fetching organization:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
