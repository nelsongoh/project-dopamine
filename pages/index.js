import { useEffect, useState } from 'react';
import Image from 'next/image';
import Toolbar from '@material-ui/core/Toolbar';
import useTheme from '@material-ui/styles/useTheme';
import Headerbar from '../src/components/Headerbar';
import { retrieveIndexPageAssets } from '../lib/server/assets';

export const getStaticProps = async (context) => {
  const { backgroundImg } = await retrieveIndexPageAssets();
  return {
    props: {
      backgroundImg
    }
  }
};

const Home = ({ backgroundImg }) => {
  const [headerBarHeight, setHeaderBarHeight] = useState(0);

  useEffect(() => {
    setHeaderBarHeight(document.getElementById("homeToolbar").clientHeight);
  }, [])

  return (
    <div style={{ display: 'flex' }}>
      <Headerbar isTopStack={true} />
      <div>
        <Toolbar id="homeToolbar" />
        <div style={{ 
          position: 'absolute', 
          width: '100vw', 
          height: `calc(100vh - ${headerBarHeight}px`
        }}>
          <Image
            src={backgroundImg}
            alt="Landing page image"
            aria-label="hot-air balloons in the desert"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
    </div>
  );  
};

export default Home;
