import cn from "clsx";

export type IconName = keyof typeof OutlineIcons | keyof typeof SolidIcons;

type IconProps = {
  className?: string;
};

type CustomIconProps = IconProps & {
  iconName: IconName;
  solid?: boolean;
};

const OutlineIcons = {
  ArrowPathRoundedSquareIcon,
  BadgeIcon,
  ChatBubbleOvalLeftIcon,
  CogIcon: CogOutlineIcon,
  HashtagIcon: HashtagOutlineIcon,
  HeartIcon: HeartOutlineIcon,
  NostrumIcon,
  SpinnerIcon,
};

const SolidIcons = {
  ArrowPathRoundedSquareIcon,
  BadgeIcon,
  ChatBubbleOvalLeftIcon,
  CogIcon: CogSolidIcon,
  HashtagIcon: HashtagSolidIcon,
  HeartIcon: HeartSolidIcon,
  NostrumIcon,
  SpinnerIcon,
};

export default function CustomIcon({
  className,
  iconName,
  solid,
}: CustomIconProps): JSX.Element {
  const Icon = solid ? SolidIcons[iconName] : OutlineIcons[iconName];

  return <Icon className={className ?? "h-7 w-7"} />;
}

function NostrumIcon({ className }: IconProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 640 640">
      <path d="M 535.38,20.50 C 546.00,25.00 552.25,29.75 558.00,37.62 558.00,37.62 563.12,44.62 563.12,44.62 563.12,44.62 592.50,50.50 592.50,50.50 608.62,53.75 624.25,57.25 627.25,58.25 633.12,60.50 638.38,66.25 639.50,72.12 640.25,76.00 640.25,76.00 633.00,77.50 593.25,85.50 561.50,99.25 540.88,117.50 535.12,122.62 535.00,122.75 535.00,130.37 535.00,143.12 532.62,164.12 530.12,174.00 526.25,189.12 520.62,199.50 510.62,209.50 493.88,226.37 477.12,231.62 435.38,233.00 422.12,233.50 404.38,234.62 396.00,235.62 387.50,236.62 380.00,237.50 379.25,237.50 378.50,237.50 376.62,234.25 375.12,230.25 366.88,208.62 346.88,188.38 322.00,176.25 268.62,150.37 201.37,163.12 148.62,209.12 143.62,213.50 144.00,213.25 152.75,207.50 188.75,184.00 220.37,174.12 255.62,175.37 274.62,176.00 288.00,179.12 303.38,186.25 327.38,197.37 346.25,218.25 352.62,240.62 355.12,249.62 354.88,273.50 352.00,283.75 347.62,299.75 341.75,309.50 328.12,323.25 320.12,331.25 313.50,339.25 310.00,345.12 306.88,350.37 300.25,358.75 294.50,364.50 286.12,372.87 282.38,375.62 273.12,380.00 266.88,382.87 261.00,385.75 260.00,386.25 259.00,386.75 249.50,405.00 239.00,426.75 239.00,426.75 219.88,466.38 219.88,466.38 219.88,466.38 221.25,473.12 221.25,473.12 222.62,480.00 222.00,486.38 219.38,493.12 217.87,496.75 218.75,498.75 241.75,542.38 241.75,542.38 265.62,587.75 265.62,587.75 265.62,587.75 283.75,588.00 283.75,588.00 299.00,588.12 302.62,588.50 306.88,590.62 319.62,596.88 330.50,615.25 324.75,621.00 322.62,623.12 167.38,623.12 165.25,621.00 162.50,618.25 163.62,614.38 169.62,605.62 177.62,594.25 180.50,592.88 199.75,591.75 211.62,591.12 215.00,590.50 214.50,589.25 212.12,583.12 172.00,511.62 170.37,510.62 158.75,503.62 152.50,492.62 152.50,479.38 152.62,465.62 158.38,455.62 170.12,448.88 175.62,445.75 178.12,442.62 194.38,417.50 204.38,402.12 212.50,389.12 212.50,388.75 212.50,388.25 208.87,387.25 204.62,386.38 200.25,385.50 192.75,383.50 188.12,381.88 183.38,380.12 179.50,379.00 179.50,379.12 179.38,379.25 177.75,382.62 175.75,386.50 167.87,402.50 147.87,409.75 121.12,406.38 121.12,406.38 108.62,404.88 108.62,404.88 108.62,404.88 100.88,409.12 100.88,409.12 83.75,418.50 69.00,422.50 50.88,422.50 35.62,422.50 23.62,419.88 10.25,413.75 10.25,413.75 0.00,408.88 0.00,408.88 0.00,408.88 0.00,400.00 0.00,400.00 0.00,386.00 2.38,355.88 5.00,338.12 13.50,278.38 35.12,225.00 65.88,187.25 75.50,175.37 96.50,155.62 108.62,147.00 135.88,127.50 167.87,114.12 202.12,108.00 218.87,105.00 251.50,105.00 266.88,108.00 294.88,113.37 326.25,127.00 366.88,151.25 395.00,168.12 410.12,175.62 423.88,179.50 433.50,182.37 437.00,182.75 447.88,182.25 458.25,181.88 461.88,181.12 467.62,178.50 486.38,169.87 495.00,153.50 495.00,126.88 495.00,126.88 495.00,114.12 495.00,114.12 495.00,114.12 488.38,109.62 488.38,109.62 471.25,97.75 463.00,76.12 468.00,56.25 472.12,40.25 481.12,29.25 496.25,22.00 503.38,18.62 505.88,18.12 516.25,17.75 526.50,17.50 529.12,17.87 535.38,20.50 Z M 512.88,44.62 C 502.62,51.37 504.75,68.37 516.25,73.00 522.62,75.50 523.12,75.50 529.50,72.50 541.75,66.50 541.75,49.87 529.62,43.75 523.88,40.87 518.12,41.25 512.88,44.62 Z" />
    </svg>
  );
}

function CogOutlineIcon({ className }: IconProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z" />
    </svg>
  );
}

function CogSolidIcon({ className }: IconProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        clipRule="evenodd"
        d="M22.25 13.46v-2.92l-2.36-1.57c-.17-.12-.26-.33-.21-.53l.58-2.54-2.17-2.17-2.53.59c-.21.04-.42-.04-.53-.21l-1.57-2.36h-2.92L8.96 4.11c-.11.17-.32.25-.52.21L5.9 3.73 3.73 5.9l.58 2.54c.05.2-.03.41-.21.53l-2.35 1.57v2.92l2.35 1.57c.18.12.26.33.21.53l-.58 2.54 2.17 2.17 2.54-.59c.2-.04.41.04.52.21l1.58 2.36h2.92l1.57-2.36c.11-.17.32-.25.53-.21l2.53.59 2.17-2.17-.58-2.54c-.05-.2.04-.41.21-.53l2.36-1.57zM12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3c1.65 0 3 1.34 3 3s-1.35 3-3 3z"
        fillRule="evenodd"
      />
    </svg>
  );
}

function HashtagOutlineIcon({ className }: IconProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M10.09 3.098L9.72 7h5.99l.39-4.089 1.99.187L17.72 7h3.78v2h-3.97l-.56 6h3.53v2h-3.72l-.38 4.089-1.99-.187.36-3.902H8.78l-.38 4.089-1.99-.187L6.77 17H2.5v-2h4.46l.56-6H3.5V7h4.21l.39-4.089 1.99.187zM14.96 15l.56-6H9.53l-.56 6h5.99z" />
    </svg>
  );
}

function HashtagSolidIcon({ className }: IconProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M10.64 3.157l-.36 3.593h4.99l.38-3.892 2.99.299-.36 3.593h2.97v2.5h-3.22l-.55 5.5h2.77v2.5h-3.02l-.39 3.892-2.98-.299.36-3.593H9.23l-.39 3.892-2.98-.299.36-3.593H2.75v-2.5h3.72l.55-5.5H3.75v-2.5h3.52l.38-3.892 2.99.299zm3.83 11.593l.55-5.5h-4.99l-.55 5.5h4.99z" />
    </svg>
  );
}

function BadgeIcon({ className }: IconProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 22 22">
      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
    </svg>
  );
}

function HeartOutlineIcon({ className }: IconProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
    </svg>
  );
}

function HeartSolidIcon({ className }: IconProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
    </svg>
  );
}

function ArrowPathRoundedSquareIcon({ className }: IconProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
    </svg>
  );
}

function ChatBubbleOvalLeftIcon({ className }: IconProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
    </svg>
  );
}

function SpinnerIcon({ className }: IconProps): JSX.Element {
  return (
    <svg
      className={cn("animate-spin", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="#6d28d9"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="#6d28d9"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
