import Link, { LinkProps } from "next/link";
import { ComponentPropsWithoutRef } from "react";

import styles from "./Tags.module.css";

import IconRemove from "@/components/Icons/Close";
import IconTag from "@/components/Icons/Tag";
import { getLabel } from "@/lib/data";
import { cn } from "@/lib/utils";
import { TagHref } from "@/lib/utilx";

type TagProps = {
  tag: string;
  isActive?: boolean;
  hrefIncludeCurrentPath?: boolean;
} & Omit<LinkProps, "href"> &
  ComponentPropsWithoutRef<"a">;

export function Tag({
  tag,
  isActive,
  hrefIncludeCurrentPath,
  className,
  ...props
}: TagProps) {
  const Icon = isActive ? IconRemove : IconTag;
  return (
    <Link
      {...props}
      className={cn(styles.tag, className, isActive && styles.active)}
      href={TagHref(tag, isActive, hrefIncludeCurrentPath)}
    >
      <Icon className={cn(styles.icon)} />
      <span className={styles.label}>{tag}</span>
    </Link>
  );
}

interface TagsProps {
  tags: string[];
  activeTags?: string[];
  className?: string;
  hrefIncludeCurrentPath?: boolean;
}

export function Tags({
  tags,
  activeTags,
  className,
  hrefIncludeCurrentPath,
}: TagsProps) {
  const label = getLabel("filterByTag");
  const activeTagsList = activeTags || [];
  return (
    <div className={cn(styles.tags, className)}>
      {!!label && <h3>{label}</h3>}
      {tags.map((tag) => (
        <Tag
          key={tag}
          tag={tag}
          isActive={activeTagsList.includes(tag)}
          scroll={false}
          hrefIncludeCurrentPath
        />
      ))}
    </div>
  );
}
