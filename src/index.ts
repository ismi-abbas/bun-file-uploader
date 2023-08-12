import { Elysia, t } from 'elysia';
import { html } from '@elysiajs/html';
import { readdirSync } from 'fs';
import * as nanoid from 'nanoid';

const PORT = process.env.PORT || 3000;

const baseDir = './uploads/';

new Elysia()
  .use(html())
  .get('/', () => new Response(Bun.file('index.html')))
  .get('/image/list', async () => {
    const directoryPath = './uploads';
    const files = readdirSync(directoryPath);

    files.forEach(file => {
      let data = Bun.file(baseDir + file);
      const stream = data.stream();
      console.log(stream);
    });

    return {
      files: files,
    };
  })
  .post(
    '/upload',
    async ({ body: { file } }) => {
      const fileName = nanoid.nanoid() + '.' + file.type.split('/')[1];
      await Bun.write(baseDir + fileName, file);

      return new Response(
        JSON.stringify({
          name: fileName,
          type: file.type,
          size: file.size,
        }),
      );
    },
    {
      body: t.Object({
        file: t.File({
          type: ['image/jpeg', 'image/png'],
        }),
      }),
    },
  )
  .post(
    '/multiple',
    ({ body: { files } }) => {
      const uploadedFiles = files.map(file => {
        let fileExtension = file.type.split('/')[1];
        const fileName = nanoid.nanoid() + '.' + fileExtension;

        Bun.write(baseDir + fileName, file);

        return {
          name: fileName,
          type: file.type,
          size: file.size,
        };
      });

      return {
        uploadedFiles,
      };
    },
    {
      body: t.Object({
        files: t.Files({
          type: ['image', 'video'],
        }),
      }),
    },
  )
  .onError(({ code, error }) => {
    return {
      code,
      error,
    };
  })
  .listen(PORT);

console.log(`Server is running on http://localhost:${PORT}`);
