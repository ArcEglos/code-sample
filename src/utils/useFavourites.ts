import useLocalStorageState from "use-local-storage-state";

// The string values of this enum should not be changed
// to make sure existing values stored by users in their
// local storage are still valid.
export enum FavouriteType {
  LAUNCH = "launch",
  LAUNCH_PAD = "launchPad",
}

export type Favourite = {
  type: FavouriteType;
  id: string;
};

export const useFavourites = () => {
  const [favourites, setFavourites] = useLocalStorageState<Array<Favourite>>(
    "favourites",
    {
      defaultValue: [],
    }
  );

  const addFavourite = ({ type, id }: Favourite) => {
    if (
      favourites.some(
        (candidate) => candidate.type === type && candidate.id === id
      )
    ) {
      return;
    }
    setFavourites([...favourites, { type, id }]);
  };

  const removeFavourite = ({ type, id }: Favourite) => {
    setFavourites(
      favourites.filter(
        (candidate) => candidate.type !== type || candidate.id !== id
      )
    );
  };

  return [favourites, { addFavourite, removeFavourite }] as const;
};
