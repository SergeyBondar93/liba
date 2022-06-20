import { getClassName } from "@cheaaa/theme";
import { PropsWithChildren, useCallback, useMemo } from "react";

import { useStyles } from "./styles/styles";
import { ComponentNames } from "./styles/types";

export type ButtonTags = "button" | "span" | "a";

export interface IButtonProps extends PropsWithChildren {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

  href?: string;
  target?: "_self" | "_blank" | "_parent" | "_top";

  baseAppearance?: string;

  appearance?: string;

  type?: "button" | "reset" | "submit";

  /* custom component */
  component?: React.ElementType;
  /* styles */
  shouldFitContent?: boolean;
  disabled?: boolean;
}

export const getElement = (disabled?: boolean, href?: string): ButtonTags => {
  if (href) {
    return disabled ? "span" : "a";
  }

  return "button";
};

export const Button = ({
  baseAppearance = "base",
  appearance = "base",
  type = "button",
  component: Component,
  disabled,
  href,
  onClick: onClickProps,
  shouldFitContent,
  ...props
}: IButtonProps) => {
  const classes = useStyles();

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
      !disabled && onClickProps?.(e),
    [disabled, onClickProps]
  );

  const Element = useMemo(
    () => Component ?? getElement(disabled, href),
    [Component, disabled, href]
  );

  const className = useMemo(() => {
    return getClassName<ComponentNames>(
      classes,
      baseAppearance,
      appearance,
      "wrapper"
    );
  }, [classes, baseAppearance, appearance]);

  return (
    <Element
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      href={disabled ? undefined : href}
      shouldfitcontent={String(shouldFitContent)}
      {...props}
    />
  );
};
