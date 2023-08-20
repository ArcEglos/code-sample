import { PropsWithChildren, useRef } from "react";
import {
  Stack,
  Flex,
  Box,
  Button,
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  DrawerBody,
  IconButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tag,
} from "@chakra-ui/react";
import { Star } from "react-feather";
import {
  Favourite,
  FavouriteType,
  useFavourites,
} from "../utils/useFavourites";
import { API_ENTITY, useSpaceXPaginatedQuery } from "../utils/use-space-x";
import Error from "./error";
import { Link } from "react-router-dom";

export function Favourites() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [favourites] = useFavourites();

  return (
    <>
      <Button
        ref={btnRef}
        colorScheme="gray"
        variant="outline"
        onClick={onOpen}
      >
        Favourites
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Favourites</DrawerHeader>
          <DrawerBody p={0}>
            {favourites.length === 0 ? (
              <Box p="6">No favourites saved.</Box>
            ) : (
              <Accordion defaultIndex={[0, 1]} allowMultiple>
                <FavouriteLaunches
                  launches={favourites
                    .filter(
                      (candidate) => candidate.type === FavouriteType.LAUNCH
                    )
                    .map((launch) => launch.id)}
                />
                <FavouriteLaunchPads
                  launchPads={favourites
                    .filter(
                      (candidate) => candidate.type === FavouriteType.LAUNCH_PAD
                    )
                    .map((launchPad) => launchPad.id)}
                />
              </Accordion>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

const FavouriteLaunches = ({ launches }: { launches: string[] }) => {
  const { data, error } = useSpaceXPaginatedQuery(
    API_ENTITY.LAUNCHES,
    {
      query: { _id: { $in: launches } },
      options: {
        populate: ["rocket", "launchpad"],
        limit: launches.length,
        sort: { date_utc: "desc" },
      },
    },
    { keepPreviousData: true }
  );

  if (launches.length === 0) {
    return null;
  }

  return (
    <FavouriteSegment title="Launches" count={launches.length}>
      <Stack>
        {error && <Error />}
        {data
          ?.map((page) => page.docs)
          .flat()
          .map((launch) => {
            if (!launches.includes(launch.id)) {
              return null;
            }

            return (
              <Box
                key={launch.id}
                gap="2"
                as={Link}
                to={`/launches/${launch.id}`}
              >
                <Flex justifyContent="space-between" alignItems="flex-end">
                  <Box isTruncated>{launch.name}</Box>
                  <ToggleFavouriteButton
                    id={launch.id}
                    type={FavouriteType.LAUNCH}
                  />
                </Flex>
                <Box
                  color="gray.500"
                  fontWeight="semibold"
                  letterSpacing="wide"
                  fontSize="xs"
                  textTransform="uppercase"
                >
                  {launch.rocket?.name} &bull; {launch.launchpad?.name}
                </Box>
              </Box>
            );
          })}
      </Stack>
    </FavouriteSegment>
  );
};

const FavouriteLaunchPads = ({ launchPads }: { launchPads: string[] }) => {
  const { data, error } = useSpaceXPaginatedQuery(
    API_ENTITY.LAUNCH_PADS,
    {
      query: { _id: { $in: launchPads } },
      options: {
        populate: ["rockets"],
        limit: launchPads.length,
        sort: { full_name: "asc" },
      },
    },
    { keepPreviousData: true }
  );

  if (launchPads.length === 0) {
    return null;
  }

  return (
    <FavouriteSegment title="Launch Pads" count={launchPads.length}>
      {error && <Error />}
      {data
        ?.map((page) => page.docs)
        .flat()
        .map((launchPad) => {
          if (!launchPads.includes(launchPad.id)) {
            return null;
          }

          return (
            <Box
              key={launchPad.id}
              gap="2"
              as={Link}
              to={`/launch-pads/${launchPad.id}`}
            >
              <Flex justifyContent="space-between" alignItems="flex-end">
                <Box isTruncated>{launchPad.full_name}</Box>
                <ToggleFavouriteButton
                  id={launchPad.id}
                  type={FavouriteType.LAUNCH_PAD}
                />
              </Flex>
              <Box
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                textTransform="uppercase"
              >
                {launchPad.rockets.map((r) => r.name).join(", ")}
              </Box>
            </Box>
          );
        })}
    </FavouriteSegment>
  );
};

const FavouriteSegment = ({
  title,
  count,
  children,
}: PropsWithChildren<{ title: string; count: number }>) => {
  return (
    <AccordionItem>
      <h2>
        <AccordionButton px={6}>
          <Box as="span" flex="1" textAlign="left">
            {title} <Tag borderRadius="full">{count}</Tag>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel px={6} pb={4}>
        {children}
      </AccordionPanel>
    </AccordionItem>
  );
};

export function ToggleFavouriteButton({ type, id }: Favourite) {
  const [favourites, { addFavourite, removeFavourite }] = useFavourites();

  const isFavourite = favourites.some(
    (candidate) => candidate.type === type && candidate.id === id
  );

  return (
    <IconButton
      aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
      variant="ghost"
      icon={
        <Star
          fill={isFavourite ? "#FFAB00" : "none"}
          stroke={isFavourite ? "none" : "black"}
        />
      }
      size="xs"
      onClick={(e) => {
        e.preventDefault();
        if (isFavourite) {
          removeFavourite({ type, id });
        } else {
          addFavourite({ type, id });
        }
      }}
    />
  );
}
