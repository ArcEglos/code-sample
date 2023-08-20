import { API_ENTITY, queryFetcher } from "./use-space-x";

beforeEach(() => {
  fetchMock.resetMocks();
});

test("Query fetcher handles requests to SpaceX V4 Query API", async () => {
  fetchMock.mockResponseOnce(
    JSON.stringify({ docs: [], offset: 0, hasNextPage: false, limit: 10 })
  );

  const response = await queryFetcher([
    API_ENTITY.LAUNCHES,
    {
      query: {},
      options: { limit: 10 },
    },
  ]);
  expect(response).toEqual({
    docs: [],
    offset: 0,
    hasNextPage: false,
    limit: 10,
  });
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(
    "https://api.spacexdata.com/v4/launches/query",
    {
      body: '{"query":{},"options":{"limit":10}}',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    }
  );
});

test("Query fetcher handles failing requests to SpaceX V4 Query API", async () => {
  fetchMock.mockReject(() => Promise.reject("API is down"));

  const response = await queryFetcher([
    API_ENTITY.LAUNCH_PADS,
    {
      query: { _id: "2341235" },
      options: {},
    },
  ]).catch((e) => null);

  expect(response).toBe(null);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(
    "https://api.spacexdata.com/v4/launchpads/query",
    {
      body: '{"query":{"_id":"2341235"},"options":{}}',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    }
  );
});
