import { Elysia, t } from 'elysia';
import * as nanoid from 'nanoid';
import { html } from '@elysiajs/html';
import { readdir, readdirSync, statSync } from 'fs';

const PORT = process.env.PORT || 3000;

const baseDir = '/Users/ismiabbas/projects/app-idea/bun-s3-uploader/uploads/';

const uploadPage = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body>
      <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="files" multiple />
        <input type="submit" value="Upload" />
      </form>
    </body>
  </html>
`;

const fileType = ['image', 'audio', 'video', 'text', 'application'];

new Elysia()
  .use(html())
  .get('/', () => uploadPage)
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
      await Bun.write(baseDir + 'index.jpg', file);

      return {
        message: 'File uploaded',
      };
    },
    {
      body: t.Object({
        file: t.File(),
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
