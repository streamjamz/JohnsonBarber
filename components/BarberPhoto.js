/* Renders a barber's photo if set, otherwise their initial in the striped avatar. */
export default function BarberPhoto({ barber }) {
  if (barber.photo_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={barber.photo_url} alt={barber.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  }
  return <span className="initial">{barber.initial || (barber.name ? barber.name[0] : '')}</span>;
}
