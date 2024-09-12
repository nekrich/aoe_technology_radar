import { NextRouter, useRouter } from "next/router.js";

import { Item } from "./types";

export function GetTagsFilter(router: NextRouter) {
  const tag = router.query.tag ? router.query.tag : router.query["tags[]"];
  const activeTags = Array.isArray(tag) ? tag : tag ? [tag] : [];
  return activeTags;
}

function normalizeURLQueryString(queryString: string) {
  return queryString.split("%5B%5D=").join("[]=");
}

export function GetTagFilterURLQueryParams() {
  const router = useRouter();
  const tags = GetTagsFilter(router);
  const queryParams = new URLSearchParams();
  tags.forEach((tag) => queryParams.append("tags[]", tag));

  return normalizeURLQueryString(queryParams.toString());
}

export function TagHref(
  tag: string,
  isActive: boolean | undefined,
  hrefIncludeCurrentPath: boolean | undefined,
) {
  const router = useRouter();

  // Convert router.query dict to URLSearchParams.
  const queryParams = new URLSearchParams();
  for (const key in router.query) {
    const value = router.query[key];
    if (Array.isArray(value)) {
      value.forEach((v) => queryParams.append(key, v));
    } else {
      queryParams.append(key, router.query[key] as string);
    }
  }

  // Convert tag query parameter to tags[].
  if (queryParams.has("tag")) {
    queryParams.append("tags[]", queryParams.get("tag") as string);
    queryParams.delete("tag");
  }

  // Update the tag query parameter.
  // If tag is active, remove it from the query string.
  if (isActive) {
    queryParams.delete("tags[]", tag);
  } else {
    queryParams.append("tags[]", tag);
  }

  // Convert URLSearchParams to query string.
  // Replace %5B%5D= with []= to be more readable.
  const queryString = normalizeURLQueryString(queryParams.toString());

  const hrefPrefix = hrefIncludeCurrentPath ? router.pathname : "/";

  // Return the query string.
  return queryString.length ? `${hrefPrefix}?${queryString}` : hrefPrefix;
}

export const FilterByTagsFilter = (tagsFilter: string[]) => (item: Item) => {
  if (!tagsFilter.length) return true;
  return (
    item.tags?.filter((itemTag) => tagsFilter!.includes(itemTag)).length ===
    tagsFilter.length
  );
};
