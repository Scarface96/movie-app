import { searchTitles } from './api';

const reply = (body) => Promise.resolve({ ok: true, json: () => Promise.resolve(body) });

afterEach(() => jest.restoreAllMocks());

test('returns results and total, passing filters through', async () => {
  const spy = jest.spyOn(global, 'fetch').mockImplementation(() =>
    reply({ Response: 'True', totalResults: '42', Search: [{ imdbID: 'tt1', Title: 'Batman' }] })
  );
  const data = await searchTitles({ query: ' batman ', type: 'movie', year: '1989', page: 2 });
  expect(data).toEqual({ results: [{ imdbID: 'tt1', Title: 'Batman' }], total: 42 });
  const url = spy.mock.calls[0][0];
  expect(url).toContain('s=batman');
  expect(url).toContain('type=movie');
  expect(url).toContain('y=1989');
  expect(url).toContain('page=2');
});

test('"Movie not found" becomes an empty result, not an error', async () => {
  jest.spyOn(global, 'fetch').mockImplementation(() => reply({ Response: 'False', Error: 'Movie not found!' }));
  await expect(searchTitles({ query: 'zzzzqq' })).resolves.toEqual({ results: [], total: 0 });
});

test('"Too many results" gives a friendly message', async () => {
  jest.spyOn(global, 'fetch').mockImplementation(() => reply({ Response: 'False', Error: 'Too many results.' }));
  await expect(searchTitles({ query: 'a' })).rejects.toMatchObject({ friendly: true });
});
