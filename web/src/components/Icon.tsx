/** Material Symbols Rounded 아이콘. name 은 fonts.google.com/icons 의 스네이크 케이스 이름 */
export function Icon({ name, size = 20, fill, className }: { name: string; size?: number; fill?: boolean; className?: string }) {
  return (
    <span aria-hidden className={`material-symbols-rounded${className ? ` ${className}` : ''}`} style={{ fontSize: size, fontVariationSettings: `'FILL' ${fill ? 1 : 0}` }}>
      {name}
    </span>
  )
}
