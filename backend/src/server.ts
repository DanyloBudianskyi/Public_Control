import Koa from 'koa';
import bodyParser from "koa-bodyparser";
import userRoute from "./routes/route";
import {connectToDatabase} from "./database";
import {errorHandler} from "./middleware/error-hendler";

export async function bootstrap(){
    const app = new Koa();

    app.use(errorHandler);
    app.use(bodyParser());

    app.use(userRoute.routes());
    app.use(userRoute.allowedMethods());

    await connectToDatabase();

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`)
    })
}

bootstrap();

//192.168.1.71:3000