type AnimatedRightChevronProps = {
  size?: number;
};

export default function AnimatedRightChevron({
  size = 12,
}: AnimatedRightChevronProps) {
  return (
    <svg
      className="stroke-white stroke-2 top-[1] relative fill-transparent"
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 12 12"
    >
      <g fillRule="evenodd">
        <path
          className="transition-opacity opacity-0 group-hover:opacity-100"
          d="M0 5h7"
        />
        <path
          className="group-hover:translate-x-[3px] transition-transform"
          d="M1 1l4 4-4 4"
        />
      </g>
    </svg>
  );
}
