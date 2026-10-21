import clsx from "clsx";
import { ReactNode } from "react";

const variants = {
  /**
   * Hero headline. Sized with clamp() rather than breakpoint steps so it
   * tracks the 3D composition continuously instead of jumping; weight 600 and
   * a slight negative tracking keep it editorial at display sizes, where the
   * old extrabold all-caps read as shouty.
   */
  display:
    "font-display text-[clamp(3rem,6.4vw,6rem)] font-semibold leading-[1.02] tracking-[-0.025em] [word-spacing:-0.04em]",
  hero: "text-5xl sm:text-6xl md:text-8xl 2xl:text-9xl 3xl:text-[10rem] font-extrabold leading-[0.95] tracking-tight",
  h1: "text-4xl md:text-6xl 2xl:text-7xl 3xl:text-8xl font-bold leading-tight",
  h2: "text-3xl md:text-5xl 2xl:text-6xl 3xl:text-7xl font-semibold leading-tight",
  h3: "text-2xl md:text-4xl 2xl:text-5xl 3xl:text-6xl font-semibold",
  title:
    "text-xl sm:text-2xl md:text-3xl 2xl:text-4xl 3xl:text-5xl font-semibold tracking-tight",
  name: "text-xl sm:text-2xl 2xl:text-3xl 3xl:text-4xl font-bold uppercase tracking-wider",
  subtitle:
    "text-sm sm:text-base md:text-lg 2xl:text-xl 3xl:text-2xl uppercase tracking-[2.5px] sm:tracking-[3.5px] leading-relaxed",
  body: "text-base md:text-lg 2xl:text-xl 3xl:text-2xl leading-7 2xl:leading-8",
  caption: "text-sm 2xl:text-base 3xl:text-lg",
  overline:
    "uppercase tracking-[6px] text-sm 2xl:text-base 3xl:text-lg font-semibold",
} as const;

/**
 * Restricted to text-bearing HTML tags on purpose. `ElementType` would also
 * admit every three.js element that @react-three/fiber adds to the JSX
 * namespace, whose props have no `children` in common with an HTML tag.
 */
type TextElement =
  | "p"
  | "span"
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "blockquote"
  | "figcaption"
  | "label"
  | "li"
  | "dd"
  | "dt";

type TypographyProps = {
  as?: TextElement;
  variant?: keyof typeof variants;
  className?: string;
  children: ReactNode;
};

const Typography = ({
  as: Component = "p",
  variant = "body",
  className,
  children,
}: TypographyProps) => {
  return (
    <Component className={clsx(variants[variant], className)}>
      {children}
    </Component>
  );
};

export default Typography;
