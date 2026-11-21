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
          d="M0 92 C180 28 340 22 520 82 C700 142 820 162 1010 103 C1180 50 1300 36 1440 76 L1440 300 L0 300 Z"
          fill="#168BFA"
        />

        {/* Middle layer: royal blue, starting lower so the top layer remains visible. */}
        <path
          className={`${styles.wavePath} ${styles.waveMiddle}`}
          d="M0 148 C190 84 340 88 530 143 C720 198 850 210 1030 159 C1190 114 1300 108 1440 139 L1440 300 L0 300 Z"
          fill="#0756C5"
        />

        {/* Bottom layer: deep navy blue, forming the visual base of the stack. */}
        <path
          className={`${styles.wavePath} ${styles.waveBottom}`}
          d="M0 208 C190 153 350 158 540 207 C720 254 875 264 1050 218 C1200 180 1320 179 1440 205 L1440 300 L0 300 Z"
          fill="#032D78"
        />
      </svg>
    </div>
  );
}
