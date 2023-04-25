import LoginForm from './LoginForm';
import Links from './Links';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.appName}>Yet Another Twitter Clone</div>
      <Links />
      <LoginForm />
    </nav>
  );
};

export default Navbar;
