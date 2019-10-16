import os from 'os';
import nock from 'nock';
import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import httpAdapter from 'axios/lib/adapters/http';
import pageLoader from '../src';

axios.defaults.adapter = httpAdapter;

const getFixturePath = (name) => path.join(__dirname, '..', '__tests__', '__fixtures__', name);

let contentTestFile;
let pathToTmpdir;

beforeEach(async () => {
  contentTestFile = await fs.readFile(getFixturePath('test.html'), 'utf-8');
  pathToTmpdir = await fs.mkdtemp(path.join(os.tmpdir(), 'writed3-'));
});

nock.disableNetConnect();

test('content loaded page', async () => {
  nock('https://hexlet.io')
    .log(console.log)
    .get('/courses')
    .reply(200, contentTestFile);

  await pageLoader(pathToTmpdir, 'https://hexlet.io/courses');
  const pageContent = await fs.readFile(path.join(pathToTmpdir, 'hexlet-io-courses.html'), 'utf-8');

  expect(pageContent).toEqual(contentTestFile);
});
