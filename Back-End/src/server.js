import app from './index.js'

import syncTables from './database/sync-tables.js'
const port = process.env.SERVER_PORT

const initServer = async () => {
  await syncTables()
  app.listen(port, error => {
    console.log(`Server is running on http://localhost:${port}`)
  })
};

initServer()