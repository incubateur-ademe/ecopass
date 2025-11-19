import Tile from "@codegouvfr/react-dsfr/Tile"
import styles from "./Contact.module.css"

const Contact = () => {
  return (
    <Tile
      className={styles.tile}
      orientation='horizontal'
      imageUrl='/images/mail-send.svg'
      title='Si vous le souhaitez, vous pouvez prendre contact avec nous !'
      linkProps={{ href: `mailto:${process.env.NEXT_PUBLIC_SUPPORT_MAIL}` }}
      desc={process.env.NEXT_PUBLIC_SUPPORT_MAIL}
    />
  )
}

export default Contact
