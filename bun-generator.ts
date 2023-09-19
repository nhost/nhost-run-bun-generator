import { createServer } from 'http';
import { get } from 'https'; 
import { createGunzip } from 'zlib'; 

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const server = createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/bun') {
    const randomPage = getRandomInt(1, 20); 
    const options = {
      hostname: 'api.pexels.com',
      path: `/v1/search?query=cake&per_page=20&page=${randomPage}&orientation=landscape`,
      headers: {
        'Authorization': Bun.env.PEXELS_API_KEY,
        'Accept-Encoding': 'gzip'
      }
    };

    get(options, (apiRes) => {
      const stream = apiRes.pipe(createGunzip());
      let data = '';

      stream.on('data', (chunk) => {
        data += chunk;
      });

      stream.on('end', () => {
        const jsonResponse = JSON.parse(data);
        const randomImageIndex = getRandomInt(0, jsonResponse.photos.length - 1);
        const imageUrl = jsonResponse.photos[randomImageIndex].src.medium;

        get(imageUrl, (imageRes) => {
          res.writeHead(200, {
            'Content-Type': imageRes.headers['content-type'],
            'Content-Length': imageRes.headers['content-length']
          });
          imageRes.pipe(res);
        });
      });

    }).on('error', (err) => {
      console.error(`Error fetching image: ${err.message}`);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(5000, () => {
  console.log('The Bun Bakery API is running on http://localhost:5000');
});

