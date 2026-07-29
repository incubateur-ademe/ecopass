import Image from "next/image"
import Block from "../Block/Block"
import styles from "./FAQ.module.css"

const FAQ = () => {
  return (
    <div className={styles.container}>
      <Block type='yellow'>
        <h2>Questions fréquentes</h2>
        <p>Explorer la FAQ pour trouver les réponses à vos questions</p>
      </Block>
      <Image src='/images/planet.svg' width={303} height={407} alt='' className={styles.image} />
    </div>
  )
}

export default FAQ
