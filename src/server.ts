import app from '@/app';
import { HOST, PORT } from '@config';

app.listen(PORT, HOST, () => {
  console.log(`
  ################################################
  ##              Server is running             ##
  ##                 ${HOST}:${PORT}               ##
  ################################################
  `);
});
