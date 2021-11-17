import makeApp from "./app";
import database, { createConnection } from "./database";
import config from "./config";

createConnection();

const app = makeApp(database);

const port = config.PORT;

app.listen(port, () => {
  console.log(`server on port ${port}`);
});
