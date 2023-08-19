import useLocalStorageState from "use-local-storage-state";

export const useFavourites = () => {
  const [favourites, setFavourites] = useLocalStorageState("favourites", {
    defaultValue: [],
  });

  const addFavourite = ({ type, id }) => {
    if (
      favourites.some(
        (candidate) => candidate.type === type && candidate.id === id
      )
    ) {
      return;
    }
    setFavourites([...favourites, { type, id }]);
  };

  const removeFavourite = ({ type, id }) => {
    setFavourites(
      favourites.filter(
        (candidate) => candidate.type !== type || candidate.id !== id
      )
    );
  };

  return [favourites, { addFavourite, removeFavourite }];
};
