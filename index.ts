import { Router } from './src/routing/Router'
import { ChatBlock } from './src/blocks/pages/ChatBlock';
import { ErrorBlock } from './src/blocks/pages/ErrorBlock';
import { LoginBlock } from './src/blocks/pages/LoginBlock';
import { RegisterBlock } from './src/blocks/pages/RegisterBlock';
import { SettingsBlock } from './src/blocks/pages/SettingsBlock';


const router = new Router("main_layout_background");

router
    .use('/', LoginBlock)
    .use('/login', LoginBlock)
    .use('/register', RegisterBlock)
    .use('/chat', ChatBlock)
    .use('/settings', SettingsBlock)
    .setError(ErrorBlock)
    .start()

window["router"] = router