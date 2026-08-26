import { useState } from "react";

export type CapabilitySystemItem = {
  id: "think" | "lead" | "transform" | "collaborate" | "adapt";
  label: string;
  children: string[];
};

type CapabilitySystemSectionProps = {
  sectionId: string;
  title: string;
  systemLabel: string;
  capabilities: CapabilitySystemItem[];
};

type ExpandedCapability = CapabilitySystemItem["id"] | "all" | null;

const childNodeLinkPaths = [
  "M50 50 L50 5",
  "M50 50 L95 28",
  "M50 50 L95 72",
  "M50 50 L50 95",
  "M50 50 L5 28",
];

export function ConceptDCapabilitySystemSection({
  sectionId,
  title,
  systemLabel,
  capabilities,
}: CapabilitySystemSectionProps) {
  const [pinnedCapability, setPinnedCapability] = useState<ExpandedCapability>(null);
  const [previewCapability, setPreviewCapability] = useState<ExpandedCapability>(null);
  const [brandName, ...systemName] = systemLabel.split(" ");
  const activeCapability = previewCapability ?? pinnedCapability;

  function isExpanded(capabilityId: CapabilitySystemItem["id"]) {
    return activeCapability === "all" || activeCapability === capabilityId;
  }

  function toggleCapability(capabilityId: CapabilitySystemItem["id"]) {
    setPreviewCapability(null);
    setPinnedCapability((current) => current === capabilityId ? null : capabilityId);
  }

  function toggleAllCapabilities() {
    setPreviewCapability(null);
    setPinnedCapability((current) => current === "all" ? null : "all");
  }

  return (
    <section aria-labelledby={`${sectionId}-heading`} className="concept-section" id={sectionId}>
      <div className="concept-container concept-d-capability-system">
        <h2 className="concept-d-capability-system__title" id={`${sectionId}-heading`}>
          {title}
        </h2>

        <div className="concept-d-capability-system__map">
          <svg aria-hidden="true" className="concept-d-capability-system__links" viewBox="0 0 100 100">
            <path d="M50 40.4 L50 21" />
            <path d="M59 46.6 L77.4 42" />
            <path d="M54.5 58.3 L63 78.8" />
            <path d="M45.5 58.3 L37 78.8" />
            <path d="M41 46.6 L22.6 42" />
          </svg>

          <button
            aria-controls={`${sectionId}-nodes`}
            aria-expanded={activeCapability === "all"}
            className="concept-d-capability-system__hub"
            onBlur={() => setPreviewCapability(null)}
            onClick={toggleAllCapabilities}
            onFocus={() => setPreviewCapability("all")}
            onPointerEnter={() => setPreviewCapability("all")}
            onPointerLeave={() => setPreviewCapability(null)}
            type="button"
          >
            <span>{brandName}</span>
            <span>{systemName.join(" ")}</span>
          </button>

          <div className="concept-d-capability-system__nodes" id={`${sectionId}-nodes`}>
            {capabilities.map((capability) => {
              const expanded = isExpanded(capability.id);
              const detailId = `${sectionId}-${capability.id}-details`;

              return (
                <div
                  className={`concept-d-capability-system__capability concept-d-capability-system__capability--${capability.id}`}
                  key={capability.id}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setPreviewCapability(null);
                    }
                  }}
                  onFocus={() => setPreviewCapability(capability.id)}
                  onPointerEnter={() => setPreviewCapability(capability.id)}
                  onPointerLeave={() => setPreviewCapability(null)}
                >
                  <button
                    aria-controls={detailId}
                    aria-expanded={expanded}
                    className="concept-d-capability-system__node"
                    onClick={() => toggleCapability(capability.id)}
                    type="button"
                  >
                    {capability.label}
                  </button>

                  <div
                    aria-hidden={!expanded}
                    className={
                      expanded
                        ? "concept-d-capability-system__child-list concept-d-capability-system__child-list--expanded"
                        : "concept-d-capability-system__child-list"
                    }
                    id={detailId}
                  >
                    <svg aria-hidden="true" className="concept-d-capability-system__child-links" viewBox="0 0 100 100">
                      {capability.children.map((child, index) => (
                        <path d={childNodeLinkPaths[index]} key={child} />
                      ))}
                    </svg>
                    {capability.children.map((child) => (
                      <button
                        aria-label={`${capability.label}: ${child}`}
                        className="concept-d-capability-system__child-node"
                        key={child}
                        onClick={() => setPinnedCapability(capability.id)}
                        onFocus={() => setPreviewCapability(capability.id)}
                        tabIndex={expanded ? 0 : -1}
                        type="button"
                      >
                        <span aria-hidden="true" />
                        {child}
                      </button>
                    ))}
                  </div>

                  <div
                    aria-hidden={!expanded}
                    className={
                      expanded
                        ? "concept-d-capability-system__mobile-children concept-d-capability-system__mobile-children--expanded"
                        : "concept-d-capability-system__mobile-children"
                    }
                  >
                    {capability.children.map((child) => (
                      <button
                        aria-label={`${capability.label}: ${child}`}
                        className="concept-d-capability-system__mobile-child-node"
                        key={child}
                        onClick={() => setPinnedCapability(capability.id)}
                        onFocus={() => setPreviewCapability(capability.id)}
                        tabIndex={expanded ? 0 : -1}
                        type="button"
                      >
                        <span aria-hidden="true" />
                        {child}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
