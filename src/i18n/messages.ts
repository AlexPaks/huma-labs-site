import commonEn from "../../messages/en/common.json";
import navigationEn from "../../messages/en/navigation.json";
import homepageEn from "../../messages/en/homepage.json";
import assessmentEn from "../../messages/en/assessment.json";
import insightResultEn from "../../messages/en/insight-result.json";
import contactFormEn from "../../messages/en/contact-form.json";
import validationEn from "../../messages/en/validation.json";
import systemEn from "../../messages/en/system.json";
import cookieConsentEn from "../../messages/en/cookie-consent.json";
import privacyEn from "../../messages/en/privacy.json";
import seoEn from "../../messages/en/seo.json";
import commonHe from "../../messages/he/common.json";
import navigationHe from "../../messages/he/navigation.json";
import homepageHe from "../../messages/he/homepage.json";
import assessmentHe from "../../messages/he/assessment.json";
import insightResultHe from "../../messages/he/insight-result.json";
import contactFormHe from "../../messages/he/contact-form.json";
import validationHe from "../../messages/he/validation.json";
import systemHe from "../../messages/he/system.json";
import cookieConsentHe from "../../messages/he/cookie-consent.json";
import privacyHe from "../../messages/he/privacy.json";
import seoHe from "../../messages/he/seo.json";
import { siteConfig, type SupportedLanguage } from "../config/site";

const heDomains = {
  common: commonHe,
  navigation: navigationHe,
  homepage: homepageHe,
  assessment: assessmentHe,
  "insight-result": insightResultHe,
  "contact-form": contactFormHe,
  validation: validationHe,
  system: systemHe,
  "cookie-consent": cookieConsentHe,
  privacy: privacyHe,
  seo: seoHe,
} as const;

const enDomains = {
  common: commonEn,
  navigation: navigationEn,
  homepage: homepageEn,
  assessment: assessmentEn,
  "insight-result": insightResultEn,
  "contact-form": contactFormEn,
  validation: validationEn,
  system: systemEn,
  "cookie-consent": cookieConsentEn,
  privacy: privacyEn,
  seo: seoEn,
} as const;

export const messageCatalogs = {
  he: heDomains,
  en: enDomains,
} as const;

type MessageCatalogs = typeof messageCatalogs;
export type MessageDomain = keyof typeof heDomains;

type PrimitiveMessage = string;
interface MessageTree {
  [key: string]: PrimitiveMessage | MessageTree;
}

type DotPath<T> = T extends PrimitiveMessage
  ? never
  : {
      [K in keyof T & string]: T[K] extends PrimitiveMessage
        ? K
        : T[K] extends MessageTree
          ? `${K}.${DotPath<T[K]>}`
          : never;
    }[keyof T & string];

export type MessageKey<D extends MessageDomain> = DotPath<
  MessageCatalogs["he"][D]
>;

type StrictMessageRef = {
  [D in MessageDomain]: `${D}:${MessageKey<D>}`;
}[MessageDomain];
export type MessageRef = StrictMessageRef | `${MessageDomain}:${string}`;

type InterpolationValues = Record<string, string | number>;

let catalogsValidated = false;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function collectShape(value: unknown, prefix = ""): string[] {
  if (typeof value === "string") {
    return [prefix];
  }

  if (!isRecord(value)) {
    return [];
  }

  return Object.entries(value).flatMap(([key, child]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    return collectShape(child, nextPrefix);
  });
}

function readLeafValue(value: unknown, key: string): string | null {
  const segments = key.split(".");
  let current: unknown = value;

  for (const segment of segments) {
    if (!isRecord(current) || !(segment in current)) {
      return null;
    }

    current = current[segment];
  }

  return typeof current === "string" ? current : null;
}

function interpolateMessage(template: string, values?: InterpolationValues) {
  return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, token: string) => {
    assert(values && token in values, `Missing interpolation value: ${token}`);
    return String(values[token]);
  });
}

function validateCatalogShapes() {
  if (catalogsValidated) {
    return;
  }

  const requiredDomains = Object.keys(heDomains) as MessageDomain[];

  for (const domain of requiredDomains) {
    assert(domain in enDomains, `Missing English message domain: ${domain}`);

    const hebrewShape = collectShape(heDomains[domain]).sort();
    const englishShape = collectShape(enDomains[domain]).sort();

    assert(
      JSON.stringify(hebrewShape) === JSON.stringify(englishShape),
      `Message shape mismatch between Hebrew and English in domain: ${domain}`,
    );

    for (const path of hebrewShape) {
      const hebrewValue = readLeafValue(heDomains[domain], path);
      const englishValue = readLeafValue(enDomains[domain], path);

      assert(
        typeof hebrewValue === "string" && hebrewValue.trim().length > 0,
        `Empty required Hebrew message value: ${domain}.${path}`,
      );
      assert(
        typeof englishValue === "string" && englishValue.trim().length > 0,
        `Empty required English message value: ${domain}.${path}`,
      );
    }
  }

  catalogsValidated = true;
}

export function getMessage<D extends MessageDomain>(
  domain: D,
  key: MessageKey<D>,
  values?: InterpolationValues,
  language: SupportedLanguage = siteConfig.defaultLanguage,
) {
  validateCatalogShapes();

  const message = readLeafValue(messageCatalogs[language][domain], key);
  assert(message !== null, `Missing message key: ${domain}.${key}`);

  return interpolateMessage(message, values);
}

export function getMessageByRef(
  ref: string,
  values?: InterpolationValues,
  language?: SupportedLanguage,
) {
  const [domain, ...segments] = ref.split(":");
  const key = segments.join(":");

  assert(domain in heDomains, `Invalid message domain: ${domain}`);
  assert(key.length > 0, `Invalid message reference: ${ref}`);

  return getMessage(
    domain as MessageDomain,
    key as MessageKey<MessageDomain>,
    values,
    language,
  );
}

export function useMessages(language: SupportedLanguage = siteConfig.defaultLanguage) {
  return {
    t: <D extends MessageDomain>(
      domain: D,
      key: MessageKey<D>,
      values?: InterpolationValues,
    ) => getMessage(domain, key, values, language),
    tRef: (ref: string, values?: InterpolationValues) =>
      getMessageByRef(ref, values, language),
  };
}
