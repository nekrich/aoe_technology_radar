import Link from "next/link";

import styles from "./Navigation.module.css";

import IconOverview from "@/components/Icons/Overview";
import IconQuestion from "@/components/Icons/Question";
import IconSearch from "@/components/Icons/Search";
import { getLabel, getToggle } from "@/lib/data";
import { GetTagFilterURLQueryParams } from "@/lib/utilx";

export function Navigation() {
  const showTagFilterInOverview = getToggle("showTagFilterInOverview");
  const tagFilterURLQueryParams = GetTagFilterURLQueryParams();
  const overviewQuery =
    showTagFilterInOverview && tagFilterURLQueryParams.length
      ? `/?${tagFilterURLQueryParams}`
      : "";
  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <Link href="/help-and-about-tech-radar">
            <IconQuestion className={styles.icon} />
            <span className={styles.label}>{getLabel("pageAbout")}</span>
          </Link>
        </li>
        <li className={styles.item}>
          <Link href={`/overview${overviewQuery}`}>
            <IconOverview className={styles.icon} />
            <span className={styles.label}>{getLabel("pageOverview")}</span>
          </Link>
        </li>
        {getToggle("showSearch") && (
          <li className={styles.item}>
            <Link href="/overview">
              <IconSearch className={styles.icon} />
              <span className={styles.label}>{getLabel("pageSearch")}</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
