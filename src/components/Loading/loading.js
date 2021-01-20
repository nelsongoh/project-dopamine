import styles from './loading.module.css';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';

const LoadingScreen = () => {
  return (
    <Dialog open>
      <CircularProgress className={styles.spinner} />
      <p className={styles.centerText}>Loading</p>
    </Dialog>
  );
}

export default LoadingScreen;
