import app from '@/app';
import config from '@/config';

app.listen(config.PORT, config.HOST, () => {
  console.log(`
  ################################################
  ##              Server is running             ##
  ##                 ${config.HOST}:${config.PORT}               ##
  ################################################
  `);
});
