const serve = require('koa-static');
const Koa = require('koa');
const app = new Koa();
const historyApiFallback = require('koa-history-api-fallback');
app.use(historyApiFallback());
app.use(serve(__dirname + '/dist'));

app.listen(8080);

console.log('wave-apartment-wx koa on port 8080');