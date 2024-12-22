import express from 'express';
import productsRouter from './src/routes/products.router.js'
import cartRouter from './src/routes/carritos.router.js'
import handlebars from 'express-handlebars';
import path from "path"
import { fileURLToPath } from 'url';
import handlebarsRouter from './src/routes/handlebars.router.js'



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.set('views',path.join( __dirname,  'views'))


app.engine("handlebars", handlebars.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    extname: '.handlebars'
}))

app.set('view engine', 'handlebars')


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter);
app.use('/realtimeproducts', handlebarsRouter)



const SERVER_PORT = 9090;
app.listen(SERVER_PORT, () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});