# Raycast - Ui Components

**Pages:** 17

---

## Grid

**URL:** llms-txt#grid

**Contents:**
- Search Bar
  - Custom filtering
  - Programmatically updating the search bar
  - Dropdown
  - Pagination
- Examples
- API Reference
  - Grid
  - Grid.Dropdown
  - Grid.Dropdown.Item

The `Grid` component is provided as an alternative to the [List](https://developers.raycast.com/api-reference/list#list) component when the defining characteristic of an item is an image.

{% hint style="info" %}
Because its API tries to stick as closely to [List](https://developers.raycast.com/api-reference/list#list)'s as possible, changing a view from [List](https://developers.raycast.com/api-reference/list#list) to [Grid](#grid) should be as simple as:

* making sure you're using at least version 1.36.0 of the `@raycast/api` package
* updating your imports from `import { List } from '@raycast/api'` to `import { Grid } from '@raycast/api'`;
* removing the `isShowingDetail` prop from the top-level `List` component, along with all [List.Item](https://developers.raycast.com/api-reference/list#list.item)s' `detail` prop
* renaming all [List.Item](https://developers.raycast.com/api-reference/list#list.item)s' h`icon` prop to `content`
* removing all [List.Item](https://developers.raycast.com/api-reference/list#list.item)s' `accessories`, `accessoryIcon` and \`accessoryTitle props; [Grid.Item](#grid.item) does not *currently* support accessories
* finally, replacing all usages of `List` with `Grid`.
  {% endhint %}

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4bb3d7e88613cf9ccba01c798f5d2aa62edfaeac%2Fgrid.webp?alt=media)

The search bar allows users to interact quickly with grid items. By default, [Grid.Items](#grid.item) are displayed if the user's input can be (fuzzy) matched to the item's `title` or `keywords`.

Sometimes, you may not want to rely on Raycast's filtering, but use/implement your own. If that's the case, you can set the `Grid`'s `filtering` [prop](#props) to false, and the items displayed will be independent of the search bar's text.\
Note that `filtering` is also implicitly set to false if an `onSearchTextChange` listener is specified. If you want to specify a change listener and *still* take advantage of Raycast's built-in filtering, you can explicitly set `filtering` to true.

### Programmatically updating the search bar

Other times, you may want the content of the search bar to be updated by the extension, for example, you may store a list of the user's previous searches and, on the next visit, allow them to "continue" where they left off.

To do so, you can use the `searchText` [prop](#props).

Some extensions may benefit from giving users a second filtering dimension. A media file management extension may allow users to view only videos or only images, an image-searching extension may allow switching ssearch engines, etc.

This is where the `searchBarAccessory` [prop](#props) is useful. Pass it a [Grid.Dropdown](#grid.dropdown) component, and it will be displayed on the right-side of the search bar. Invoke it either by using the global shortcut `⌘` `P` or by clicking on it.

{% hint style="info" %}
Pagination requires version 1.69.0 or higher of the `@raycast/api` package.
{% endhint %}

`Grid`s have built-in support for pagination. To opt in to pagination, you need to pass it a `pagination` prop, which is an object providing 3 pieces of information:

* `onLoadMore` - will be called by Raycast when the user reaches the end of the grid, either using the keyboard or the mouse. When it gets called, the extension is expected to perform an async operation which eventually can result in items being appended to the end of the grid.
* `hasMore` - indicates to Raycast whether it *should* call `onLoadMore` when the user reaches the end of the grid.
* `pageSize` - indicates how many placeholder items Raycast should add to the end of the grid when it calls `onLoadMore`. Once `onLoadMore` finishes executing, the placeholder items will be replaced by the newly-added grid items.

Note that extensions have access to a limited amount of memory. As your extension paginates, its memory usage will increase. Paginating extensively could lead to the extension eventually running out of memory and crashing. To protect against the extension crashing due to memory exhaustion, Raycast monitors the extension's memory usage and employs heuristics to determine whether it's safe to paginate further. If it's deemed unsafe to continue paginating, `onLoadMore` will not be triggered when the user scrolls to the bottom, regardless of the `hasMore` value. Additionally, during development, a warning will be printed in the terminal.

For convenience, most of the [hooks](https://developers.raycast.com/utilities/getting-started) that we provide have built-in pagination support. Here's an example of how to add pagination support to a simple command using [usePromise](https://developers.raycast.com/utilities/react-hooks/usepromise), and one "from scratch".

{% tabs %}
{% tab title="GridWithUsePromisePagination.tsx" %}

{% tab title="GridWithPagination.tsx" %}

{% endtab %}
{% endtabs %}

{% hint style="warning" %}
Pagination might not work properly if all grid items are rendered and visible at once, as `onLoadMore` won't be triggered. This typically happens when an API returns 10 results by default, all fitting within the Raycast window. To fix this, try displaying more items, like 20.
{% endhint %}

{% tabs %}
{% tab title="Grid.tsx" %}

{% tab title="GridWithSections.tsx" %}

{% tab title="GridWithActions.tsx" %}

{% tab title="GridWithEmptyView\.tsx" %}

{% endtab %}
{% endtabs %}

Displays [Grid.Section](#grid.section)s or [Grid.Item](#grid.item)s.

The grid uses built-in filtering by indexing the title & keywords of its items.

| Prop                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Type                                                                                                       | Default |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------- |
| actions              | A reference to an ActionPanel. It will only be shown when there aren't any children.                                                                                                                                                                                                                                                                                                                                                                                                                | `React.ReactNode`                                                                                          | -       |
| aspectRatio          | Aspect ratio for the Grid.Item elements. Defaults to 1.                                                                                                                                                                                                                                                                                                                                                                                                                                             | `"1"` or `"3/2"` or `"2/3"` or `"4/3"` or `"3/4"` or `"16/9"` or `"9/16"`                                  | -       |
| children             | Grid sections or items. If Grid.Item elements are specified, a default section is automatically created.                                                                                                                                                                                                                                                                                                                                                                                            | `React.ReactNode`                                                                                          | -       |
| columns              | Column count for the grid's sections. Minimum value is 1, maximum value is 8.                                                                                                                                                                                                                                                                                                                                                                                                                       | `number`                                                                                                   | -       |
| filtering            | Toggles Raycast filtering. When `true`, Raycast will use the query in the search bar to filter the items. When `false`, the extension needs to take care of the filtering. You can further define how native filtering orders sections by setting an object with a `keepSectionOrder` property: When `true`, ensures that Raycast filtering maintains the section order as defined in the extension. When `false`, filtering may change the section order depending on the ranking values of items. | `boolean` or `{ keepSectionOrder: boolean }`                                                               | -       |
| fit                  | Fit for the Grid.Item element content. Defaults to "contain"                                                                                                                                                                                                                                                                                                                                                                                                                                        | [`Grid.Fit`](#grid.fit)                                                                                    | -       |
| inset                | Indicates how much space there should be between a Grid.Items' content and its borders. The absolute value depends on the value of the `itemSize` prop.                                                                                                                                                                                                                                                                                                                                             | [`Grid.Inset`](#grid.inset)                                                                                | -       |
| isLoading            | Indicates whether a loading bar should be shown or hidden below the search bar                                                                                                                                                                                                                                                                                                                                                                                                                      | `boolean`                                                                                                  | -       |
| navigationTitle      | The main title for that view displayed in Raycast                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `string`                                                                                                   | -       |
| onSearchTextChange   | Callback triggered when the search bar text changes.                                                                                                                                                                                                                                                                                                                                                                                                                                                | `(text: string) => void`                                                                                   | -       |
| onSelectionChange    | Callback triggered when the item selection in the grid changes. When the received id is `null`, it means that all items have been filtered out and that there are no item selected                                                                                                                                                                                                                                                                                                                  | `(id: string) => void`                                                                                     | -       |
| pagination           | Configuration for pagination                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `{ hasMore: boolean; onLoadMore: () => void; pageSize: number }`                                           | -       |
| searchBarAccessory   | Grid.Dropdown that will be shown in the right-hand-side of the search bar.                                                                                                                                                                                                                                                                                                                                                                                                                          | `ReactElement<`[`List.Dropdown.Props`](https://developers.raycast.com/api-reference/list#props)`, string>` | -       |
| searchBarPlaceholder | Placeholder text that will be shown in the search bar.                                                                                                                                                                                                                                                                                                                                                                                                                                              | `string`                                                                                                   | -       |
| searchText           | The text that will be displayed in the search bar.                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `string`                                                                                                   | -       |
| selectedItemId       | Selects the item with the specified id.                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `string`                                                                                                   | -       |
| throttle             | Defines whether the `onSearchTextChange` handler will be triggered on every keyboard press or with a delay for throttling the events. Recommended to set to `true` when using custom filtering logic with asynchronous operations (e.g. network requests).                                                                                                                                                                                                                                          | `boolean`                                                                                                  | -       |

A dropdown menu that will be shown in the right-hand-side of the search bar.

| Prop                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Type                                         | Default |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------- |
| tooltip<mark style="color:red;">\*</mark> | Tooltip displayed when hovering the dropdown.                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `string`                                     | -       |
| children                                  | Dropdown sections or items. If Dropdown.Item elements are specified, a default section is automatically created.                                                                                                                                                                                                                                                                                                                                                                                    | `React.ReactNode`                            | -       |
| defaultValue                              | The default value of the dropdown. Keep in mind that `defaultValue` will be configured once per component lifecycle. This means that if a user changes the value, `defaultValue` won't be configured on re-rendering. **If you're using `storeValue` and configured it as `true`** ***and*****&#x20;a Dropdown.Item with the same value exists, then it will be selected.** **If you configure `value` at the same time as `defaultValue`, the `value` will have precedence over `defaultValue`.**  | `string`                                     | -       |
| filtering                                 | Toggles Raycast filtering. When `true`, Raycast will use the query in the search bar to filter the items. When `false`, the extension needs to take care of the filtering. You can further define how native filtering orders sections by setting an object with a `keepSectionOrder` property: When `true`, ensures that Raycast filtering maintains the section order as defined in the extension. When `false`, filtering may change the section order depending on the ranking values of items. | `boolean` or `{ keepSectionOrder: boolean }` | -       |
| id                                        | ID of the dropdown.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `string`                                     | -       |
| isLoading                                 | Indicates whether a loading indicator should be shown or hidden next to the search bar                                                                                                                                                                                                                                                                                                                                                                                                              | `boolean`                                    | -       |
| onChange                                  | Callback triggered when the dropdown selection changes.                                                                                                                                                                                                                                                                                                                                                                                                                                             | `(newValue: string) => void`                 | -       |
| onSearchTextChange                        | Callback triggered when the search bar text changes.                                                                                                                                                                                                                                                                                                                                                                                                                                                | `(text: string) => void`                     | -       |
| placeholder                               | Placeholder text that will be shown in the dropdown search field.                                                                                                                                                                                                                                                                                                                                                                                                                                   | `string`                                     | -       |
| storeValue                                | Indicates whether the value of the dropdown should be persisted after selection, and restored next time the dropdown is rendered.                                                                                                                                                                                                                                                                                                                                                                   | `boolean`                                    | -       |
| throttle                                  | Defines whether the `onSearchTextChange` handler will be triggered on every keyboard press or with a delay for throttling the events. Recommended to set to `true` when using custom filtering logic with asynchronous operations (e.g. network requests).                                                                                                                                                                                                                                          | `boolean`                                    | -       |
| value                                     | The currently value of the dropdown.                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `string`                                     | -       |

### Grid.Dropdown.Item

A dropdown item in a [Grid.Dropdown](#grid.dropdown)

| Prop                                    | Description                                                                                                                                                                   | Type                                                                                               | Default |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------- |
| title<mark style="color:red;">\*</mark> | The title displayed for the item.                                                                                                                                             | `string`                                                                                           | -       |
| value<mark style="color:red;">\*</mark> | Value of the dropdown item. Make sure to assign each unique value for each item.                                                                                              | `string`                                                                                           | -       |
| icon                                    | An optional icon displayed for the item.                                                                                                                                      | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) | -       |
| keywords                                | An optional property used for providing additional indexable strings for search. When filtering the items in Raycast, the keywords will be searched in addition to the title. | `string[]`                                                                                         | -       |

### Grid.Dropdown.Section

Visually separated group of dropdown items.

Use sections to group related menu items together.

| Prop     | Description                       | Type              | Default |
| -------- | --------------------------------- | ----------------- | ------- |
| children | The item elements of the section. | `React.ReactNode` | -       |
| title    | Title displayed above the section | `string`          | -       |

A view to display when there aren't any items available. Use to greet users with a friendly message if the\
extension requires user input before it can show any items e.g. when searching for an image, a gif etc.

Raycast provides a default `EmptyView` that will be displayed if the Grid component either has no children,\
or if it has children, but none of them match the query in the search bar. This too can be overridden by passing an\
empty view alongside the other `Grid.Item`s.

Note that the `EmptyView` is *never* displayed if the `Grid`'s `isLoading` property is true and the search bar is empty.

![Grid EmptyView illustration](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ce76aa8900d21be445aba5e7acd3ef7fa7687e9e%2Fgrid-empty-view.webp?alt=media)

| Prop        | Description                                              | Type                                                                                               | Default |
| ----------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------- |
| actions     | A reference to an ActionPanel.                           | `React.ReactNode`                                                                                  | -       |
| description | An optional description for why the empty view is shown. | `string`                                                                                           | -       |
| icon        | An icon displayed in the center of the EmptyView.        | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) | -       |
| title       | The main title displayed for the Empty View.             | `string`                                                                                           | -       |

A item in the [Grid](#grid).

This is one of the foundational UI components of Raycast. A grid item represents a single entity. It can be an image, an emoji, a GIF etc. You most likely want to perform actions on this item, so make it clear\
to the user what this item is about.

| Prop                                      | Description                                                                                                                                                                                         | Type                                                                                                                                                                                                                                                                                            | Default |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| content<mark style="color:red;">\*</mark> | An image or color, optionally with a tooltip, representing the content of the grid item.                                                                                                            | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) or `{ color:` [`Color.ColorLike`](https://developers.raycast.com/api-reference/colors#color.colorlike) `}` or `{ tooltip: string; value: Image.ImageLike` or `{ color: Color.ColorLike; } }` | -       |
| accessory                                 | An optional Grid.Item.Accessory item displayed underneath a Grid.Item.                                                                                                                              | [`Grid.Item.Accessory`](#grid.item.accessory)                                                                                                                                                                                                                                                   | -       |
| actions                                   | An ActionPanel that will be updated for the selected grid item.                                                                                                                                     | `React.ReactNode`                                                                                                                                                                                                                                                                               | -       |
| id                                        | ID of the item. This string is passed to the `onSelectionChange` handler of the Grid when the item is selected. Make sure to assign each item a unique ID or a UUID will be auto generated.         | `string`                                                                                                                                                                                                                                                                                        | -       |
| keywords                                  | An optional property used for providing additional indexable strings for search. When filtering the list in Raycast through the search bar, the keywords will be searched in addition to the title. | `string[]`                                                                                                                                                                                                                                                                                      | -       |
| quickLook                                 | Optional information to preview files with Quick Look. Toggle the preview ith Action.ToggleQuickLook.                                                                                               | `{ name?: string; path: "fs".PathLike }`                                                                                                                                                                                                                                                        | -       |
| subtitle                                  | An optional subtitle displayed below the title.                                                                                                                                                     | `string`                                                                                                                                                                                                                                                                                        | -       |
| title                                     | An optional title displayed below the content.                                                                                                                                                      | `string`                                                                                                                                                                                                                                                                                        | -       |

A group of related [Grid.Item](#grid.item).

Sections are a great way to structure your grid. For example, you can group photos taken in the same place or in the same day. This way, the user can quickly access what is most relevant.

Sections can specify their own `columns`, `fit`, `aspectRatio` and `inset` props, separate from what is defined on the main [Grid](#grid) component.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-274bdfb26a191e298c4248a6d7031d08d725f484%2Fgrid-styled-sections.webp?alt=media)

{% tabs %}
{% tab title="GridWithSection.tsx" %}

{% tab title="GridWithStyledSection.tsx" %}

{% endtab %}
{% endtabs %}

| Prop        | Description                                                           | Type                                                                      | Default |
| ----------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------- |
| aspectRatio | Aspect ratio for the Grid.Item elements. Defaults to 1.               | `"1"` or `"3/2"` or `"2/3"` or `"4/3"` or `"3/4"` or `"16/9"` or `"9/16"` | -       |
| children    | The Grid.Item elements of the section.                                | `React.ReactNode`                                                         | -       |
| columns     | Column count for the section. Minimum value is 1, maximum value is 8. | `number`                                                                  | -       |
| fit         | Fit for the Grid.Item element content. Defaults to "contain"          | [`Grid.Fit`](#grid.fit)                                                   | -       |
| inset       | Inset for the Grid.Item element content. Defaults to "none".          | [`Grid.Inset`](#grid.inset)                                               | -       |
| subtitle    | An optional subtitle displayed next to the title of the section.      | `string`                                                                  | -       |
| title       | Title displayed above the section.                                    | `string`                                                                  | -       |

### Grid.Item.Accessory

An interface describing an accessory view in a `Grid.Item`.

![Grid.Item accessories illustration](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a7b63e239c1418d77e7ec242f0e34c711a44dd7d%2Fgrid-item-accessories.webp?alt=media)

An enum representing the amount of space there should be between a Grid Item's content and its borders. The absolute value depends on the value of [Grid](#grid)'s or [Grid.Section](#grid.section)'s `columns` prop.

#### Enumeration members

| Name   | Description   |
| ------ | ------------- |
| Small  | Small insets  |
| Medium | Medium insets |
| Large  | Large insets  |

### Grid.ItemSize (deprecated)

An enum representing the size of the Grid's child [Grid.Item](#grid.item)s.

#### Enumeration members

| Name   | Description           |
| ------ | --------------------- |
| Small  | Fits 8 items per row. |
| Medium | Fits 5 items per row. |
| Large  | Fits 3 items per row. |

An enum representing how [Grid.Item](#grid.item)'s content should be fit.

#### Enumeration members

| Name    | Description                                                                                                                     |
| ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Contain | The content will be contained within the grid cell, with vertical/horizontal bars if its aspect ratio differs from the cell's.  |
| Fill    | The content will be scaled proportionally so that it fill the entire cell; parts of the content could end up being cropped out. |

**Examples:**

Example 1 (typescript):
```typescript
import { useEffect, useState } from "react";
import { Grid } from "@raycast/api";

const items = [
  { content: "🙈", keywords: ["see-no-evil", "monkey"] },
  { content: "🥳", keywords: ["partying", "face"] },
];

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [filteredList, filterList] = useState(items);

  useEffect(() => {
    filterList(items.filter((item) => item.keywords.some((keyword) => keyword.includes(searchText))));
  }, [searchText]);

  return (
    <Grid
      columns={5}
      inset={Grid.Inset.Large}
      filtering={false}
      onSearchTextChange={setSearchText}
      navigationTitle="Search Emoji"
      searchBarPlaceholder="Search your favorite emoji"
    >
      {filteredList.map((item) => (
        <Grid.Item key={item.content} content={item.content} />
      ))}
    </Grid>
  );
}
```

Example 2 (typescript):
```typescript
import { useState } from "react";
import { Action, ActionPanel, Grid } from "@raycast/api";

const items = [
  { content: "🙈", keywords: ["see-no-evil", "monkey"] },
  { content: "🥳", keywords: ["partying", "face"] },
];

export default function Command() {
  const [searchText, setSearchText] = useState("");

  return (
    <Grid
      searchText={searchText}
      onSearchTextChange={setSearchText}
      navigationTitle="Search Emoji"
      searchBarPlaceholder="Search your favorite emoji"
    >
      {items.map((item) => (
        <Grid.Item
          key={item.content}
          content={item.content}
          actions={
            <ActionPanel>
              <Action title="Select" onAction={() => setSearchText(item.content)} />
            </ActionPanel>
          }
        />
      ))}
    </Grid>
  );
}
```

Example 3 (typescript):
```typescript
import { setTimeout } from "node:timers/promises";
import { useState } from "react";
import { Grid } from "@raycast/api";
import { usePromise } from "@raycast/utils";

export default function Command() {
  const [searchText, setSearchText] = useState("");

  const { isLoading, data, pagination } = usePromise(
    (searchText: string) => async (options: { page: number }) => {
      await setTimeout(200);
      const newData = Array.from({ length: 25 }, (_v, index) => ({ index, page: options.page, text: searchText }));
      return { data: newData, hasMore: options.page < 10 };
    },
    [searchText]
  );

  return (
    <Grid isLoading={isLoading} onSearchTextChange={setSearchText} pagination={pagination}>
      {data?.map((item) => (
        <Grid.Item
          key={`${item.index} ${item.page} ${item.text}`}
          content=""
          title={`Page: ${item.page} Item ${item.index}`}
          subtitle={item.text}
        />
      ))}
    </Grid>
  );
}
```

Example 4 (typescript):
```typescript
import { setTimeout } from "node:timers/promises";
import { useCallback, useEffect, useRef, useState } from "react";
import { Grid } from "@raycast/api";

type State = {
  searchText: string;
  isLoading: boolean;
  hasMore: boolean;
  data: {
    index: number;
    page: number;
    text: string;
  }[];
  nextPage: number;
};
const pageSize = 20;
export default function Command() {
  const [state, setState] = useState<State>({ searchText: "", isLoading: true, hasMore: true, data: [], nextPage: 0 });
  const cancelRef = useRef<AbortController | null>(null);

  const loadNextPage = useCallback(async (searchText: string, nextPage: number, signal?: AbortSignal) => {
    setState((previous) => ({ ...previous, isLoading: true }));
    await setTimeout(200);
    const newData = Array.from({ length: pageSize }, (_v, index) => ({
      index,
      page: nextPage,
      text: searchText,
    }));
    if (signal?.aborted) {
      return;
    }
    setState((previous) => ({
      ...previous,
      data: [...previous.data, ...newData],
      isLoading: false,
      hasMore: nextPage < 10,
    }));
  }, []);

  const onLoadMore = useCallback(() => {
    setState((previous) => ({ ...previous, nextPage: previous.nextPage + 1 }));
  }, []);

  const onSearchTextChange = useCallback(
    (searchText: string) => {
      if (searchText === state.searchText) return;
      setState((previous) => ({
        ...previous,
        data: [],
        nextPage: 0,
        searchText,
      }));
    },
    [state.searchText]
  );

  useEffect(() => {
    cancelRef.current?.abort();
    cancelRef.current = new AbortController();
    loadNextPage(state.searchText, state.nextPage, cancelRef.current?.signal);
    return () => {
      cancelRef.current?.abort();
    };
  }, [loadNextPage, state.searchText, state.nextPage]);

  return (
    <Grid
      isLoading={state.isLoading}
      onSearchTextChange={onSearchTextChange}
      pagination={{ onLoadMore, hasMore: state.hasMore, pageSize }}
    >
      {state.data.map((item) => (
        <Grid.Item
          key={`${item.index} ${item.page} ${item.text}`}
          content=""
          title={`Page: ${item.page} Item ${item.index}`}
          subtitle={item.text}
        />
      ))}
    </Grid>
  );
}
```

---

## Todo List

**URL:** llms-txt#todo-list

**Contents:**
- Render todo list
- Create a todo
- Complete a todo
- Delete a todo

This example show how to use lists in combination with forms.

{% hint style="info" %}
The source code of the example can be found [here](https://github.com/raycast/extensions/tree/main/examples/todo-list#readme).
{% endhint %}

What's an example section without a todo list?! Let's put one together in Raycast. This example will show how to render a list, navigate to a form to create a new element and update the list.

![Example: A simple todo list](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9aaa862f82624bd327d69b52bca9de6f6e12dd13%2Fexample-todo-list.webp?alt=media)

Let's start with a set of todos and simply render them as a list in Raycast:

For this we define a TypeScript interface to describe out Todo with a `title` and a `isCompleted` flag that we use later to complete the todo. We use [React's `useState` hook](https://reactjs.org/docs/hooks-state.html) to create a local state of our todos. This allows us to update them later and the list will get re-rendered. Lastly we render a list of all todos.

A static list of todos isn't that much fun. Let's create new ones with a form. For this, we create a new React component that renders the form:

The `<CreateTodoForm>` shows a single text field for the title. When the form is submitted, it calls the `onCreate` callback and closes itself.

![Create todo form](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d4c1ff50bde2708dfcf9875a92ab4d0a2a41ef53%2Fexample-create-todo.webp?alt=media)

To use the action, we add it to the `<List>` component. This makes the action available when the list is empty which is exactly what we want to create our first todo.

Now that we can create new todos, we also want to make sure that we can tick off something on our todo list. For this, we create a `<ToggleTodoAction>` that we assign to the `<List.Item>`:

In this case we added the `<ToggleTodoAction>` to the list item. By doing this we can use the `index` to toggle the appropriate todo. We also added an icon to our todo that reflects the `isCompleted` state.

Similar to toggling a todo, we also add the possibility to delete one. You can follow the same steps and create a new `<DeleteTodoAction>` and add it to the `<List.Item>`.

We also gave the `<DeleteTodoAction>` a keyboard shortcut. This way users can delete todos quicker. Additionally, we also added the `<CreateTodoAction>` to the `<List.Item>`. This makes sure that users can also create new todos when there are some already.

Finally, our command looks like this:

And that's a wrap. You created a todo list in Raycast, it's that easy. As next steps, you could extract the `<CreateTodoForm>` into a separate command. Then you can create todos also from the root search of Raycast and can even assign a global hotkey to open the form. Also, the todos aren't persisted. If you close the command and reopen it, they are gone. To persist, you can use the [storage](https://developers.raycast.com/api-reference/storage) or [write it to disc](https://developers.raycast.com/api-reference/environment#environment).

**Examples:**

Example 1 (typescript):
```typescript
import { List } from "@raycast/api";
import { useState } from "react";

interface Todo {
  title: string;
  isCompleted: boolean;
}

export default function Command() {
  const [todos, setTodos] = useState<Todo[]>([
    { title: "Write a todo list extension", isCompleted: false },
    { title: "Explain it to others", isCompleted: false },
  ]);

  return (
    <List>
      {todos.map((todo, index) => (
        <List.Item key={index} title={todo.title} />
      ))}
    </List>
  );
}
```

Example 2 (typescript):
```typescript
function CreateTodoForm(props: { onCreate: (todo: Todo) => void }) {
  const { pop } = useNavigation();

  function handleSubmit(values: { title: string }) {
    props.onCreate({ title: values.title, isCompleted: false });
    pop();
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Todo" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="title" title="Title" />
    </Form>
  );
}

function CreateTodoAction(props: { onCreate: (todo: Todo) => void }) {
  return (
    <Action.Push
      icon={Icon.Pencil}
      title="Create Todo"
      shortcut={{ modifiers: ["cmd"], key: "n" }}
      target={<CreateTodoForm onCreate={props.onCreate} />}
    />
  );
}
```

Example 3 (typescript):
```typescript
export default function Command() {
  const [todos, setTodos] = useState<Todo[]>([]);

  function handleCreate(todo: Todo) {
    const newTodos = [...todos, todo];
    setTodos(newTodos);
  }

  return (
    <List
      actions={
        <ActionPanel>
          <CreateTodoAction onCreate={handleCreate} />
        </ActionPanel>
      }
    >
      {todos.map((todo, index) => (
        <List.Item key={index} title={todo.title} />
      ))}
    </List>
  );
}
```

Example 4 (typescript):
```typescript
export default function Command() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // ...

  function handleToggle(index: number) {
    const newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
  }

  return (
    <List
      actions={
        <ActionPanel>
          <CreateTodoAction onCreate={handleCreate} />
        </ActionPanel>
      }
    >
      {todos.map((todo, index) => (
        <List.Item
          key={index}
          icon={todo.isCompleted ? Icon.Checkmark : Icon.Circle}
          title={todo.title}
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                <ToggleTodoAction todo={todo} onToggle={() => handleToggle(index)} />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function ToggleTodoAction(props: { todo: Todo; onToggle: () => void }) {
  return (
    <Action
      icon={props.todo.isCompleted ? Icon.Circle : Icon.Checkmark}
      title={props.todo.isCompleted ? "Uncomplete Todo" : "Complete Todo"}
      onAction={props.onToggle}
    />
  );
}
```

---

## Alert

**URL:** llms-txt#alert

**Contents:**
- API Reference
  - confirmAlert
- Types
  - Alert.Options
  - Alert.ActionOptions
  - Alert.ActionStyle

When the user takes an important action (for example when irreversibly deleting something), you can ask for confirmation by using `confirmAlert`.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-18a8eeb2446fdc8e95157b412aa2c84fd22ffbfa%2Falert.webp?alt=media)

Creates and shows a confirmation Alert with the given [options](#alert.options).

| Name                                      | Description                           | Type                              |
| ----------------------------------------- | ------------------------------------- | --------------------------------- |
| options<mark style="color:red;">\*</mark> | The options used to create the Alert. | [`Alert.Options`](#alert.options) |

A Promise that resolves to a boolean when the user triggers one of the actions.\
It will be `true` for the primary Action, `false` for the dismiss Action.

The options to create an Alert.

| Property                                | Description                                                                                                                                                                                                                                                | Type                                                                                                |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| title<mark style="color:red;">\*</mark> | The title of an alert. Displayed below the icon.                                                                                                                                                                                                           | `string`                                                                                            |
| dismissAction                           | The Action to dismiss the alert. There usually shouldn't be any side effects when the user takes this action.                                                                                                                                              | [`Alert.ActionOptions`](#alert.actionoptions)                                                       |
| icon                                    | The icon of an alert to illustrate the action. Displayed on the top.                                                                                                                                                                                       | [`Image.ImageLike`](https://developers.raycast.com/user-interface/icons-and-images#image.imagelike) |
| message                                 | An additional message for an Alert. Useful to show more information, e.g. a confirmation message for a destructive action.                                                                                                                                 | `string`                                                                                            |
| primaryAction                           | The primary Action the user can take.                                                                                                                                                                                                                      | [`Alert.ActionOptions`](#alert.actionoptions)                                                       |
| rememberUserChoice                      | If set to true, the Alert will also display a `Do not show this message again` checkbox. When checked, the answer is persisted and directly returned to the extension the next time the alert should be shown, without the user actually seeing the alert. | `boolean`                                                                                           |

### Alert.ActionOptions

The options to create an Alert Action.

| Property                                | Description                                     | Type                                      |
| --------------------------------------- | ----------------------------------------------- | ----------------------------------------- |
| title<mark style="color:red;">\*</mark> | The title of the action.                        | `string`                                  |
| onAction                                | A callback called when the action is triggered. | `() => void`                              |
| style                                   | The style of the action.                        | [`Alert.ActionStyle`](#alert.actionstyle) |

### Alert.ActionStyle

Defines the visual style of an Action of the Alert.

Use [Alert.ActionStyle.Default](#alert.actionstyle) for confirmations of a positive action.\
Use [Alert.ActionStyle.Destructive](#alert.actionstyle) for confirmations of a destructive action (eg. deleting a file).

#### Enumeration members

| Name        | Value                                                                                                                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Default     | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-cf694515bf72da488eea228c3511ea5667cacfe2%2Falert-action-default.webp?alt=media)     |
| Destructive | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-3529cca2309b77669ede9d8cc0bdff210a9b6f00%2Falert-action-destructive.webp?alt=media) |
| Cancel      | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e73a37408b953e1a0d6f9751d5e8f001c0f2556f%2Falert-action-cancel.webp?alt=media)      |

**Examples:**

Example 1 (typescript):
```typescript
async function confirmAlert(options: Alert.Options): Promise<boolean>;
```

Example 2 (typescript):
```typescript
import { confirmAlert } from "@raycast/api";

export default async function Command() {
  if (await confirmAlert({ title: "Are you sure?" })) {
    console.log("confirmed");
    // do something
  } else {
    console.log("canceled");
  }
}
```

Example 3 (typescript):
```typescript
import { Alert, confirmAlert } from "@raycast/api";

export default async function Command() {
  const options: Alert.Options = {
    title: "Finished cooking",
    message: "Delicious pasta for lunch",
    primaryAction: {
      title: "Do something",
      onAction: () => {
        // while you can register a handler for an action, it's more elegant
        // to use the `if (await confirmAlert(...)) { ... }` pattern
        console.log("The alert action has been triggered");
      },
    },
  };
  await confirmAlert(options);
}
```

---

## Detail

**URL:** llms-txt#detail

**Contents:**
- API Reference
  - Detail
  - Detail.Metadata

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c2161bc51a61a09b4a7aea8a1ed6ab3f65ddd566%2Fdetail.webp?alt=media)

Renders a markdown ([CommonMark](https://commonmark.org)) string with an optional metadata panel.

Typically used as a standalone view or when navigating from a [List](https://developers.raycast.com/api-reference/user-interface/list).

{% tabs %}
{% tab title="Render a markdown string" %}

{% tab title="Render an image from the assets directory" %}

{% endtab %}
{% endtabs %}

| Prop            | Description                                                                    | Type              | Default |
| --------------- | ------------------------------------------------------------------------------ | ----------------- | ------- |
| actions         | A reference to an ActionPanel.                                                 | `React.ReactNode` | -       |
| isLoading       | Indicates whether a loading bar should be shown or hidden below the search bar | `boolean`         | -       |
| markdown        | The CommonMark string to be rendered.                                          | `string`          | -       |
| metadata        | The `Detail.Metadata` to be rendered in the right side area                    | `React.ReactNode` | -       |
| navigationTitle | The main title for that view displayed in Raycast                              | `string`          | -       |

{% hint style="info" %}
You can specify custom image dimensions by adding a `raycast-width` and `raycast-height` query string to the markdown image. For example: `![Image Title](example.png?raycast-width=250&raycast-height=250)`

You can also specify a tint color to apply to an markdown image by adding a `raycast-tint-color` query string. For example: `![Image Title](example.png?raycast-tintColor=blue)`
{% endhint %}

{% hint style="info" %}
You can now render [LaTeX](https://www.latex-project.org) in the markdown. We support the following delimiters:

* Inline math: `\(...\)` and `\begin{math}...\end{math}`
* Display math: `\[...\]`, `$$...$$` and `\begin{equation}...\end{equation}`
  {% endhint %}

A Metadata view that will be shown in the right-hand-side of the `Detail`.

Use it to display additional structured data about the main content shown in the `Detail` view.

![Detail-metadata illustration](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2ff9dfb88c0b6358b14ffac00c3cff10697634d0%2Fdetail-metadata.webp?alt=media)

```typescript
import { Detail } from "@raycast/api";

// Define markdown here to prevent unwanted indentation.
const markdown = `

**Examples:**

Example 1 (typescript):
```typescript
import { Detail } from "@raycast/api";

export default function Command() {
  return <Detail markdown="**Hello** _World_!" />;
}
```

Example 2 (typescript):
```typescript
import { Detail } from "@raycast/api";

export default function Command() {
  return <Detail markdown={`![Image Title](example.png)`} />;
}
```

---

## Brew Changelog

**URL:** llms-txt#brew-changelog

**Contents:**
- [Added a bunch of new feedback] - {PR_MERGE_DATE}
- [New Additions] - 2022-12-13
- [Fixes & Bits] - 2021-11-19
- [New Commands] - 2021-11-04
- [Added Brew] - 2021-10-26
- Contributing to Existing Extensions vs Creating a New One
- Binary Dependencies and Additional Configuration
- Keychain Access
- UI/UX Guidelines
  - Preferences

## [Added a bunch of new feedback] - {PR_MERGE_DATE}

- Improve reliability of `outdated` command
- Add action to copy formula/cask name
- Add cask name & tap to cask details
- Add Toast action to cancel current action
- Add Toast action to copy error log after failure

## [New Additions] - 2022-12-13

- Add greedy upgrade preference
- Add `upgrade` command

## [Fixes & Bits] - 2021-11-19

- Improve discovery of brew prefix
- Update Cask.installed correctly after installation
- Fix installed state after uninstalling search result
- Fix cache check after installing/uninstalling cask
- Add uninstall action to outdated action panel

## [New Commands] - 2021-11-04

Add support for searching and managing casks

## [Added Brew] - 2021-10-26

Initial version code
```

![An extensions version history on raycast.com/store](https://user-images.githubusercontent.com/17166544/159987128-1e9f22a6-506b-4edd-bb40-e121bfdc46f8.png)

{% hint style="info" %}
You can use [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) to help you format your changelog correctly
{% endhint %}

## Contributing to Existing Extensions vs Creating a New One

* **When you should contribute to an existing extension instead of creating a new one**
  * You want to make a small improvement to an extension that is already published, e.g. extra actions, new preference, UX improvements, etc.. Usually, it's a non-significant change.
  * You want to add a simple command that compliments an existing extension without changing the extension title or description, e.g. you want to add "Like Current Track" command for Spotify. It wouldn't make sense to create a whole new extension just for this when there is already the [Spotify Controls](https://www.raycast.com/thomas/spotify-controls) extension.
  * **Important:** If your change is significant, it makes sense to contact the author of the extension before you invest a lot of time into it. We cannot merge significant contributions without the author's sign-off.
* **When you should consider creating a new extension instead of contributing to an existing one**
  * The changes to an existing extension would be significant and might break other people's workflows. Check with the author if you want to proceed with the collaboration path.
  * Your extension provides an integration with the same service but has a different configuration, e.g. one extension could be "GitHub Cloud", another "GitHub Enterprise". One extension could be "Spotify Controls" and only uses AppleScript to play/pause songs, while another extension can provide deeper integration via the API and require an access token setup. There is no reason to try to merge everything together as this would only make things more complicated.
* **Multiple simple extensions vs one large one**
  * If your extension works standalone and brings something new to the Store, it's acceptable to create a new one instead of adding commands to an existing one. E.g. one extension could be "GitHub Repository Search", another one could be "GitHub Issue Search". It should not be the goal to merge all extensions connecting with one service into one mega extension. However, it's also acceptable to merge two extensions under one if the authors decide to do so.

## Binary Dependencies and Additional Configuration

* Avoid asking users to perform additional downloads and try to automate as much as possible from the extension, especially if you are targeting non-developers. See the [Speedtest](https://github.com/raycast/extensions/pull/302) extension that downloads a CLI in the background and later uses it under the hood.
* If you do end up downloading executable binaries in the background, please make sure it's done from a server that you don't have access to. Otherwise, we cannot guarantee that you won't replace the binary with malicious code after the review. E.g. downloading `speedtest-cli` from [`install.speedtest.net`](http://install.speedtest.net) is acceptable, but doing this from some custom AWS server would lead to a rejection. Add additional integrity checks through hashes.
* Don't bundle opaque binaries where sources are unavailable or where it's unclear how they have been built.
* Don't bundle heavy binary dependencies in the extension – this would lead to an increased extension download size.
* **Examples for interacting with binaries**
  * ✅ Calling known system binaries
  * ✅ Binary downloaded or installed from a trusted location with additional integrity checking through hashes (that is, verify whether the downloaded binary really matches the expected binary)
  * ✅ Binary extracted from an npm package and copied to assets, with traceable sources how the binary is built; **note**: we have yet to integrate CI actions for copying and comparing the files; meanwhile, ask a member of the Raycast team to add the binary for you
  * ❌ Any binary with unavailable sources or unclear builds just added to the assets folder

* Extensions requesting Keychain Access will be rejected due to security concerns. If you can't work around this limitation, reach out to us on [Slack](https://raycast.com/community) or via `feedback@raycast.com`.

![Required preferences will be shown when opening the command](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a1ab8634fce260f92c072f77830f843cbd2a55a2%2Frequired-preferences-2.webp?alt=media)

* Use the [preferences API](https://developers.raycast.com/api-reference/preferences) to let your users configure your extension or for providing credentials like API tokens
  * When using `required: true`, Raycast will ask the user to set preferences before continuing with an extension. See the example [here](https://github.com/raycast/extensions/blob/main/extensions/gitlab/package.json#L150).
* You should not build separate commands for configuring your extension. If you miss some API to achieve the preferences setup you want, please file a [GitHub issue](https://github.com/raycast/extensions/issues) with a feature request.

![Raycast Action Panel component](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-25a03b5271959426230e724a733f30e7597dd1bf%2Faction-panel.webp?alt=media)

* Actions in the action panel should also follow the **Title Case** naming convention
  * ✅ `Open in Browser`, `Copy to Clipboard`
  * ❌ `Copy url`, `set project`, `Set priority`
* Provide icons for actions if there are other actions with icons in the list
  * Avoid having a list of actions where some have icons and some don't
* Add ellipses `…` for actions that will have a submenu. Don't repeat the parent action name in the submenu
  * ✅ `Set Priority…` and submenu would have `Low`, `Medium`, `High`
  * ❌ `Set Priority` and submenu would have `Set Priority Low`, `Set Priority Medium`, etc

* Use the [Navigation API](https://developers.raycast.com/api-reference/user-interface/navigation) for pushing new screens. This will ensure that a user can navigate within your extension the same way as in the rest of the application.
* Avoid introducing your own navigation stack. Extensions that just replace the view's content when it's expected to push a new screen will be rejected.

* When you update lists with an empty array of elements, the "No results" view will be shown. You can customize this view by using the [List.EmptyView](https://developers.raycast.com/api-reference/user-interface/list#list.emptyview) or [Grid.EmptyView](https://developers.raycast.com/api-reference/user-interface/grid#grid.emptyview) components.
* **Common mistake** - "flickering empty state view" on start
  * If you try rendering an empty list before real data arrives (e.g. from the network or disk), you might see a flickering "No results" view when opening the extension. To prevent this, make sure not to return an empty list of items before you get the data you want to display. In the meantime, you can show the loading indicator. See [this example](https://developers.raycast.com/information/best-practices#show-loading-indicator).

* Don't change the `navigationTitle` in the root command - it will be automatically set to the command name. Use `navigationTitle` only in nested screens to provide additional context. See [Slack Status extension](https://github.com/raycast/extensions/blob/020f2232aa5579b5c63b4b3c08d23ad719bce1f8/extensions/slack-status/src/setStatusForm.tsx#L95) as an example of correct usage of the `navigationTitle` property.
* Avoid long titles. If you can't predict how long the navigation title string will be, consider using something else. E.g. in the Jira extension, we use the issue key instead of the issue title to keep it short.
* Avoid updating the navigation title multiple times on one screen depending on some state. If you find yourself doing it, there is a high chance you are misusing it.

### Placeholders in Text Fields

* For a better visual experience, add placeholders in text field and text area components. This includes preferences.
* Don't leave the search bar without a placeholder

* It’s not allowed to include external analytics in extensions. Later on, we will add support to give developers more insights into how their extension is being used.

### Localization / Language

* At the moment, Raycast doesn't support localization and only supports US English. Therefore, please avoid introducing your custom way to localize your extension. If the locale might affect functionality (e.g. using the correct unit of measurement), please use the preferences API.
* Use US English spelling (not British)

---

## Navigation

**URL:** llms-txt#navigation

**Contents:**
- API Reference
  - useNavigation
- Types
  - Navigation

A hook that lets you push and pop view components in the navigation stack.

You most likely won't use this hook too often. To push a new component, use the [Push Action](https://developers.raycast.com/api-reference/actions#action.push). When a user presses `ESC`, we automatically pop to the previous component.

A [Navigation](#navigation) object with [Navigation.push](#navigation) and [Navigation.pop](#navigation) functions. Use the functions to alter the navigation stack.

Return type of the [useNavigation](#usenavigation) hook to perform push and pop actions.

| Property                               | Description                                           | Type                                                      |
| -------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------- |
| pop<mark style="color:red;">\*</mark>  | Pop current view component from the navigation stack. | `() => void`                                              |
| push<mark style="color:red;">\*</mark> | Push a new view component to the navigation stack.    | `(component: React.ReactNode, onPop: () => void) => void` |

**Examples:**

Example 1 (typescript):
```typescript
function useNavigation(): Navigation;
```

Example 2 (typescript):
```typescript
import { Action, ActionPanel, Detail, useNavigation } from "@raycast/api";

function Ping() {
  const { push } = useNavigation();

  return (
    <Detail
      markdown="Ping"
      actions={
        <ActionPanel>
          <Action title="Push" onAction={() => push(<Pong />)} />
        </ActionPanel>
      }
    />
  );
}

function Pong() {
  const { pop } = useNavigation();

  return (
    <Detail
      markdown="Pong"
      actions={
        <ActionPanel>
          <Action title="Pop" onAction={pop} />
        </ActionPanel>
      }
    />
  );
}

export default function Command() {
  return <Ping />;
}
```

---

## showFailureToast

**URL:** llms-txt#showfailuretoast

**Contents:**
- Signature
  - Arguments
  - Return
- Example

Function that shows a failure [Toast](https://developers.raycast.com/api-reference/feedback/toast) for a given Error.

* `error` is the error to report.

* `options.title` is a string describing the action that failed. By default, `"Something went wrong"`
* `options.primaryAction` is a Toast [Action](https://developers.raycast.com/api-reference/feedback/toast#toast.actionoptions).

Returns a [Toast](https://developers.raycast.com/api-reference/feedback/toast).

**Examples:**

Example 1 (ts):
```ts
function showFailureToast(
  error: unknown,
  options?: {
    title?: string;
    primaryAction?: Toast.ActionOptions;
  },
): Promise<T>;
```

Example 2 (tsx):
```tsx
import { showHUD } from "@raycast/api";
import { runAppleScript, showFailureToast } from "@raycast/utils";

export default async function () {
  try {
    const res = await runAppleScript(
      `
      on run argv
        return "hello, " & item 1 of argv & "."
      end run
      `,
      ["world"],
    );
    await showHUD(res);
  } catch (error) {
    showFailureToast(error, { title: "Could not run AppleScript" });
  }
}
```

---

## Form

**URL:** llms-txt#form

**Contents:**
- Two Types of Items: Controlled vs. Uncontrolled
- Validation
- Drafts
- API Reference
  - Form
  - Form.TextField
  - Form.PasswordField
  - Form.TextArea
  - Form.Checkbox
  - Form.DatePicker

Our `Form` component provides great user experience to collect some data from a user and submit it for extensions needs.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b36017e7ee6ad8162b27712895ac0ac036103b4d%2Fexample-doppler-share-secrets.webp?alt=media)

## Two Types of Items: Controlled vs. Uncontrolled

Items in React can be one of two types: controlled or uncontrolled.

An uncontrolled item is the simpler of the two. It's the closest to a plain HTML input. React puts it on the page, and Raycast keeps track of the rest. Uncontrolled inputs require less code, but make it harder to do certain things.

With a controlled item, YOU explicitly control the `value` that the item displays. You have to write code to respond to changes with defining `onChange` callback, store the current `value` somewhere, and pass that value back to the item to be displayed. It's a feedback loop with your code in the middle. It's more manual work to wire these up, but they offer the most control.

You can take look at these two styles below under each of the supported items.

Before submitting data, it is important to ensure all required form controls are filled out, in the correct format.

In Raycast, validation can be fully controlled from the API. To keep the same behavior as we have natively, the proper way of usage is to validate a `value` in the `onBlur` callback, update the `error` of the item and keep track of updates with the `onChange` callback to drop the `error` value. The [useForm](https://developers.raycast.com/utilities/react-hooks/useform) utils hook nicely wraps this behavior and is the recommended way to do deal with validations.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-06326f9b2b6de5d39b9c8aa37e677b23c122f26e%2Fform-validation.webp?alt=media)

{% hint style="info" %}
Keep in mind that if the Form has any errors, the [`Action.SubmitForm`](https://developers.raycast.com/api-reference/actions#action.submitform) `onSubmit` callback won't be triggered.
{% endhint %}

{% tabs %}
{% tab title="FormValidationWithUtils.tsx" %}

{% tab title="FormValidationWithoutUtils.tsx" %}

{% endtab %}
{% endtabs %}

Drafts are a mechanism to preserve filled-in inputs (but not yet submitted) when an end-user exits the command. To enable this mechanism, set the `enableDrafts` prop on your Form and populate the initial values of the Form with the [top-level prop `draftValues`](https://developers.raycast.com/information/lifecycle#launchprops).

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a71310d2af9ec5e3b3e443bbf6f11ffc067adf52%2Fform-drafts.webp?alt=media)

{% hint style="info" %}

* Drafts for forms nested in navigation are not supported yet. In this case, you will see a warning about it.
* Drafts won't preserve the [`Form.Password`](#form.passwordfield)'s values.
* Drafts will be dropped once [`Action.SubmitForm`](https://developers.raycast.com/api-reference/actions#action.submitform) is triggered.
* If you call [`popToRoot()`](https://developers.raycast.com/window-and-search-bar#poptoroot), drafts won't be preserved or updated.
  {% endhint %}

{% tabs %}
{% tab title="Uncontrolled Form" %}

{% tab title="Controlled Form" %}

{% endtab %}
{% endtabs %}

Shows a list of form items such as [Form.TextField](#form.textfield), [Form.Checkbox](#form.checkbox) or [Form.Dropdown](#form.dropdown).

Optionally add a [Form.LinkAccessory](#form.linkaccessory) in the right-hand side of the navigation bar.

| Prop               | Description                                                                         | Type                                                           | Default |
| ------------------ | ----------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------- |
| actions            | A reference to an ActionPanel.                                                      | `React.ReactNode`                                              | -       |
| children           | The Form.Item elements of the form.                                                 | `React.ReactNode`                                              | -       |
| enableDrafts       | Defines whether the Form.Items values will be preserved when user exits the screen. | `boolean`                                                      | -       |
| isLoading          | Indicates whether a loading bar should be shown or hidden below the search bar      | `boolean`                                                      | -       |
| navigationTitle    | The main title for that view displayed in Raycast                                   | `string`                                                       | -       |
| searchBarAccessory | Form.LinkAccessory that will be shown in the right-hand-side of the search bar.     | `ReactElement<`[`Form.LinkAccessory.Props`](#props)`, string>` | -       |

A form item with a text field for input.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e0d079518d5780a4b1c84d08642a4349bbc5e68d%2Fform-textfield.webp?alt=media)

{% tabs %}
{% tab title="Uncontrolled text field" %}

{% tab title="Controlled text field" %}

{% endtab %}
{% endtabs %}

| Prop                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                     | Type                                 | Default |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------- |
| id<mark style="color:red;">\*</mark> | ID of the form item. Make sure to assign each form item a unique id.                                                                                                                                                                                                                                                                                                                                                            | `string`                             | -       |
| autoFocus                            | Indicates whether the item should be focused automatically once the form is rendered.                                                                                                                                                                                                                                                                                                                                           | `boolean`                            | -       |
| defaultValue                         | The default value of the item. Keep in mind that `defaultValue` will be configured once per component lifecycle. This means that if a user changes the value, `defaultValue` won't be configured on re-rendering. If you're using `storeValue` and configured it as `true` then the stored value will be set. If you configure `value` at the same time with `defaultValue`, the `value` will be set instead of `defaultValue`. | `string`                             | -       |
| error                                | An optional error message to show the form item validation issues. If the `error` is present, the Form Item will be highlighted with red border and will show an error message on the right.                                                                                                                                                                                                                                    | `string`                             | -       |
| info                                 | An optional info message to describe the form item. It appears on the right side of the item with an info icon. When the icon is hovered, the info message is shown.                                                                                                                                                                                                                                                            | `string`                             | -       |
| onBlur                               | The callback that will be triggered when the item loses its focus.                                                                                                                                                                                                                                                                                                                                                              | `(event: FormEvent<string>) => void` | -       |
| onChange                             | The callback which will be triggered when the `value` of the item changes.                                                                                                                                                                                                                                                                                                                                                      | `(newValue: string) => void`         | -       |
| onFocus                              | The callback which will be triggered should be called when the item is focused.                                                                                                                                                                                                                                                                                                                                                 | `(event: FormEvent<string>) => void` | -       |
| placeholder                          | Placeholder text shown in the text field.                                                                                                                                                                                                                                                                                                                                                                                       | `string`                             | -       |
| storeValue                           | Indicates whether the value of the item should be persisted after submitting, and restored next time the form is rendered.                                                                                                                                                                                                                                                                                                      | `boolean`                            | -       |
| title                                | The title displayed on the left side of the item.                                                                                                                                                                                                                                                                                                                                                                               | `string`                             | -       |
| value                                | The current value of the item.                                                                                                                                                                                                                                                                                                                                                                                                  | `string`                             | -       |

#### Methods (Imperative API)

| Name  | Signature    | Description                                                                |
| ----- | ------------ | -------------------------------------------------------------------------- |
| focus | `() => void` | Makes the item request focus.                                              |
| reset | `() => void` | Resets the form item to its initial value, or `defaultValue` if specified. |

### Form.PasswordField

A form item with a secure text field for password-entry in which the entered characters must be kept secret.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-70aadaea0c392c1dc97d0797f2f1d7b8e4d439ed%2Fform-password.webp?alt=media)

{% tabs %}
{% tab title="Uncontrolled password field" %}

{% tab title="Controlled password field" %}

{% endtab %}
{% endtabs %}

| Prop                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                     | Type                                 | Default |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------- |
| id<mark style="color:red;">\*</mark> | ID of the form item. Make sure to assign each form item a unique id.                                                                                                                                                                                                                                                                                                                                                            | `string`                             | -       |
| autoFocus                            | Indicates whether the item should be focused automatically once the form is rendered.                                                                                                                                                                                                                                                                                                                                           | `boolean`                            | -       |
| defaultValue                         | The default value of the item. Keep in mind that `defaultValue` will be configured once per component lifecycle. This means that if a user changes the value, `defaultValue` won't be configured on re-rendering. If you're using `storeValue` and configured it as `true` then the stored value will be set. If you configure `value` at the same time with `defaultValue`, the `value` will be set instead of `defaultValue`. | `string`                             | -       |
| error                                | An optional error message to show the form item validation issues. If the `error` is present, the Form Item will be highlighted with red border and will show an error message on the right.                                                                                                                                                                                                                                    | `string`                             | -       |
| info                                 | An optional info message to describe the form item. It appears on the right side of the item with an info icon. When the icon is hovered, the info message is shown.                                                                                                                                                                                                                                                            | `string`                             | -       |
| onBlur                               | The callback that will be triggered when the item loses its focus.                                                                                                                                                                                                                                                                                                                                                              | `(event: FormEvent<string>) => void` | -       |
| onChange                             | The callback which will be triggered when the `value` of the item changes.                                                                                                                                                                                                                                                                                                                                                      | `(newValue: string) => void`         | -       |
| onFocus                              | The callback which will be triggered should be called when the item is focused.                                                                                                                                                                                                                                                                                                                                                 | `(event: FormEvent<string>) => void` | -       |
| placeholder                          | Placeholder text shown in the password field.                                                                                                                                                                                                                                                                                                                                                                                   | `string`                             | -       |
| storeValue                           | Indicates whether the value of the item should be persisted after submitting, and restored next time the form is rendered.                                                                                                                                                                                                                                                                                                      | `boolean`                            | -       |
| title                                | The title displayed on the left side of the item.                                                                                                                                                                                                                                                                                                                                                                               | `string`                             | -       |
| value                                | The current value of the item.                                                                                                                                                                                                                                                                                                                                                                                                  | `string`                             | -       |

#### Methods (Imperative API)

| Name  | Signature    | Description                                                                |
| ----- | ------------ | -------------------------------------------------------------------------- |
| focus | `() => void` | Makes the item request focus.                                              |
| reset | `() => void` | Resets the form item to its initial value, or `defaultValue` if specified. |

A form item with a text area for input. The item supports multiline text entry.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b86a65278162fe68c8661034a239d039a2e447cc%2Fform-textarea.webp?alt=media)

{% tabs %}
{% tab title="Uncontrolled text area" %}

{% tab title="Controlled text area" %}

{% endtab %}
{% endtabs %}

| Prop                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                     | Type                                 | Default |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------- |
| id<mark style="color:red;">\*</mark> | ID of the form item. Make sure to assign each form item a unique id.                                                                                                                                                                                                                                                                                                                                                            | `string`                             | -       |
| autoFocus                            | Indicates whether the item should be focused automatically once the form is rendered.                                                                                                                                                                                                                                                                                                                                           | `boolean`                            | -       |
| defaultValue                         | The default value of the item. Keep in mind that `defaultValue` will be configured once per component lifecycle. This means that if a user changes the value, `defaultValue` won't be configured on re-rendering. If you're using `storeValue` and configured it as `true` then the stored value will be set. If you configure `value` at the same time with `defaultValue`, the `value` will be set instead of `defaultValue`. | `string`                             | -       |
| enableMarkdown                       | Whether markdown will be highlighted in the TextArea or not. When enabled, markdown shortcuts starts to work for the TextArea (pressing `⌘ + B` will add `**bold**` around the selected text, `⌘ + I` will make the selected text italic, etc.)                                                                                                                                                                                 | `boolean`                            | -       |
| error                                | An optional error message to show the form item validation issues. If the `error` is present, the Form Item will be highlighted with red border and will show an error message on the right.                                                                                                                                                                                                                                    | `string`                             | -       |
| info                                 | An optional info message to describe the form item. It appears on the right side of the item with an info icon. When the icon is hovered, the info message is shown.                                                                                                                                                                                                                                                            | `string`                             | -       |
| onBlur                               | The callback that will be triggered when the item loses its focus.                                                                                                                                                                                                                                                                                                                                                              | `(event: FormEvent<string>) => void` | -       |
| onChange                             | The callback which will be triggered when the `value` of the item changes.                                                                                                                                                                                                                                                                                                                                                      | `(newValue: string) => void`         | -       |
| onFocus                              | The callback which will be triggered should be called when the item is focused.                                                                                                                                                                                                                                                                                                                                                 | `(event: FormEvent<string>) => void` | -       |
| placeholder                          | Placeholder text shown in the text area.                                                                                                                                                                                                                                                                                                                                                                                        | `string`                             | -       |
| storeValue                           | Indicates whether the value of the item should be persisted after submitting, and restored next time the form is rendered.                                                                                                                                                                                                                                                                                                      | `boolean`                            | -       |
| title                                | The title displayed on the left side of the item.                                                                                                                                                                                                                                                                                                                                                                               | `string`                             | -       |
| value                                | The current value of the item.                                                                                                                                                                                                                                                                                                                                                                                                  | `string`                             | -       |

#### Methods (Imperative API)

| Name  | Signature    | Description                                                                |
| ----- | ------------ | -------------------------------------------------------------------------- |
| focus | `() => void` | Makes the item request focus.                                              |
| reset | `() => void` | Resets the form item to its initial value, or `defaultValue` if specified. |

A form item with a checkbox.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ef18048374669510de660607b9c0e368c07a00c1%2Fform-checkbox.webp?alt=media)

{% tabs %}
{% tab title="Uncontrolled checkbox" %}

{% tab title="Controlled checkbox" %}

{% endtab %}
{% endtabs %}

| Prop                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                     | Type                                  | Default |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ------- |
| id<mark style="color:red;">\*</mark>    | ID of the form item. Make sure to assign each form item a unique id.                                                                                                                                                                                                                                                                                                                                                            | `string`                              | -       |
| label<mark style="color:red;">\*</mark> | The label displayed on the right side of the checkbox.                                                                                                                                                                                                                                                                                                                                                                          | `string`                              | -       |
| autoFocus                               | Indicates whether the item should be focused automatically once the form is rendered.                                                                                                                                                                                                                                                                                                                                           | `boolean`                             | -       |
| defaultValue                            | The default value of the item. Keep in mind that `defaultValue` will be configured once per component lifecycle. This means that if a user changes the value, `defaultValue` won't be configured on re-rendering. If you're using `storeValue` and configured it as `true` then the stored value will be set. If you configure `value` at the same time with `defaultValue`, the `value` will be set instead of `defaultValue`. | `boolean`                             | -       |
| error                                   | An optional error message to show the form item validation issues. If the `error` is present, the Form Item will be highlighted with red border and will show an error message on the right.                                                                                                                                                                                                                                    | `string`                              | -       |
| info                                    | An optional info message to describe the form item. It appears on the right side of the item with an info icon. When the icon is hovered, the info message is shown.                                                                                                                                                                                                                                                            | `string`                              | -       |
| onBlur                                  | The callback that will be triggered when the item loses its focus.                                                                                                                                                                                                                                                                                                                                                              | `(event: FormEvent<boolean>) => void` | -       |
| onChange                                | The callback which will be triggered when the `value` of the item changes.                                                                                                                                                                                                                                                                                                                                                      | `(newValue: boolean) => void`         | -       |
| onFocus                                 | The callback which will be triggered should be called when the item is focused.                                                                                                                                                                                                                                                                                                                                                 | `(event: FormEvent<boolean>) => void` | -       |
| storeValue                              | Indicates whether the value of the item should be persisted after submitting, and restored next time the form is rendered.                                                                                                                                                                                                                                                                                                      | `boolean`                             | -       |
| title                                   | The title displayed on the left side of the item.                                                                                                                                                                                                                                                                                                                                                                               | `string`                              | -       |
| value                                   | The current value of the item.                                                                                                                                                                                                                                                                                                                                                                                                  | `boolean`                             | -       |

#### Methods (Imperative API)

| Name  | Signature    | Description                                                                |
| ----- | ------------ | -------------------------------------------------------------------------- |
| focus | `() => void` | Makes the item request focus.                                              |
| reset | `() => void` | Resets the form item to its initial value, or `defaultValue` if specified. |

A form item with a date picker.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e2b50c8a42be98887a58a493470d5007543befda%2Fform-datepicker.webp?alt=media)

{% tabs %}
{% tab title="Uncontrolled date picker" %}

{% tab title="Controlled date picker" %}

{% endtab %}
{% endtabs %}

| Prop                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                     | Type                                                                                                                            | Default |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------- |
| id<mark style="color:red;">\*</mark> | ID of the form item. Make sure to assign each form item a unique id.                                                                                                                                                                                                                                                                                                                                                            | `string`                                                                                                                        | -       |
| autoFocus                            | Indicates whether the item should be focused automatically once the form is rendered.                                                                                                                                                                                                                                                                                                                                           | `boolean`                                                                                                                       | -       |
| defaultValue                         | The default value of the item. Keep in mind that `defaultValue` will be configured once per component lifecycle. This means that if a user changes the value, `defaultValue` won't be configured on re-rendering. If you're using `storeValue` and configured it as `true` then the stored value will be set. If you configure `value` at the same time with `defaultValue`, the `value` will be set instead of `defaultValue`. | [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)                                 | -       |
| error                                | An optional error message to show the form item validation issues. If the `error` is present, the Form Item will be highlighted with red border and will show an error message on the right.                                                                                                                                                                                                                                    | `string`                                                                                                                        | -       |
| info                                 | An optional info message to describe the form item. It appears on the right side of the item with an info icon. When the icon is hovered, the info message is shown.                                                                                                                                                                                                                                                            | `string`                                                                                                                        | -       |
| max                                  | The maximum date (inclusive) allowed for selection. - If the PickDate type is `Type.Date`, only the full day date will be considered for comparison, ignoring the time components of the Date object. - If the PickDate type is `Type.DateTime`, both date and time components will be considered for comparison. The date should be a JavaScript Date object.                                                                  | [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)                                 | -       |
| min                                  | The minimum date (inclusive) allowed for selection. - If the PickDate type is `Type.Date`, only the full day date will be considered for comparison, ignoring the time components of the Date object. - If the PickDate type is `Type.DateTime`, both date and time components will be considered for comparison. The date should be a JavaScript Date object.                                                                  | [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)                                 | -       |
| onBlur                               | The callback that will be triggered when the item loses its focus.                                                                                                                                                                                                                                                                                                                                                              | `(event: FormEvent<`[`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)`>) => void` | -       |
| onChange                             | The callback which will be triggered when the `value` of the item changes.                                                                                                                                                                                                                                                                                                                                                      | `(newValue:` [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)`) => void`         | -       |
| onFocus                              | The callback which will be triggered should be called when the item is focused.                                                                                                                                                                                                                                                                                                                                                 | `(event: FormEvent<`[`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)`>) => void` | -       |
| storeValue                           | Indicates whether the value of the item should be persisted after submitting, and restored next time the form is rendered.                                                                                                                                                                                                                                                                                                      | `boolean`                                                                                                                       | -       |
| title                                | The title displayed on the left side of the item.                                                                                                                                                                                                                                                                                                                                                                               | `string`                                                                                                                        | -       |
| type                                 | Indicates what types of date components can be picked Defaults to Form.DatePicker.Type.DateTime                                                                                                                                                                                                                                                                                                                                 | [`Form.DatePicker.Type`](#form.datepicker.type)                                                                                 | -       |
| value                                | The current value of the item.                                                                                                                                                                                                                                                                                                                                                                                                  | [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)                                 | -       |

#### Methods (Imperative API)

| Name  | Signature    | Description                                                                |
| ----- | ------------ | -------------------------------------------------------------------------- |
| focus | `() => void` | Makes the item request focus.                                              |
| reset | `() => void` | Resets the form item to its initial value, or `defaultValue` if specified. |

#### Form.DatePicker.isFullDay

A method that determines if a given date represents a full day or a specific time.

A form item with a dropdown menu.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a41244152d1b3069ff42e915e6d00b6259e3a2f1%2Fform-dropdown.webp?alt=media)

{% tabs %}
{% tab title="Uncontrolled dropdown" %}

{% tab title="Controlled dropdown" %}

{% endtab %}
{% endtabs %}

| Prop                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Type                                         | Default |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------- |
| id<mark style="color:red;">\*</mark> | ID of the form item. Make sure to assign each form item a unique id.                                                                                                                                                                                                                                                                                                                                                                                                                                | `string`                                     | -       |
| autoFocus                            | Indicates whether the item should be focused automatically once the form is rendered.                                                                                                                                                                                                                                                                                                                                                                                                               | `boolean`                                    | -       |
| children                             | Sections or items. If Form.Dropdown.Item elements are specified, a default section is automatically created.                                                                                                                                                                                                                                                                                                                                                                                        | `React.ReactNode`                            | -       |
| defaultValue                         | The default value of the item. Keep in mind that `defaultValue` will be configured once per component lifecycle. This means that if a user changes the value, `defaultValue` won't be configured on re-rendering. If you're using `storeValue` and configured it as `true` then the stored value will be set. If you configure `value` at the same time with `defaultValue`, the `value` will be set instead of `defaultValue`.                                                                     | `string`                                     | -       |
| error                                | An optional error message to show the form item validation issues. If the `error` is present, the Form Item will be highlighted with red border and will show an error message on the right.                                                                                                                                                                                                                                                                                                        | `string`                                     | -       |
| filtering                            | Toggles Raycast filtering. When `true`, Raycast will use the query in the search bar to filter the items. When `false`, the extension needs to take care of the filtering. You can further define how native filtering orders sections by setting an object with a `keepSectionOrder` property: When `true`, ensures that Raycast filtering maintains the section order as defined in the extension. When `false`, filtering may change the section order depending on the ranking values of items. | `boolean` or `{ keepSectionOrder: boolean }` | -       |
| info                                 | An optional info message to describe the form item. It appears on the right side of the item with an info icon. When the icon is hovered, the info message is shown.                                                                                                                                                                                                                                                                                                                                | `string`                                     | -       |
| isLoading                            | Indicates whether a loading indicator should be shown or hidden next to the search bar                                                                                                                                                                                                                                                                                                                                                                                                              | `boolean`                                    | -       |
| onBlur                               | The callback that will be triggered when the item loses its focus.                                                                                                                                                                                                                                                                                                                                                                                                                                  | `(event: FormEvent<string>) => void`         | -       |
| onChange                             | The callback which will be triggered when the `value` of the item changes.                                                                                                                                                                                                                                                                                                                                                                                                                          | `(newValue: string) => void`                 | -       |
| onFocus                              | The callback which will be triggered should be called when the item is focused.                                                                                                                                                                                                                                                                                                                                                                                                                     | `(event: FormEvent<string>) => void`         | -       |
| onSearchTextChange                   | Callback triggered when the search bar text changes.                                                                                                                                                                                                                                                                                                                                                                                                                                                | `(text: string) => void`                     | -       |
| placeholder                          | Placeholder text that will be shown in the dropdown search field.                                                                                                                                                                                                                                                                                                                                                                                                                                   | `string`                                     | -       |
| storeValue                           | Indicates whether the value of the item should be persisted after submitting, and restored next time the form is rendered.                                                                                                                                                                                                                                                                                                                                                                          | `boolean`                                    | -       |
| throttle                             | Defines whether the `onSearchTextChange` handler will be triggered on every keyboard press or with a delay for throttling the events. Recommended to set to `true` when using custom filtering logic with asynchronous operations (e.g. network requests).                                                                                                                                                                                                                                          | `boolean`                                    | -       |
| title                                | The title displayed on the left side of the item.                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `string`                                     | -       |
| value                                | The current value of the item.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `string`                                     | -       |

#### Methods (Imperative API)

| Name  | Signature    | Description                                                                |
| ----- | ------------ | -------------------------------------------------------------------------- |
| focus | `() => void` | Makes the item request focus.                                              |
| reset | `() => void` | Resets the form item to its initial value, or `defaultValue` if specified. |

### Form.Dropdown.Item

A dropdown item in a [Form.Dropdown](#form.dropdown)

| Prop                                    | Description                                                                                                                                                                   | Type                                                                                               | Default |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------- |
| title<mark style="color:red;">\*</mark> | The title displayed for the item.                                                                                                                                             | `string`                                                                                           | -       |
| value<mark style="color:red;">\*</mark> | Value of the dropdown item. Make sure to assign each unique value for each item.                                                                                              | `string`                                                                                           | -       |
| icon                                    | A optional icon displayed for the item.                                                                                                                                       | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) | -       |
| keywords                                | An optional property used for providing additional indexable strings for search. When filtering the items in Raycast, the keywords will be searched in addition to the title. | `string[]`                                                                                         | -       |

### Form.Dropdown.Section

Visually separated group of dropdown items.

Use sections to group related menu items together.

| Prop     | Description                       | Type              | Default |
| -------- | --------------------------------- | ----------------- | ------- |
| children | The item elements of the section. | `React.ReactNode` | -       |
| title    | Title displayed above the section | `string`          | -       |

A form item with a tag picker that allows the user to select multiple items.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-0df8b3735a1881832202a9a88b4614abddf986a4%2Fform-tagpicker.webp?alt=media)

{% tabs %}
{% tab title="Uncontrolled tag picker" %}

{% tab title="Controlled tag picker" %}

{% endtab %}
{% endtabs %}

| Prop                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                     | Type                                   | Default |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ------- |
| id<mark style="color:red;">\*</mark> | ID of the form item. Make sure to assign each form item a unique id.                                                                                                                                                                                                                                                                                                                                                            | `string`                               | -       |
| autoFocus                            | Indicates whether the item should be focused automatically once the form is rendered.                                                                                                                                                                                                                                                                                                                                           | `boolean`                              | -       |
| children                             | The list of tags.                                                                                                                                                                                                                                                                                                                                                                                                               | `React.ReactNode`                      | -       |
| defaultValue                         | The default value of the item. Keep in mind that `defaultValue` will be configured once per component lifecycle. This means that if a user changes the value, `defaultValue` won't be configured on re-rendering. If you're using `storeValue` and configured it as `true` then the stored value will be set. If you configure `value` at the same time with `defaultValue`, the `value` will be set instead of `defaultValue`. | `string[]`                             | -       |
| error                                | An optional error message to show the form item validation issues. If the `error` is present, the Form Item will be highlighted with red border and will show an error message on the right.                                                                                                                                                                                                                                    | `string`                               | -       |
| info                                 | An optional info message to describe the form item. It appears on the right side of the item with an info icon. When the icon is hovered, the info message is shown.                                                                                                                                                                                                                                                            | `string`                               | -       |
| onBlur                               | The callback that will be triggered when the item loses its focus.                                                                                                                                                                                                                                                                                                                                                              | `(event: FormEvent<string[]>) => void` | -       |
| onChange                             | The callback which will be triggered when the `value` of the item changes.                                                                                                                                                                                                                                                                                                                                                      | `(newValue: string[]) => void`         | -       |
| onFocus                              | The callback which will be triggered should be called when the item is focused.                                                                                                                                                                                                                                                                                                                                                 | `(event: FormEvent<string[]>) => void` | -       |
| placeholder                          | Placeholder text shown in the token field.                                                                                                                                                                                                                                                                                                                                                                                      | `string`                               | -       |
| storeValue                           | Indicates whether the value of the item should be persisted after submitting, and restored next time the form is rendered.                                                                                                                                                                                                                                                                                                      | `boolean`                              | -       |
| title                                | The title displayed on the left side of the item.                                                                                                                                                                                                                                                                                                                                                                               | `string`                               | -       |
| value                                | The current value of the item.                                                                                                                                                                                                                                                                                                                                                                                                  | `string[]`                             | -       |

#### Methods (Imperative API)

| Name  | Signature    | Description                                                                |
| ----- | ------------ | -------------------------------------------------------------------------- |
| focus | `() => void` | Makes the item request focus.                                              |
| reset | `() => void` | Resets the form item to its initial value, or `defaultValue` if specified. |

### Form.TagPicker.Item

A tag picker item in a [Form.TagPicker](#form.tagpicker).

| Prop                                    | Description                                                       | Type                                                                                               | Default |
| --------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------- |
| title<mark style="color:red;">\*</mark> | The display title of the tag.                                     | `string`                                                                                           | -       |
| value<mark style="color:red;">\*</mark> | Value of the tag. Make sure to assign unique value for each item. | `string`                                                                                           | -       |
| icon                                    | An icon to show in the tag.                                       | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) | -       |

A form item that shows a separator line. Use for grouping and visually separating form items.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8268f478b1023d780fa7f357b062a39eb8b09546%2Fform-separator.webp?alt=media)

A form item with a button to open a dialog to pick some files and/or some directories (depending on its props).

{% hint style="info" %}
While the user picked some items that existed, it might be possible for them to be deleted or changed when the `onSubmit` callback is called. Hence you should always make sure that the items exist before acting on them!
{% endhint %}

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a84e496e0d48f2d448078314a7a42af3db29abcf%2Fform-filepicker-multiple.webp?alt=media)

![Single Selection](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-53289fc13e994aeee7d356baf18b053340e8e927%2Fform-filepicker-single.webp?alt=media)

{% tabs %}
{% tab title="Uncontrolled file picker" %}

{% tab title="Single selection file picker" %}

{% tab title="Directory picker" %}

{% tab title="Controlled file picker" %}

{% endtab %}
{% endtabs %}

| Prop                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                     | Type                                   | Default |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ------- |
| id<mark style="color:red;">\*</mark> | ID of the form item. Make sure to assign each form item a unique id.                                                                                                                                                                                                                                                                                                                                                            | `string`                               | -       |
| allowMultipleSelection               | Indicates whether the user can select multiple items or only one.                                                                                                                                                                                                                                                                                                                                                               | `boolean`                              | -       |
| autoFocus                            | Indicates whether the item should be focused automatically once the form is rendered.                                                                                                                                                                                                                                                                                                                                           | `boolean`                              | -       |
| canChooseDirectories                 | Indicates whether it's possible to choose a directory. Note: On Windows, this property is ignored if `canChooseFiles` is set to `true`.                                                                                                                                                                                                                                                                                         | `boolean`                              | -       |
| canChooseFiles                       | Indicates whether it's possible to choose a file.                                                                                                                                                                                                                                                                                                                                                                               | `boolean`                              | -       |
| defaultValue                         | The default value of the item. Keep in mind that `defaultValue` will be configured once per component lifecycle. This means that if a user changes the value, `defaultValue` won't be configured on re-rendering. If you're using `storeValue` and configured it as `true` then the stored value will be set. If you configure `value` at the same time with `defaultValue`, the `value` will be set instead of `defaultValue`. | `string[]`                             | -       |
| error                                | An optional error message to show the form item validation issues. If the `error` is present, the Form Item will be highlighted with red border and will show an error message on the right.                                                                                                                                                                                                                                    | `string`                               | -       |
| info                                 | An optional info message to describe the form item. It appears on the right side of the item with an info icon. When the icon is hovered, the info message is shown.                                                                                                                                                                                                                                                            | `string`                               | -       |
| onBlur                               | The callback that will be triggered when the item loses its focus.                                                                                                                                                                                                                                                                                                                                                              | `(event: FormEvent<string[]>) => void` | -       |
| onChange                             | The callback which will be triggered when the `value` of the item changes.                                                                                                                                                                                                                                                                                                                                                      | `(newValue: string[]) => void`         | -       |
| onFocus                              | The callback which will be triggered should be called when the item is focused.                                                                                                                                                                                                                                                                                                                                                 | `(event: FormEvent<string[]>) => void` | -       |
| showHiddenFiles                      | Indicates whether the file picker displays files that are normally hidden from the user.                                                                                                                                                                                                                                                                                                                                        | `boolean`                              | -       |
| storeValue                           | Indicates whether the value of the item should be persisted after submitting, and restored next time the form is rendered.                                                                                                                                                                                                                                                                                                      | `boolean`                              | -       |
| title                                | The title displayed on the left side of the item.                                                                                                                                                                                                                                                                                                                                                                               | `string`                               | -       |
| value                                | The current value of the item.                                                                                                                                                                                                                                                                                                                                                                                                  | `string[]`                             | -       |

#### Methods (Imperative API)

| Name  | Signature    | Description                                                                |
| ----- | ------------ | -------------------------------------------------------------------------- |
| focus | `() => void` | Makes the item request focus.                                              |
| reset | `() => void` | Resets the form item to its initial value, or `defaultValue` if specified. |

A form item with a simple text label.

Do *not* use this component to show validation messages for other form fields.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8dba909f1969413f109d4536b5f61bd638213019%2Fform-description.webp?alt=media)

| Prop                                   | Description                                                   | Type     | Default |
| -------------------------------------- | ------------------------------------------------------------- | -------- | ------- |
| text<mark style="color:red;">\*</mark> | Text that will be displayed in the middle.                    | `string` | -       |
| title                                  | The display title of the left side from the description item. | `string` | -       |

### Form.LinkAccessory

A link that will be shown in the right-hand side of the navigation bar.

| Prop                                     | Description                 | Type     | Default |
| ---------------------------------------- | --------------------------- | -------- | ------- |
| target<mark style="color:red;">\*</mark> | The target of the link.     | `string` | -       |
| text<mark style="color:red;">\*</mark>   | The text value of the item. | `string` | -       |

Some Form.Item callbacks (like `onFocus` and `onBlur`) can return a `Form.Event` object that you can use in a different ways.

| Property                                 | Description                                              | Type                                  |
| ---------------------------------------- | -------------------------------------------------------- | ------------------------------------- |
| target<mark style="color:red;">\*</mark> | An interface containing target data related to the event | `{ id: string; value?: any }`         |
| type<mark style="color:red;">\*</mark>   | A type of event                                          | [`Form.Event.Type`](#form.event.type) |

The different types of [`Form.Event`](#form.event). Can be `"focus"` or `"blur"`.

Values of items in the form.

For type-safe form values, you can define your own interface. Use the ID's of the form items as the property name.

| Name              | Type  | Required | Description                     |
| ----------------- | ----- | -------- | ------------------------------- |
| \[itemId: string] | `any` | Yes      | The form value of a given item. |

### Form.DatePicker.Type

The types of date components the user can pick with a `Form.DatePicker`.

#### Enumeration members

| Name     | Description                                                      |
| -------- | ---------------------------------------------------------------- |
| DateTime | Hour and second can be picked in addition to year, month and day |
| Date     | Only year, month, and day can be picked                          |

You can use React's [useRef](https://reactjs.org/docs/hooks-reference.html#useref) hook to create variables which have access to imperative APIs (such as `.focus()` or `.reset()`) exposed by the native form items.

**Examples:**

Example 1 (tsx):
```tsx
import { Action, ActionPanel, Form, showToast, Toast } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";

interface SignUpFormValues {
  name: string;
  password: string;
}

export default function Command() {
  const { handleSubmit, itemProps } = useForm<SignUpFormValues>({
    onSubmit(values) {
      showToast({
        style: Toast.Style.Success,
        title: "Yay!",
        message: `${values.name} account created`,
      });
    },
    validation: {
      name: FormValidation.Required,
      password: (value) => {
        if (value && value.length < 8) {
          return "Password must be at least 8 symbols";
        } else if (!value) {
          return "The item is required";
        }
      },
    },
  });
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField title="Full Name" placeholder="Tim Cook" {...itemProps.name} />
      <Form.PasswordField title="New Password" {...itemProps.password} />
    </Form>
  );
}
```

Example 2 (typescript):
```typescript
import { Form } from "@raycast/api";
import { useState } from "react";

export default function Command() {
  const [nameError, setNameError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  function dropNameErrorIfNeeded() {
    if (nameError && nameError.length > 0) {
      setNameError(undefined);
    }
  }

  function dropPasswordErrorIfNeeded() {
    if (passwordError && passwordError.length > 0) {
      setPasswordError(undefined);
    }
  }

  return (
    <Form>
      <Form.TextField
        id="nameField"
        title="Full Name"
        placeholder="Tim Cook"
        error={nameError}
        onChange={dropNameErrorIfNeeded}
        onBlur={(event) => {
          if (event.target.value?.length == 0) {
            setNameError("The field should't be empty!");
          } else {
            dropNameErrorIfNeeded();
          }
        }}
      />
      <Form.PasswordField
        id="password"
        title="New Password"
        error={passwordError}
        onChange={dropPasswordErrorIfNeeded}
        onBlur={(event) => {
          const value = event.target.value;
          if (value && value.length > 0) {
            if (!validatePassword(value)) {
              setPasswordError("Password should be at least 8 characters!");
            } else {
              dropPasswordErrorIfNeeded();
            }
          } else {
            setPasswordError("The field should't be empty!");
          }
        }}
      />
      <Form.TextArea id="bioTextArea" title="Add Bio" placeholder="Describe who you are" />
      <Form.DatePicker id="birthDate" title="Date of Birth" />
    </Form>
  );
}

function validatePassword(value: string): boolean {
  return value.length >= 8;
}
```

Example 3 (typescript):
```typescript
import { Form, ActionPanel, Action, popToRoot, LaunchProps } from "@raycast/api";

interface TodoValues {
  title: string;
  description?: string;
  dueDate?: Date;
}

export default function Command(props: LaunchProps<{ draftValues: TodoValues }>) {
  const { draftValues } = props;

  return (
    <Form
      enableDrafts
      actions={
        <ActionPanel>
          <Action.SubmitForm
            onSubmit={(values: TodoValues) => {
              console.log("onSubmit", values);
              popToRoot();
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="title" title="Title" defaultValue={draftValues?.title} />
      <Form.TextArea id="description" title="Description" defaultValue={draftValues?.description} />
      <Form.DatePicker id="dueDate" title="Due Date" defaultValue={draftValues?.dueDate} />
    </Form>
  );
}
```

Example 4 (typescript):
```typescript
import { Form, ActionPanel, Action, popToRoot, LaunchProps } from "@raycast/api";
import { useState } from "react";

interface TodoValues {
  title: string;
  description?: string;
  dueDate?: Date;
}

export default function Command(props: LaunchProps<{ draftValues: TodoValues }>) {
  const { draftValues } = props;

  const [title, setTitle] = useState<string>(draftValues?.title || "");
  const [description, setDescription] = useState<string>(draftValues?.description || "");
  const [dueDate, setDueDate] = useState<Date | null>(draftValues?.dueDate || null);

  return (
    <Form
      enableDrafts
      actions={
        <ActionPanel>
          <Action.SubmitForm
            onSubmit={(values: TodoValues) => {
              console.log("onSubmit", values);
              popToRoot();
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="title" title="Title" value={title} onChange={setTitle} />
      <Form.TextArea id="description" title="Description" value={description} onChange={setDescription} />
      <Form.DatePicker id="dueDate" title="Due Date" value={dueDate} onChange={setDueDate} />
    </Form>
  );
}
```

---

## useForm

**URL:** llms-txt#useform

**Contents:**
- Signature
  - Arguments
  - Return
- Example
- Types
  - FormValidation

Hook that provides a high-level interface to work with Forms, and more particularly, with Form validations. It incorporates all the good practices to provide a great User Experience for your Forms.

* `onSubmit` is a callback that will be called when the form is submitted and all validations pass.

* `initialValues` are the initial values to set when the Form is first rendered.
* `validation` are the validation rules for the Form. A validation for a Form item is a function that takes the current value of the item as an argument and must return a string when the validation is failing. We also provide some shorthands for common cases, see [FormValidation](#formvalidation).

Returns an object which contains the necessary methods and props to provide a good User Experience in your Form.

* `handleSubmit` is a function to pass to the `onSubmit` prop of the `<Action.SubmitForm>` element. It wraps the initial `onSubmit` argument with some goodies related to the validation.
* `itemProps` are the props that must be passed to the `<Form.Item>` elements to handle the validations.

It also contains some additions for easy manipulation of the Form's data.

* `values` is the current values of the Form.
* `setValue` is a function that can be used to programmatically set the value of a specific field.
* `setValidationError` is a function that can be used to programmatically set the validation of a specific field.
* `focus` is a function that can be used to programmatically focus a specific field.
* `reset` is a function that can be used to reset the values of the Form. Optionally, you can specify the values to set when the Form is reset.

Shorthands for common validation cases

#### Enumeration members

| Name     | Description                                       |
| -------- | ------------------------------------------------- |
| Required | Show an error when the value of the item is empty |

**Examples:**

Example 1 (ts):
```ts
function useForm<T extends Form.Values>(props: {
  onSubmit: (values: T) => void | boolean | Promise<void | boolean>;
  initialValues?: Partial<T>;
  validation?: {
    [id in keyof T]?: ((value: T[id]) => string | undefined | null) | FormValidation;
  };
}): {
  handleSubmit: (values: T) => void | boolean | Promise<void | boolean>;
  itemProps: {
    [id in keyof T]: Partial<Form.ItemProps<T[id]>> & {
      id: string;
    };
  };
  setValidationError: (id: keyof T, error: ValidationError) => void;
  setValue: <K extends keyof T>(id: K, value: T[K]) => void;
  values: T;
  focus: (id: keyof T) => void;
  reset: (initialValues?: Partial<T>) => void;
};
```

Example 2 (tsx):
```tsx
import { Action, ActionPanel, Form, showToast, Toast } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";

interface SignUpFormValues {
  firstName: string;
  lastName: string;
  birthday: Date | null;
  password: string;
  number: string;
  hobbies: string[];
}

export default function Command() {
  const { handleSubmit, itemProps } = useForm<SignUpFormValues>({
    onSubmit(values) {
      showToast({
        style: Toast.Style.Success,
        title: "Yay!",
        message: `${values.firstName} ${values.lastName} account created`,
      });
    },
    validation: {
      firstName: FormValidation.Required,
      lastName: FormValidation.Required,
      password: (value) => {
        if (value && value.length < 8) {
          return "Password must be at least 8 symbols";
        } else if (!value) {
          return "The item is required";
        }
      },
      number: (value) => {
        if (value && value !== "2") {
          return "Please select '2'";
        }
      },
    },
  });
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField title="First Name" placeholder="Enter first name" {...itemProps.firstName} />
      <Form.TextField title="Last Name" placeholder="Enter last name" {...itemProps.lastName} />
      <Form.DatePicker title="Date of Birth" {...itemProps.birthday} />
      <Form.PasswordField
        title="Password"
        placeholder="Enter password at least 8 characters long"
        {...itemProps.password}
      />
      <Form.Dropdown title="Your Favorite Number" {...itemProps.number}>
        {[1, 2, 3, 4, 5, 6, 7].map((num) => {
          return <Form.Dropdown.Item value={String(num)} title={String(num)} key={num} />;
        })}
      </Form.Dropdown>
    </Form>
  );
}
```

---

## Icons & Images

**URL:** llms-txt#icons-&-images

**Contents:**
- API Reference
  - Icon
  - Image.Mask
- Types
  - Image
  - FileIcon
  - Image.ImageLike
  - Image.Source
  - Image.Fallback
  - Image.URL

List of built-in icons that can be used for actions or list items.

#### Enumeration members

|                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6ee5708df8c742bed7ffa3c73fbf605a550a89ca%2Ficon-add-person-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-cc9d8e7cc6b6fe626b71f1e9fcccd89b24bf1f8b%2Ficon-add-person-16%40light.svg?alt=media" alt=""></picture><br>AddPerson</p>                      |                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-171fbbe6710200f053814a32f4a26d57acd6f3a7%2Ficon-airplane-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-469dcddfcc360d6689963863cd41704a913ca793%2Ficon-airplane-16%40light.svg?alt=media" alt=""></picture><br>Airplane</p>                      |                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-0fe66b07e988d12b2fa6c71c68b81c2b2f0f5f8b%2Ficon-airplane-filled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1e2a4258b55dd43598418a4aa2480d74e3a4997a%2Ficon-airplane-filled-16%40light.svg?alt=media" alt=""></picture><br>AirplaneFilled</p>                |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4341cca9fb6058af7b232a92b0625c4b01f8348d%2Ficon-airplane-landing-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e20fc40dcf1d75c4e75c25702eb8b50a5a2024b0%2Ficon-airplane-landing-16%40light.svg?alt=media" alt=""></picture><br>AirplaneLanding</p>             |           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b54473a627b86ab4c80c9ca8fab5b6e6cfa35ee0%2Ficon-airplane-takeoff-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2de6ac5a72d530ea8cf1a9713cdce4bf97409cc3%2Ficon-airplane-takeoff-16%40light.svg?alt=media" alt=""></picture><br>AirplaneTakeoff</p>           |                            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-136bc8ca0d9592189e5f9c1fd4d8efe74e257023%2Ficon-airpods-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b0936df174f1e4a79f54d89e6455dac0b0f1fc4d%2Ficon-airpods-16%40light.svg?alt=media" alt=""></picture><br>Airpods</p>                            |
|                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-016a0c7e98415519c44c7e0e8ef2d5eb45067287%2Ficon-alarm-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9f040a22411d364b5deb85609827ee62caa3e348%2Ficon-alarm-16%40light.svg?alt=media" alt=""></picture><br>Alarm</p>                             |                <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a54d272898061ffa421d7c4de1b3a8162a2c51db%2Ficon-alarm-ringing-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1be245a90cd3ddbebc5f5d9613a737882f4725a4%2Ficon-alarm-ringing-16%40light.svg?alt=media" alt=""></picture><br>AlarmRinging</p>               |                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b5d5529d7d054a3a627c4880e7f6036a5f0a6944%2Ficon-align-centre-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-32110eb54c2cf0bb820f5b2007d3d066b2fc0301%2Ficon-align-centre-16%40light.svg?alt=media" alt=""></picture><br>AlignCentre</p>                     |
|                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f86d3306040e05333132ed576425a094776be3b3%2Ficon-align-left-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f47b705ed077a17eacbc8bd148b67324777b3257%2Ficon-align-left-16%40light.svg?alt=media" alt=""></picture><br>AlignLeft</p>                      |                   <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-00185c7618f6118b64466d9699ad1e5146637264%2Ficon-align-right-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-67d1003ef17dc18ddf66d27f46b1bfd042f5641f%2Ficon-align-right-16%40light.svg?alt=media" alt=""></picture><br>AlignRight</p>                  |              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e4cf36d051bca437335311089e5eb712dda94c2d%2Ficon-american-football-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ef50c1eb0f8af87559c30ab6e6c9ad3fdf8ddb35%2Ficon-american-football-16%40light.svg?alt=media" alt=""></picture><br>AmericanFootball</p>             |
|                            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-afc2068752a881ff2626ec63e87dd96be4cf56ab%2Ficon-anchor-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d9be0a0133ac6e6a1d10f48d27c3316e95b9a95f%2Ficon-anchor-16%40light.svg?alt=media" alt=""></picture><br>Anchor</p>                            |                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-915fa84b6ccf17f298ca7cfb4726697eb011b108%2Ficon-app-window-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-33431e97d401f24e086889c0649cdc964b78a4ca%2Ficon-app-window-16%40light.svg?alt=media" alt=""></picture><br>AppWindow</p>                    |            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-254cfc957b00e8215ba7cf494c2771f4bb8e846d%2Ficon-app-window-grid-2x2-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d2d8801ce523b3283a8563eefd4945bd48569ffa%2Ficon-app-window-grid-2x2-16%40light.svg?alt=media" alt=""></picture><br>AppWindowGrid2x2</p>           |
|          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-154705698746dde1f9971d7cbe450f471b18438a%2Ficon-app-window-grid-3x3-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9f200b5d1f52f11d28468d74a146dda6e937850f%2Ficon-app-window-grid-3x3-16%40light.svg?alt=media" alt=""></picture><br>AppWindowGrid3x3</p>          |             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-69cc5a681d90fbe8dc6a9b817b00da3e225fae7a%2Ficon-app-window-list-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-fa30351029ea60661d722cc07e3b0bc2110f45f8%2Ficon-app-window-list-16%40light.svg?alt=media" alt=""></picture><br>AppWindowList</p>             |      <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ce9de27f833e5188523daff2c8d71d4d2858adbb%2Ficon-app-window-sidebar-left-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-0388e9a8a2cf96b3b889823fe6cb35325dd6c95d%2Ficon-app-window-sidebar-left-16%40light.svg?alt=media" alt=""></picture><br>AppWindowSidebarLeft</p>     |
|   <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-bc3dda681b9b4887a5d98aaa74ee268fa7a1caf7%2Ficon-app-window-sidebar-right-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8549d33dc277535867c386492d0ba85d83ae2d35%2Ficon-app-window-sidebar-right-16%40light.svg?alt=media" alt=""></picture><br>AppWindowSidebarRight</p>  |             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-877a1c5419e9a05d44744ec9bde83070dc8ecc06%2Ficon-arrow-clockwise-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4e273d19c66cb3cecc1467e807169e1cf5d8e855%2Ficon-arrow-clockwise-16%40light.svg?alt=media" alt=""></picture><br>ArrowClockwise</p>            |     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-bbe63efef80d51aada59d8cb2fcaa79e77ef1221%2Ficon-arrow-counter-clockwise-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e6371b244d67701b24c6f8de8925c2008451c5d6%2Ficon-arrow-counter-clockwise-16%40light.svg?alt=media" alt=""></picture><br>ArrowCounterClockwise</p>     |
|                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f6640161f45e05e91e4fa8d2b8c06ab771468a7f%2Ficon-arrow-down-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9c7c961f2e5d974c6495607318b8f8f33dabba8a%2Ficon-arrow-down-16%40light.svg?alt=media" alt=""></picture><br>ArrowDown</p>                      |          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4be9bc9c7fcab19674623e5e33e47af8478ccc09%2Ficon-arrow-down-circle-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-03cc0390a49fcc0bba3bc943ba5462fc54480c9c%2Ficon-arrow-down-circle-16%40light.svg?alt=media" alt=""></picture><br>ArrowDownCircle</p>          |    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8b39d844695f415fc6463b0c0fb24a845a7200f3%2Ficon-arrow-down-circle-filled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-039ad400119b66d2020e2219f350fa52c744dcbb%2Ficon-arrow-down-circle-filled-16%40light.svg?alt=media" alt=""></picture><br>ArrowDownCircleFilled</p>    |
|                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5ed31bbbdc36cace0408bcb691d71cec43d39818%2Ficon-arrow-left-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-38f088bebdb46f655c2480b4ee49cda352c02228%2Ficon-arrow-left-16%40light.svg?alt=media" alt=""></picture><br>ArrowLeft</p>                      |          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c6b2b397e14d0017af02364b655d2d0fd1fbb5e5%2Ficon-arrow-left-circle-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-07536b26a1e0bfa6f51be0b5a78b007f3e3910e0%2Ficon-arrow-left-circle-16%40light.svg?alt=media" alt=""></picture><br>ArrowLeftCircle</p>          |    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-347ed7442bc25ed8418bc8bb48ee20e6612fc198%2Ficon-arrow-left-circle-filled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-cbd8300e69bc34d2e3d7106b6242143d6b40aa3c%2Ficon-arrow-left-circle-filled-16%40light.svg?alt=media" alt=""></picture><br>ArrowLeftCircleFilled</p>    |
|                          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-57eee9e22fd1a32a7b27a46f7f4d201f060127a9%2Ficon-arrow-ne-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-0f20b0d1177273b24146d6c8c7760c9febdc1ea6%2Ficon-arrow-ne-16%40light.svg?alt=media" alt=""></picture><br>ArrowNe</p>                         |                   <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9f8e9e6adb9f0869702af95d8dca66347f9b8923%2Ficon-arrow-right-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-009765bc876f1996f73890ab8cc938d18157134b%2Ficon-arrow-right-16%40light.svg?alt=media" alt=""></picture><br>ArrowRight</p>                  |             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-33d0ef0fc2011c3a09c90d764fb9bbda8cf0bacc%2Ficon-arrow-right-circle-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5c8caf3b29c1b9a626721a213f77398c8f954e2f%2Ficon-arrow-right-circle-16%40light.svg?alt=media" alt=""></picture><br>ArrowRightCircle</p>            |
| <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1a6035000a76d1da9b8cfeb3510a54427e11014a%2Ficon-arrow-right-circle-filled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-56d4ab3cb20f36d58cdfdc8de81bfdacd8b6ffe8%2Ficon-arrow-right-circle-filled-16%40light.svg?alt=media" alt=""></picture><br>ArrowRightCircleFilled</p> |                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6d65199aebe4c630d59e44b3a555136c3709bd1d%2Ficon-arrow-up-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-820eda3e482c1bcfae246f232d7175e7c2d8e3f7%2Ficon-arrow-up-16%40light.svg?alt=media" alt=""></picture><br>ArrowUp</p>                       |                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b780aa5ae0edbd7e3656b3f851e7285337f7807a%2Ficon-arrow-up-circle-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-82e7d027845b939008732949c8c1b407bed35357%2Ficon-arrow-up-circle-16%40light.svg?alt=media" alt=""></picture><br>ArrowUpCircle</p>                 |
|      <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-0a849e8150355ae27cad3f34df7a8cdc7c6ae240%2Ficon-arrow-up-circle-filled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-63c2ee09db37653bcf3aeba8de93a3216768c3b0%2Ficon-arrow-up-circle-filled-16%40light.svg?alt=media" alt=""></picture><br>ArrowUpCircleFilled</p>     |             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-85f62a130822028248006de09cecbf1d9e8ec9c4%2Ficon-arrows-contract-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4be642cac8038f87a22bacaefc39d1fb3ae5e015%2Ficon-arrows-contract-16%40light.svg?alt=media" alt=""></picture><br>ArrowsContract</p>            |                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-fc3faa5f6e3fff789acb7e25195be0bc58e99b7f%2Ficon-arrows-expand-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-27f1fecf4905e32835b4b87755915b6f239b6b81%2Ficon-arrows-expand-16%40light.svg?alt=media" alt=""></picture><br>ArrowsExpand</p>                   |
|                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6399deb401f75d5fc91d7d060d73dda7399dc1af%2Ficon-at-symbol-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-59c6bf2aa01bceff048944671d3216bcf56031be%2Ficon-at-symbol-16%40light.svg?alt=media" alt=""></picture><br>AtSymbol</p>                        |                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2c98ec92ad04ae12826434192b1adb72e85c327d%2Ficon-band-aid-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2d4a1b3b2df52411dcdb7c53772cf6814d2a1e8e%2Ficon-band-aid-16%40light.svg?alt=media" alt=""></picture><br>BandAid</p>                       |                          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-0fd98eae680d7b00ed26acac3203be01e70b459d%2Ficon-bank-note-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f42773db994bcb82ed630461fb1ed00f087db9e3%2Ficon-bank-note-16%40light.svg?alt=media" alt=""></picture><br>BankNote</p>                         |
|                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6479296a51f7044e410ec16e476f3b5ffd0ab29b%2Ficon-bar-chart-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a9ee90ea1d85f56572d25d94536159181c9bf534%2Ficon-bar-chart-16%40light.svg?alt=media" alt=""></picture><br>BarChart</p>                        |                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-bda8ebdbb0ff9fc154a241856fd4435e89d34294%2Ficon-bar-code-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-78e45ad441732dbaf59ce19f6fe5896f0039f3a6%2Ficon-bar-code-16%40light.svg?alt=media" alt=""></picture><br>BarCode</p>                       |                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9d7bee76e54e52e675848453e23278b26b1c20b9%2Ficon-bath-tub-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f5c224462ee053c4ae82e0bdb9a467c66e7e7338%2Ficon-bath-tub-16%40light.svg?alt=media" alt=""></picture><br>BathTub</p>                           |
|                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-0dd78b50cd3021e7302264e6f949f9d2fc4e10c7%2Ficon-battery-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-07a67d31a5b1370715d67b05773afe8abe69932f%2Ficon-battery-16%40light.svg?alt=media" alt=""></picture><br>Battery</p>                          |           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-23ec77df107a77ef2221551eb5c360dce67b2f36%2Ficon-battery-charging-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a635c806e54bb7d0584652bbd94df35344edefc6%2Ficon-battery-charging-16%40light.svg?alt=media" alt=""></picture><br>BatteryCharging</p>           |               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4a19ece97089d219e9b9e5e741d1c4255c1d8ee9%2Ficon-battery-disabled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-07e757e246cacf101451b95cd8495d10a708bfe9%2Ficon-battery-disabled-16%40light.svg?alt=media" alt=""></picture><br>BatteryDisabled</p>               |
|                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-dc2001c1d1863cfa2d154c8d1520fbbfffe1814d%2Ficon-bell-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-64c28fb83ea5f51ef9786a7e2de9041c83d5c535%2Ficon-bell-16%40light.svg?alt=media" alt=""></picture><br>Bell</p>                               |                <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2107f3c67f8b1236020775e7075e94ea4e5c3295%2Ficon-bell-disabled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d38b615531df6c48626c84f03fe50ec1f2cbd5b4%2Ficon-bell-disabled-16%40light.svg?alt=media" alt=""></picture><br>BellDisabled</p>               |                                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2ad4e27b6eeb592dfaef02be069ab48d8bb2d47e%2Ficon-bike-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-64fd009c94e5c794e9659a123b7c7b4001f805d6%2Ficon-bike-16%40light.svg?alt=media" alt=""></picture><br>Bike</p>                                |
|                      <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-be225e3e580b7280ebd44aa917568f526356fe41%2Ficon-binoculars-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-fcec613184ed6da78f63712749e86a796b68d32f%2Ficon-binoculars-16%40light.svg?alt=media" alt=""></picture><br>Binoculars</p>                      |                             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f56ebb12bf6a2ee3f6ebc520e123bc5e466be935%2Ficon-bird-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-32e941f7db7dfc66836889c9a71d1d59d5ab8f98%2Ficon-bird-16%40light.svg?alt=media" alt=""></picture><br>Bird</p>                            |                  <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ac479aaf9fc64945a60231fe5c7d8d6e5bfa5afd%2Ficon-blank-document-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a0062b0cbed96076ff93a85fc2371b379bf91381%2Ficon-blank-document-16%40light.svg?alt=media" alt=""></picture><br>BlankDocument</p>                  |
|                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-12821c9333ba46afbe26e306e672933047a21376%2Ficon-bluetooth-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-98c75cee8eee1e988e482ba955f678accd9ecba1%2Ficon-bluetooth-16%40light.svg?alt=media" alt=""></picture><br>Bluetooth</p>                       |                             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-459e896be268214b7410868700197be56b677584%2Ficon-boat-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-18e3bd8c6f981c45f1bb9d0184b96eeb8293e3c9%2Ficon-boat-16%40light.svg?alt=media" alt=""></picture><br>Boat</p>                            |                                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-111ab0d692dfef7fe760f07b814073301887a499%2Ficon-bold-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-69ba27d9388667552ecd8ce5be07a12b63f38a17%2Ficon-bold-16%40light.svg?alt=media" alt=""></picture><br>Bold</p>                                |
|                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4cf36b217e7c0c2c54392ba7deac9ac9e0d5029f%2Ficon-bolt-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-864f06e460825c6c3e6eddbc6d740934fbc9e599%2Ficon-bolt-16%40light.svg?alt=media" alt=""></picture><br>Bolt</p>                               |                <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7e93eff43f55d693e994988c2f0d4c309785f5c8%2Ficon-bolt-disabled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d87c107e2a26ce9e3f34c03f099e4c9917385d66%2Ficon-bolt-disabled-16%40light.svg?alt=media" alt=""></picture><br>BoltDisabled</p>               |                                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6864a5b1de6b6d64987e3a91e6806079b8629504%2Ficon-book-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8f16ebe7a98d343f36ccc2c9e41024d4ce4a5a70%2Ficon-book-16%40light.svg?alt=media" alt=""></picture><br>Book</p>                                |
|                         <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-64d41fa683d70a559bef350b571128c1503ec184%2Ficon-bookmark-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8a753fecc0291c6e59f361cb60f72120beb2a527%2Ficon-bookmark-16%40light.svg?alt=media" alt=""></picture><br>Bookmark</p>                         |                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b610e5a3e07b3e537dd0c3c214809214e7ed2c0c%2Ficon-box-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-3fab2e361116c9e0831a77d5037ba4847f35b76e%2Ficon-box-16%40light.svg?alt=media" alt=""></picture><br>Box</p>                              |                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8fa1d04e1c7a2ac68db25a5dd74641c36b8c2cec%2Ficon-brush-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-20bf2cbec839b0df6c2be67f1a40e82315edcda8%2Ficon-brush-16%40light.svg?alt=media" alt=""></picture><br>Brush</p>                               |
|                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4f687e156caaac9b561d31623106a2237a4917c7%2Ficon-speech-bubble-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f6ceb6c97c6529a29f5da50badbb7ec4c45f57e3%2Ficon-speech-bubble-16%40light.svg?alt=media" alt=""></picture><br>Bubble</p>                     |                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-754a39769fa604b868f8be9e3415341431d2383e%2Ficon-bug-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d843a0ef47b866eee6002b0d38fa260cea3ffbdd%2Ficon-bug-16%40light.svg?alt=media" alt=""></picture><br>Bug</p>                              |                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a80c744cc190bdcfd6fa0401be860b12ae3d5fd9%2Ficon-building-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-644a22d915512d151143109ade4e4d2c96bdf10b%2Ficon-building-16%40light.svg?alt=media" alt=""></picture><br>Building</p>                          |
|                  <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-47198556ad04a35bb2ee024a67bd8f6ca34096f5%2Ficon-bullet-points-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-da294c3a1dcfe9430cf828c0c458fed59db06215%2Ficon-bullet-points-16%40light.svg?alt=media" alt=""></picture><br>BulletPoints</p>                  |                      <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-0a303ee6466ae11e30e19b57f79fd0b7853df6d6%2Ficon-bulls-eye-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7e5479c0b73181dbdec95b8767f52946c9b37c8f%2Ficon-bulls-eye-16%40light.svg?alt=media" alt=""></picture><br>BullsEye</p>                     |                <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-659f0583d798354cb5685bcf3091a2cd64e4d4a3%2Ficon-bulls-eye-missed-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a78521fc317b509bc5eaecfa2fc77eb4fe26e826%2Ficon-bulls-eye-missed-16%40light.svg?alt=media" alt=""></picture><br>BullsEyeMissed</p>               |
|                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f01cdf079104bb91aa8a9e24a6f96960c8fe3f85%2Ficon-buoy-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9ab54883cd1e4f1695129d28ea85ad60f2cd8a32%2Ficon-buoy-16%40light.svg?alt=media" alt=""></picture><br>Buoy</p>                               |                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4e21fcdaee8cd26d086c5451c6742356638f3de1%2Ficon-calculator-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-228b1c6213873c738b4638355c7c0bc01f9cac7e%2Ficon-calculator-16%40light.svg?alt=media" alt=""></picture><br>Calculator</p>                   |                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-fe3287242b5bfafd41abdfc0aee1f9be4912e106%2Ficon-calendar-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d6da2a6e83f11e51bd2191627c36b07b541f7861%2Ficon-calendar-16%40light.svg?alt=media" alt=""></picture><br>Calendar</p>                          |
|                            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-0e30f20ab95d038b7c57c0b0ed5f31f9503c05b5%2Ficon-camera-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1d576282e6eccdb6c3faa5aeb46a31e8d61f3fbe%2Ficon-camera-16%40light.svg?alt=media" alt=""></picture><br>Camera</p>                            |                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9bb570695e917fe319979fd9d377f3dc24a32622%2Ficon-car-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9cba5a2729c44dbc626b95d3a208f9be1adb8fa9%2Ficon-car-16%40light.svg?alt=media" alt=""></picture><br>Car</p>                              |                                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-600606d4960b96478b256ea77363db4d3d7d6845%2Ficon-cart-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-3b93090fdb7953592a396f34ef0c18e2e975518a%2Ficon-cart-16%40light.svg?alt=media" alt=""></picture><br>Cart</p>                                |
|                                  <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8ae8da3432d39a8f3d2a03cb758a8a77638d2614%2Ficon-cd-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8ca4e2dd6a5b1ee31bdcb5db67d5a0d5b2264fd8%2Ficon-cd-16%40light.svg?alt=media" alt=""></picture><br>Cd</p>                                  |                          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-50703f7b35147e602fcf4643021b407bec5d6715%2Ficon-center-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f1fb06899c2b00a01660ab922db7464af52eb8ac%2Ficon-center-16%40light.svg?alt=media" alt=""></picture><br>Center</p>                         |                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5dc695a48e755da2fe9c59ff89b49fa1b06bc18e%2Ficon-check-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-097014fbdc3072afd51d850cb036177713ad29d1%2Ficon-check-16%40light.svg?alt=media" alt=""></picture><br>Check</p>                               |
|                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-296f018500a524732b8793b14791e450707ecc9a%2Ficon-check-circle-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c86e75dee3abd20b9a13844f2e14f5a349c9ef80%2Ficon-check-circle-16%40light.svg?alt=media" alt=""></picture><br>CheckCircle</p>                   |                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-72d8b7acb41eace9dddd3c1685cd60a61536c7cf%2Ficon-check-list-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-35973dd1dd44420a38cc7bbc0ab5c123d4608071%2Ficon-check-list-16%40light.svg?alt=media" alt=""></picture><br>CheckList</p>                    |                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-01a009cb1574032874cb006016a2ce1e9972a130%2Ficon-check-rosette-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e8ce7b08aaf148281cac5e240d9078d20f394dc6%2Ficon-check-rosette-16%40light.svg?alt=media" alt=""></picture><br>CheckRosette</p>                   |
|                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b5d189b3577958290360d962740cb9c9079b06c1%2Ficon-checkmark-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-3e720e9eb140e6e94656ed3362fb81db3658a56a%2Ficon-checkmark-16%40light.svg?alt=media" alt=""></picture><br>Checkmark</p>                       |                   <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c09ac3d81f58d7b18e5285fc91298de799ca461c%2Ficon-chess-piece-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ece43ae781f72bd96abf63f9103853fe9bfbf8ed%2Ficon-chess-piece-16%40light.svg?alt=media" alt=""></picture><br>ChessPiece</p>                  |                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8baa9908c2aef8a1b695feffbd7d8eedb3656d0d%2Ficon-chevron-down-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-99f728d90c7706083b6f31b4f27084bb0f8753b1%2Ficon-chevron-down-16%40light.svg?alt=media" alt=""></picture><br>ChevronDown</p>                     |
|           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1562660f5e07f94a4ef0a47901dd2f7d1b0668d3%2Ficon-chevron-down-small-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-232ba06f93c9af50df0769b47b75d9624e13861b%2Ficon-chevron-down-small-16%40light.svg?alt=media" alt=""></picture><br>ChevronDownSmall</p>           |                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b9a647bf899e69413cba48d439066627db40dc99%2Ficon-chevron-left-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-3369e450f11ae92225b50722552dcedba167efb1%2Ficon-chevron-left-16%40light.svg?alt=media" alt=""></picture><br>ChevronLeft</p>                 |             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a498c18c1e02f373c37901615ac03a060820b14e%2Ficon-chevron-left-small-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9b42b3ccdc7260e61507c4a560a34e079538f213%2Ficon-chevron-left-small-16%40light.svg?alt=media" alt=""></picture><br>ChevronLeftSmall</p>            |
|                  <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-76a340deff3a8455246ffd3b109831bc00e5329f%2Ficon-chevron-right-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-56af7bca92cab2544edc370d367329b32cab2691%2Ficon-chevron-right-16%40light.svg?alt=media" alt=""></picture><br>ChevronRight</p>                  |       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ca2c4bb6324012575aa36d810d81076ed4618fd9%2Ficon-chevron-right-small-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-dfb0cdb7334ad450f8c1ff86ffdf23d9e610cfec%2Ficon-chevron-right-small-16%40light.svg?alt=media" alt=""></picture><br>ChevronRightSmall</p>       |                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a5527e4413e7fcc193ca8de2137c517e0c81a542%2Ficon-chevron-up-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a4f1afcf3b5ab7db2e2f6bae7c2ca4b844fe5dcd%2Ficon-chevron-up-16%40light.svg?alt=media" alt=""></picture><br>ChevronUp</p>                        |
|                <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-347d0f71caa550f48e0720b2e47d6809bf9af5fc%2Ficon-chevron-up-down-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e9bc751bae2d7f54910d90d5605042aed4d98701%2Ficon-chevron-up-down-16%40light.svg?alt=media" alt=""></picture><br>ChevronUpDown</p>               |            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9eff4605d1dce2d260e34db8d1400bf8526d3dbb%2Ficon-chevron-up-small-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8fd49b00a662b599fcf613a4849aabc5588d6a0b%2Ficon-chevron-up-small-16%40light.svg?alt=media" alt=""></picture><br>ChevronUpSmall</p>           |                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-95753bb0d5f2bb271a2681d4a468090ce08ccff6%2Ficon-circle-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-020263cba37a7b5f7fc9797d43879d0f2a11da92%2Ficon-circle-16%40light.svg?alt=media" alt=""></picture><br>Circle</p>                             |
|               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2630e02c6d61c6c85f8b2b5fa0cc5251ded1ac46%2Ficon-circle-disabled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-864d66eeac3630f9bf4158997de16299421aa94b%2Ficon-circle-disabled-16%40light.svg?alt=media" alt=""></picture><br>CircleDisabled</p>               |             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2d58acafccf368fa28b9556934d3fdde55480130%2Ficon-circle-ellipsis-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-41abad7f06f5ec69cff35325ce7ad7baec94ed60%2Ficon-circle-ellipsis-16%40light.svg?alt=media" alt=""></picture><br>CircleEllipsis</p>            |                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e98cd65c295182ac3801f1cda2fb5fcc2095ee7e%2Ficon-circle-filled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f939eff393b90ba2686f21c81715c64452e15e5f%2Ficon-circle-filled-16%40light.svg?alt=media" alt=""></picture><br>CircleFilled</p>                   |
|               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-58d9f6bc84f72007269a94bed7ac46ba710841b1%2Ficon-circle-progress-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8047c5fb807838719094696b0e55bc72aa62dc05%2Ficon-circle-progress-16%40light.svg?alt=media" alt=""></picture><br>CircleProgress</p>               |       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c6334ba6c7c036e4dd24215588fcc20036cd834a%2Ficon-circle-progress-100-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-bc8522224c56f4c5c0f81ecbd0feb6f5cebb4548%2Ficon-circle-progress-100-16%40light.svg?alt=media" alt=""></picture><br>CircleProgress100</p>       |             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-af935389ade4bf9f57dd7f80a2114e9cfe22c9f3%2Ficon-circle-progress-25-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ad13ed736d62d130a0af380ad2cabbdc66f92168%2Ficon-circle-progress-25-16%40light.svg?alt=media" alt=""></picture><br>CircleProgress25</p>            |
|           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a3cf7511c13840f2343680e4f7509f4f585fdfe0%2Ficon-circle-progress-50-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c931f558d9cca9a41473d090051b1488941f7478%2Ficon-circle-progress-50-16%40light.svg?alt=media" alt=""></picture><br>CircleProgress50</p>           |         <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7a8a9b12bd8dc25e1323e605b9b932b0628ee0d1%2Ficon-circle-progress-75-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-558c005d11118fd5073105660545342c8c32b715%2Ficon-circle-progress-75-16%40light.svg?alt=media" alt=""></picture><br>CircleProgress75</p>        |               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-0ed4a2224084b653ccdb3a45af12c34fd99f151e%2Ficon-clear-formatting-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2d29baa828fbb9f3534de9c993d1d04b991373f0%2Ficon-clear-formatting-16%40light.svg?alt=media" alt=""></picture><br>ClearFormatting</p>               |
|                   <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8052c6bc5de1ae562a31e1c81028ffff181026bd%2Ficon-copy-clipboard-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e9b5fc5f692eb1569faad9e9a8505bff7b921c46%2Ficon-copy-clipboard-16%40light.svg?alt=media" alt=""></picture><br>Clipboard</p>                  |                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-59c28cf455dbc770cf5c89e8e6ee40528ed5ec53%2Ficon-clock-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-01d08a691ca393969a23c19eadc0079397ecff23%2Ficon-clock-16%40light.svg?alt=media" alt=""></picture><br>Clock</p>                           |                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-228b2cd49fc4ebfa4358d27074beb542ed570ccc%2Ficon-cloud-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-48b191c57a0671913ab4f5758f36b7d3ce7f9e14%2Ficon-cloud-16%40light.svg?alt=media" alt=""></picture><br>Cloud</p>                               |
|               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-77dacf119461bf85a1611bb23aca764ab8110093%2Ficon-cloud-lightning-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9ecd30e61f0f3d7f68b0b02402de1fd2f441643e%2Ficon-cloud-lightning-16%40light.svg?alt=media" alt=""></picture><br>CloudLightning</p>               |                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c8e83c7eee3f76f6c2bf1a7e58395929400b762e%2Ficon-cloud-rain-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-06c060f8142d3ffc7a628854efc6f7295122e69a%2Ficon-cloud-rain-16%40light.svg?alt=media" alt=""></picture><br>CloudRain</p>                    |                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-3debb5be9c4ffcf264459a7f872c89aad59fa991%2Ficon-cloud-snow-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7192c653e78a3902d694f5f7c73da23b281fb4af%2Ficon-cloud-snow-16%40light.svg?alt=media" alt=""></picture><br>CloudSnow</p>                        |
|                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e504f3de833d51debed9677e731bc47055ce1b3f%2Ficon-cloud-sun-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-988f493c3536cf311a2faff40ba6484a9a682338%2Ficon-cloud-sun-16%40light.svg?alt=media" alt=""></picture><br>CloudSun</p>                        |                             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ae130b17da3fe4e08a8ee5ca43a8ae57a6260ed5%2Ficon-code-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-fcd1a26c4ff74653c060103298c222a3533f7e80%2Ficon-code-16%40light.svg?alt=media" alt=""></picture><br>Code</p>                            |                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1601352d50ee456f308e57c6718882059372ab27%2Ficon-code-block-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-11c03e5bbe072d56a358889955c6005610ba09fa%2Ficon-code-block-16%40light.svg?alt=media" alt=""></picture><br>CodeBlock</p>                        |
|                                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-569cf615a9665d9b444c7f74795fcf0c35eec5ff%2Ficon-cog-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d705ca7fcd26d23dc71f03d6fbbda0d2ee4bec58%2Ficon-cog-16%40light.svg?alt=media" alt=""></picture><br>Cog</p>                                |                             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8f2b0418b31bf28bc8d9e0437284f45d4f45eadc%2Ficon-coin-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5d3a8a80ebfbf80d482978ed945e0b7aa06d8db5%2Ficon-coin-16%40light.svg?alt=media" alt=""></picture><br>Coin</p>                            |                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-10b9ac0de046a9aa7e0d6d1bef1024e4869b4e4e%2Ficon-coins-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-420f3fb4401a54284284e1b7bac8f53bac4b5018%2Ficon-coins-16%40light.svg?alt=media" alt=""></picture><br>Coins</p>                               |
|                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-221283272abe1fdd02a7746f06fbcd1bca51ad2e%2Ficon-command-symbol-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-38f4be7b113d9efac818f75c98dda1f40f4ca7ce%2Ficon-command-symbol-16%40light.svg?alt=media" alt=""></picture><br>CommandSymbol</p>                |                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7eb51493f9162b3b901d6ed5797688d6e453279a%2Ficon-compass-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-06e6f6ab5c605473efc8458e3698b9a7a53032a1%2Ficon-compass-16%40light.svg?alt=media" alt=""></picture><br>Compass</p>                        |                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-183cc1e914e9750bf1260893a8e553abefd72c2e%2Ficon-computer-chip-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d00435cc27fb5d49c83fcf1dc10674974fc7be7d%2Ficon-computer-chip-16%40light.svg?alt=media" alt=""></picture><br>ComputerChip</p>                   |
|                         <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b0f22a8bab0dd3bbf83125111d686fc523e2237c%2Ficon-contrast-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f47c446986d1743fb20af4a686bd8b13b56ce8e6%2Ficon-contrast-16%40light.svg?alt=media" alt=""></picture><br>Contrast</p>                         |              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8052c6bc5de1ae562a31e1c81028ffff181026bd%2Ficon-copy-clipboard-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e9b5fc5f692eb1569faad9e9a8505bff7b921c46%2Ficon-copy-clipboard-16%40light.svg?alt=media" alt=""></picture><br>CopyClipboard</p>              |                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-53835e5ede86e305ce41a7b149744b828181c974%2Ficon-credit-card-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-de23deaf26108d4d9c899ebd94df2e68e5da1ed1%2Ficon-credit-card-16%40light.svg?alt=media" alt=""></picture><br>CreditCard</p>                      |
|                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-dc41dc33156fbdb96b8ec85d3a9ff5dec4714bba%2Ficon-cricket-ball-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ab0f36d9bfc3f5ebce9c0f62d572d4f4cef6796c%2Ficon-cricket-ball-16%40light.svg?alt=media" alt=""></picture><br>CricketBall</p>                   |                             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1097f74400d125d9929eaa8c27a91eed2243c481%2Ficon-crop-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e13f6ad1fe73e1672286be3401943b4741b437f6%2Ficon-crop-16%40light.svg?alt=media" alt=""></picture><br>Crop</p>                            |                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-44ba797e8c389e71943dd9c95e93819512de7962%2Ficon-crown-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5fcaef157850226a2fb93a6e0a2152ae2e4a60b1%2Ficon-crown-16%40light.svg?alt=media" alt=""></picture><br>Crown</p>                               |
|                            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5390bc30fc971214c7409901d243fa2ac38b89ec%2Ficon-crypto-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6555b045fada98f9fc8ebe08ad66ecfafd5e5ff7%2Ficon-crypto-16%40light.svg?alt=media" alt=""></picture><br>Crypto</p>                            |             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-050315736cc51b88f03059b2ce2876ed7bcc208c%2Ficon-delete-document-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ee597690985b05e72adcc2bb8c1340578ea03b09%2Ficon-delete-document-16%40light.svg?alt=media" alt=""></picture><br>DeleteDocument</p>            |                            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f900226448d501af3739e0c561188737729304fc%2Ficon-desktop-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5d138ae05579039936dff176c55173dde645599b%2Ficon-desktop-16%40light.svg?alt=media" alt=""></picture><br>Desktop</p>                            |
|                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4445e464a9fbc9e26e3fcd615ce0787d22759475%2Ficon-devices-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-dad9f4710293a0f0eb10c9c0ffd949f775b3a0be%2Ficon-devices-16%40light.svg?alt=media" alt=""></picture><br>Devices</p>                          |                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-349e82c8faba659ab5e540ca82b04eb030cad049%2Ficon-dna-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9815aeb0ce45f20913a84a98d6db3b2223f37476%2Ficon-dna-16%40light.svg?alt=media" alt=""></picture><br>Dna</p>                              |                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ac479aaf9fc64945a60231fe5c7d8d6e5bfa5afd%2Ficon-blank-document-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a0062b0cbed96076ff93a85fc2371b379bf91381%2Ficon-blank-document-16%40light.svg?alt=media" alt=""></picture><br>Document</p>                    |
|                                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-78cb40b479e588c2e4d23320a382184038839977%2Ficon-dot-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4fe272faeb1cd19a326e6c06b86fadeae9d76f06%2Ficon-dot-16%40light.svg?alt=media" alt=""></picture><br>Dot</p>                                |                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a9778c7d4d434264420c6749ad2dc020edda3ce9%2Ficon-download-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-775ef27747bc5488d91dece8c77bfedb431d447e%2Ficon-download-16%40light.svg?alt=media" alt=""></picture><br>Download</p>                      |                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-caec45c62cdb3bb023539c6728dfb37b23b584b0%2Ficon-droplets-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2877fe22a3b66a031b9f9b8a66d1dbb04238fd1d%2Ficon-droplets-16%40light.svg?alt=media" alt=""></picture><br>Droplets</p>                          |
|                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-fe1c031f76d0f9f90267410d3f7e8e4a316ecdd3%2Ficon-duplicate-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-3108d33656540342e55741192750bcb5854a90f3%2Ficon-duplicate-16%40light.svg?alt=media" alt=""></picture><br>Duplicate</p>                       |                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-58d4ce993c6e810c6827baa6885e03fe8135ed4f%2Ficon-edit-shape-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c426367bbb07c94e54d17c47286c7940dc041aba%2Ficon-edit-shape-16%40light.svg?alt=media" alt=""></picture><br>EditShape</p>                    |                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ffb0c87407fda4db5b10a9b1e72f84b5a28f78e9%2Ficon-eject-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-12a1bf3238989cb9ff87767f0442f510d13732e4%2Ficon-eject-16%40light.svg?alt=media" alt=""></picture><br>Eject</p>                               |
|                         <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-0c334ad9b7df6d83bfa937b7e1380970ccbf3d8c%2Ficon-ellipsis-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-80673a211db1c7f0ee0eb041fb4e03a75f607405%2Ficon-ellipsis-16%40light.svg?alt=media" alt=""></picture><br>Ellipsis</p>                         |          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-892371c6cd86fcd3bd986994c29d973a52eec2d3%2Ficon-ellipsis-vertical-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a7d46d168daece01d0910f090625077ef8e28230%2Ficon-ellipsis-vertical-16%40light.svg?alt=media" alt=""></picture><br>EllipsisVertical</p>         |                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8b43176c1537f3e2007e80c8063170e334415bfe%2Ficon-emoji-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-eb1dab8f284a679e7ac29a8cbc08fe91b693b1f7%2Ficon-emoji-16%40light.svg?alt=media" alt=""></picture><br>Emoji</p>                               |
|                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7e1ec28267a6b0f043345d76bb0d6156b93fbe8b%2Ficon-emoji-sad-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6cfa21721805e6d06189e95b85b1bbabe90e7c89%2Ficon-emoji-sad-16%40light.svg?alt=media" alt=""></picture><br>EmojiSad</p>                        |                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d15a8a62e5728033c25e8268a2c4d1a7c7d7ce26%2Ficon-envelope-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-39af1e59537706f714102983c9805863168ea8fb%2Ficon-envelope-16%40light.svg?alt=media" alt=""></picture><br>Envelope</p>                      |                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f0384efe6050111b8f9c502e9c8420f74e3d3a5c%2Ficon-eraser-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a5725fd9d52e8a7fd669c285e95cacf344da5718%2Ficon-eraser-16%40light.svg?alt=media" alt=""></picture><br>Eraser</p>                             |
|                  <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6a586dc1f0924c1ce0714488b06802da99ec2401%2Ficon-important-01-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6274eb99b2f316ec34d50b3ce6c0213fcb8c2ed9%2Ficon-important-01-16%40light.svg?alt=media" alt=""></picture><br>ExclamationMark</p>                 |            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-800e205213353418070108eb2bf24a5073f4b0fd%2Ficon-exclamationmark-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ca0cf23e31d63d434f5b0ebd9be9ba8f2bac2af8%2Ficon-exclamationmark-16%40light.svg?alt=media" alt=""></picture><br>Exclamationmark</p>            |              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9be247a28db3bbd313336cb4bbeb24fc468efa2c%2Ficon-exclamationmark-2-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-95addb662c7b059c9db3c0efb06ac0a2f33823b2%2Ficon-exclamationmark-2-16%40light.svg?alt=media" alt=""></picture><br>Exclamationmark2</p>             |
|            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8da3268dc6eb4c905da8f15ef59110e37193b0b8%2Ficon-exclamationmark-3-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5b612de0ef427201b66052cb56ddd129e80343ce%2Ficon-exclamationmark-3-16%40light.svg?alt=media" alt=""></picture><br>Exclamationmark3</p>            |                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-fa5ebdb3a2b66938f66371ddaf5e6817122e934a%2Ficon-eye-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f44baab531e3a0563b83e26fab6b388354bfee4f%2Ficon-eye-16%40light.svg?alt=media" alt=""></picture><br>Eye</p>                              |                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e6706301d2c9535a25973044da60b620cbcb89e6%2Ficon-eye-disabled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4b3d045e166708386e1d153477f5ce1178deec51%2Ficon-eye-disabled-16%40light.svg?alt=media" alt=""></picture><br>EyeDisabled</p>                     |
|                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9985f8cc18c70f905e59434449eb18229f4df174%2Ficon-eye-dropper-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5544918e3761cb1cae452b51cd1232819127893b%2Ficon-eye-dropper-16%40light.svg?alt=media" alt=""></picture><br>EyeDropper</p>                     |                          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-04d4dea649161fde5fc7b080e5894f4427363bd3%2Ficon-female-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ed653a3b987f1292dacf1892c3a9cea920e99b69%2Ficon-female-16%40light.svg?alt=media" alt=""></picture><br>Female</p>                         |                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-fde0fd9399e68243cd8b6c8bc296c27a72d138b3%2Ficon-film-strip-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-50366952e836c094aa7939a94e7a8bdb6a233218%2Ficon-film-strip-16%40light.svg?alt=media" alt=""></picture><br>FilmStrip</p>                        |
|                            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ae6bdb106ef12a33a11b3915df1e8c2049a53f7f%2Ficon-filter-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9c5d674b8f48c4eae2d722e44fe45c3ad3e7aa93%2Ficon-filter-16%40light.svg?alt=media" alt=""></picture><br>Filter</p>                            |                          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d6d97bce5191f753b8816938e2c314b9e3b897e1%2Ficon-finder-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-dd4d013129e8eb2bac2d391a0c12a02d4f786aea%2Ficon-finder-16%40light.svg?alt=media" alt=""></picture><br>Finder</p>                         |                      <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f1db1fe76ac5ce4b4d9958c5889e7bf4a1f30dc2%2Ficon-fingerprint-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2b3373d4cd0e1b52c256d8cc4b4224730b753ce7%2Ficon-fingerprint-16%40light.svg?alt=media" alt=""></picture><br>Fingerprint</p>                      |
|                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-92d5d2886abfed109eae00c948ab6372428df4f9%2Ficon-flag-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-98c980f040d1fe6948cf3cd9685003eea902100d%2Ficon-flag-16%40light.svg?alt=media" alt=""></picture><br>Flag</p>                               |                          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7b47641a4a26387041fab27ea9e637e69a068e20%2Ficon-folder-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-88379fdc547db1f1e95b99ea5ac077bdb44c6fae%2Ficon-folder-16%40light.svg?alt=media" alt=""></picture><br>Folder</p>                         |                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-3dc48dfd04eb9809399bbe74c583353d0e3b4c29%2Ficon-footprints-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d90cc1e8d17569d3f73d396da5f705b8d6b4aaec%2Ficon-footprints-16%40light.svg?alt=media" alt=""></picture><br>Footprints</p>                       |
|                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4a09497790984b2069a2e62cdd868b8c03f898c3%2Ficon-forward-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-dddf67f102d275fbd849b19ccd2f3d1bc541047c%2Ficon-forward-16%40light.svg?alt=media" alt=""></picture><br>Forward</p>                          |              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-bfbb856ec1247713d7381e894b3bea6b63a84b01%2Ficon-forward-filled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b9a7bedf5802fd19f535ad231191d83f92fb68cc%2Ficon-forward-filled-16%40light.svg?alt=media" alt=""></picture><br>ForwardFilled</p>              |                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-01e66848a925f7c0724a0cba3d13e0bc40061bd8%2Ficon-fountain-tip-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8b853545f5adcdd8c4c76b923f6055e5ba7cf4d6%2Ficon-fountain-tip-16%40light.svg?alt=media" alt=""></picture><br>FountainTip</p>                     |
|                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ab1a79ce855a5e2325acfe3ba30576ac39b27b84%2Ficon-full-signal-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-46ee1d034eaae848f49860018fb3264e95a0e7f7%2Ficon-full-signal-16%40light.svg?alt=media" alt=""></picture><br>FullSignal</p>                     |             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e2e746b64c21723c5ad1432328c151fcd30bff32%2Ficon-game-controller-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-cf63f53cf45075b4bbe7a769ccfb62a1b7e70a06%2Ficon-game-controller-16%40light.svg?alt=media" alt=""></picture><br>GameController</p>            |                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9a838dea2f07cc7c0961b31e3906b04d41afe407%2Ficon-gauge-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b075b4f03590924a57bfca4c5ea4987cea12e3fc%2Ficon-gauge-16%40light.svg?alt=media" alt=""></picture><br>Gauge</p>                               |
|                                <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-569cf615a9665d9b444c7f74795fcf0c35eec5ff%2Ficon-cog-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d705ca7fcd26d23dc71f03d6fbbda0d2ee4bec58%2Ficon-cog-16%40light.svg?alt=media" alt=""></picture><br>Gear</p>                                |                          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c99a98f21abe1aaaa3abcebcc9d8c1e8bfc80ff3%2Ficon-geopin-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-3ca59e32e6cb7dee772780f86f46deb2534108eb%2Ficon-geopin-16%40light.svg?alt=media" alt=""></picture><br>Geopin</p>                         |                                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-0e47517ba0009868bae51d3e98900d6f0773ca5f%2Ficon-germ-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-cd6bc86df498818ace66a7f41f5af76a176fe251%2Ficon-germ-16%40light.svg?alt=media" alt=""></picture><br>Germ</p>                                |
|                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-24f2923b6624168813654b1a33572aef16316fcc%2Ficon-gift-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-44208c6088ccfcc96c97d7cfea8d052e9af9750b%2Ficon-gift-16%40light.svg?alt=media" alt=""></picture><br>Gift</p>                               |                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-20df6b6cceba56f75687e1332cb7b996f781eeec%2Ficon-glasses-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-371ff5324cf47dcbab0d3e033c7ba5f253098479%2Ficon-glasses-16%40light.svg?alt=media" alt=""></picture><br>Glasses</p>                        |                            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-135fa18171fdd32cecae0700b13f66616462335e%2Ficon-globe-01-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7f8e387f137b1f38fc765c34a8c952c6d5b680ff%2Ficon-globe-01-16%40light.svg?alt=media" alt=""></picture><br>Globe</p>                            |
|                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8a22606568373c7ae5f6c7537806653bfc423c62%2Ficon-goal-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7e0cb9f6f3bb07f175de978842244bc1e61fc728%2Ficon-goal-16%40light.svg?alt=media" alt=""></picture><br>Goal</p>                               |                          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a70397cd8a8f1722092b5f9c02f0b455c9900e10%2Ficon-hammer-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-470f011e1f82b39e0fc36c7a05c5ef9c4f82980f%2Ficon-hammer-16%40light.svg?alt=media" alt=""></picture><br>Hammer</p>                         |                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-977a566451d50d4d33229c73a2c4bc589984cfe7%2Ficon-hard-drive-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-189ceb1326aae007254d2e89f865dadc15c85220%2Ficon-hard-drive-16%40light.svg?alt=media" alt=""></picture><br>HardDrive</p>                        |
|                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-21a7a66e01f97bac32d63cff1090a74ec41273a1%2Ficon-hashtag-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7ac81a183a0cfd36211bd54c3811ccb0d90e71c0%2Ficon-hashtag-16%40light.svg?alt=media" alt=""></picture><br>Hashtag</p>                          |                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-254f4a43a6e976223460a02845684378266477f2%2Ficon-heading-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-bf5f06147e9dddadad44721246cfe843302aeff6%2Ficon-heading-16%40light.svg?alt=media" alt=""></picture><br>Heading</p>                        |                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-03d019d5ef07b61379bc053bc74ac128059c56ae%2Ficon-headphones-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1484af06327d702f0df70c6ec4d865de39c36e97%2Ficon-headphones-16%40light.svg?alt=media" alt=""></picture><br>Headphones</p>                       |
|                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-63e087106fb61ad9a01263f73327ff8ca8e58f79%2Ficon-heart-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-40ac925ba7ad8239d00d4e76c7eb92669abc05c1%2Ficon-heart-16%40light.svg?alt=media" alt=""></picture><br>Heart</p>                             |              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a5492c0b5e3e7e23768c3fc98920b614be71fa65%2Ficon-heart-disabled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-16e9b8aab9ae13ee7182219984475b109abe6f25%2Ficon-heart-disabled-16%40light.svg?alt=media" alt=""></picture><br>HeartDisabled</p>              |                         <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d3ae78957d2082a8db5394177fbd29d951f352ec%2Ficon-heartbeat-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b2c6815f3c42fddfc42739447436d51c0168a172%2Ficon-heartbeat-16%40light.svg?alt=media" alt=""></picture><br>Heartbeat</p>                         |
|                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e1e40355b12fd5bc198d023b84ec1195b10de04d%2Ficon-highlight-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d8dceef8388a280607cf5f6316af18fab6fcde76%2Ficon-highlight-16%40light.svg?alt=media" alt=""></picture><br>Highlight</p>                       |                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-312ca0613ca0301844e6ab99812d6e1a10b478c3%2Ficon-hourglass-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ce0874a5b8a5583a47585120e2d932ac3be68618%2Ficon-hourglass-16%40light.svg?alt=media" alt=""></picture><br>Hourglass</p>                     |                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7bed2054f7367fec9b986f334415db9898ea74ec%2Ficon-house-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a61373cbce98a4a9c0602e1eb35f172ff8d3005b%2Ficon-house-16%40light.svg?alt=media" alt=""></picture><br>House</p>                               |
|                         <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c30a52951ad3153066e33217c1f32bd83080ca16%2Ficon-humidity-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-51eab87f5635d967b819c7894eb93485e05150a8%2Ficon-humidity-16%40light.svg?alt=media" alt=""></picture><br>Humidity</p>                         |                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-90f64033b27c71e5f0d1884783567d8a74714b93%2Ficon-image-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d16127721501853b0db2b463070337cd4b8ea0fb%2Ficon-image-16%40light.svg?alt=media" alt=""></picture><br>Image</p>                           |                      <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6a586dc1f0924c1ce0714488b06802da99ec2401%2Ficon-important-01-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6274eb99b2f316ec34d50b3ce6c0213fcb8c2ed9%2Ficon-important-01-16%40light.svg?alt=media" alt=""></picture><br>Important</p>                      |
|                            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-51684b1e9dc8d4ef5b742d69c9bab8f3d21945c8%2Ficon-info-01-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-960d1c2191a064629d152be3dec29b7e43100a73%2Ficon-info-01-16%40light.svg?alt=media" alt=""></picture><br>Info</p>                            |                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-61375c5a0add1672884b3cbf2029e6ebb3545b99%2Ficon-italics-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-529869f00b3d7b2b2616174ec6b2c2d5ac7f29a5%2Ficon-italics-16%40light.svg?alt=media" alt=""></picture><br>Italics</p>                        |                                  <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-da6db8d7cb1c5c0c67796abefd2c6d6dc9374fcf%2Ficon-key-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8a197cc7336248a75e71903df6a939e8c21c7956%2Ficon-key-16%40light.svg?alt=media" alt=""></picture><br>Key</p>                                  |
|                         <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-fea7b72949b01d7ef928a2bc2d02cfa97bab67ee%2Ficon-keyboard-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f80f32a35bf97c3d346979afbd63bed35e762af9%2Ficon-keyboard-16%40light.svg?alt=media" alt=""></picture><br>Keyboard</p>                         |                          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f70d2f271523ccb657325fddd8d0b181d88e8a07%2Ficon-layers-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-0f6af67d0bbf9514fbc60906495a3986c46e47f5%2Ficon-layers-16%40light.svg?alt=media" alt=""></picture><br>Layers</p>                         |                      <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-637973da24a2828a3cf727f5b0b1e5468ed153f0%2Ficon-leaderboard-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-3adfbca82016521c97780e875bd75a0f506d46be%2Ficon-leaderboard-16%40light.svg?alt=media" alt=""></picture><br>Leaderboard</p>                      |
|                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-666d6949fd27139416b8ab0c131ab18ae8868ae4%2Ficon-leaf-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6c4656dd344dbe46790f9b6dcde500947d62b9eb%2Ficon-leaf-16%40light.svg?alt=media" alt=""></picture><br>Leaf</p>                               |                      <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7ae43931ebb35675244640e443e873d342d30c23%2Ficon-signal-2-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-312528d9c018e01b4c7dc9e8bfeb085bcbdeb643%2Ficon-signal-2-16%40light.svg?alt=media" alt=""></picture><br>LevelMeter</p>                     |                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-377e4dfb3689e79763deaef94d70a588a630b768%2Ficon-light-bulb-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e672aa2ea7466f916dcd823cb64530c39c3eb90c%2Ficon-light-bulb-16%40light.svg?alt=media" alt=""></picture><br>LightBulb</p>                        |
|                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9c5707bc16c64eaef2009092da1a61b78195fd1e%2Ficon-light-bulb-off-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-95b37e006b43a12ded95c850438c7166a9f94465%2Ficon-light-bulb-off-16%40light.svg?alt=media" alt=""></picture><br>LightBulbOff</p>                 |                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-61a4d46e06ad436fa468566fa71aafb26597d12d%2Ficon-line-chart-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-33a88d997d9672d475a1b96803e272462bfffc07%2Ficon-line-chart-16%40light.svg?alt=media" alt=""></picture><br>LineChart</p>                    |                                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-585a806f5695f292feaa10b68179cfd3d403a562%2Ficon-link-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-76521bbba129f9ea8067a421d8dffce7c37ef740%2Ficon-link-16%40light.svg?alt=media" alt=""></picture><br>Link</p>                                |
|                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-69cc5a681d90fbe8dc6a9b817b00da3e225fae7a%2Ficon-app-window-list-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-fa30351029ea60661d722cc07e3b0bc2110f45f8%2Ficon-app-window-list-16%40light.svg?alt=media" alt=""></picture><br>List</p>                    |                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-cbffeeab1b1b94cc7f08ea551ef50d33ecf96480%2Ficon-livestream-01-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-40169730d75ffd2a6c4cc8e3a552632d029a8d6b%2Ficon-livestream-01-16%40light.svg?alt=media" alt=""></picture><br>Livestream</p>                |        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e2e3f015ce5577f7ddfbf341d298b69e6f096a61%2Ficon-livestream-disabled-01-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-290c446fd52335940dfb63694a7108a6978c1971%2Ficon-livestream-disabled-01-16%40light.svg?alt=media" alt=""></picture><br>LivestreamDisabled</p>       |
|                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-18f0b7c54ce215eb0358a207d9e85405a52019ae%2Ficon-lock-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-09b3305848716c6481f48ab8aa9c2833cebea221%2Ficon-lock-16%40light.svg?alt=media" alt=""></picture><br>Lock</p>                               |                <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d803de3e6dc48fbd6464fc3620c4c7d92922618a%2Ficon-lock-disabled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4b5da80c3c601c4c971b43f2299bd56f03fe0c78%2Ficon-lock-disabled-16%40light.svg?alt=media" alt=""></picture><br>LockDisabled</p>               |                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e2545379b0c0e59254aa102542d115221c807632%2Ficon-lock-unlocked-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-620ec6cec3bad2512b8811f7b027f6501094b7f7%2Ficon-lock-unlocked-16%40light.svg?alt=media" alt=""></picture><br>LockUnlocked</p>                   |
|                            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-16bafdd4ae3ced685f6937958d7ec05b003cc96d%2Ficon-logout-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1257d5531a8be249fc82eb71bd55c2f64cf34f9f%2Ficon-logout-16%40light.svg?alt=media" alt=""></picture><br>Logout</p>                            |                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-763f2140dab0c5c8d8c97c72ef6982649fc07c30%2Ficon-lorry-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-39163c1c9e3eb5214a4bf093207bf56968f7657e%2Ficon-lorry-16%40light.svg?alt=media" alt=""></picture><br>Lorry</p>                           |                         <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-013b8a708bd2e298a319229c410791f79fe84289%2Ficon-lowercase-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7abf9ef6679d71cbd56c9bb321b8da3b16bc5ca6%2Ficon-lowercase-16%40light.svg?alt=media" alt=""></picture><br>Lowercase</p>                         |
|              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-adc7d4c682d7eafc940f257c2ad6c821c1358556%2Ficon-magnifying-glass-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b95ba6cefeefacd2d9f1208dd75d72fa08ba9a2a%2Ficon-magnifying-glass-16%40light.svg?alt=media" alt=""></picture><br>MagnifyingGlass</p>             |                             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8096d9f1391096a2079bdcd9f2da397064915e4b%2Ficon-male-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f76ad8b663ec38eba33372154a540b376e4a6568%2Ficon-male-16%40light.svg?alt=media" alt=""></picture><br>Male</p>                            |                                  <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-74e259ce5456766e87510159642394c6a7196ce6%2Ficon-map-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c39f3032d965f6197cc19171b27b5f021f75d371%2Ficon-map-16%40light.svg?alt=media" alt=""></picture><br>Map</p>                                  |
|                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a0114569a25bc65efd4ba2deaab1e930c2ccefbc%2Ficon-mask-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5560607bfad4eb95cc3c219d145cb83386a44365%2Ficon-mask-16%40light.svg?alt=media" alt=""></picture><br>Mask</p>                               |                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b5a2f0e1638cfe6a6f5d20d600ed30357f149600%2Ficon-maximize-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d5d19bab34d0970c24075da7e2cb2ff4662c0fd0%2Ficon-maximize-16%40light.svg?alt=media" alt=""></picture><br>Maximize</p>                      |                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ecddd4b661d560b8997636d7c9120864a2364eae%2Ficon-medical-support-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c56548f7114569bd63b599d3d89d58b163026682%2Ficon-medical-support-16%40light.svg?alt=media" alt=""></picture><br>MedicalSupport</p>                |
|                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-3e363f2dad07189fe263e03ec4f1c4b2af98f800%2Ficon-megaphone-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-33470f1ea20425cfdb3d0c8a5693f30a5b661157%2Ficon-megaphone-16%40light.svg?alt=media" alt=""></picture><br>Megaphone</p>                       |                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-183cc1e914e9750bf1260893a8e553abefd72c2e%2Ficon-computer-chip-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d00435cc27fb5d49c83fcf1dc10674974fc7be7d%2Ficon-computer-chip-16%40light.svg?alt=media" alt=""></picture><br>MemoryChip</p>                |                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-995687228a0ae9d52c6dd85eb1b16df265b24b7f%2Ficon-memory-stick-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5e2c77209b4b5bbd80b68659ad63e532f16abf8a%2Ficon-memory-stick-16%40light.svg?alt=media" alt=""></picture><br>MemoryStick</p>                     |
|                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4f687e156caaac9b561d31623106a2237a4917c7%2Ficon-speech-bubble-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f6ceb6c97c6529a29f5da50badbb7ec4c45f57e3%2Ficon-speech-bubble-16%40light.svg?alt=media" alt=""></picture><br>Message</p>                    |                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5e11bdc558a6d46963bbfa3be325d6089e6eb87a%2Ficon-microphone-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d2df08159dd75b256c92bf37c93138672b749c0a%2Ficon-microphone-16%40light.svg?alt=media" alt=""></picture><br>Microphone</p>                   |           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-978756b7983b806d62bf4a8d0ec05340611992dc%2Ficon-microphone-disabled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b2c481e73342b70507674ef6e681503fccb88488%2Ficon-microphone-disabled-16%40light.svg?alt=media" alt=""></picture><br>MicrophoneDisabled</p>          |
|                         <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9229d4510f5d1ba126bda5c1d7c34796479b800c%2Ficon-minimize-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b49a0e5d22be32a73bc3904049359a3c07f78dd8%2Ficon-minimize-16%40light.svg?alt=media" alt=""></picture><br>Minimize</p>                         |                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7edff94310dad5b7d4818eec442503578d6210cd%2Ficon-minus-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ba05d14d07bfb0dbd626e4746fe7cd52ecae633e%2Ficon-minus-16%40light.svg?alt=media" alt=""></picture><br>Minus</p>                           |                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-979bee25b3a69579b20ca428899c429d72412a79%2Ficon-minus-circle-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ca5df480994a2d429d67a163a643a4187660e8f9%2Ficon-minus-circle-16%40light.svg?alt=media" alt=""></picture><br>MinusCircle</p>                     |
|          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b90dff6032f046a8ef7e98e2710a15b0af08a8bc%2Ficon-minus-circle-filled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5c8a37bdac69a36a72272cdac56cd7cdea0e69df%2Ficon-minus-circle-filled-16%40light.svg?alt=media" alt=""></picture><br>MinusCircleFilled</p>         |                          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1745bd7336f35c832c061e2f3c700387505b172e%2Ficon-mobile-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-dccfd8948782ada929a5005eb354811f27847f6b%2Ficon-mobile-16%40light.svg?alt=media" alt=""></picture><br>Mobile</p>                         |                            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e0a09ab323e11bab418b5c9635485521a33122e9%2Ficon-monitor-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c5adbfa0956938104a30170ba5c09bb47ce9097c%2Ficon-monitor-16%40light.svg?alt=media" alt=""></picture><br>Monitor</p>                            |
|                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6ecf2a3cc7df74f2c2903d53ae4f822ed6ba89a9%2Ficon-moon-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-bb8489278417539a605cbd5f43bae3bbe5005a37%2Ficon-moon-16%40light.svg?alt=media" alt=""></picture><br>Moon</p>                               |                      <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-724cae5149db973cf9a413bb2a3adde8803301a7%2Ficon-moon-down-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c80d17c8ac5de644ca2ab0158ac3aca88ace99ad%2Ficon-moon-down-16%40light.svg?alt=media" alt=""></picture><br>MoonDown</p>                     |                             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7960ae02857b583dc74ab6b103dcd905a95c06e1%2Ficon-moon-up-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d48b9125fcebd9554a2e3267c834cf9c4cb16a8b%2Ficon-moon-up-16%40light.svg?alt=media" alt=""></picture><br>MoonUp</p>                            |
|                         <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-15d84e192c7bfbc662aae04def93af47d0455b86%2Ficon-moonrise-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4ccdb160a688e2a9caf5fbfaeab7bda006722550%2Ficon-moonrise-16%40light.svg?alt=media" alt=""></picture><br>Moonrise</p>                         |                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a1fb0b27a0ea60dc40f837de9f1150befc29eb03%2Ficon-mountain-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a51353ecf35f1a2d2f25cc971aabe834093b17c7%2Ficon-mountain-16%40light.svg?alt=media" alt=""></picture><br>Mountain</p>                      |                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8bff14ca5dc20d515489d8f39976ec5ea110181c%2Ficon-mouse-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-abef27fd04ed120cc1ed1b20452462daeb3ec0c9%2Ficon-mouse-16%40light.svg?alt=media" alt=""></picture><br>Mouse</p>                               |
|                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-cda5139ac72eb40ea535862798ec98d16fb92a69%2Ficon-move-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c9c693d59ee89acae6888f57ace652e467a66383%2Ficon-move-16%40light.svg?alt=media" alt=""></picture><br>Move</p>                               |                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-48875354c4b4b898e3ffc5996e7fbda6f6f92ae3%2Ficon-mug-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f1c1726fac884c5f8c76a30c5f223e95cb054bb1%2Ficon-mug-16%40light.svg?alt=media" alt=""></picture><br>Mug</p>                              |                          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e0623a51c101fe10de5de7a52d9e9ee344ce08be%2Ficon-mug-steam-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c786e46b6ee1f96b784a1289740d3f016acfefc8%2Ficon-mug-steam-16%40light.svg?alt=media" alt=""></picture><br>MugSteam</p>                         |
|                         <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-16cefdb53fce1a1d4d232da8d3aa519ef3960d9a%2Ficon-multiply-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-666113a1923aaf486777878a2f55206cecc3b5b0%2Ficon-multiply-16%40light.svg?alt=media" alt=""></picture><br>Multiply</p>                         |                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1d49defba6beadf97ed6c5a67c420a1e92e984ce%2Ficon-music-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-09e489908eb6377a73069cfa0cd08132a28bb6a8%2Ficon-music-16%40light.svg?alt=media" alt=""></picture><br>Music</p>                           |                            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b782623f890de43a644a635298822dda8b8881fa%2Ficon-network-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-89f8be5b0a27144a014c15644e6d1ca7eb19ed28%2Ficon-network-16%40light.svg?alt=media" alt=""></picture><br>Network</p>                            |
|                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-69cfff874d7b2f8371ff71d793d4c6fb92d1b4d8%2Ficon-new-document-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-40350e790932dfbbb932777beec167eb8b253141%2Ficon-new-document-16%40light.svg?alt=media" alt=""></picture><br>NewDocument</p>                   |                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a42d5b18eb89a26e8c3ced8bb8988cc1623f4593%2Ficon-new-folder-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-df69be5a03efddb15aab068476989709cff81f90%2Ficon-new-folder-16%40light.svg?alt=media" alt=""></picture><br>NewFolder</p>                    |                         <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-840ac63586202a11e3a02b00def0fee46dca062a%2Ficon-paperclip-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-287d36cd4b859314996a3c23d062de3f13d3f3c3%2Ficon-paperclip-16%40light.svg?alt=media" alt=""></picture><br>Paperclip</p>                         |
|                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c30bfb65a1b44535c9f48dda1ede40593f2625fd%2Ficon-paragraph-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-02ca70c0c4a9b7528e0cae9e4e73c9448077afda%2Ficon-paragraph-16%40light.svg?alt=media" alt=""></picture><br>Paragraph</p>                       |                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-17963c3de0d6023cc1ba98d9946b7a3efe3ca635%2Ficon-patch-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-360c995764ad962f10991dec39ee7f9fcc33f46d%2Ficon-patch-16%40light.svg?alt=media" alt=""></picture><br>Patch</p>                           |                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-82ba55d051d4f7eda82d2bc47f8deef8082bbdff%2Ficon-pause-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9edecb4403141cad6225e6c33db01467d243d131%2Ficon-pause-16%40light.svg?alt=media" alt=""></picture><br>Pause</p>                               |
|                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-3cb0071b7fb79161ae1d9d41617cede897168b28%2Ficon-pause-filled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d667729622e83bec311c1ed4fbbd011e9abea7dc%2Ficon-pause-filled-16%40light.svg?alt=media" alt=""></picture><br>PauseFilled</p>                   |                          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e49988d6197622982e4b8f6d6dd13735ab1a06de%2Ficon-pencil-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-3e39bd3d4ad4c1d97a6bf4d86fa37acb3b43506f%2Ficon-pencil-16%40light.svg?alt=media" alt=""></picture><br>Pencil</p>                         |                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d6702bf486c135afc607be2489bde1c806145fc6%2Ficon-person-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-062d8822fe172d784af5cd476dab9306ff3b89bd%2Ficon-person-16%40light.svg?alt=media" alt=""></picture><br>Person</p>                             |
|                  <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2e957e442616dce1a402e22c8d1a3f33a33eadc9%2Ficon-person-circle-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-139b275e740dea4f5469c58821079c4813440096%2Ficon-person-circle-16%40light.svg?alt=media" alt=""></picture><br>PersonCircle</p>                  |                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9ae51c374bd71e10406b07924970af0f7f8374ed%2Ficon-person-lines-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-65ec50082276678c6d42bbe1d02214354e1f0140%2Ficon-person-lines-16%40light.svg?alt=media" alt=""></picture><br>PersonLines</p>                 |                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4096c5654770c8c80b43d65aedb6df298ac4d385%2Ficon-phone-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-447cb849df3f4457776e9cf2a7ffe0163c2bed33%2Ficon-phone-16%40light.svg?alt=media" alt=""></picture><br>Phone</p>                               |
|                  <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-344b9d32a0324f64c8e96429b535587eb9797660%2Ficon-phone-ringing-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5c37c16daf786d25997de96cb59d92f9250ecf5f%2Ficon-phone-ringing-16%40light.svg?alt=media" alt=""></picture><br>PhoneRinging</p>                  |                      <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-386dacdc734bd7694e8ce0c0ae95faa37db9a7b2%2Ficon-pie-chart-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a574172c68550567bf63b70a8ffeefdbdb4da04f%2Ficon-pie-chart-16%40light.svg?alt=media" alt=""></picture><br>PieChart</p>                     |                                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-89f021b5ac873e22c88982d795e1ff685f037bd8%2Ficon-pill-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4c41d1d181cb4cc827c464d63e2db639c44bf468%2Ficon-pill-16%40light.svg?alt=media" alt=""></picture><br>Pill</p>                                |
|                                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-fc0a99ae529639c433cfed80c2a08b7fece4c8fa%2Ficon-pin-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7f8acc6d1354e0868fd8e50958966884082c8b44%2Ficon-pin-16%40light.svg?alt=media" alt=""></picture><br>Pin</p>                                |                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6072abd41f998c9b52efb357d0434206408e6a1d%2Ficon-pin-disabled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-dbf4f7abe18ce4c9a11ac86fda5a92dead28db4d%2Ficon-pin-disabled-16%40light.svg?alt=media" alt=""></picture><br>PinDisabled</p>                 |                                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-336f1d4b7aa5ecc44770541d7e76c5d94614d8ca%2Ficon-play-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d2f837649f8f5686e6366c1fcbe2ab7b25adf07c%2Ficon-play-16%40light.svg?alt=media" alt=""></picture><br>Play</p>                                |
|                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-698521ddb5b44a0cd866c44107a74f1cfa63d778%2Ficon-play-filled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f6062d825496a75f0b72fc7a664b3235df2ce1f8%2Ficon-play-filled-16%40light.svg?alt=media" alt=""></picture><br>PlayFilled</p>                     |                             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a60f365a3cc4648d271d65696b7b347ffbbfd87b%2Ficon-plug-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ac3e6e6310b91d9b1a6d561f65cda6a3353bc091%2Ficon-plug-16%40light.svg?alt=media" alt=""></picture><br>Plug</p>                            |                                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-447385d7533acfdf113cba200eee1b298303c49b%2Ficon-plus-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f8f34613ffeab484f2ca994edecc5ba1a0fde888%2Ficon-plus-16%40light.svg?alt=media" alt=""></picture><br>Plus</p>                                |
|                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5725ffb304ba0e956aed2dad665f2d2778e2b171%2Ficon-plus-circle-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1dc0bd2e10ad54c43f42c932fe4635d9f73fe769%2Ficon-plus-circle-16%40light.svg?alt=media" alt=""></picture><br>PlusCircle</p>                     |         <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e4c8d1a89c114db3c4672beb15867e3013a2d6cf%2Ficon-plus-circle-filled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-04526b1327ad0065a1990e5840bb7e2cd7951580%2Ficon-plus-circle-filled-16%40light.svg?alt=media" alt=""></picture><br>PlusCircleFilled</p>        | <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a0309a948da0f9d0126d4b9d9bf5de3c3e53d891%2Ficon-plus-minus-divide-multiply-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-85f96ffc65e75e5ccccda981e5934840d02548e1%2Ficon-plus-minus-divide-multiply-16%40light.svg?alt=media" alt=""></picture><br>PlusMinusDivideMultiply</p> |
|                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5355e626ab5f0c758e6e597eb8224ccc0ea9333e%2Ficon-plus-square-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5636a1806a706a711d8e3a5182bb6c68e8cfbf29%2Ficon-plus-square-16%40light.svg?alt=media" alt=""></picture><br>PlusSquare</p>                     |     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-0b8f3940425002a748feb16c3baccfec7f55e01b%2Ficon-plus-top-right-square-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-28e713059b07e4ba8df19495607ae2eb0c7df206%2Ficon-plus-top-right-square-16%40light.svg?alt=media" alt=""></picture><br>PlusTopRightSquare</p>    |                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-550e78c59fa86694ff77179b91da1bf482a8cbbb%2Ficon-power-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-40b4eaa43a0c563c352251a77547004d5cd39e4e%2Ficon-power-16%40light.svg?alt=media" alt=""></picture><br>Power</p>                               |
|                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f94e379082b99cc1645ce35a0be4292689bc4d01%2Ficon-print-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-646ae609f47b2ec0dd576afb63d7b6e43bc493ac%2Ficon-print-16%40light.svg?alt=media" alt=""></picture><br>Print</p>                             |         <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4ffa4144a26c1364287329fc69f8ae19dcb30dee%2Ficon-question-mark-circle-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ac3a4fe71e4c63ce42c707d71a6fdbde763b10e5%2Ficon-question-mark-circle-16%40light.svg?alt=media" alt=""></picture><br>QuestionMark</p>        |          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4ffa4144a26c1364287329fc69f8ae19dcb30dee%2Ficon-question-mark-circle-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ac3a4fe71e4c63ce42c707d71a6fdbde763b10e5%2Ficon-question-mark-circle-16%40light.svg?alt=media" alt=""></picture><br>QuestionMarkCircle</p>         |
|                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-34497591dcf74460c8dc76b08963ebdeaf69aa74%2Ficon-quicklink-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ac654e412386ce78f346b403707996af79fac23e%2Ficon-quicklink-16%40light.svg?alt=media" alt=""></picture><br>Quicklink</p>                       |             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d2e9fb37853e765b3525fa3b896c65afd041ffd4%2Ficon-quotation-marks-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4c1e8d59c8aecc6f8e7db9edac8768aca3f9475e%2Ficon-quotation-marks-16%40light.svg?alt=media" alt=""></picture><br>QuotationMarks</p>            |                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a4b89ee17a47885299b554b4aca773537d8d0ede%2Ficon-quote-block-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-0bfe8bb2a8692654c5b2b9efabd8cf87fd1170d2%2Ficon-quote-block-16%40light.svg?alt=media" alt=""></picture><br>QuoteBlock</p>                      |
|                            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-289421db616fc6014f78adfdd068f5568ac35e6d%2Ficon-racket-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-784509f7e445b6d97adf174c57df877aa25fe445%2Ficon-racket-16%40light.svg?alt=media" alt=""></picture><br>Racket</p>                            |                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f9c905c30fe4101cf3224764f2c40bded31f3394%2Ficon-raindrop-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-21140a9b7b4c7c134d58b19dc55773be15e8d069%2Ficon-raindrop-16%40light.svg?alt=media" alt=""></picture><br>Raindrop</p>                      |                <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ce0ca2a6fd4c97ad09d938abd8d7aa5c731c61ff%2Ficon-raycast-logo-neg-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f5bc87aea07bf30180fea195d408999923775531%2Ficon-raycast-logo-neg-16%40light.svg?alt=media" alt=""></picture><br>RaycastLogoNeg</p>               |
|              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4abbe4d86dcda7ccb9ea0bb156007ca4ade80341%2Ficon-raycast-logo-pos-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-aabfa8f91e81f4bc89481a1781475013b1cbe586%2Ficon-raycast-logo-pos-16%40light.svg?alt=media" alt=""></picture><br>RaycastLogoPos</p>              |                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-46652b122c934f04a4376ed028fbf92021cf2e90%2Ficon-receipt-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-cbab4e9097c08abb5a99bb1d03e02a7bfc75f017%2Ficon-receipt-16%40light.svg?alt=media" alt=""></picture><br>Receipt</p>                        |                                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8e0bab5e2968237236f00bef55c9a1c6acbee7aa%2Ficon-redo-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-682bafa40eab034ec740754b0e3857114a07cab9%2Ficon-redo-16%40light.svg?alt=media" alt=""></picture><br>Redo</p>                                |
|                  <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5d62580f5d175ab7105f990b352129b76da978bf%2Ficon-remove-person-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b9a97cadac6dee482e9e048950c6492028ce1135%2Ficon-remove-person-16%40light.svg?alt=media" alt=""></picture><br>RemovePerson</p>                  |                          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5547ac89a149b1963db0b0b703d1895adf1367f1%2Ficon-repeat-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e0748c661cb63822c33bb6b799ed2bcd63576e0c%2Ficon-repeat-16%40light.svg?alt=media" alt=""></picture><br>Repeat</p>                         |                            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6e606882ce780ae91bb3be8616738612fbaefc24%2Ficon-replace-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-3decb2a8f0062ee6face13098ae234dfbf5181f5%2Ficon-replace-16%40light.svg?alt=media" alt=""></picture><br>Replace</p>                            |
|                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-58c70b057d4df9075c48280a39fbadb94617b8c3%2Ficon-replace-one-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c3e14bc4bb01595d0e6f9d5bc77cbac5d26a791b%2Ficon-replace-one-16%40light.svg?alt=media" alt=""></picture><br>ReplaceOne</p>                     |                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d7ca4e336b99263cd7872907aad5d028b7d042ad%2Ficon-reply-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-87020dd19f8d1f2ccc68e5f257f2817a66370b28%2Ficon-reply-16%40light.svg?alt=media" alt=""></picture><br>Reply</p>                           |                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c90bff3c43e1fbb9f677e5c396d908f3ab2a9815%2Ficon-rewind-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-76e27489d81be730a04526b4f3b5dc4e0c4d67af%2Ficon-rewind-16%40light.svg?alt=media" alt=""></picture><br>Rewind</p>                             |
|                  <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c8543dabacef347e59909095d964be92bb21dcdf%2Ficon-rewind-filled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-07617fb1aee1a9da225b892895a81cae3ec725ca%2Ficon-rewind-filled-16%40light.svg?alt=media" alt=""></picture><br>RewindFilled</p>                  |                          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7a506534d34ab0c4e3586cd027cd74cc5174d381%2Ficon-rocket-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-78f0b696ac6d8c5e5d2261617fe58cd31a333b44%2Ficon-rocket-16%40light.svg?alt=media" alt=""></picture><br>Rocket</p>                         |                            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-547a74a4acf370655d696b730042cc8a3e9a3946%2Ficon-rosette-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-768f174c5cc9e3470d297972334696e4b98931cf%2Ficon-rosette-16%40light.svg?alt=media" alt=""></picture><br>Rosette</p>                            |
|       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-bcce10a99f487a50e77172e5c284bb5091028c38%2Ficon-rotate-anti-clockwise-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f3478329a6cc71a5281aeadc091d8eebd8bf1d7d%2Ficon-rotate-anti-clockwise-16%40light.svg?alt=media" alt=""></picture><br>RotateAntiClockwise</p>      |           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5f81a4eaaa26a1d77ee7e3c0f15b6dbbbff43df0%2Ficon-rotate-clockwise-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-56b04d163df07f690b9891ab80b78f5f3917dab2%2Ficon-rotate-clockwise-16%40light.svg?alt=media" alt=""></picture><br>RotateClockwise</p>           |                                  <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c59f38ec4a3b6b3fb4acc82c4fb0ca58326b1a1e%2Ficon-rss-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2e2c7943043f3f755d49ce9667cc1c506a212ad4%2Ficon-rss-16%40light.svg?alt=media" alt=""></picture><br>Rss</p>                                  |
|                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f5ff9c83d5395a79f0b8ddff2eba3710fc7f944c%2Ficon-ruler-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-aae5a4ce1c9ce933a13b81fd1fa9789fb242967b%2Ficon-ruler-16%40light.svg?alt=media" alt=""></picture><br>Ruler</p>                             |                <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4c093322d14dfd1b50d158f292758a2b6d027894%2Ficon-save-document-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-fc0c3a596728ca8831a8b1cf3120939fc89c8382%2Ficon-save-document-16%40light.svg?alt=media" alt=""></picture><br>SaveDocument</p>               |                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f997215675ebb2a5bc90a9adfc84a67b00f61556%2Ficon-shield-01-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-414270d558db13b8814fbb0ad8e6ecb02f637df9%2Ficon-shield-01-16%40light.svg?alt=media" alt=""></picture><br>Shield</p>                          |
|               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7e2654dfe6da24f9d0af7a876329f614b5aa6806%2Ficon-short-paragraph-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-40650854118114cedc3cc4e55eb2be239f5698c5%2Ficon-short-paragraph-16%40light.svg?alt=media" alt=""></picture><br>ShortParagraph</p>               |                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-06c4a488e742bd3d20f8e23641a537a9d34122d4%2Ficon-shuffle-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b8c0637bf743e43544b5d82d1ca21dc41002ddd7%2Ficon-shuffle-16%40light.svg?alt=media" alt=""></picture><br>Shuffle</p>                        |           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-bc3dda681b9b4887a5d98aaa74ee268fa7a1caf7%2Ficon-app-window-sidebar-right-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8549d33dc277535867c386492d0ba85d83ae2d35%2Ficon-app-window-sidebar-right-16%40light.svg?alt=media" alt=""></picture><br>Sidebar</p>           |
|                          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ec9a243430c6bc40d4be0bee218179263dec0a18%2Ficon-signal-0-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c6ffbfe3d12cab0788024dc31a7768212531df23%2Ficon-signal-0-16%40light.svg?alt=media" alt=""></picture><br>Signal0</p>                         |                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4dd18531d72364e7adace85f8a010fd8de0f19e6%2Ficon-signal-1-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b8287e971f1e8c39da92572af2d019723ec73ccd%2Ficon-signal-1-16%40light.svg?alt=media" alt=""></picture><br>Signal1</p>                       |                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7ae43931ebb35675244640e443e873d342d30c23%2Ficon-signal-2-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-312528d9c018e01b4c7dc9e8bfeb085bcbdeb643%2Ficon-signal-2-16%40light.svg?alt=media" alt=""></picture><br>Signal2</p>                           |
|                          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5da32b0bbe514c3ea0addfca8214bfbb8bfbeb52%2Ficon-signal-3-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-47c56c06186be227b309e4f879f660774d350ad7%2Ficon-signal-3-16%40light.svg?alt=media" alt=""></picture><br>Signal3</p>                         |                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-905261a90f87660f3976aba9a3ff949991729c80%2Ficon-snippets-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9596edcaa1d52817576220d0e9b47b559b7b4be9%2Ficon-snippets-16%40light.svg?alt=media" alt=""></picture><br>Snippets</p>                      |                         <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-adb9c38d77944be18755d0c37e346f1978b2c3fe%2Ficon-snowflake-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d13262ac39182b1ac52322a7db2aa8b6a12c5557%2Ficon-snowflake-16%40light.svg?alt=media" alt=""></picture><br>Snowflake</p>                         |
|                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-68bba774c05c85f35210170004848bdfc847d99f%2Ficon-soccer-ball-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-357e955c212bbff0603aef1760360a092937533f%2Ficon-soccer-ball-16%40light.svg?alt=media" alt=""></picture><br>SoccerBall</p>                     |                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a9732b3ac5b3ee9b68f47b4104f926eace482548%2Ficon-speaker-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e4d2fd3d989392b63b6256be8dd4dab5280707b4%2Ficon-speaker-16%40light.svg?alt=media" alt=""></picture><br>Speaker</p>                        |                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b59f65e76d54caed63a81a0efa18ff9c5ff98cca%2Ficon-speaker-down-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-71f164d6476f4c89751b7d1854ab569bf4b3e2b9%2Ficon-speaker-down-16%40light.svg?alt=media" alt=""></picture><br>SpeakerDown</p>                     |
|                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e91925e335159864a57df23b7256490ea9be2c67%2Ficon-speaker-high-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7baa3652c1d26381f49f96380a17f79bb11efd49%2Ficon-speaker-high-16%40light.svg?alt=media" alt=""></picture><br>SpeakerHigh</p>                   |                   <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2901ea231ffba23a354291b2f8db72f4f3c80a80%2Ficon-speaker-low-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a6ae90f0775652a1d71c3580522e780e16a5d9ae%2Ficon-speaker-low-16%40light.svg?alt=media" alt=""></picture><br>SpeakerLow</p>                  |                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7dcee37c7ea0abc0241f0d68a30f5ae13fc73089%2Ficon-speaker-off-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d2c884937545846764c6b5203292e2b85f68a811%2Ficon-speaker-off-16%40light.svg?alt=media" alt=""></picture><br>SpeakerOff</p>                      |
|                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6dd9d891c83528e71b1960acfe5e1bf07859ec71%2Ficon-speaker-on-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-fa8d908df55922d2d36807ecba870ba6971543e5%2Ficon-speaker-on-16%40light.svg?alt=media" alt=""></picture><br>SpeakerOn</p>                      |                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-52b3afa728f6e13c243de4d02e71ca1656b6d239%2Ficon-speaker-up-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-722bf30c4e1494736118733a77951dfcbcd75b36%2Ficon-speaker-up-16%40light.svg?alt=media" alt=""></picture><br>SpeakerUp</p>                    |                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4f687e156caaac9b561d31623106a2237a4917c7%2Ficon-speech-bubble-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f6ceb6c97c6529a29f5da50badbb7ec4c45f57e3%2Ficon-speech-bubble-16%40light.svg?alt=media" alt=""></picture><br>SpeechBubble</p>                   |
|        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-88518d124a9107f2ad4d3400c2d6ed95620cd422%2Ficon-speech-bubble-active-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-3736f4b20c6e50d16c09ca1b3f2af3894c9ea3b5%2Ficon-speech-bubble-active-16%40light.svg?alt=media" alt=""></picture><br>SpeechBubbleActive</p>        | <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-69beae44a6fa91d4b9ca4b57ae1b17a654695cee%2Ficon-speech-bubble-important-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c6d3f456ddb85e4b4b6a4a6472d51a6273e27b8e%2Ficon-speech-bubble-important-16%40light.svg?alt=media" alt=""></picture><br>SpeechBubbleImportant</p> |                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b820577e19e5ab9261231b126b9528a4bd540852%2Ficon-square-ellipsis-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d52508cc9fcee0fcd0f505fcced6abe32d0819b8%2Ficon-square-ellipsis-16%40light.svg?alt=media" alt=""></picture><br>SquareEllipsis</p>                |
|                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-673d9c412c5a39baf68c6677e19bd8235f03b338%2Ficon-stacked-bars-1-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-99dcf0338a4443a121c2e028e7c9941525eff5dd%2Ficon-stacked-bars-1-16%40light.svg?alt=media" alt=""></picture><br>StackedBars1</p>                 |               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b49999090dbbaeadf2c77b72dac25c03290ab686%2Ficon-stacked-bars-2-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-eeb7fd48215437fa2e847245f68d450e3c203c56%2Ficon-stacked-bars-2-16%40light.svg?alt=media" alt=""></picture><br>StackedBars2</p>              |                   <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-3feb4d338d01dc27f7d56de44143b21fe165e51b%2Ficon-stacked-bars-3-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f0323bf7a69aa04ccbf755bdb47fe91f8f113563%2Ficon-stacked-bars-3-16%40light.svg?alt=media" alt=""></picture><br>StackedBars3</p>                  |
|                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c33c4d0e69d487531a81250ee05654764df13c6c%2Ficon-stacked-bars-4-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-06f573b81c9d74a62758b50d27aed576e3bffc8e%2Ficon-stacked-bars-4-16%40light.svg?alt=media" alt=""></picture><br>StackedBars4</p>                 |                             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1794b5cb02995c9aa679f2d380cbf275a265d6b2%2Ficon-star-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-98014382d12724723694b478cd1c879e0d5b8e54%2Ficon-star-16%40light.svg?alt=media" alt=""></picture><br>Star</p>                            |                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-32faebecace6909d78bacbad9c253d56809a1360%2Ficon-star-circle-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e7d4be199d5a4ac4bbd2e1b5b987109b2336d1a7%2Ficon-star-circle-16%40light.svg?alt=media" alt=""></picture><br>StarCircle</p>                      |
|                  <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-891ba69263775dfc0dc319825f5ed3bdf5eaa875%2Ficon-star-disabled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-01058d5039afed08b42f9c69627ccea057f0708b%2Ficon-star-disabled-16%40light.svg?alt=media" alt=""></picture><br>StarDisabled</p>                  |                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-462016e48936701117d98cc61d0e737bde332c52%2Ficon-stars-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e51baa4e968ac37de1c63a5d4a41b0772ec7f0be%2Ficon-stars-16%40light.svg?alt=media" alt=""></picture><br>Stars</p>                           |                                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-947cc314c65625890aec1423210ae4caa36b4fed%2Ficon-stop-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-11a8b848f6bbae4bfbdd4434e91dd11d82267203%2Ficon-stop-16%40light.svg?alt=media" alt=""></picture><br>Stop</p>                                |
|                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-658a07ad31e61c07d85219273cec7ac578f2cb02%2Ficon-stop-filled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-deb112f8938ca47b74028e580fce410431c1f9dc%2Ficon-stop-filled-16%40light.svg?alt=media" alt=""></picture><br>StopFilled</p>                     |                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a2ba9f7ffdb70fd7ecf9398dad112ca5a57a54d4%2Ficon-stopwatch-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b9949c7757787d5cafa2a442f14dd5015526c656%2Ficon-stopwatch-16%40light.svg?alt=media" alt=""></picture><br>Stopwatch</p>                     |                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9fdfcc493acf9826eaf3b4665ba9059207b17ade%2Ficon-store-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-841fbaa19ca79adb5eb5b89a9e96515afac10163%2Ficon-store-16%40light.svg?alt=media" alt=""></picture><br>Store</p>                               |
|                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c7967f1783b34ac460e2b5bc51226bdb8fe045ce%2Ficon-strike-through-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5defdd6285e43c6c2f77dea9900b624fbef160b4%2Ficon-strike-through-16%40light.svg?alt=media" alt=""></picture><br>StrikeThrough</p>                |                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-10622f9a8414d0da11e94c170aad3d077c432725%2Ficon-sun-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d060665e5d7142630ba452380fe3bfab07485427%2Ficon-sun-16%40light.svg?alt=media" alt=""></picture><br>Sun</p>                              |                            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-bf85f1b3354c51bf000394a4701a1387f2b6c32d%2Ficon-sunrise-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9bdc458de8217901db25b41457f48555b56897ff%2Ficon-sunrise-16%40light.svg?alt=media" alt=""></picture><br>Sunrise</p>                            |
|                            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1878bb0a74fdb246df7be46ba4dcde5ace83ac14%2Ficon-swatch-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6c0cef8becf61d4fa3e7d56a3d45744f2388cbf6%2Ficon-swatch-16%40light.svg?alt=media" alt=""></picture><br>Swatch</p>                            |                          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e30290d9031dfa62f0f45e4133acd04a2e19856d%2Ficon-switch-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-46af3e15e96e51bc5b0f96f6802289d746f5cf55%2Ficon-switch-16%40light.svg?alt=media" alt=""></picture><br>Switch</p>                         |                            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-941836039eb5f380ccc0cf93b32e002650dd5537%2Ficon-syringe-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-3b93e1902be1a2fc0fa0f0d5804b276e541fc5ef%2Ficon-syringe-16%40light.svg?alt=media" alt=""></picture><br>Syringe</p>                            |
|                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4079bf0a1b3c3198da23f6fc2d31de450ef10b8a%2Ficon-tack-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-88795541c8814785e75dcbd6a982b1938970984b%2Ficon-tack-16%40light.svg?alt=media" alt=""></picture><br>Tack</p>                               |                <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e80d2949a028fa7eedc01345ab099c2b0521babc%2Ficon-tack-disabled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a7701b695bd590475fa6e9551732a6d4b0ac4eb7%2Ficon-tack-disabled-16%40light.svg?alt=media" alt=""></picture><br>TackDisabled</p>               |                                  <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8f1f71a7b73246c2c337cbbf38735a46e19acbeb%2Ficon-tag-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f0e081de8c95b6726a469a8c7d8068495962cbef%2Ficon-tag-16%40light.svg?alt=media" alt=""></picture><br>Tag</p>                                  |
|                     <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-58a7658b3652e3477797bbf02cdd4c66ee2f1392%2Ficon-temperature-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-81d3b3beeeabe561b9db9725e2dea59c6d7d833d%2Ficon-temperature-16%40light.svg?alt=media" alt=""></picture><br>Temperature</p>                    |                   <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8668d6e7e306457be5d99995982d53d028c23a8a%2Ficon-tennis-ball-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b0fd8131341f9b1758d4b121ac850f186b33f7a0%2Ficon-tennis-ball-16%40light.svg?alt=media" alt=""></picture><br>TennisBall</p>                  |                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d8bca19e024b21ba83cc1c8af6cd9829f39a9ecf%2Ficon-terminal-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-142637119129eecad2e3c3bdaec8df4e3333a343%2Ficon-terminal-16%40light.svg?alt=media" alt=""></picture><br>Terminal</p>                          |
|                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1eaf5de852e672bdf7ef4e632300e2413ba48248%2Ficon-text-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b90833fa84470368e4d4fb9e03a8fe5c17becae0%2Ficon-text-16%40light.svg?alt=media" alt=""></picture><br>Text</p>                               |                   <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f7b130aceba87f382be7333a9e9fb7125b821b78%2Ficon-text-cursor-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4767b5c4b51a6179120806b61def7e9ed0ac56b4%2Ficon-text-cursor-16%40light.svg?alt=media" alt=""></picture><br>TextCursor</p>                  |                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c63230fd10ce2d3eaa3a4c680aabd75b53aac9ad%2Ficon-text-input-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4531f89e1c8efb464a0910d61aa4ee7d774aca1e%2Ficon-text-input-16%40light.svg?alt=media" alt=""></picture><br>TextInput</p>                        |
|                 <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-198a17c360b668483939804184a4ecc00fece4f2%2Ficon-text-selection-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a264eee08b1b94fa41cf9c836683dd254ddcecb2%2Ficon-text-selection-16%40light.svg?alt=media" alt=""></picture><br>TextSelection</p>                |                   <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-26b80aec744b20413facfff7283f7212ba76ea11%2Ficon-thumbs-down-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c498f6d9c8cce7c642ffed864d3e23a7124bd2e9%2Ficon-thumbs-down-16%40light.svg?alt=media" alt=""></picture><br>ThumbsDown</p>                  |             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-865ba3bcb490256443bd88b41e0c41fb843b2662%2Ficon-thumbs-down-filled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-0173d31dcc99a75f8b4c353eb6f08eca12738a1d%2Ficon-thumbs-down-filled-16%40light.svg?alt=media" alt=""></picture><br>ThumbsDownFilled</p>            |
|                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-094812fda83c14078bb49786fd2fa47f27b2c677%2Ficon-thumbs-up-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6b2d65c8bb98ea1c8e323c84f8c38ceb3ff753e5%2Ficon-thumbs-up-16%40light.svg?alt=media" alt=""></picture><br>ThumbsUp</p>                        |            <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-383a0e28ab240c6271bf657be19c7d153f91c81c%2Ficon-thumbs-up-filled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f25c0ca09c749b713313673f49017ca4fb407548%2Ficon-thumbs-up-filled-16%40light.svg?alt=media" alt=""></picture><br>ThumbsUpFilled</p>           |                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1590d872f18eeb2cde86d242bf558a0371640691%2Ficon-ticket-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d380713fdd42599e79bcbb4b15e86a5391671b5d%2Ficon-ticket-16%40light.svg?alt=media" alt=""></picture><br>Ticket</p>                             |
|                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-cf2a1ce966d606b7d51885230eb0fd6f2215de18%2Ficon-torch-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-eb87edfec8f7acc2597e7a32c98eefab75d0f72c%2Ficon-torch-16%40light.svg?alt=media" alt=""></picture><br>Torch</p>                             |                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6aef5369a528f739373e1926c563cece3295a753%2Ficon-train-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-41e0fc24f167b3cd8d5110b8d5206625c3c91383%2Ficon-train-16%40light.svg?alt=media" alt=""></picture><br>Train</p>                           |                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6d01516f6bc26509e0e3eee1af10eed3b12308bf%2Ficon-trash-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1945a636e39307f12fce3329c31b27f066613e07%2Ficon-trash-16%40light.svg?alt=media" alt=""></picture><br>Trash</p>                               |
|                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-085d5ec7f6f764dce18f8893f73c03eff419c951%2Ficon-tray-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-39badb7eea54ae27fd4ccd708fc7fdc8eb322dcb%2Ficon-tray-16%40light.svg?alt=media" alt=""></picture><br>Tray</p>                               |                             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-374216f8184d6190af68ea23e94f552407224aa5%2Ficon-tree-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-9e78b941925d2d5922803daf0a584a1011521d67%2Ficon-tree-16%40light.svg?alt=media" alt=""></picture><br>Tree</p>                            |                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-88bd2f0acf838c830b20f1224968721ca371cfac%2Ficon-trophy-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a5447fe21791f9dfb994d6328238196c5461ab70%2Ficon-trophy-16%40light.svg?alt=media" alt=""></picture><br>Trophy</p>                             |
|                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b3ef346b1903adebed52efb53ea973e5320a6cba%2Ficon-two-people-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e70cd707b490fde47c749c7d7f789aab361b9af5%2Ficon-two-people-16%40light.svg?alt=media" alt=""></picture><br>TwoPeople</p>                      |                       <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-18c1691df442c3532e9441bab79864aece084493%2Ficon-umbrella-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d22da6af2fb7bfe6463000f0427398e2f337a24f%2Ficon-umbrella-16%40light.svg?alt=media" alt=""></picture><br>Umbrella</p>                      |                         <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-58db6b7f07bfc53fa071f8a379980fd3893ac1f5%2Ficon-underline-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7b4f03169b20b0d85b040b5c858779fda52791d7%2Ficon-underline-16%40light.svg?alt=media" alt=""></picture><br>Underline</p>                         |
|                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-fdf96a8da9ecd7c20cd63ea73e85e14af86dda08%2Ficon-undo-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4e2e05e8d12aeae17e3434986148b2b9efeadb69%2Ficon-undo-16%40light.svg?alt=media" alt=""></picture><br>Undo</p>                               |                          <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6d4c70b0f124c6f6e80e32d9b6cc12e1702d4d71%2Ficon-upload-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-866bcbfa972316afd3b02437d633aa7527d3f02f%2Ficon-upload-16%40light.svg?alt=media" alt=""></picture><br>Upload</p>                         |                         <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-52924a8c8b8a7787f7f85e8a5b46410ee1fccb65%2Ficon-uppercase-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-aac249079a5d4185c3ec712ab51198a82f612686%2Ficon-uppercase-16%40light.svg?alt=media" alt=""></picture><br>Uppercase</p>                         |
|                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d747b4b9b7c0b08f6507187c70dee4e7a8d42001%2Ficon-video-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2a6ba4c0d781fa90a8a4ef88b0ad563392e64970%2Ficon-video-16%40light.svg?alt=media" alt=""></picture><br>Video</p>                             |              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-0fa01f3e21f8d6417a4a6ed44632e6b81da1d9b7%2Ficon-video-disabled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-61727e7b56855e477263f680deb39598d730bc7b%2Ficon-video-disabled-16%40light.svg?alt=media" alt=""></picture><br>VideoDisabled</p>              |                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-16feb0d0c6120955e3f4b1772d025f12aac21b96%2Ficon-wallet-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-76b2d676c83cad47247862c653b94df03a264a98%2Ficon-wallet-16%40light.svg?alt=media" alt=""></picture><br>Wallet</p>                             |
|                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f8089de43d479ae856ca4235d15ebf987107f2ec%2Ficon-wand-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d381a4d2af25556a903a9cb54f9ff8e0b5dfa012%2Ficon-wand-16%40light.svg?alt=media" alt=""></picture><br>Wand</p>                               |                        <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a120907d76546edc19dd24cc9c3ec9ccca1a1110%2Ficon-warning-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7ccdce0cbbce419ae463c4f43d8e18b4d75467d8%2Ficon-warning-16%40light.svg?alt=media" alt=""></picture><br>Warning</p>                        |                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4110005745c4476c93d7ff117e9dd4648155cc64%2Ficon-waveform-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-afa5d00279625a0a77971224b4efd9183868cb0f%2Ficon-waveform-16%40light.svg?alt=media" alt=""></picture><br>Waveform</p>                          |
|                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7c611423acb818631234c146a28017291ed0c1d9%2Ficon-weights-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b88cef6239d134bc0a53f294ad13db304b156165%2Ficon-weights-16%40light.svg?alt=media" alt=""></picture><br>Weights</p>                          |                             <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5ebeb594ab70bdeef48373a4dbcd037a5457778d%2Ficon-wifi-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d468fcc168aa4dcb79b3564cbf9566f3d336f604%2Ficon-wifi-16%40light.svg?alt=media" alt=""></picture><br>Wifi</p>                            |                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b816642b041d316f171c73e2bc7636c2380cd712%2Ficon-wifi-disabled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-555a9b9cd5ca34aaa571f2a2dbb1a66ef31a8d51%2Ficon-wifi-disabled-16%40light.svg?alt=media" alt=""></picture><br>WifiDisabled</p>                   |
|                               <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-99b03080e36818e6ce950810c48a1c5e46686ac1%2Ficon-wind-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6c73a555c81e8396bf8e33c9c1d2705cfaf47669%2Ficon-wind-16%40light.svg?alt=media" alt=""></picture><br>Wind</p>                               |                      <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-915fa84b6ccf17f298ca7cfb4726697eb011b108%2Ficon-app-window-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-33431e97d401f24e086889c0649cdc964b78a4ca%2Ficon-app-window-16%40light.svg?alt=media" alt=""></picture><br>Window</p>                     |                           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-960bee5f9c67b98224213f71d2e8c91d375d21cd%2Ficon-windsock-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-18dce0d4c493471090af3f74636a7437418f1039%2Ficon-windsock-16%40light.svg?alt=media" alt=""></picture><br>Windsock</p>                          |
|           <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7f52e5e9b9222a5882fa5842bb80e06b6ec3cc0d%2Ficon-wrench-screwdriver-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b32712111a9234b4660a69bd311d094eeb1f2af6%2Ficon-wrench-screwdriver-16%40light.svg?alt=media" alt=""></picture><br>WrenchScrewdriver</p>          |                   <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a3a1e10ced425b903991e1111fb5c31fcec36384%2Ficon-wrist-watch-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-8195201bdcb9a098c32a720225c067c27a5d35fa%2Ficon-wrist-watch-16%40light.svg?alt=media" alt=""></picture><br>WristWatch</p>                  |                    <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-415deec0d5612ee7db9010464a98b739ce90474b%2Ficon-x-mark-circle-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-0d6350c48bda79d51942e2b42efa8baa1b7feee7%2Ficon-x-mark-circle-16%40light.svg?alt=media" alt=""></picture><br>XMarkCircle</p>                    |
|         <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1a85b84ee2b9dde3c66c2df53b56473ef4bf3746%2Ficon-x-mark-circle-filled-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-612c030d71cc77f7e707d3adfd72581190a13548%2Ficon-x-mark-circle-filled-16%40light.svg?alt=media" alt=""></picture><br>XMarkCircleFilled</p>        |  <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2a235b5fc57d3ad5063afd12767ab8cd38e89cbb%2Ficon-x-mark-circle-half-dash-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b5ff79b8a7ede52b1ec8945d71e41c276e03587b%2Ficon-x-mark-circle-half-dash-16%40light.svg?alt=media" alt=""></picture><br>XMarkCircleHalfDash</p>  |      <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-76ad55539fba2482eace11487736c96da4d81ab9%2Ficon-x-mark-top-right-square-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4aaae36781e8add6ffa03ade5098798f66fd11d1%2Ficon-x-mark-top-right-square-16%40light.svg?alt=media" alt=""></picture><br>XMarkTopRightSquare</p>      |
|                              <p><picture><source srcset="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-c85e7556de1b4c4e16d7b729be1b6bd7c403cd2b%2Ficon-xmark-16%40dark.svg?alt=media" media="(prefers-color-scheme: dark)"><img src="https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4569666b758d74569c42562408a0ace59cd3ef36%2Ficon-xmark-16%40light.svg?alt=media" alt=""></picture><br>Xmark</p>                             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

Available masks that can be used to change the shape of an image.

Can be handy to shape avatars or other items in a list.

#### Enumeration members

| Name             | Value              |
| ---------------- | ------------------ |
| Circle           | "circle"           |
| RoundedRectangle | "roundedRectangle" |

Display different types of images, including network images or bundled assets.

Apply image transforms to the source, such as a `mask` or a `tintColor`.

{% hint style="info" %}
Tip: Suffix your local assets with `@dark` to automatically provide a dark theme option, eg: `icon.png` and `icon@dark.png`.
{% endhint %}

| Property                                 | Description                                                            | Type                                                                                     |
| ---------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| source<mark style="color:red;">\*</mark> | The Image.Source of the image.                                         | [`Image.Source`](#image.source)                                                          |
| fallback                                 | Image.Fallback image, in case `source` can't be loaded.                | [`Image.Fallback`](#image.fallback)                                                      |
| mask                                     | A Image.Mask to apply to the image.                                    | [`Image.Mask`](#image.mask)                                                              |
| tintColor                                | A Color.ColorLike to tint all the non-transparent pixels of the image. | [`Color.ColorLike`](https://developers.raycast.com/api-reference/colors#color.colorlike) |

An icon as it's used in the Finder.

| Property                                   | Description                                        | Type     |
| ------------------------------------------ | -------------------------------------------------- | -------- |
| fileIcon<mark style="color:red;">\*</mark> | The path to a file or folder to get its icon from. | `string` |

Union type for the supported image types.

The source of an [Image](#image). Can be either a remote URL, a local file resource, a built-in [Icon](#icon) or a single emoji.

For consistency, it's best to use the built-in [Icon](#icon) in lists, the Action Panel, and other places. If a specific icon isn't built-in, you can reference custom ones from the `assets` folder of the extension by file name, e.g. `my-icon.png`. Alternatively, you can reference an absolute HTTPS URL that points to an image or use an emoji. You can also specify different remote or local assets for light and dark theme.

A fallback [Image](#image) that will be displayed in case the source image cannot be loaded. Can be either a local file resource, a built-in [Icon](#icon), a single emoji, or a theme-aware asset. Any specified `mask` or `tintColor` will also apply to the fallback image.

Image is a string representing a URL.

Image is a string representing an asset from the `assets/` folder

**Examples:**

Example 1 (typescript):
```typescript
import { Icon, List } from "@raycast/api";

export default function Command() {
  return (
    <List>
      <List.Item title="Icon" icon={Icon.Circle} />
    </List>
  );
}
```

Example 2 (typescript):
```typescript
import { Image, List } from "@raycast/api";

export default function Command() {
  return (
    <List>
      <List.Item
        title="Icon"
        icon={{
          source: "https://raycast.com/uploads/avatar.png",
          mask: Image.Mask.Circle,
        }}
      />
    </List>
  );
}
```

Example 3 (typescript):
```typescript
// Built-in icon
const icon = Icon.Eye;

// Built-in icon with tint color
const tintedIcon = { source: Icon.Bubble, tintColor: Color.Red };

// Bundled asset with circular mask
const avatar = { source: "avatar.png", mask: Image.Mask.Circle };

// Implicit theme-aware icon
// with 'icon.png' and 'icon@dark.png' in the `assets` folder
const icon = "icon.png";

// Explicit theme-aware icon
const icon = { source: { light: "https://example.com/icon-light.png", dark: "https://example.com/icon-dark.png" } };
```

Example 4 (typescript):
```typescript
import { List } from "@raycast/api";

export default function Command() {
  return (
    <List>
      <List.Item title="File icon" icon={{ fileIcon: __filename }} />
    </List>
  );
}
```

---

## List

**URL:** llms-txt#list

**Contents:**
- Search Bar
  - Custom filtering
  - Programmatically updating the search bar
  - Dropdown
  - Pagination
- Examples
- API Reference
  - List
  - List.Dropdown
  - List.Dropdown.Item

The de-facto user interface in Raycast. Ideal to present similar data such as to-dos or files.

Our `List` component provides great user experience out of the box:

* Use built-in filtering for best performance.
* Group-related items in sections with titles and subtitles.
* Show loading indicator for longer operations.
* Use the search query for typeahead experiences, optionally throttled.

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d9ff7a3c3f01cd1e09f7931c91be432700f545d9%2Flist.webp?alt=media)

The search bar allows users to interact quickly with list items. By default, [List.Items](#list.item) are displayed if the user's input can be (fuzzy) matched to the item's `title` or `keywords`.

Sometimes, you may not want to rely on Raycast's filtering, but use/implement your own. If that's the case, you can set the `List`'s `filtering` [prop](#props) to false, and the items displayed will be independent of the search bar's text.\
Note that `filtering` is also implicitly set to false if an `onSearchTextChange` listener is specified. If you want to specify a change listener and *still* take advantage of Raycast's built-in filtering, you can explicitly set `filtering` to true.

### Programmatically updating the search bar

Other times, you may want the content of the search bar to be updated by the extension, for example, you may store a list of the user's previous searches and, on the next visit, allow them to "continue" where they left off.

To do so, you can use the `searchText` [prop](#props).

Some extensions may benefit from giving users a second filtering dimension. A todo extension may allow users to use different groups, a newspaper-reading extension may want to allow quickly switching categories, etc.

This is where the `searchBarAccessory` [prop](#props) is useful. Pass it a [List.Dropdown](#list.dropdown) component, and it will be displayed on the right-side of the search bar. Invoke it either by using the global shortcut `⌘` `P` or by clicking on it.

{% hint style="info" %}
Pagination requires version 1.69.0 or higher of the `@raycast/api` package.
{% endhint %}

`List`s have built-in support for pagination. To opt in to pagination, you need to pass it a `pagination` prop, which is an object providing 3 pieces of information:

* `onLoadMore` - will be called by Raycast when the user reaches the end of the list, either using the keyboard or the mouse. When it gets called, the extension is expected to perform an async operation which eventually can result in items being appended to the end of the list.
* `hasMore` - indicates to Raycast whether it *should* call `onLoadMore` when the user reaches the end of the list.
* `pageSize` - indicates how many placeholder items Raycast should add to the end of the list when it calls `onLoadMore`. Once `onLoadMore` finishes executing, the placeholder items will be replaced by the newly-added list items.

Note that extensions have access to a limited amount of memory. As your extension paginates, its memory usage will increase. Paginating extensively could lead to the extension eventually running out of memory and crashing. To protect against the extension crashing due to memory exhaustion, Raycast monitors the extension's memory usage and employs heuristics to determine whether it's safe to paginate further. If it's deemed unsafe to continue paginating, `onLoadMore` will not be triggered when the user scrolls to the bottom, regardless of the `hasMore` value. Additionally, during development, a warning will be printed in the terminal.

For convenience, most of the [hooks](https://developers.raycast.com/utilities/getting-started) that we provide have built-in pagination support. Here's an example of how to add pagination support to a simple command using [usePromise](https://developers.raycast.com/utilities/react-hooks/usepromise), and one "from scratch".

{% tabs %}
{% tab title="ListWithUsePromisePagination.tsx" %}

{% tab title="ListWithPagination.tsx" %}

{% endtab %}
{% endtabs %}

{% hint style="warning" %}
Pagination might not work properly if all list items are rendered and visible at once, as `onLoadMore` won't be triggered. This typically happens when an API returns 10 results by default, all fitting within the Raycast window. To fix this, try displaying more items, like 20.
{% endhint %}

{% tabs %}
{% tab title="List.tsx" %}

{% tab title="ListWithSections.tsx" %}

{% tab title="ListWithActions.tsx" %}

{% tab title="ListWithDetail.tsx" %}

{% tab title="ListWithEmptyView\.tsx" %}

{% endtab %}
{% endtabs %}

Displays [List.Section](#list.section) or [List.Item](#list.item).

The list uses built-in filtering by indexing the title of list items and additionally keywords.

| Prop                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Type                                                             | Default |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------- |
| actions              | A reference to an ActionPanel. It will only be shown when there aren't any children.                                                                                                                                                                                                                                                                                                                                                                                                                | `React.ReactNode`                                                | -       |
| children             | List sections or items. If List.Item elements are specified, a default section is automatically created.                                                                                                                                                                                                                                                                                                                                                                                            | `React.ReactNode`                                                | -       |
| filtering            | Toggles Raycast filtering. When `true`, Raycast will use the query in the search bar to filter the items. When `false`, the extension needs to take care of the filtering. You can further define how native filtering orders sections by setting an object with a `keepSectionOrder` property: When `true`, ensures that Raycast filtering maintains the section order as defined in the extension. When `false`, filtering may change the section order depending on the ranking values of items. | `boolean` or `{ keepSectionOrder: boolean }`                     | -       |
| isLoading            | Indicates whether a loading bar should be shown or hidden below the search bar                                                                                                                                                                                                                                                                                                                                                                                                                      | `boolean`                                                        | -       |
| isShowingDetail      | Whether the List should have an area on the right side of the items to show additional details about the selected item. When true, it is recommended not to show any accessories on the `List.Item` and instead show the additional information in the `List.Item.Detail` view.                                                                                                                                                                                                                     | `boolean`                                                        | -       |
| navigationTitle      | The main title for that view displayed in Raycast                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `string`                                                         | -       |
| onSearchTextChange   | Callback triggered when the search bar text changes.                                                                                                                                                                                                                                                                                                                                                                                                                                                | `(text: string) => void`                                         | -       |
| onSelectionChange    | Callback triggered when the item selection in the list changes. When the received id is `null`, it means that all items have been filtered out and that there are no item selected                                                                                                                                                                                                                                                                                                                  | `(id: string) => void`                                           | -       |
| pagination           | Configuration for pagination                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `{ hasMore: boolean; onLoadMore: () => void; pageSize: number }` | -       |
| searchBarAccessory   | List.Dropdown that will be shown in the right-hand-side of the search bar.                                                                                                                                                                                                                                                                                                                                                                                                                          | `ReactElement<`[`List.Dropdown.Props`](#props)`, string>`        | -       |
| searchBarPlaceholder | Placeholder text that will be shown in the search bar.                                                                                                                                                                                                                                                                                                                                                                                                                                              | `string`                                                         | -       |
| searchText           | The text that will be displayed in the search bar.                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `string`                                                         | -       |
| selectedItemId       | Selects the item with the specified id.                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `string`                                                         | -       |
| throttle             | Defines whether the `onSearchTextChange` handler will be triggered on every keyboard press or with a delay for throttling the events. Recommended to set to `true` when using custom filtering logic with asynchronous operations (e.g. network requests).                                                                                                                                                                                                                                          | `boolean`                                                        | -       |

A dropdown menu that will be shown in the right-hand-side of the search bar.

| Prop                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Type                                         | Default |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------- |
| tooltip<mark style="color:red;">\*</mark> | Tooltip displayed when hovering the dropdown.                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `string`                                     | -       |
| children                                  | Dropdown sections or items. If Dropdown.Item elements are specified, a default section is automatically created.                                                                                                                                                                                                                                                                                                                                                                                    | `React.ReactNode`                            | -       |
| defaultValue                              | The default value of the dropdown. Keep in mind that `defaultValue` will be configured once per component lifecycle. This means that if a user changes the value, `defaultValue` won't be configured on re-rendering. **If you're using `storeValue` and configured it as `true`** ***and*****&#x20;a Dropdown.Item with the same value exists, then it will be selected.** **If you configure `value` at the same time as `defaultValue`, the `value` will have precedence over `defaultValue`.**  | `string`                                     | -       |
| filtering                                 | Toggles Raycast filtering. When `true`, Raycast will use the query in the search bar to filter the items. When `false`, the extension needs to take care of the filtering. You can further define how native filtering orders sections by setting an object with a `keepSectionOrder` property: When `true`, ensures that Raycast filtering maintains the section order as defined in the extension. When `false`, filtering may change the section order depending on the ranking values of items. | `boolean` or `{ keepSectionOrder: boolean }` | -       |
| id                                        | ID of the dropdown.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `string`                                     | -       |
| isLoading                                 | Indicates whether a loading indicator should be shown or hidden next to the search bar                                                                                                                                                                                                                                                                                                                                                                                                              | `boolean`                                    | -       |
| onChange                                  | Callback triggered when the dropdown selection changes.                                                                                                                                                                                                                                                                                                                                                                                                                                             | `(newValue: string) => void`                 | -       |
| onSearchTextChange                        | Callback triggered when the search bar text changes.                                                                                                                                                                                                                                                                                                                                                                                                                                                | `(text: string) => void`                     | -       |
| placeholder                               | Placeholder text that will be shown in the dropdown search field.                                                                                                                                                                                                                                                                                                                                                                                                                                   | `string`                                     | -       |
| storeValue                                | Indicates whether the value of the dropdown should be persisted after selection, and restored next time the dropdown is rendered.                                                                                                                                                                                                                                                                                                                                                                   | `boolean`                                    | -       |
| throttle                                  | Defines whether the `onSearchTextChange` handler will be triggered on every keyboard press or with a delay for throttling the events. Recommended to set to `true` when using custom filtering logic with asynchronous operations (e.g. network requests).                                                                                                                                                                                                                                          | `boolean`                                    | -       |
| value                                     | The currently value of the dropdown.                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `string`                                     | -       |

### List.Dropdown.Item

A dropdown item in a [List.Dropdown](#list.dropdown)

| Prop                                    | Description                                                                                                                                                                   | Type                                                                                               | Default |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------- |
| title<mark style="color:red;">\*</mark> | The title displayed for the item.                                                                                                                                             | `string`                                                                                           | -       |
| value<mark style="color:red;">\*</mark> | Value of the dropdown item. Make sure to assign each unique value for each item.                                                                                              | `string`                                                                                           | -       |
| icon                                    | An optional icon displayed for the item.                                                                                                                                      | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) | -       |
| keywords                                | An optional property used for providing additional indexable strings for search. When filtering the items in Raycast, the keywords will be searched in addition to the title. | `string[]`                                                                                         | -       |

### List.Dropdown.Section

Visually separated group of dropdown items.

Use sections to group related menu items together.

| Prop     | Description                       | Type              | Default |
| -------- | --------------------------------- | ----------------- | ------- |
| children | The item elements of the section. | `React.ReactNode` | -       |
| title    | Title displayed above the section | `string`          | -       |

A view to display when there aren't any items available. Use to greet users with a friendly message if the\
extension requires user input before it can show any list items e.g. when searching for a package, an article etc.

Raycast provides a default `EmptyView` that will be displayed if the List component either has no children,\
or if it has children, but none of them match the query in the search bar. This too can be overridden by passing an\
empty view alongside the other `List.Item`s.

Note that the `EmptyView` is *never* displayed if the `List`'s `isLoading` property is true and the search bar is empty.

![List EmptyView illustration](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b6810472c5725620a5d412613fdd084fd3b77902%2Flist-empty-view.webp?alt=media)

| Prop        | Description                                              | Type                                                                                               | Default |
| ----------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------- |
| actions     | A reference to an ActionPanel.                           | `React.ReactNode`                                                                                  | -       |
| description | An optional description for why the empty view is shown. | `string`                                                                                           | -       |
| icon        | An icon displayed in the center of the EmptyView.        | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) | -       |
| title       | The main title displayed for the Empty View.             | `string`                                                                                           | -       |

A item in the [List](#list).

This is one of the foundational UI components of Raycast. A list item represents a single entity. It can be a\
GitHub pull request, a file, or anything else. You most likely want to perform actions on this item, so make it clear\
to the user what this list item is about.

| Prop                                    | Description                                                                                                                                                                                         | Type                                                                                                                                                                                                                                     | Default |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| title<mark style="color:red;">\*</mark> | The main title displayed for that item, optionally with a tooltip.                                                                                                                                  | `string` or `{ tooltip?: string; value: string }`                                                                                                                                                                                        | -       |
| accessories                             | An optional array of List.Item.Accessory items displayed on the right side in a List.Item.                                                                                                          | [`List.Item.Accessory`](#list.item.accessory)`[]`                                                                                                                                                                                        | -       |
| actions                                 | An ActionPanel that will be updated for the selected list item.                                                                                                                                     | `React.ReactNode`                                                                                                                                                                                                                        | -       |
| detail                                  | The `List.Item.Detail` to be rendered in the right side area when the parent List is showing details and the item is selected.                                                                      | `React.ReactNode`                                                                                                                                                                                                                        | -       |
| icon                                    | An optional icon displayed for the list item.                                                                                                                                                       | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) or `{ tooltip: string; value:` [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) `}` | -       |
| id                                      | ID of the item. This string is passed to the `onSelectionChange` handler of the List when the item is selected. Make sure to assign each item a unique ID or a UUID will be auto generated.         | `string`                                                                                                                                                                                                                                 | -       |
| keywords                                | An optional property used for providing additional indexable strings for search. When filtering the list in Raycast through the search bar, the keywords will be searched in addition to the title. | `string[]`                                                                                                                                                                                                                               | -       |
| quickLook                               | Optional information to preview files with Quick Look. Toggle the preview with Action.ToggleQuickLook.                                                                                              | `{ name?: string; path: "fs".PathLike }`                                                                                                                                                                                                 | -       |
| subtitle                                | An optional subtitle displayed next to the main title, optionally with a tooltip.                                                                                                                   | `string` or `{ tooltip?: string; value?: string }`                                                                                                                                                                                       | -       |

A Detail view that will be shown in the right-hand-side of the `List`.

When shown, it is recommended not to show any accessories on the `List.Item` and instead bring those additional information in the `List.Item.Detail` view.

![List-detail illustration](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d310e56b42ce2e77b85ecc5909b8bcbe12fa112f%2Flist-detail.webp?alt=media)

| Prop      | Description                                                                                                                   | Type              | Default |
| --------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------- |
| isLoading | Indicates whether a loading bar should be shown or hidden above the detail                                                    | `boolean`         | -       |
| markdown  | The CommonMark string to be rendered in the right side area when the parent List is showing details and the item is selected. | `string`          | -       |
| metadata  | The `List.Item.Detail.Metadata` to be rendered in the bottom side of the `List.Item.Detail`                                   | `React.ReactNode` | -       |

### List.Item.Detail.Metadata

A Metadata view that will be shown in the bottom side of the `List.Item.Detail`.

Use it to display additional structured data about the content of the `List.Item`.

{% tabs %}
{% tab title="Metadata + Markdown" %}
![List Detail-metadata illustration](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-4c02baa9f1d9292a03aa094018b662872ce6e942%2Flist-detail-metadata-split.webp?alt=media)

{% tab title="Metadata Standalone" %}
![List Detail-metadata illustration](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-81529bdb81a2efffcd13a86e8ea913f5cb78a18f%2Flist-detail-metadata-standalone.webp?alt=media)

{% endtab %}
{% endtabs %}

| Prop                                       | Description                        | Type              | Default |
| ------------------------------------------ | ---------------------------------- | ----------------- | ------- |
| children<mark style="color:red;">\*</mark> | The elements of the Metadata view. | `React.ReactNode` | -       |

### List.Item.Detail.Metadata.Label

A title with, optionally, an icon and/or text to its right.

![List Detail-metadata-label illustration](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-d918c5dc5d2c7eaee3011fd542f21afe88b629ce%2Flist-detail-metadata-label.webp?alt=media)

| Prop                                    | Description                                                                                                                | Type                                                                                                            | Default |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------- |
| title<mark style="color:red;">\*</mark> | The title of the item.                                                                                                     | `string`                                                                                                        | -       |
| icon                                    | An icon to illustrate the value of the item.                                                                               | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike)              | -       |
| text                                    | The text value of the item. Specifying `color` will display the text in the provided color. Defaults to Color.PrimaryText. | `string` or `{ color?:` [`Color`](https://developers.raycast.com/api-reference/colors#color)`; value: string }` | -       |

### List.Item.Detail.Metadata.Link

An item to display a link.

![List Detail-metadata-link illustration](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-04a9b7dc4177f80744d123856c2b5aaae9c1f694%2Flist-detail-metadata-link.webp?alt=media)

| Prop                                     | Description                     | Type     | Default |
| ---------------------------------------- | ------------------------------- | -------- | ------- |
| target<mark style="color:red;">\*</mark> | The target of the link.         | `string` | -       |
| text<mark style="color:red;">\*</mark>   | The text value of the item.     | `string` | -       |
| title<mark style="color:red;">\*</mark>  | The title shown above the item. | `string` | -       |

### List.Item.Detail.Metadata.TagList

A list of [`Tags`](#list.item.detail.metadata.taglist.item) displayed in a row.

![List Detail-metadata-tag-list illustration](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-2dee98df60c54a79f38571f7109a787da32dc0e1%2Flist-detail-metadata-tag-list.webp?alt=media)

| Prop                                       | Description                        | Type              | Default |
| ------------------------------------------ | ---------------------------------- | ----------------- | ------- |
| children<mark style="color:red;">\*</mark> | The tags contained in the TagList. | `React.ReactNode` | -       |
| title<mark style="color:red;">\*</mark>    | The title shown above the item.    | `string`          | -       |

### List.Item.Detail.Metadata.TagList.Item

A Tag in a `List.Item.Detail.Metadata.TagList`.

| Prop     | Description                                                                                         | Type                                                                                               | Default |
| -------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------- |
| color    | Changes the text color to the provided color and sets a transparent background with the same color. | [`Color.ColorLike`](https://developers.raycast.com/api-reference/colors#color.colorlike)           | -       |
| icon     | The optional icon tag icon. Required if the tag has no text.                                        | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) | -       |
| onAction | Callback that is triggered when the item is clicked.                                                | `() => void`                                                                                       | -       |
| text     | The optional tag text. Required if the tag has no icon.                                             | `string`                                                                                           | -       |

### List.Item.Detail.Metadata.Separator

A metadata item that shows a separator line. Use it for grouping and visually separating metadata items.

![List Detail-metadata-separator illustration](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-e67bdba1103ac032a5090d87e484e2b35f547f1c%2Flist-detail-metadata-separator.webp?alt=media)

A group of related [List.Item](#list.item).

Sections are a great way to structure your list. For example, group GitHub issues with the same status and order them by priority.\
This way, the user can quickly access what is most relevant.

| Prop     | Description                                                      | Type              | Default |
| -------- | ---------------------------------------------------------------- | ----------------- | ------- |
| children | The List.Item elements of the section.                           | `React.ReactNode` | -       |
| subtitle | An optional subtitle displayed next to the title of the section. | `string`          | -       |
| title    | Title displayed above the section.                               | `string`          | -       |

### List.Item.Accessory

An interface describing an accessory view in a `List.Item`.

![List.Item accessories illustration](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-f9c66d7d4f09101ce3ab239c5dbd509f3304b776%2Flist-item-accessories.webp?alt=media)

| Property                              | Description                                                                                                                                                                                                                                                                                                                                                                     | Type                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| tag<mark style="color:red;">\*</mark> | A string or Date that will be used as the label, optionally colored. The date is formatted relatively to the current time (for example `new Date()` will be displayed as `"now"`, yesterday's Date will be displayed as "1d", etc.). Color changes the text color to the provided color and sets a transparent background with the same color. Defaults to Color.SecondaryText. | `string` or [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) or `undefined` or `null` or `{ color?:` [`Color.ColorLike`](https://developers.raycast.com/api-reference/colors#color.colorlike)`; value: string` or [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) or `undefined` or `null }` |
| text                                  | An optional text that will be used as the label, optionally colored. Color changes the text color to the provided color. Defaults to Color.SecondaryText.                                                                                                                                                                                                                       | `string` or `null` or `{ color?:` [`Color`](https://developers.raycast.com/api-reference/colors#color)`; value: string` or `undefined` or `null }`                                                                                                                                                                                                                                          |
| date                                  | An optional Date that will be used as the label, optionally colored. The date is formatted relatively to the current time (for example `new Date()` will be displayed as `"now"`, yesterday's Date will be displayed as "1d", etc.). Color changes the text color to the provided color. Defaults to Color.SecondaryText.                                                       | [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) or `null` or `{ color?:` [`Color`](https://developers.raycast.com/api-reference/colors#color)`; value:` [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) or `undefined` or `null }`                                                          |
| icon                                  | An optional Image.ImageLike that will be used as the icon.                                                                                                                                                                                                                                                                                                                      | [`Image.ImageLike`](https://developers.raycast.com/api-reference/icons-and-images#image.imagelike) or `null`                                                                                                                                                                                                                                                                                |
| tooltip                               | An optional tooltip shown when the accessory is hovered.                                                                                                                                                                                                                                                                                                                        | `string` or `null`                                                                                                                                                                                                                                                                                                                                                                          |

**Examples:**

Example 1 (typescript):
```typescript
import { useEffect, useState } from "react";
import { Action, ActionPanel, List } from "@raycast/api";

const items = ["Augustiner Helles", "Camden Hells", "Leffe Blonde", "Sierra Nevada IPA"];

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [filteredList, filterList] = useState(items);

  useEffect(() => {
    filterList(items.filter((item) => item.includes(searchText)));
  }, [searchText]);

  return (
    <List
      filtering={false}
      onSearchTextChange={setSearchText}
      navigationTitle="Search Beers"
      searchBarPlaceholder="Search your favorite beer"
    >
      {filteredList.map((item) => (
        <List.Item
          key={item}
          title={item}
          actions={
            <ActionPanel>
              <Action title="Select" onAction={() => console.log(`${item} selected`)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
```

Example 2 (typescript):
```typescript
import { useEffect, useState } from "react";
import { Action, ActionPanel, List } from "@raycast/api";

const items = ["Augustiner Helles", "Camden Hells", "Leffe Blonde", "Sierra Nevada IPA"];

export default function Command() {
  const [searchText, setSearchText] = useState("");

  return (
    <List
      searchText={searchText}
      onSearchTextChange={setSearchText}
      navigationTitle="Search Beers"
      searchBarPlaceholder="Search your favorite beer"
    >
      {items.map((item) => (
        <List.Item
          key={item}
          title={item}
          actions={
            <ActionPanel>
              <Action title="Select" onAction={() => setSearchText(item)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
```

Example 3 (typescript):
```typescript
import { setTimeout } from "node:timers/promises";
import { useState } from "react";
import { List } from "@raycast/api";
import { usePromise } from "@raycast/utils";

export default function Command() {
  const [searchText, setSearchText] = useState("");

  const { isLoading, data, pagination } = usePromise(
    (searchText: string) => async (options: { page: number }) => {
      await setTimeout(200);
      const newData = Array.from({ length: 25 }, (_v, index) => ({
        index,
        page: options.page,
        text: searchText,
      }));
      return { data: newData, hasMore: options.page < 10 };
    },
    [searchText]
  );

  return (
    <List isLoading={isLoading} onSearchTextChange={setSearchText} pagination={pagination}>
      {data?.map((item) => (
        <List.Item
          key={`${item.page} ${item.index} ${item.text}`}
          title={`Page ${item.page} Item ${item.index}`}
          subtitle={item.text}
        />
      ))}
    </List>
  );
}
```

Example 4 (typescript):
```typescript
import { setTimeout } from "node:timers/promises";
import { useCallback, useEffect, useRef, useState } from "react";
import { List } from "@raycast/api";

type State = {
  searchText: string;
  isLoading: boolean;
  hasMore: boolean;
  data: {
    index: number;
    page: number;
    text: string;
  }[];
  nextPage: number;
};
const pageSize = 20;
export default function Command() {
  const [state, setState] = useState<State>({ searchText: "", isLoading: true, hasMore: true, data: [], nextPage: 0 });
  const cancelRef = useRef<AbortController | null>(null);

  const loadNextPage = useCallback(async (searchText: string, nextPage: number, signal?: AbortSignal) => {
    setState((previous) => ({ ...previous, isLoading: true }));
    await setTimeout(500);
    const newData = Array.from({ length: pageSize }, (_v, index) => ({
      index,
      page: nextPage,
      text: searchText,
    }));
    if (signal?.aborted) {
      return;
    }
    setState((previous) => ({
      ...previous,
      data: [...previous.data, ...newData],
      isLoading: false,
      hasMore: nextPage < 10,
    }));
  }, []);

  const onLoadMore = useCallback(() => {
    setState((previous) => ({ ...previous, nextPage: previous.nextPage + 1 }));
  }, []);

  const onSearchTextChange = useCallback(
    (searchText: string) => {
      if (searchText === state.searchText) return;
      setState((previous) => ({
        ...previous,
        data: [],
        nextPage: 0,
        searchText,
      }));
    },
    [state.searchText]
  );

  useEffect(() => {
    cancelRef.current?.abort();
    cancelRef.current = new AbortController();
    loadNextPage(state.searchText, state.nextPage, cancelRef.current?.signal);
    return () => {
      cancelRef.current?.abort();
    };
  }, [loadNextPage, state.searchText, state.nextPage]);

  return (
    <List
      isLoading={state.isLoading}
      onSearchTextChange={onSearchTextChange}
      pagination={{ onLoadMore, hasMore: state.hasMore, pageSize }}
    >
      {state.data.map((item) => (
        <List.Item
          key={`${item.page} ${item.index} ${item.text}`}
          title={`Page ${item.page} Item ${item.index}`}
          subtitle={item.text}
        />
      ))}
    </List>
  );
}
```

---

## User Interface

**URL:** llms-txt#user-interface

**Contents:**
- Rendering

Raycast uses React for its user interface declaration and renders the supported elements to our native UI. The API comes with a set of UI components that you can use to build your extensions. Think of it as a design system. The high-level components are the following:

* [List](https://developers.raycast.com/api-reference/user-interface/list) to show multiple similar items, f.e. a list of your open todos.
* [Grid](https://developers.raycast.com/api-reference/user-interface/grid) similar to a List but with more legroom to show an image for each item, f.e. a collection of icons.
* [Detail](https://developers.raycast.com/api-reference/user-interface/detail) to present more information, f.e. the details of a GitHub pull request.
* [Form](https://developers.raycast.com/api-reference/user-interface/form) to create new content, f.e. filing a bug report.

Each component can provide interaction via an [ActionPanel](https://developers.raycast.com/api-reference/user-interface/action-panel). The panel has a list of [Actions](https://developers.raycast.com/api-reference/user-interface/actions) where each one can be associated with a [keyboard shortcut](https://developers.raycast.com/api-reference/keyboard). Shortcuts allow users to use Raycast without using their mouse.

To render a user interface, you need to do the following:

* Set the `mode` to `view` in the [`package.json` manifest file](https://developers.raycast.com/information/manifest#command-properties)
* Export a React component from your command entry file

As a general rule of thumb, you should render something as quickly as possible. This guarantees that your command feels responsive. If you don't have data available to show, you can set the `isLoading` prop to `true` on top-level components such as [`<Detail>`](https://developers.raycast.com/api-reference/user-interface/detail), [`<Form>`](https://developers.raycast.com/api-reference/user-interface/form), or [`<List>`](https://developers.raycast.com/api-reference/user-interface/list). It shows a loading indicator at the top of Raycast.

Here is an example that shows a loading indicator for 2 seconds after the command got launched:

**Examples:**

Example 1 (typescript):
```typescript
import { List } from "@raycast/api";
import { useEffect, useState } from "react";

export default function Command() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  return <List isLoading={isLoading}>{/* Render your data */}</List>;
}
```

---

## Icons

**URL:** llms-txt#icons

---

## Feedback

**URL:** llms-txt#feedback

Raycast has several ways to provide feedback to the user:

* [Toast](https://developers.raycast.com/api-reference/feedback/toast) *- when an asynchronous operation is happening or when an error is thrown*
* [HUD](https://developers.raycast.com/api-reference/feedback/hud) *- to confirm an action worked after closing Raycast*
* [Alert](https://developers.raycast.com/api-reference/feedback/alert) *- to ask for confirmation before taking an action*

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-607b51d1dc3e47c6cdff37be217a0e4d42368a57%2Ftoast.webp?alt=media)

---

## Pikachu

**URL:** llms-txt#pikachu

![](https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png)

Pikachu that can generate powerful electricity have cheek sacs that are extra soft and super stretchy.
`;

export default function Main() {
  return (
    <Detail
      markdown={markdown}
      navigationTitle="Pikachu"
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Height" text={`1' 04"`} />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label title="Weight" text="13.2 lbs" />
        </Detail.Metadata>
      }
    />
  );
}
```

---

## Colors

**URL:** llms-txt#colors

**Contents:**
- API Reference
  - Color
- Types
  - Color.ColorLike
  - Color.Dynamic
  - Color.Raw

Anywhere you can pass a color in a component prop, you can pass either:

* A standard [Color](#color)
* A [Dynamic](#color.dynamic) Color
* A [Raw](#color.raw) Color

The standard colors. Use those colors for consistency.

The colors automatically adapt to the Raycast theme (light or dark).

#### Enumeration members

| Name          | Dark Theme                                                                                                                                                                                                                | Light Theme                                                                                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Blue          | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-bb792f0278bbeea127bab32134a0addabe1f471d%2Fcolor-dark-blue.webp?alt=media)           | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-b5fd11b78553af9231fec2bbd2065fa5b21daccd%2Fcolor-blue.webp?alt=media)           |
| Green         | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-1f26f61f56df07565cd4749355f553c998856c75%2Fcolor-dark-green.webp?alt=media)          | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-0ecfe804320264a9ea87283aaa994930f7cb4d7d%2Fcolor-green.webp?alt=media)          |
| Magenta       | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-460fbc6e16fa66a017a31462d181e1b7db1299f1%2Fcolor-dark-magenta.webp?alt=media)        | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-aab0de01b6ee3f98eedd291af31708cc27c1bceb%2Fcolor-magenta.webp?alt=media)        |
| Orange        | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-5c867edbcb01e9fb71ddbfd0351ec7e19cadbec2%2Fcolor-dark-orange.webp?alt=media)         | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a80e366e832757469108afcaddff62f3aeb1d3a0%2Fcolor-orange.webp?alt=media)         |
| Purple        | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6e5cba871d9c05aa374915445a220b40f3838aeb%2Fcolor-dark-purple.webp?alt=media)         | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-eb0b963fade8b81c5680524e646b95ebb223476e%2Fcolor-purple.webp?alt=media)         |
| Red           | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-ffb7f9534f418f2c52ff9983abbb886df9496f9f%2Fcolor-dark-red.webp?alt=media)            | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-73815c38fa3cbc20735f01160de3d9172a277cb1%2Fcolor-red.webp?alt=media)            |
| Yellow        | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-970d9768755133d23b1e27ff90b72b78e4753bad%2Fcolor-dark-yellow.webp?alt=media)         | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-656146171a1eb17d688bb5bc16eb442f955a6cf3%2Fcolor-yellow.webp?alt=media)         |
| PrimaryText   | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-46bb91f2a4e7d5a5ebe2b6e358560c6f5933ed47%2Fcolor-dark-primary-text.webp?alt=media)   | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-a2b368984466f481e372240d508588bb603f88bb%2Fcolor-primary-text.webp?alt=media)   |
| SecondaryText | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-eb8e7a97fd21d5853b9c40bc47634e4b8033585e%2Fcolor-dark-secondary-text.webp?alt=media) | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-6302cb6111a94d075871bbc02b7d39b124eb70dd%2Fcolor-secondary-text.webp?alt=media) |

Union type for the supported color types.

When using a [Raw Color](#color.raw), it will be adjusted to achieve high contrast with the Raycast user interface. To disable color adjustment, you need to switch to using a [Dynamic Color](#color.dynamic). However, we recommend leaving color adjustment on, unless your extension depends on exact color reproduction.

A dynamic color applies different colors depending on the active Raycast theme.

When using a [Dynamic Color](#color.dynamic), it will be adjusted to achieve high contrast with the Raycast user interface. To disable color adjustment, you can set the `adjustContrast` property to `false`. However, we recommend leaving color adjustment on, unless your extension depends on exact color reproduction.

| Property                                | Description                                                         | Type      |
| --------------------------------------- | ------------------------------------------------------------------- | --------- |
| dark<mark style="color:red;">\*</mark>  | The color which is used in dark theme.                              | `string`  |
| light<mark style="color:red;">\*</mark> | The color which is used in light theme.                             | `string`  |
| adjustContrast                          | Enables dynamic contrast adjustment for light and dark theme color. | `boolean` |

A color can also be a simple string. You can use any of the following color formats:

* HEX, e.g `#FF0000`
* Short HEX, e.g. `#F00`
* RGBA, e.g. `rgb(255, 0, 0)`
* RGBA Percentage, e.g. `rgb(255, 0, 0, 1.0)`
* HSL, e.g. `hsla(200, 20%, 33%, 0.2)`
* Keywords, e.g. `red`

**Examples:**

Example 1 (typescript):
```typescript
import { Color, Icon, List } from "@raycast/api";

export default function Command() {
  return (
    <List>
      <List.Item title="Blue" icon={{ source: Icon.Circle, tintColor: Color.Blue }} />
      <List.Item title="Green" icon={{ source: Icon.Circle, tintColor: Color.Green }} />
      <List.Item title="Magenta" icon={{ source: Icon.Circle, tintColor: Color.Magenta }} />
      <List.Item title="Orange" icon={{ source: Icon.Circle, tintColor: Color.Orange }} />
      <List.Item title="Purple" icon={{ source: Icon.Circle, tintColor: Color.Purple }} />
      <List.Item title="Red" icon={{ source: Icon.Circle, tintColor: Color.Red }} />
      <List.Item title="Yellow" icon={{ source: Icon.Circle, tintColor: Color.Yellow }} />
      <List.Item title="PrimaryText" icon={{ source: Icon.Circle, tintColor: Color.PrimaryText }} />
      <List.Item title="SecondaryText" icon={{ source: Icon.Circle, tintColor: Color.SecondaryText }} />
    </List>
  );
}
```

Example 2 (typescript):
```typescript
ColorLike: Color | Color.Dynamic | Color.Raw;
```

Example 3 (typescript):
```typescript
import { Color, Icon, List } from "@raycast/api";

export default function Command() {
  return (
    <List>
      <List.Item title="Built-in color" icon={{ source: Icon.Circle, tintColor: Color.Red }} />
      <List.Item title="Raw color" icon={{ source: Icon.Circle, tintColor: "#FF0000" }} />
      <List.Item
        title="Dynamic color"
        icon={{
          source: Icon.Circle,
          tintColor: {
            light: "#FF01FF",
            dark: "#FFFF50",
            adjustContrast: true,
          },
        }}
      />
    </List>
  );
}
```

Example 4 (typescript):
```typescript
import { Icon, List } from "@raycast/api";

export default function Command() {
  return (
    <List>
      <List.Item
        title="Dynamic Tint Color"
        icon={{
          source: Icon.Circle,
          tintColor: {
            light: "#FF01FF",
            dark: "#FFFF50",
            adjustContrast: false,
          },
        }}
      />
      <List.Item
        title="Dynamic Tint Color"
        icon={{
          source: Icon.Circle,
          tintColor: { light: "#FF01FF", dark: "#FFFF50" },
        }}
      />
    </List>
  );
}
```

---

## Toast

**URL:** llms-txt#toast

**Contents:**
- API Reference
  - showToast
- Types
  - Toast
  - Toast.Options
  - Toast.Style
  - Toast.ActionOptions

When an asynchronous operation is happening or when an error is thrown, it's usually a good idea to keep the user informed about it. Toasts are made for that.

Additionally, Toasts can have some actions associated to the action they are about. For example, you could provide a way to cancel an asynchronous operation, undo an action, or copy the stack trace of an error.

{% hint style="info" %}
The `showToast()` will fallback to [showHUD()](https://developers.raycast.com/api-reference/hud#showhud) if the Raycast window is closed.
{% endhint %}

![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-607b51d1dc3e47c6cdff37be217a0e4d42368a57%2Ftoast.webp?alt=media)

Creates and shows a Toast with the given [options](#toast.options).

When showing an animated Toast, you can later on update it:

| Name                                      | Description                         | Type                                                                                |
| ----------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------- |
| options<mark style="color:red;">\*</mark> | The options to customize the Toast. | [`Alert.Options`](https://developers.raycast.com/api-reference/alert#alert.options) |

A Promise that resolves with the shown Toast. The Toast can be used to change or hide it.

A Toast with a certain style, title, and message.

Use [showToast](#showtoast) to create and show a Toast.

| Property                                          | Description                                                                                                        | Type                                                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| message<mark style="color:red;">\*</mark>         | An additional message for the Toast. Useful to show more information, e.g. an identifier of a newly created asset. | `string`                                                                                        |
| primaryAction<mark style="color:red;">\*</mark>   | The primary Action the user can take when hovering on the Toast.                                                   | [`Alert.ActionOptions`](https://developers.raycast.com/api-reference/alert#alert.actionoptions) |
| secondaryAction<mark style="color:red;">\*</mark> | The secondary Action the user can take when hovering on the Toast.                                                 | [`Alert.ActionOptions`](https://developers.raycast.com/api-reference/alert#alert.actionoptions) |
| style<mark style="color:red;">\*</mark>           | The style of a Toast.                                                                                              | [`Action.Style`](https://developers.raycast.com/user-interface/actions#action.style)            |
| title<mark style="color:red;">\*</mark>           | The title of a Toast. Displayed on the top.                                                                        | `string`                                                                                        |

| Name | Type                  | Description      |
| ---- | --------------------- | ---------------- |
| hide | `() => Promise<void>` | Hides the Toast. |
| show | `() => Promise<void>` | Shows the Toast. |

The options to create a [Toast](#toast).

| Property                                | Description                                                                                                        | Type                                                                                            |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| title<mark style="color:red;">\*</mark> | The title of a Toast. Displayed on the top.                                                                        | `string`                                                                                        |
| message                                 | An additional message for the Toast. Useful to show more information, e.g. an identifier of a newly created asset. | `string`                                                                                        |
| primaryAction                           | The primary Action the user can take when hovering on the Toast.                                                   | [`Alert.ActionOptions`](https://developers.raycast.com/api-reference/alert#alert.actionoptions) |
| secondaryAction                         | The secondary Action the user can take when hovering on the Toast.                                                 | [`Alert.ActionOptions`](https://developers.raycast.com/api-reference/alert#alert.actionoptions) |
| style                                   | The style of a Toast.                                                                                              | [`Action.Style`](https://developers.raycast.com/user-interface/actions#action.style)            |

Defines the visual style of the Toast.

Use [Toast.Style.Success](#toast.style) for confirmations and [Toast.Style.Failure](#toast.style) for displaying errors.\
Use [Toast.Style.Animated](#toast.style) when your Toast should be shown until a process is completed.\
You can hide it later by using [Toast.hide](#toast) or update the properties of an existing Toast.

#### Enumeration members

| Name     | Value                                                                                                                                                                                                          |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Animated | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-7e62989ba2fea14db0967e09bb5bfaf84706e12d%2Ftoast-animated.webp?alt=media) |
| Success  | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-dce0b170c3e47fa4c5525e1a0a74600350006445%2Ftoast-success.webp?alt=media)  |
| Failure  | ![](https://2922539984-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Me_8A39tFhZg3UaVoSN%2Fuploads%2Fgit-blob-96a3cfd7aaec6933c18481f6228bb647093217ff%2Ftoast-failure.webp?alt=media)  |

### Toast.ActionOptions

The options to create a [Toast](#toast) Action.

| Property                                   | Description                                     | Type                                                                             |
| ------------------------------------------ | ----------------------------------------------- | -------------------------------------------------------------------------------- |
| onAction<mark style="color:red;">\*</mark> | A callback called when the action is triggered. | `(toast:` [`Toast`](#toast)`) => void`                                           |
| title<mark style="color:red;">\*</mark>    | The title of the action.                        | `string`                                                                         |
| shortcut                                   | The keyboard shortcut for the action.           | [`Keyboard.Shortcut`](https://developers.raycast.com/keyboard#keyboard.shortcut) |

**Examples:**

Example 1 (typescript):
```typescript
async function showToast(options: Toast.Options): Promise<Toast>;
```

Example 2 (typescript):
```typescript
import { showToast, Toast } from "@raycast/api";

export default async function Command() {
  const success = false;

  if (success) {
    await showToast({ title: "Dinner is ready", message: "Pizza margherita" });
  } else {
    await showToast({
      style: Toast.Style.Failure,
      title: "Dinner isn't ready",
      message: "Pizza dropped on the floor",
    });
  }
}
```

Example 3 (typescript):
```typescript
import { showToast, Toast } from "@raycast/api";
import { setTimeout } from "timers/promises";

export default async function Command() {
  const toast = await showToast({
    style: Toast.Style.Animated,
    title: "Uploading image",
  });

  try {
    // upload the image
    await setTimeout(1000);

    toast.style = Toast.Style.Success;
    toast.title = "Uploaded image";
  } catch (err) {
    toast.style = Toast.Style.Failure;
    toast.title = "Failed to upload image";
    if (err instanceof Error) {
      toast.message = err.message;
    }
  }
}
```

Example 4 (typescript):
```typescript
import { showToast, Toast } from "@raycast/api";

export default async function Command() {
  const options: Toast.Options = {
    style: Toast.Style.Success,
    title: "Finished cooking",
    message: "Delicious pasta for lunch",
    primaryAction: {
      title: "Do something",
      onAction: (toast) => {
        console.log("The toast action has been triggered");
        toast.hide();
      },
    },
  };
  await showToast(options);
}
```

---
