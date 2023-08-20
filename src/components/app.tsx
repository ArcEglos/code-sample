import React from "react";
import { Routes, Route } from "react-router-dom";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { Favourites } from "./favourites";

const Launches = React.lazy(() => import("./launches"));
const Launch = React.lazy(() => import("./launch"));
const Home = React.lazy(() => import("./home"));
const LaunchPads = React.lazy(() => import("./launch-pads"));
const LaunchPad = React.lazy(() => import("./launch-pad"));

export default function App() {
  return (
    <div>
      <NavBar />
      <React.Suspense
        fallback={
          <Flex justifyContent="center" alignItems="center" minHeight="50vh">
            <Spinner size="lg" />
          </Flex>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/launches" element={<Launches />} />
          <Route path="/launches/:launchId" element={<Launch />} />
          <Route path="/launch-pads" element={<LaunchPads />} />
          <Route path="/launch-pads/:launchPadId" element={<LaunchPad />} />
        </Routes>
      </React.Suspense>
    </div>
  );
}

function NavBar() {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="6"
      bg="gray.800"
      color="white"
    >
      <Text
        fontFamily="mono"
        letterSpacing="2px"
        fontWeight="bold"
        fontSize="lg"
      >
        ¡SPACE·R0CKETS!
      </Text>
      <Favourites />
    </Flex>
  );
}
