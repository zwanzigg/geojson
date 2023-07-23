import express, {Express, Request, Response} from 'express';
import {fetchStreetMapDetails} from "./src/street-map-api";
import {AxiosError} from "axios";
const osmtogeojson = require('osmtogeojson');

const app: Express = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/api/geojson', async (req: Request, res: Response) => {
  const bbox: string = req.query.bbox as string;

  if (!bbox) {
    return res.status(400).send({
      error: 'Please provide bbox data',
    })
  }

  const bboxArray : Array<number> = bbox.split(',').map((item: string) => {
    const float = parseFloat(item);
    if (isNaN(float)) {
      return res.status(400).send({
        error: 'Not all bbox values are numbers',
      })
    }
    return float;
  }) as Array<number>;

  try {
    const streetMap = await fetchStreetMapDetails(bboxArray)
    const {data} = streetMap;
    return res.json({data: osmtogeojson(data)});
  } catch (err: unknown) {
    const error = err as AxiosError;
    return res.status(error?.response?.status || 500).json({
      error: error?.response?.data || 'Something went wrong',
    })
  }
});

app.listen(port, () => {
  console.log(`⚡️⚡️⚡️ Server is running at http://localhost:${port}`);
});