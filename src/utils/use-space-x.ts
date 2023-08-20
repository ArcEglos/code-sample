import useSWR, { SWRConfiguration } from "swr";
import useSWRInfinite, { SWRInfiniteConfiguration } from "swr/infinite";
import { z } from "zod";

const spaceXApiBase = import.meta.env.VITE_SPACEX_API_URL;

export enum API_ENTITY {
  LAUNCHES = "launches",
  LAUNCH_PADS = "launchpads",
}

// The schemas for these entities are not comprehensive.
// They only cover the elements that we are currently using.
// See the API documentation at https://github.com/r-spacex/SpaceX-API/tree/master/docs
// for the full details.
const launchSchema = z.object({
  links: z.object({
    patch: z.object({
      small: z.string(),
    }),
    mission_patch_small: z.string().optional(),
    flickr: z.object({ original: z.array(z.string()) }),
    youtube_id: z.string().nullish(),
  }),
  rocket: z.object({
    name: z.string(),
    success_rate_pct: z.number(),
    height: z.object({
      meters: z.number(),
      feet: z.number(),
    }),
    mass: z.object({
      kg: z.number(),
      lb: z.number(),
    }),
  }),
  success: z.boolean(),
  launchpad: z.object({
    id: z.string(),
    name: z.string(),
    timezone: z.string(),
    full_name: z.string(),
  }),
  name: z.string(),
  date_utc: z.string(),
  date_local: z.string(),
  flight_number: z.number(),
  details: z.string().nullish(),
  id: z.string(),
});
export type LaunchDetails = z.infer<typeof launchSchema>;
export type LaunchResponse = { docs: Array<LaunchDetails> };

const launchPadSchema = z.object({
  name: z.string(),
  full_name: z.string(),
  rockets: z.array(z.object({ name: z.string() })),
  details: z.string(),
  status: z.string(),
  id: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  locality: z.string(),
  region: z.string(),
  launch_attempts: z.number(),
  launch_successes: z.number(),
});
export type LaunchPadDetails = z.infer<typeof launchPadSchema>;
export type LaunchPadResponse = { docs: Array<LaunchPadDetails> };

const metaSchema = z.object({
  limit: z.number(),
  offset: z.number(),
  hasNextPage: z.boolean(),
});

const entitySchemas = {
  [API_ENTITY.LAUNCHES]: launchSchema,
  [API_ENTITY.LAUNCH_PADS]: launchPadSchema,
};

type Response<EntityType extends API_ENTITY> = z.infer<typeof metaSchema> & {
  docs: Array<z.infer<(typeof entitySchemas)[EntityType]>>;
};

export const queryFetcher = async ([objectType, payload]: [
  API_ENTITY,
  unknown
]) => {
  const response = await fetch(`${spaceXApiBase}/${objectType}/query`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw Error(response.statusText);
  }
  const responseBody = await response.json();

  const schema = metaSchema.extend({
    docs: z.array(entitySchemas[objectType]),
  });

  const parsed = schema.safeParse(responseBody);

  if (!parsed.success) {
    throw parsed.error;
  }

  return parsed.data;
};

export function useSpaceXQuery<EntityType extends API_ENTITY>(
  objectType: EntityType,
  payload: unknown,
  options?: SWRConfiguration
) {
  return useSWR<Response<EntityType>>(
    [objectType, payload],
    queryFetcher,
    options
  );
}

export function useSpaceXPaginatedQuery<EntityType extends API_ENTITY>(
  objectType: EntityType,
  payload: { options: Record<string, unknown> } & Record<string, unknown>,
  options?: SWRInfiniteConfiguration
) {
  return useSWRInfinite<Response<EntityType>>(
    (_pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.hasNextPage) {
        return null;
      }

      const offset = previousPageData
        ? previousPageData.offset + previousPageData.limit
        : 0;

      return [
        objectType,
        { ...payload, options: { ...payload.options, offset } },
      ];
    },
    queryFetcher,
    options
  );
}
