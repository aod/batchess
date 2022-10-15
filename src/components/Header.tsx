import styles from "./Header.module.css";
import Title from "@/components/Title";

export default function Header() {
  return (
    <header className={styles.header}>
      <Title />
      <span className={styles.subheader}>
        <a
          href="http://l.yatko.dev/batchess-src"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono"
        >
          Source
        </a>
      </span>
    </header>
  );
}
