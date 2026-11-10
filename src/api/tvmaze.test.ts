import { searchShows } from './tvmaze'

describe('searchShows', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the search endpoint with an encoded query and signal', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify([{ score: 1, show: { id: 1 } }])),
      )
    vi.stubGlobal('fetch', fetchMock)
    const controller = new AbortController()

    const results = await searchShows('law & order', controller.signal)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.tvmaze.com/search/shows?q=law%20%26%20order',
      { signal: controller.signal },
    )
    expect(results).toEqual([{ score: 1, show: { id: 1 } }])
  })

  it('throws when the response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('', { status: 503 })),
    )

    await expect(searchShows('murder')).rejects.toThrow(
      'TVmaze request failed: 503',
    )
  })
})
