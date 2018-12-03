const app = require('./app.js');

const port = 4444;

app.listen(port, () => console.log(`Calculator API running on port - ${port}!`));