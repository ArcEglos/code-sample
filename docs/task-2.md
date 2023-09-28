This PR adds the favourite feature as described in [CHALLENGE.md](../CHALLENGE.md).

## Decisions

### Storage

One of the main decisions to take for the feature was where to store the currently saved favourites. One of the main constraints given by the feature itself was that the information should be persisted - at least locally. As this means putting the information into the local storage I decided to build the state handling fully around this local storage entry to avoid duplication.
To avoid cross-browser edge-cases around local storage behavior and events I went with the library `use-local-storage-state`, which also has some benefits for the testing setup (see below).

#### swr upgrade

I found that one feature of swr that allows to keep previous data when fetching new data with different paramaters (e.g. because the list of IDs needed to be displayed in the sidebar changed) was only added in version 2.x. I decided to make this upgrade after getting an overview over our usage of swr and consulting https://swr.vercel.app/blog/swr-v2#migration-guide for breaking changes. It turned out that we only had to do minimal changes in a single place in the codebase. Because it would solve a fetching issue very elegantly, it in general is helpful to keep dependencies up-to-date and this being a straightforward migration I decided to go ahead with it. In a real world setting I would certainly make this migration in an independent PR and it might very well have been the case that the migration would be a lot more complicated, which could have changed the tradeoffs involved.

### Future expansion

The favourite bar is currently implemented for the two existing data types. It is set up in a way that would allow additional data types as well, however. The storage entry specifically is using a fairly generic format, to allow new types of data without causing migration issues for existing storage entries of our users.
On the rendering side I went fairly lightweight on the abstractions. As I didn't have a strong sense on the direction the rendering would go in I wanted to avoid the risk of adding the wrong abstraction and would rather observe where it will develop over time.

### Performance & optimization

I decided to go with additional fetch queries for the sidebar instead of storing the information needed for rendering in the storage as well. This has multiple reasons: Avoiding stale data and more flexibility in changing the displayed information among others. However, it has the cost of additional requests, an area that could possibly be optimized if needed.

### Testing

Generally I am a big proponent of testing frontends as close to their real-world usage as possible. This also means testing most hooks in the context of their use. For this reason I decided to go for a more integration-style test that assembles a stripped down version of the UI and then tests some of the behaviors of saving favourites and removing them. For this test specifically it is very helpful that the state library is able to fall back to an in-memory storage in environments where local storage is not available.

## Next steps

There are multiple aspects that I didn't get to in the time of this challenge that should ideally be addressed:
1. Improved empty and error states - these are currently fairly bare-bones
2. Full coverage of the tests - I didn't manage to test all behaviors for all situations and locations
3. Limits - currently it would theoretically be possible to save as many favourites as the user wants, which would at some point cause performance issues. This should be limited in some form, or at least the sidebar would need to use pagination as well.

In terms of the process I would usually expect to iterate on the visuals with other people of the team such as designers, PM, analysts to get them to a polished state.