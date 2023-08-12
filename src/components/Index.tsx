import * as elements from 'typed-html';

export default function Index({ image }: { image: string }) {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Bun Uploader</title>
				<link rel="shortcut icon" href="https://bun.dev/favicon.ico" type="image/x-icon" />
				<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.15/dist/tailwind.min.css" rel="stylesheet" />
			</head>
			<body class="bg-gray-100">
				<section class="container mx-auto flex flex-col items-center justify-center h-screen">
					<div class="flex flex-col items-center justify-center mb-6">
						<div class="flex gap-3">
							<h1 class="text-3xl font-bold">Bun Uploader</h1>
							<img src="../assets/bun.png" alt="bun-image" height="40px" width="40px" />
						</div>
						<p class="text-gray-600 mt-2">This app is using bun api to serve and save files</p>
					</div>

					<form class="flex flex-col items-center" action="/upload" method="post" enctype="multipart/form-data">
						<input type="file" name="file" class="p-2 border border-gray-300 rounded-lg shadow-sm mb-2" />
						<button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
							Upload
						</button>
					</form>
				</section>
			</body>
		</html>
	);
}
