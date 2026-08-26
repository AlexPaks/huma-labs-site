import rawSocialLinks from "../../content/social-links.json";

export type SocialLink = {
  id: string;
  label: string;
  href: string;
  isMock: boolean;
};

export const socialLinks = rawSocialLinks as SocialLink[];
