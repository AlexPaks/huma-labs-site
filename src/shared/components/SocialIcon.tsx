type SocialIconProps = {
  provider: string;
};

export function SocialIcon({ provider }: SocialIconProps) {
  switch (provider) {
    case "linkedin":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M5.2 8.3A1.7 1.7 0 1 0 5.2 5a1.7 1.7 0 0 0 0 3.3ZM3.8 9.7h2.8v8.9H3.8V9.7Zm4.5 0H11v1.2h.1c.4-.8 1.4-1.6 3-1.6 3.2 0 3.8 2.1 3.8 4.8v4.5H15v-4c0-1 0-2.4-1.5-2.4s-1.7 1.1-1.7 2.3v4.1H9V9.7Z" fill="currentColor" />
        </svg>
      );
    case "facebook":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M13.8 20v-7h2.4l.4-2.8h-2.8V8.4c0-.8.2-1.4 1.4-1.4h1.5V4.5c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.1H8.7V13h2.4v7h2.7Z" fill="currentColor" />
        </svg>
      );
    case "instagram":
      return (
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <rect height="15" rx="4" stroke="currentColor" strokeWidth="1.8" width="15" x="4.5" y="4.5" />
          <circle cx="12" cy="12" r="3.35" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="16.95" cy="7.1" fill="currentColor" r="1.05" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <path d="M19.2 4.8A9.3 9.3 0 0 0 4.6 16l-1.1 4.4 4.5-1.1A9.3 9.3 0 1 0 19.2 4.8Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
          <path d="M9 7.7c.2-.5.4-.5.7-.5h.6c.2 0 .4 0 .5.4l.7 1.7c.1.3.1.5 0 .7l-.5.6c-.1.2-.2.3-.1.5.4.8 1 1.5 1.8 2 .2.1.4.1.5 0l.7-.8c.2-.2.4-.2.7-.1l1.6.8c.3.1.4.3.4.5 0 .4-.2 1.2-.7 1.5-.5.3-1 .4-1.6.2-1.1-.4-2.2-1.1-3.1-2-1.1-1.1-1.8-2.3-2.2-3.4-.2-.6-.1-1.2.1-1.7Z" fill="currentColor" stroke="currentColor" strokeWidth="0.45" />
        </svg>
      );
    default:
      return null;
  }
}
