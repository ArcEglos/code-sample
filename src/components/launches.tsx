import { Badge, Box, Image, SimpleGrid, Text, Flex } from "@chakra-ui/react";
import { format as timeAgo } from "timeago.js";
import { Link } from "react-router-dom";

import {
  API_ENTITY,
  LaunchDetails,
  useSpaceXPaginatedQuery,
} from "../utils/use-space-x";
import { formatDate } from "../utils/format-date";
import Error from "./error";
import Breadcrumbs from "./breadcrumbs";
import LoadMoreButton from "./load-more-button";
import { ToggleFavouriteButton } from "./favourites";
import { FavouriteType } from "../utils/useFavourites";

const PAGE_SIZE = 12;

export default function Launches() {
  const { data, error, isValidating, setSize } = useSpaceXPaginatedQuery(
    API_ENTITY.LAUNCHES,
    {
      query: { upcoming: false },
      options: {
        limit: PAGE_SIZE,
        populate: ["rocket", "launchpad"],
        sort: { date_utc: "desc" },
      },
    }
  );

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Launches" }]}
      />
      <SimpleGrid m={[2, null, 6]} minChildWidth="350px" spacing="4">
        {error && <Error />}
        {data
          ?.map((page) => page.docs)
          .flat()
          .map((launch) => (
            <LaunchItem launch={launch} key={launch.id} />
          ))}
      </SimpleGrid>
      <LoadMoreButton
        loadMore={() => setSize((size) => size + 1)}
        data={data}
        isLoadingMore={isValidating}
      />
    </div>
  );
}

export function LaunchItem({ launch }: { launch: LaunchDetails }) {
  return (
    <Box
      as={Link}
      to={`/launches/${launch.id}`}
      boxShadow="md"
      borderWidth="1px"
      rounded="lg"
      overflow="hidden"
      position="relative"
    >
      <Image
        src={launch.links.flickr.original[0] ?? launch.links.patch.small}
        alt={`${launch.name} launch`}
        height={["200px", null, "300px"]}
        width="100%"
        objectFit="cover"
        objectPosition="bottom"
      />

      <Image
        position="absolute"
        top="5"
        right="5"
        src={launch.links.mission_patch_small}
        height="75px"
        objectFit="contain"
        objectPosition="bottom"
      />
      <Flex>
        <Box p="6" minWidth="0" flexGrow={1}>
          <Box d="flex" alignItems="baseline">
            {launch.success ? (
              <Badge px="2" variant="solid" colorScheme="green">
                Successful
              </Badge>
            ) : (
              <Badge px="2" variant="solid" colorScheme="red">
                Failed
              </Badge>
            )}
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="2"
            >
              {launch.rocket?.name} &bull; {launch.launchpad?.name}
            </Box>
          </Box>

          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
          >
            {launch.name}
          </Box>
          <Flex whiteSpace="nowrap">
            <Text fontSize="sm">{formatDate(launch.date_utc)} </Text>
            <Text color="gray.500" ml="2" fontSize="sm">
              {timeAgo(launch.date_utc)}
            </Text>
          </Flex>
        </Box>
        <Box p="4" pl="0" pt="5">
          <ToggleFavouriteButton id={launch.id} type={FavouriteType.LAUNCH} />
        </Box>
      </Flex>
    </Box>
  );
}
