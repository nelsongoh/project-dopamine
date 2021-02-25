import { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useTheme from '@material-ui/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import Headerbar from '@/components/Headerbar';

const useStyles = makeStyles((theme) => ({
  pageTitle: {
    position: 'absolute',
    zIndex: 1,
    color: 'white',
    [theme.breakpoints.only("xs")]: {
      top: '250%',
      left: '120%',
      width: '200px',
    },
    [theme.breakpoints.only("sm")]: {
      top: '340%',
      left: '200%',
      width: '200px',
    },
    [theme.breakpoints.only("md")]: {
      top: '420%',
      left: '200%',
      width: '300px' 
    },
    [theme.breakpoints.up("lg")]: {
      top: '220%',
      left: '500%',
      width: '300px' 
    },
  },
}));

// getStaticProps is required to make page "static" as using
//  a custom server disables automatic static optimizations
// custom server docs - https://nextjs.org/docs/advanced-features/custom-server
// automatic static optimizations -  https://nextjs.org/docs/advanced-features/automatic-static-optimization
//
// without GSP - Cache-Control is set to `private` by the custom server disabling caching
// with GSP - Cache-Control is set to `s-maxage=1, stale-while-revalidate`
export const getStaticProps = async () => {
  return {
    props: {},
  };
};

const Home = () => {
  const [headerBarHeight, setHeaderBarHeight] = useState(0);
  const classes = useStyles();
  const theme = useTheme();

  const isXtraSmall = useMediaQuery(theme.breakpoints.only("xs"));

  const getTypoVariant = () => {
    if (isXtraSmall) {
      return "h4";
    } else {
      return "h2";
    }
  };

  useEffect(() => {
    setHeaderBarHeight(document.getElementById("homeToolbar").clientHeight);
  }, []);

  return (
    <Fragment>
      <div style={{ display: 'flex' }}>
        <Headerbar isTopStack={true} />
        <div style={{ position: 'relative '}}>
          <Toolbar id="homeToolbar" />
          <div className={classes.pageTitle}>
            <Typography variant={getTypoVariant()} style={{ fontFamily: 'Permanent Marker, cursive' }}>
              Welcome to the Playground
            </Typography>
          </div>
          <div style={{ 
            position: 'absolute', 
            width: '100vw', 
            height: `calc(100vh - ${headerBarHeight}px`,
            zIndex: -1,
          }}>
            {/* <img
              src="/assets/indexPage/desert-hot-air-balloon.jpg"
            /> */}
            <Image
              src="/assets/indexPage/desert-hot-air-balloon.jpg"
              alt="Landing page image"
              aria-label="hot-air balloons in the desert"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </div>
    </Fragment>
  );  
};

export default Home;
