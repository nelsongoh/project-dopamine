import { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import ContainerSize from './ContainerSize';
import retrieveFragrancesContent from '@/client-lib/content/retrieveFragrancesContent';
import { FragranceData } from '@/models/fragrances';

const Fragrances = () => {
  const [fragranceData, setFragranceData] = useState(FragranceData());

  useEffect(() => {
    const getFragrancesData = async () => {
      const resp = await retrieveFragrancesContent();
      
      if (resp.success) {
        setFragranceData({
          containerSizes: resp.data.containerSizeInMl,
          dilutionLevels: resp.data.dilutionLevelPercent,
        })
      } else {
        console.log(resp.errors);
      }
    }

    getFragrancesData();
  }, []);

  const [containerSize, setContainerSize] = useState(null);

  return (
    <Grid container direction="column" alignContent="center">
      <Grid item xs={12}>
        <h1>Where the container size selections should be</h1>
        <ContainerSize
          sizes={fragranceData.containerSizes}
          updateSelectedSize={setContainerSize}
        />
      </Grid>
      <Grid item xs={12}>
        <h1>Dilution level</h1>
      </Grid>
      <Grid item xs={12}>
        <h1>Select fragrance function</h1>
      </Grid>
      <Grid item xs={12}>
        <h1>Select ingredients for Top, Middle, and Base notes</h1>
      </Grid>
      <Grid item xs={12}>
        <h1>Adjust volume of Top, Middle, and Base notes (sums to 100%)</h1>
      </Grid>
      <Grid item xs={12}>
        <h1>Assign droplet count for Top, Middle, and Base notes</h1>
      </Grid>
    </Grid>
  );
};

export default Fragrances;
