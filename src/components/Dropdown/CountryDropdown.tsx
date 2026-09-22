import { ForwardedRef, ReactNode, forwardRef } from "react"
import Dropdown, { DropdownItem } from "./Dropdown"
import { Country } from "../../types/Product"
import { countryMapping } from "../../utils/ecobalyse/mappings"

const regionCountries: Partial<Record<Country, string[]>> = {
  [Country.RégionEuropeDeLOuest]: [
    "Allemagne",
    "Andorre",
    "Autriche",
    "Belgique",
    "Chypre",
    "Cité du Vatican",
    "Danemark",
    "Espagne",
    "Finlande",
    "Grèce",
    "Irlande",
    "Islande",
    "Italie",
    "Liechtenstein",
    "Luxembourg",
    "Malte",
    "Monaco",
    "Pays-Bas",
    "Portugal",
    "Royaume-Uni",
    "Saint-Marin",
    "Suède",
    "Suisse",
  ],
  [Country.RégionEuropeDeLEst]: [
    "Albanie",
    "Arménie",
    "Azerbaïdjan",
    "Biélorussie",
    "Bosnie-Herzégovine",
    "Bulgarie",
    "Croatie",
    "Estonie",
    "Géorgie",
    "Hongrie",
    "Kosovo",
    "Lettonie",
    "Lituanie",
    "Macédoine",
    "Moldavie",
    "Monténégro",
    "Pologne",
    "Roumanie",
    "Russie",
    "Serbie",
    "Slovaquie",
    "Slovénie",
    "Tchéquie",
    "Ukraine",
  ],
  [Country.RégionAsie]: [
    "Afghanistan",
    "Birmanie",
    "Bhoutan",
    "Brunei",
    "Corée du Nord",
    "Corée du Sud",
    "Hong Kong",
    "Indonésie",
    "Japon",
    "Kirghizistan",
    "Laos",
    "Macao",
    "Malaisie",
    "Maldives",
    "Mongolie",
    "Népal",
    "Philippines",
    "Singapour",
    "Tadjikistan",
    "Taïwan",
    "Thaïlande",
    "Timor oriental",
    "Turkménistan",
    "Ouzbékistan",
  ],
  [Country.RégionAfrique]: [
    "Afrique du Sud",
    "Algérie",
    "Angola",
    "Bénin",
    "Botswana",
    "Burkina Faso",
    "Burundi",
    "Cameroun",
    "Cap-Vert",
    "Comores",
    "Congo",
    "Côte d'Ivoire",
    "Djibouti",
    "Égypte",
    "Érythrée",
    "Eswatini",
    "Éthiopie",
    "Gabon",
    "Gambie",
    "Ghana",
    "Guinée",
    "Guinée équatoriale",
    "Guinée-Bissau",
    "Kenya",
    "Lesotho",
    "Liberia",
    "Libye",
    "Madagascar",
    "Malawi",
    "Mali",
    "Maurice",
    "Mauritanie",
    "Mayotte",
    "Mozambique",
    "Namibie",
    "Niger",
    "Nigéria",
    "Ouganda",
    "République Centrafricaine",
    "République Démocratique du Congo",
    "Réunion",
    "Rwanda",
    "Sahara occidental",
    "Sao Tomé-et-Principe",
    "Sénégal",
    "Seychelles",
    "Sierra Leone",
    "Somalie",
    "Soudan",
    "Soudan du Sud",
    "Tanzanie",
    "Tchad",
    "Togo",
    "Zambie",
    "Zimbabwé",
  ],
  [Country.RégionMoyenOrient]: [
    "Arabie Saoudite",
    "Bahreïn",
    "Émirats Arabes Unis",
    "Irak",
    "Iran",
    "Israël",
    "Jordanie",
    "Koweït",
    "Liban",
    "Oman",
    "Palestine",
    "Qatar",
    "Syrie",
    "Yémen",
  ],
  [Country.RégionAmériqueLatine]: [
    "Antigua-et-Barbuda",
    "Argentine",
    "Bahamas",
    "Barbade",
    "Belize",
    "Bolivie",
    "Brésil",
    "Chili",
    "Colombie",
    "Costa Rica",
    "Cuba",
    "Dominique",
    "Équateur",
    "El Salvador",
    "Grenade",
    "Guadeloupe",
    "Guatemala",
    "Guyana",
    "Guyana française",
    "Haïti",
    "Honduras",
    "Jamaïque",
    "Martinique",
    "Mexique",
    "Montserrat",
    "Nicaragua",
    "Panama",
    "Paraguay",
    "Pérou",
    "Porto Rico",
    "République Dominicaine",
    "Saint-Barthélemy",
    "Saint-Martin",
    "Saint-Pierre-et-Miquelon",
    "Sainte-Lucie",
    "Suriname",
    "Trinité-et-Tobago",
    "Uruguay",
    "Venezuela",
  ],
  [Country.RégionAmériqueDuNord]: ["Bermudes", "Canada", "États-Unis", "Groenland"],
  [Country.RégionOcéanie]: [
    "Australie",
    "Fidji",
    "Guam",
    "Îles Mariannes du Nord",
    "Îles Salomon",
    "Kiribati",
    "Micronésie",
    "Nauru",
    "Nouvelle-Calédonie",
    "Nouvelle-Zélande",
    "Palaos",
    "Papouasie-Nouvelle-Guinée",
    "Polynésie française",
    "Samoa",
    "Samoa américaines",
    "Tokelau",
    "Tonga",
    "Tuvalu",
    "Vanuatu",
    "Wallis-et-Futuna",
  ],
}

const buildCountryItems = () => {
  const items: DropdownItem[] = [
    {
      value: "???",
      title: "Pays inconnu",
    },
  ]

  Object.entries(regionCountries).forEach(([region, countries]) => {
    items.push({
      value: countryMapping[region as Country],
      title: region,
      subtitle: countries.length > 0 ? countries.join(", ") : undefined,
    })
  })

  const specificCountries = [
    Country.Myanmar,
    Country.Bangladesh,
    Country.Chine,
    Country.France,
    Country.Inde,
    Country.Cambodge,
    Country.Maroc,
    Country.Pakistan,
    Country.Tunisie,
    Country.Turquie,
    Country.Vietnam,
  ]

  specificCountries.forEach((country) => {
    items.push({
      value: countryMapping[country],
      title: country,
    })
  })

  return items
}

const countryItems = buildCountryItems()

const CountryDropdown = (
  {
    selectedCountry,
    setCountry,
    placeholder,
    state,
    stateRelatedMessage,
    label = "Pays",
  }: {
    selectedCountry: string
    setCountry: (value: string) => void
    placeholder?: string
    state?: "success" | "error" | "info" | "default"
    stateRelatedMessage?: ReactNode
    label?: string
  },
  ref: ForwardedRef<HTMLInputElement>,
) => {
  return (
    <Dropdown
      ref={ref}
      items={countryItems}
      selectedValue={selectedCountry}
      onSelect={setCountry}
      label={label}
      placeholder={placeholder || "Rechercher un pays…"}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
    />
  )
}

export default forwardRef(CountryDropdown)
