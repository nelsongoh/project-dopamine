import styles from './loading.module.css';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';

const LoadingScreen = ({ isOpen }) => {
  return (
    <Dialog open={isOpen}>
      <CircularProgress className={styles.spinner} />
      <p className={styles.centerText}>Loading</p>
    </Dialog>
  );
}

export default LoadingScreen;
