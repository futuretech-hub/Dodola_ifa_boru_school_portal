import styles from "./DecorativeWaves.module.css";

export type DecorativeWavesProps = {
  /** Optional class name for positioning the wave component in a parent layout. */
  className?: string;
  /** Animation is opt-in so the default decoration stays completely still. */
  animated?: boolean;
  /** Add an accessible label only when the waves communicate meaning. */
  ariaLabel?: string;
};

export function DecorativeWaves({
  className,
  animated = false,
  ariaLabel,
}: DecorativeWavesProps) {
  // Combining CSS-module classes this way keeps the component reusable in any layout.
  const rootClassName = [
    styles.wrapper,
    animated ? styles.animated : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      {/*
        viewBox gives the paths a stable drawing canvas. `preserveAspectRatio="none"`
        lets the SVG stretch to any screen width while keeping each curve smooth.
        There is no rectangle or background here, so the component is transparent.
      */}
      <svg
        className={styles.svg}
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        role={ariaLabel ? "img" : undefined}
        aria-label={ariaLabel}
        aria-hidden={ariaLabel ? undefined : true}
        focusable="false"
      >
        {/* Top layer: bright blue. The cubic C commands create flowing Bézier curves. */}
        <path
          className={`${styles.wavePath} ${styles.waveTop}`}
          d="M0 102 C150 30 315 20 485 82 C665 148 805 162 972 98 C1158 26 1300 42 1440 82 L1440 300 L0 300 Z"
          fill="#168BFA"
        />

        {/* Middle layer: royal blue, starting lower so the top layer remains visible. */}
        <path
          className={`${styles.wavePath} ${styles.waveMiddle}`}
          d="M0 142 C156 78 322 72 500 142 C680 214 824 218 1002 146 C1170 78 1314 88 1440 132 L1440 300 L0 300 Z"
          fill="#0756C5"
        />

        {/* Bottom layer: deep navy blue, forming the visual base of the stack. */}
        <path
          className={`${styles.wavePath} ${styles.waveBottom}`}
          d="M0 190 C172 132 344 132 526 202 C706 272 864 270 1044 204 C1204 146 1332 160 1440 194 L1440 300 L0 300 Z"
          fill="#032D78"
        />
      </svg>
    </div>
  );
}
