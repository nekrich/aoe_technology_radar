import Fuse from "fuse.js";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import { Filter } from "@/components/Filter/Filter";
import { ItemList } from "@/components/ItemList/ItemList";
import { Tag } from "@/components/Tags/Tags";
import { getItems, getLabel, getTags, getToggle } from "@/lib/data";
import { formatTitle } from "@/lib/format";
import { Item } from "@/lib/types";
import { FilterByTagsFilter, GetTagsFilter } from "@/lib/utilx";
import { CustomPage } from "@/pages/_app";

const Overview: CustomPage = () => {
  const title = getLabel("pageOverview");
  const router = useRouter();
  const ring = router.query.ring as string | undefined;
  const query = (router.query.query as string) || "";
  const tags = getTags();
  const tagsFilter = GetTagsFilter(router);

  const onRingChange = useCallback(
    (ring: string) => {
      router.push({ query: { ...router.query, ring, query } });
    },
    [router, query],
  );

  const onQueryChange = useCallback(
    (query: string) => {
      router.replace({ query: { ...router.query, ring, query } });
    },
    [router, ring],
  );

  const { items, index } = useMemo(() => {
    const items = getItems()
      .filter((item) => !ring || item.ring === ring)
      .filter(FilterByTagsFilter(tagsFilter));
    const index = new Fuse(items, {
      threshold: 0.4,
      distance: 600,
      includeScore: true,
      keys: [
        {
          name: "title",
          weight: 1.5,
        },
        {
          name: "tags",
          weight: 1,
        },
        {
          name: "body",
          weight: 0.9,
        },
        {
          name: "revision.body",
          weight: 0.7,
        },
      ],
    });

    return { items, index };
  }, [ring, tagsFilter]);

  const results = useMemo(() => {
    if (!query) return items;
    return index.search(query).map((result) => result.item);
  }, [query, index, items]);

  var tagElements;
  if (getToggle("showTagFilterInOverview") && tags.length > 0) {
    tagElements = tags.map((tag) => (
      <Tag
        key={tag}
        tag={tag}
        isActive={tagsFilter.includes(tag)}
        scroll={true}
        hrefIncludeCurrentPath
      />
    ));
  }

  return (
    <>
      <Head>
        <title>{formatTitle(title)}</title>
      </Head>
      <h1>{title}</h1>
      <Filter
        query={query}
        ring={ring}
        onRingChange={onRingChange}
        onQueryChange={onQueryChange}
      />
      <ItemList items={results} size="large" hideRing={!!ring} />
      <br />
      Tags filter: {tagElements}
    </>
  );
};

export default Overview;
