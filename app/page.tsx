import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Details from '@/components/Details';
import Tickets from '@/components/Tickets';
import Location from '@/components/Location';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Details />
        <Tickets />
        <Location />
      </main>
      <Footer />
    </>
  );
}
