import * as express from 'express';
import { LoginController } from '../controllers/LoginController';
import { RegisterController } from '../controllers/RegisterController';
import { SettingsController } from '../controllers/SettingsController';
import { ChatController } from '../controllers/ChatController';
import { ErrorController } from '../controllers/ErrorController';

const app = express();
const PORT = 3000;

app.use(express.static('dist', { extensions: ['scss', 'css'] }));

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  const controller = new LoginController();
  res.send(controller.renderLayout());
});

app.get('/register', (req, res) => {
  const controller = new RegisterController();
  res.send(controller.renderLayout());
});

app.get('/settings', (req, res) => {
  const controller = new SettingsController();
  res.send(controller.renderLayout());
});

app.get('/chat', (req, res) => {
  const controller = new ChatController();
  res.send(controller.renderLayout());
});

app.get('/user_avatar.png', (req, res) => {
  res.sendFile(`${process.cwd()}/src/images/common/user.png`);
});

app.get('*', (req, res) => {
  const controller = new ErrorController();
  res.send(controller.renderLayout());
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
