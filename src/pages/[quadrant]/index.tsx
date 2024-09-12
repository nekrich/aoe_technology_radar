import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { RingList } from "@/components/RingList/RingList";
import { Tag } from "@/components/Tags/Tags";
import {
  getItems,
  getQuadrant,
  getQuadrants,
  getTags,
  getToggle,
  sortByFeaturedAndTitle,
} from "@/lib/data";
import { formatTitle } from "@/lib/format";
import { FilterByTagsFilter, GetTagsFilter } from "@/lib/utilx";
import { CustomPage } from "@/pages/_app";

const QuadrantPage: CustomPage = () => {
  const router = useRouter();
  const query = router.query;
  const quadrant = getQuadrant(query.quadrant as string);
  const tags = getTags();
  const tagsFilter = GetTagsFilter(router);

  const items = useMemo(
    () =>
      quadrant?.id &&
      getItems(quadrant.id)
        .filter(FilterByTagsFilter(tagsFilter))
        .sort(sortByFeaturedAndTitle),
    [quadrant?.id, tagsFilter],
  );
  if (!quadrant || !items) return null;

  var tagElements;
  if (getToggle("showTagFilterInQuadrants") && tags.length > 0) {
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
        <title>{formatTitle(quadrant.title)}</title>
        <meta name="description" content={quadrant.description} />
      </Head>

      <h1>{quadrant.title}</h1>
      <h2>{quadrant.description}</h2>

      <RingList items={items} />

      <br />
      <h5>Tags filter: {tagElements}</h5>
    </>
  );
};

export default QuadrantPage;

export const getStaticPaths = async () => {
  const quadrants = getQuadrants();
  const paths = quadrants.map((quadrant) => ({
    params: { quadrant: quadrant.id },
  }));

  return { paths, fallback: false };
};

export const getStaticProps = async () => {
  return { props: {} };
};
