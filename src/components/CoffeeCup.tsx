type CoffeeCupProps = {
  onClick: () => void
}

export function CoffeeCup({ onClick }: CoffeeCupProps) {
  return <button type="button" className="coffee-cup" aria-label="Show a QR code to this site" onClick={onClick} />
}
