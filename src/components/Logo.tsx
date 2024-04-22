export const Logo = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={512}
    height={512}
    fill="none"
    viewBox="0 0 512 512"
    className={className}
  >
    <g clipPath="url(#a)">
      <path
        fill="#000"
        d="M130.841 452V149.455h54.807v128.079h140.193V149.455h54.954V452h-54.954V323.477H185.648V452h-54.807Z"
      />
      <path
        stroke="#000"
        strokeWidth={46}
        d="M38.736 273.375 271.375 40.736M240.263 40.736l232.639 232.639"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h512v512H0z" />
      </clipPath>
    </defs>
  </svg>
);
