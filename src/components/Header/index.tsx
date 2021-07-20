import styles from './header.module.scss'

export default function Header() {
  return (
    <div className={styles.title}>
          <img src="/images/Vector.svg" alt="logo" />
          <p>spacetraveling <span>.</span></p>
    </div>
  )
}
