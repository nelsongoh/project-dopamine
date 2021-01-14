import Container from '@material-ui/core/Container';
import Headerbar from '../Headerbar';
import styles from './loading.module.css';

const LoadingScreen = () => {
  return (
    <div>
      <Headerbar />
      <Container>
        <h1 className={styles.centerText}>Loading...</h1>
      </Container>
    </div>
    
  );
}

export default LoadingScreen;
