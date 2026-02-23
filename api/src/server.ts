import { app } from "./app.js";
import { getEnvConfig } from "./config/env.js";

const envConfig = getEnvConfig();

app.listen(envConfig.port, () => {
  console.info(`[API] Server running on port ${envConfig.port}`);
});
