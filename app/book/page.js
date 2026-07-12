import Booking from '@/components/Booking';
import { getBarbers, getServices, getAddons, getContent } from '@/lib/content';

export const revalidate = 0;

export default async function BookPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const [barbers, services, addons, content] = await Promise.all([getBarbers(), getServices(), getAddons(), getContent()]);

  // Which weekdays the shop is closed (0=Sun … 6=Sat). Default: Sunday.
  const closedDays = String(content.closed_days ?? '0')
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n) && n >= 0 && n <= 6);

  const initialBarber = typeof sp.barber === 'string' ? sp.barber : null;
  const initialService = typeof sp.service === 'string' ? sp.service : null;
  // If a barber was preselected, start on the service step; if a service was
  // preselected, start on the barber step. Otherwise start at the beginning.
  const initialStep = initialBarber ? 1 : 0;

  return (
    <main className="book" data-page="book">
      <Booking
        barbers={barbers}
        services={services}
        addons={addons}
        initialBarber={initialBarber}
        initialService={initialService}
        initialStep={initialStep}
        closedDays={closedDays.length ? closedDays : [0]}
      />
    </main>
  );
}
