import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      uri: process.env.DATABASE_URI
    }
  };
});
