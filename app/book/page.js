import Booking from '@/components/Booking';
import { getBarbers, getServices, getAddons } from '@/lib/content';

export const revalidate = 0;

export default async function BookPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const [barbers, services, addons] = await Promise.all([getBarbers(), getServices(), getAddons()]);

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
      />
    </main>
  );
}
