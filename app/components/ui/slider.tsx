import { Slider as ChakraSlider, For, HStack } from "@chakra-ui/react";
import * as React from "react";

export interface SliderProps extends ChakraSlider.RootProps {
  label?: Exclude<React.ReactNode, Promise<unknown>>;
  marks?: (
    | number
    | { label: Exclude<React.ReactNode, Promise<unknown>>; value: number }
  )[];
  showValue?: boolean;
}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  function Slider(props, ref) {
    const { label, marks: marksProp, showValue, ...rest } = props;
    const value = props.defaultValue ?? props.value;

    const marks = marksProp?.map((mark) => {
      if (typeof mark === "number") return { label: undefined, value: mark };
      return mark;
    });

    const hasMarkLabel = !!marks?.some((mark) => mark.label);

    return (
      <ChakraSlider.Root ref={ref} thumbAlignment="center" {...rest}>
        {label && !showValue && (
          <ChakraSlider.Label>{label}</ChakraSlider.Label>
        )}
        {label && showValue && (
          <HStack justify="space-between">
            <ChakraSlider.Label>{label}</ChakraSlider.Label>
            <ChakraSlider.ValueText />
          </HStack>
        )}
        <ChakraSlider.Control data-has-mark-label={hasMarkLabel || undefined}>
          <ChakraSlider.Track>
            <ChakraSlider.Range />
          </ChakraSlider.Track>
          <SliderThumbs value={value} />
          <SliderMarks marks={marks} />
        </ChakraSlider.Control>
      </ChakraSlider.Root>
    );
  },
);

interface SliderMarksProps {
  marks?: (number | { label: React.ReactNode; value: number })[];
}

function SliderThumbs(props: { value?: number[] }) {
  const { value } = props;
  return (
    <For each={value}>
      {(_, index) => (
        <ChakraSlider.Thumb index={index} key={index}>
          <ChakraSlider.HiddenInput />
        </ChakraSlider.Thumb>
      )}
    </For>
  );
}

const SliderMarks = React.forwardRef<HTMLDivElement, SliderMarksProps>(
  function SliderMarks(props, ref) {
    const { marks } = props;
    if (!marks?.length) return null;

    return (
      <ChakraSlider.MarkerGroup ref={ref}>
        {marks.map((mark, index) => {
          const value = typeof mark === "number" ? mark : mark.value;
          const label = typeof mark === "number" ? undefined : mark.label;
          return (
            <ChakraSlider.Marker key={index} value={value}>
              <ChakraSlider.MarkerIndicator />
              {label}
            </ChakraSlider.Marker>
          );
        })}
      </ChakraSlider.MarkerGroup>
    );
  },
);
