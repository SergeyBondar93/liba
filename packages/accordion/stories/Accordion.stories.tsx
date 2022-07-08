import { useState } from "react";
import { CheckboxGroup, Switcher } from "@cheaaa/checkbox";
import { Meta } from "@storybook/react";
import { ThemeProvider } from "react-jss";

import { Accordion } from "../src";

import { theme } from "./theme";

const disabled = {
  table: {
    disable: true,
  },
};
export default {
  component: Accordion,
  title: "Accordion",
  argTypes: {
    appearance: disabled,
    baseAppearance: disabled,
    title: disabled,
    children: disabled,
    getHeightStyles: disabled,
  },
  parameters: {
    backgrounds: {
      default: "lightblue",
      values: [{ name: "lightblue", value: "#E5ECF7" }],
    },
  },
} as Meta;

const Weekdays = () => {
  const [value, setValue] = useState<string[]>([]);

  const handleChange = (newValue: string[], clickedBy: string) => {
    if (clickedBy === "fullWeekend") {
      const newValues = newValue.includes("fullWeekend")
        ? [...new Set([...newValue, "saturday", "sunday"])]
        : newValue.filter((day) => !["saturday", "sunday"].includes(day));

      setValue(newValues);

      return;
    }

    setValue(newValue);
  };

  const isFullWeekend = value.includes("fullWeekend");
  const options = [
    {
      value: "monday",
      label: "Понедельник",
    },
    {
      value: "tuesday",
      label: "Вторник",
    },
    {
      value: "wednesday",
      label: "Среда",
    },
    {
      value: "thursday",
      label: "Четверг",
    },
    {
      value: "friday",
      label: "Пятница",
    },
    {
      value: "fullWeekend",
      label: "Полные выходные",
    },
    {
      value: "saturday",
      label: "Суббота",
      disabled: isFullWeekend,
    },
    {
      value: "sunday",
      label: "Воскресенье",
      disabled: isFullWeekend,
    },
  ].map((option) => ({ ...option, appearance: "filters" }));

  return (
    <CheckboxGroup value={value} onChange={handleChange} options={options} />
  );
};

const AccordionTemplate = () => {
  const [isOpenAll, setIsOpenAll] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Switcher checked={isOpenAll} onChange={setIsOpenAll} label="Open All" />
      <div
        style={{
          width: "320px",
          background: "white",
          borderRadius: "10px",
        }}
      >
        <Accordion isOpen={isOpenAll} title={"Дни недели"}>
          <Weekdays />
        </Accordion>
        <Accordion isOpen={isOpenAll} title={"Дни недели"}>
          <Weekdays />
        </Accordion>
        <Accordion isOpen={isOpenAll} title={"Дни недели"}>
          <Weekdays />
        </Accordion>
        <Accordion isOpen={isOpenAll} title={"Дни недели"}>
          <Weekdays />
        </Accordion>
      </div>
    </ThemeProvider>
  );
};

export const AccordionStory = AccordionTemplate.bind({});

AccordionStory.args = {
  disabled: false,
};

const CustomHeightTemplate = () => {
  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          width: "320px",
          background: "white",
          borderRadius: "10px",
        }}
      >
        <Accordion
          getHeightStyles={({ isOpen }) =>
            isOpen ? window.innerHeight - 80 : 0
          }
          title={"Дни недели"}
        >
          <Weekdays />
        </Accordion>
      </div>
    </ThemeProvider>
  );
};

export const CustomHeight = CustomHeightTemplate.bind({});
