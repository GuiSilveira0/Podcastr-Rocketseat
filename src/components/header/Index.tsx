import styles from './styles.module.scss'

export function Header(){
    const currentDate = new Date().toLocaleDateString('pt-br', {dateStyle: ('medium')})

    return(
        <header className={styles.headerContainer}>
            <img src="/logo.svg" alt="Logo" />
            <p>O melhor para você ouvir, sempre</p>

            <span>{currentDate}</span>
        </header>
    );
}