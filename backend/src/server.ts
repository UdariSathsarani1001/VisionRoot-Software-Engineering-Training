import app from './app';
import { env } from './config/environment';

app.listen(env.port, () => {
  console.log(`Backend running on port ${env.port}`);
});
