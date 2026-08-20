import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const maxScrollAttempts = 60;
const headerOffsetPadding = 16;

function getTargetId(hash: string) {
  if (!hash || hash === "#") {
    return null;
  }

  const rawId = hash.startsWith("#") ? hash.slice(1) : hash;

  try {
    return decodeURIComponent(rawId);
  } catch {
    return rawId;
  }
}

function getHeaderOffset() {
  const header = document.querySelector<HTMLElement>(".concept-header");
  const headerHeight = header?.getBoundingClientRect().height ?? 0;
  return Math.round(headerHeight + headerOffsetPadding);
}

function scrollToHashTarget(hash: string) {
  const targetId = getTargetId(hash);
  if (!targetId) {
    return false;
  }

  const target = document.getElementById(targetId);
  if (!target) {
    return false;
  }

  const top = Math.max(
    0,
    window.scrollY + target.getBoundingClientRect().top - getHeaderOffset(),
  );

  window.scrollTo({
    top,
    behavior: "auto",
  });

  return true;
}

function isUnmodifiedPrimaryClick(event: MouseEvent) {
  return (
    event.button === 0 &&
    !event.defaultPrevented &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey
  );
}

export function HashScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousLocationRef = useRef(location);
  const savedScrollPositionsRef = useRef(new Map<string, number>());

  useEffect(() => {
    const previousLocation = previousLocationRef.current;

    if (
      !previousLocation.hash &&
      location.hash &&
      previousLocation.pathname === location.pathname
    ) {
      savedScrollPositionsRef.current.set(location.pathname, window.scrollY);
    }

    if (
      previousLocation.hash &&
      !location.hash &&
      previousLocation.pathname === location.pathname &&
      navigationType === "POP"
    ) {
      const savedScrollTop = savedScrollPositionsRef.current.get(location.pathname);
      if (savedScrollTop !== undefined) {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            window.scrollTo({ top: savedScrollTop, behavior: "auto" });
          });
        });
      }
    }

    previousLocationRef.current = location;
  }, [location, navigationType]);

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    let cancelled = false;
    let frameId = 0;
    let attempt = 0;

    const tryScroll = () => {
      if (cancelled) {
        return;
      }

      if (scrollToHashTarget(location.hash)) {
        return;
      }

      attempt += 1;
      if (attempt < maxScrollAttempts) {
        frameId = window.requestAnimationFrame(tryScroll);
      }
    };

    frameId = window.requestAnimationFrame(tryScroll);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
    };
  }, [location.hash, location.key, location.pathname]);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (!isUnmodifiedPrimaryClick(event)) {
        return;
      }

      const eventTarget = event.target;
      if (!(eventTarget instanceof Element)) {
        return;
      }

      const anchor = eventTarget.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || !anchor.href || !anchor.hash) {
        return;
      }

      if (anchor.target && anchor.target !== "_self") {
        return;
      }

      const targetUrl = new URL(anchor.href, window.location.href);
      if (targetUrl.origin !== window.location.origin) {
        return;
      }

      const samePath = targetUrl.pathname === window.location.pathname;
      const sameHash = targetUrl.hash === window.location.hash;

      if (!samePath || !sameHash) {
        return;
      }

      event.preventDefault();
      scrollToHashTarget(targetUrl.hash);
    }

    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, []);

  return null;
}
