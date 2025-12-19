"use client";
import { useEffect, useRef } from "react";
import * as Plot from '@observablehq/plot';

interface ExtendedPlotOptions extends Plot.PlotOptions {
  className?: string;
  caption?: string | null;
  captionLabel?: string | null;
  options?: ExtendedPlotOptions;
  legend?: Plot.LegendOptions;
  title?: string | null;
  width?: number;
  height?: number;
  [key: string]: any; // Allow additional properties
}

export default function PlotComponent(props: ExtendedPlotOptions) {
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultProps = { width: 400, height: 400 };

  if (props.options) props = props.options;

  const {
    title,
    className = "",
    caption = null,
    captionLabel = null,
    legend,                 // optional extra prop we’ll add
    ...plotProps
  } = props;

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    node.innerHTML = "";

    // 1. the main plot
    const chart = Plot.plot({
      ...defaultProps,
      ...plotProps,
    });
    node.append(chart);

    // 2. optional manual legend
    if (legend) {
      const legendNode = Plot.legend(legend);  // <— returns an SVG
      node.append(legendNode);
    }
  }, [props]);

  return (
    <div className={className}>
      {title && (
        <div className="font-mono uppercase text-xs text-gray-400 font-semibold" suppressHydrationWarning>
          {title}
        </div>
      )}
      <div ref={containerRef} />
      {caption && (
        <p className="text-xs mt-2">
          {captionLabel && <span className="font-semibold">{captionLabel}: </span>}
          {caption}
        </p>
      )}
    </div>
  );
}
