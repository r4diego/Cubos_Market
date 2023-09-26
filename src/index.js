const app = require('./servidor');

app.use(require('./rotas'));

app.listen(3000);