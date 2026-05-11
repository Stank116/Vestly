import { env } from './config/env';
import { createApp } from './app';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Vestly API running on http://localhost:${env.PORT}`);
});
