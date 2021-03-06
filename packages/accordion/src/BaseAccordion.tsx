import { Button, IButtonProps } from "@cheaaa/button";
import { getClassName, IThemedProps } from "@cheaaa/theme";
import {
  useState,
  useRef,
  useEffect,
  ReactNode,
  useMemo,
  forwardRef,
} from "react";
import { Classes } from "jss";
import React from "react";

import { Icon } from "./Icon";
import { ComponentNames } from "./styles/types";

export type GetHeightStylesFn = (args: {
  isOpen: boolean;
  height: number;
}) => number;

export interface IBaseAccordionProps extends IThemedProps {
  /**
   * Текст на Title Button.
   */
  title?:
    | string
    | ReactNode
    | ((args: { isOpen: boolean }) => string | ReactNode);
  children: ReactNode;
  isOpen?: boolean;

  /**
   * Длительность анимации разворачивания, не больше 0.5s
   *
   */
  animationDuration?: `0.${number}s`;

  /**
   * Функция для вычисления кастомной высоты body. Принимает isOpen и высчитанную высоту самим компонентом
   */
  getHeightStyles?: GetHeightStylesFn;

  /**
   * Props для кастомизации Title Button,
   */
  titleButtonProps?: IButtonProps<any>;
  // TODO Типизирование передаваемого кастомного компонента вместо кнокпи не удалось нормально сделать
  // достаточно болезненное занятие, что бы при передаче компонента показывались пропсы которые относятся к нему

  classes: Classes<string>;
  defaultTitleButtonAppearance: string;
}

export interface IAccordionChildrenProps {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BaseAccordion = forwardRef<HTMLDivElement, IBaseAccordionProps>(
  (
    {
      baseAppearance = "base",
      appearance = "base",
      isOpen: isOpenProps = false,
      title: titleProps,
      children,
      getHeightStyles,
      titleButtonProps = {},
      animationDuration = "0.2s",
      defaultTitleButtonAppearance,
      classes,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(isOpenProps);
    const [height, setHeight] = useState(0);
    const bodyRef = useRef<HTMLDivElement>(null);
    const childrenWrapperRef = useRef<HTMLDivElement>(null);
    const [isFullOpened, setIsFullOpened] = useState(isOpenProps);

    const animationRef = useRef<any>(true);

    useEffect(() => {
      let timeout: ReturnType<typeof setTimeout> | null = null;
      const observer = new ResizeObserver(([entry]) => {
        animationRef.current = false;
        setHeight(entry.contentRect.height);
        timeout = setTimeout(() => {
          animationRef.current = true;
        }, 600);
      });
      childrenWrapperRef.current &&
        observer.observe(childrenWrapperRef.current);

      return () => {
        timeout && clearTimeout(timeout);
        childrenWrapperRef.current &&
          observer.unobserve(childrenWrapperRef.current);
      };
    }, []);

    useEffect(() => {
      setIsOpen(isOpenProps);
    }, [isOpenProps]);

    useEffect(() => {
      let timeout: ReturnType<typeof setTimeout> | null = null;

      if (isOpen) {
        timeout = setTimeout(() => {
          setIsFullOpened(true);
        }, 600);
      } else {
        setIsFullOpened(false);
      }

      return () => {
        timeout && clearTimeout(timeout);
      };
    }, [isOpen]);

    const classNames = useMemo(() => {
      const wrapperClassName = getClassName<ComponentNames>(
        classes,
        baseAppearance,
        appearance,
        "wrapper"
      );
      const titleClassName = getClassName<ComponentNames>(
        classes,
        baseAppearance,
        appearance,
        "title"
      );
      const iconClassName = getClassName<ComponentNames>(
        classes,
        baseAppearance,
        appearance,
        "icon"
      );
      const bodyClassName = getClassName<ComponentNames>(
        classes,
        baseAppearance,
        appearance,
        "body"
      );
      const childrenWrapperClassName = getClassName<ComponentNames>(
        classes,
        baseAppearance,
        appearance,
        "childrenWrapper"
      );

      return {
        wrapperClassName,
        titleClassName,
        iconClassName,
        bodyClassName,
        childrenWrapperClassName,
      };
    }, [classes, baseAppearance, appearance]);

    const _height = useMemo(() => {
      if (getHeightStyles) {
        return getHeightStyles({ isOpen, height });
      }

      return isOpen ? height : 0;
    }, [getHeightStyles, isOpen, height]);

    const title = useMemo(() => {
      return typeof titleProps === "function"
        ? titleProps({ isOpen })
        : titleProps;
    }, [titleProps, isOpen]);

    return (
      <div className={classNames.wrapperClassName} ref={ref}>
        <Button
          shouldFitContent
          onClick={() => setIsOpen(!isOpen)}
          appearance={
            titleButtonProps.appearance || defaultTitleButtonAppearance
          }
          {...titleButtonProps}
        >
          <Icon
            className={classNames.iconClassName}
            data-is-open={String(!!isOpen)}
          />

          {title}
        </Button>
        <div
          ref={bodyRef}
          className={classNames.bodyClassName}
          data-is-opened={String(!!isFullOpened)}
          style={{
            height: _height,
            transition: animationRef.current ? animationDuration : undefined,
          }}
        >
          <div
            ref={childrenWrapperRef}
            className={classNames.childrenWrapperClassName}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);
