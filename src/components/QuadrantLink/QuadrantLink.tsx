import Link from "next/link";

import styles from "./QuadrantLink.module.css";

import Pie from "@/components/Icons/Pie";
import { getLabel, getToggle } from "@/lib/data";
import { Quadrant } from "@/lib/types";
import { cn } from "@/lib/utils";
import { GetTagFilterURLQueryParams } from "@/lib/utilx";

interface QuadrantLinkProps {
  quadrant: Quadrant;
  label?: string;
  className?: string;
}
export function QuadrantLink({
  quadrant,
  label = getLabel("zoomIn"),
  className,
}: QuadrantLinkProps) {
  const showTagFilterInQuadrants = getToggle("showTagFilterInQuadrants");
  const tagFilterURLQueryParams = GetTagFilterURLQueryParams();
  const quadrantsQuery =
    showTagFilterInQuadrants && tagFilterURLQueryParams.length
      ? `/?${tagFilterURLQueryParams}`
      : "";

  return (
    <Link
      className={cn(styles.link, className)}
      href={`/${quadrant.id}${quadrantsQuery}`}
    >
      <Pie className={styles.icon} />
      <span className={styles.label}>{label}</span>
    </Link>
  );
}
