import App from '@/app';
import logger from '@/utils/logger.util';

const main = async (): Promise<void> => {
  const app = await App.build();

  app.start();

  process.on('SIGINT', () => {
    logger.info(`Process ${process.pid} received SIGINT: Exiting with code 0`);
    app.stop();
  });
  process.on('SIGTERM', () => {
    logger.info(`Process ${process.pid} received SIGTERM: Exiting with code 0`);
    app.stop();
  });
};

main();
