import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Menu from './components/Menu';
import About from './components/About';
import BookingForm from './components/BookingForm';
import Locations from './components/Locations';
import OrderCTA from './components/OrderCTA';
import Footer from './components/Footer';
import CartBar from './components/CartBar';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';

const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Menu />
        <About />
        <BookingForm />
        <Locations />
        <OrderCTA />
      </main>
      <Footer />
      <CartBar />
      <CartDrawer />
      <Checkout />
    </>
  );
};

export default App;
