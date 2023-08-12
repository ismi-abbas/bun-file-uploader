import { Elysia, t } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { html } from '@elysiajs/html';
import { readdirSync, mkdir, exists, existsSync } from 'fs';
import * as nanoid from 'nanoid';
import Index from './components/Index';
import * as elements from 'typed-html';

const PORT = process.env.PORT || 8080;

const baseDir = './uploads/';

const app = new Elysia();

app.use(staticPlugin());

app.use(html()).get('/', ({ html }) => html(<Index image="" />));

app.get('/image/list', async () => {
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
});

app.post(
	'/upload',
	async ({ body: { file } }) => {
		const directoryExists = existsSync(baseDir);
		if (!directoryExists) {
			mkdir(baseDir, { recursive: true }, err => {
				if (err) throw err;
			});
		}

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
);

app.post(
	'/multiple',
	({ body: { files } }) => {
		const directoryExists = existsSync(baseDir);
		if (!directoryExists) {
			mkdir(baseDir, { recursive: true }, err => {
				if (err) throw err;
			});
		}
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
);

app.onError(({ code, error }) => {
	return {
		code,
		error,
	};
});

app.listen(PORT);

console.log(`Server is running on http://localhost:${PORT}`);
