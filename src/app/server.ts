import * as express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('dist', { extensions: ['scss', 'css', 'html', 'js'] }));

app.get('/', (req, res) => {
  res.sendFile(`${process.cwd()}/index.html`);
});


app.get(/login|register|settings|chat|error/, (req, res) => {
  res.sendFile(`${process.cwd()}/index.html`);
});

app.get('/user_avatar.png', (req, res) => {
  res.sendFile(`${process.cwd()}/src/images/common/user.png`);
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
