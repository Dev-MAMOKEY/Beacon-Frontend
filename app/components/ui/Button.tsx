import type { ReactNode } from "react";
import { Link } from "react-router";

type BaseProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "gradient";
  className?: string;
};

type ButtonProps = BaseProps &
  ({ as?: "button" } & React.ButtonHTMLAttributes<HTMLButtonElement>);
type LinkProps = BaseProps & { as: "link"; to: string };

type Props = ButtonProps | LinkProps;

/**
 * 공용 버튼.
 * - primary:   bg-primary, 흰 글씨, 파란 그림자 (Figma "Generate Token")
 * - secondary: bg-border-subtle, 어두운 글씨 (Figma "Export Report")
 * - gradient:  primary → primary-hover 그라디언트, 파란 그림자 (Figma "New Session")
 *
 * as="link"을 주면 React Router <Link>로 렌더.
 */
export function Button(props: Props) {
  const { children, variant = "primary", className = "" } = props;

  const base = "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold transition-opacity hover:opacity-90";

  const variants = {
    primary:
      "bg-primary text-white shadow-[0px_10px_15px_-3px_rgba(0,91,191,0.2),0px_4px_6px_-4px_rgba(0,91,191,0.2)]",
    secondary:
      "bg-border-subtle text-foreground",
    gradient:
      "bg-gradient-to-r from-primary to-primary-hover text-white shadow-[0px_10px_15px_-3px_rgba(0,91,191,0.2),0px_4px_6px_-4px_rgba(0,91,191,0.2)]",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (props.as === "link") {
    return (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    );
  }

  const { as, variant: _v, className: _c, ...buttonProps } = props as ButtonProps & { variant?: string };

  return (
    <button type="button" {...buttonProps} className={classes}>
      {children}
    </button>
  );
}
