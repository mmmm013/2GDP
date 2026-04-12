import Image from 'next/image';

type KFamilyVisualStripProps = {
  containerClassName?: string;
  primaryImageSrc: string;
  primaryImageAlt: string;
  primaryBadge: string;
  primaryCopy: string;
  primarySizes: string;
  secondaryImageSrc?: string;
  secondaryImageAlt?: string;
  secondarySizes?: string;
  secondaryPaneClassName?: string;
  gridStyle?: React.CSSProperties;
  overlayClassName?: string;
};

export default function KFamilyVisualStrip({
  containerClassName,
  primaryImageSrc,
  primaryImageAlt,
  primaryBadge,
  primaryCopy,
  primarySizes,
  secondaryImageSrc,
  secondaryImageAlt,
  secondarySizes,
  secondaryPaneClassName,
  gridStyle,
  overlayClassName = 'absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent',
}: KFamilyVisualStripProps) {
  return (
    <div className={`kk-visual-shell ${containerClassName ?? ''}`}>
      <div className="kk-visual-grid" style={gridStyle}>
        <div className="kk-visual-pane h-44 md:h-56">
          <Image
            src={primaryImageSrc}
            alt={primaryImageAlt}
            fill
            sizes={primarySizes}
            className="object-cover"
            priority
          />
          <div className={overlayClassName} />
          <div className="absolute bottom-3 left-3 text-left">
            <p className="kk-visual-badge text-amber-200/90">{primaryBadge}</p>
            <p className="kk-visual-copy text-[#F5E6D3]/95">{primaryCopy}</p>
          </div>
        </div>

        {secondaryImageSrc && secondaryImageAlt && (
          <div className={`kk-visual-pane h-44 md:h-56 ${secondaryPaneClassName ?? ''}`}>
            <Image
              src={secondaryImageSrc}
              alt={secondaryImageAlt}
              fill
              sizes={secondarySizes ?? '(max-width: 768px) 100vw, 33vw'}
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
