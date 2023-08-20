import {
  render,
  screen,
  within,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { LaunchItem } from "./launches";
import { LaunchPadItem } from "./launch-pads";
import { Favourites } from "./favourites";
import { BrowserRouter } from "react-router-dom";
import { LaunchDetails, LaunchPadDetails } from "../utils/use-space-x";

const launchFixture: LaunchDetails = {
  links: {
    patch: {
      small: "https://images2.imgbox.com/a9/9a/NXVkTZCE_o.png",
    },
    flickr: { original: [] },
  },
  rocket: {
    name: "Falcon 9",
    success_rate_pct: 95,
    mass: {
      kg: 100,
      lb: 200,
    },
    height: {
      meters: 60,
      feet: 180,
    },
  },
  flight_number: 180,
  details: "Put a bunch of satellites into space",
  success: true,
  launchpad: {
    name: "KSC LC 39A",
    id: "12345",
    timezone: "America/New York",
    full_name: "Historic Launch Pad 39a",
  },
  name: "Starlink 4-2 (v1.5) & Blue Walker 3",
  date_utc: "2022-09-11T01:10:00.000Z",
  date_local: "2022-09-10T21:10:00-04:00",
  id: "62a9f89a20413d2695d8871a",
};

const launchPadFixture: LaunchPadDetails = {
  name: "CCSFS SLC 40",
  full_name: "Cape Canaveral Space Force Station Space Launch Complex 40",
  rockets: [
    {
      name: "Falcon 9",
    },
  ],
  status: "active",
  id: "5e9e4501f509094ba4566f84",
  launch_attempts: 55,
  launch_successes: 55,
  details: "Quite an important launch pad",
  locality: "Cape Canaveral",
  region: "USA",
  latitude: 30.56,
  longitude: -60.153,
};

beforeEach(() => {
  fetchMock.resetMocks();
});

test("Allows toggling favourite status on launches", async () => {
  fetchMock.mockResponse(async (req) => {
    if (req.url.endsWith("/launches/query")) {
      return JSON.stringify({
        docs: [launchFixture],
        offset: 0,
        hasNextPage: false,
        limit: 10,
      });
    } else if (req.url.endsWith("/launchpads/query")) {
      return JSON.stringify({
        docs: [launchPadFixture],
        offset: 0,
        hasNextPage: false,
        limit: 10,
      });
    } else {
      return {
        status: 404,
        body: "Not Found",
      };
    }
  });

  render(
    <>
      <LaunchItem launch={launchFixture} />
      <LaunchPadItem launchPad={launchPadFixture} />
      <Favourites />
    </>,
    { wrapper: BrowserRouter }
  );

  const [launchPanelElement, launchPadPanelElement] =
    screen.getAllByRole("link");
  const launchPanel = within(launchPanelElement);
  const launchPadPanel = within(launchPadPanelElement);

  // Toggling the favourite status on the launch panel works
  await userEvent.click(launchPanel.getByLabelText("Add to favourites"));

  expect(launchPanel.queryByLabelText("Add to favourites")).toBeNull();
  await launchPanel.findByLabelText("Remove from favourites");

  // Toggling the favourite status on the launch pad panel works
  await userEvent.click(launchPadPanel.getByLabelText("Add to favourites"));

  expect(launchPadPanel.queryByLabelText("Add to favourites")).toBeNull();
  await launchPadPanel.findByLabelText("Remove from favourites");

  // Opening the sidebar
  await userEvent.click(screen.getByText("Favourites"));
  const inSidebar = within(screen.getByRole("dialog"));
  inSidebar.getByText("Launches");
  inSidebar.getByText("Launch Pads");

  // Favourite shows up in sidebar
  await inSidebar.findByText(launchFixture.name);
  const [launchToggle, launchPadToggle] = await inSidebar.findAllByLabelText(
    "Remove from favourites"
  );

  // Remove favourite launch
  await userEvent.click(launchToggle);
  expect(inSidebar.queryByText("Launches")).toBeNull();
  expect(inSidebar.queryByText("No favourites saved.")).toBeNull();
  inSidebar.getByText("Launch Pads");

  // Remove favourite launch pad
  await userEvent.click(launchPadToggle);
  expect(inSidebar.queryByText("Launches")).toBeNull();
  expect(inSidebar.queryByText("Launch Pads")).toBeNull();
  await inSidebar.findByText("No favourites saved.");

  // Closing the sidebar
  await userEvent.click(inSidebar.getByLabelText("Close"));
  await waitForElementToBeRemoved(() => screen.queryByRole("dialog"));
});
