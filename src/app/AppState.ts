import { AuthorizeController } from "../controllers/AuthorizeController";
import { ChatsController } from "../controllers/ChatsController";
import { UserController } from "../controllers/UserController";
import { Router } from "../routing/Router";
import { Store } from "../store/Store";

export type AppState = {
    controllers: {
        authorization: AuthorizeController,
        user: UserController,
        chats: ChatsController,
    },
    store: Store,
    router: Router
}