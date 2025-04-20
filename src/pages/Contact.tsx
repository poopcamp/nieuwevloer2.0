
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import PageHeader from "@/components/contact/PageHeader";
import { Toaster } from "@/components/ui/toaster";

const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleFormSuccess = () => {
    setFormSubmitted(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Contact | NieuweVloer.be - Professionele tegelplaatsing</title>
        <meta name="description" content="Neem contact op met NieuweVloer.be voor uw vragen over tegelplaatsing, vloeren en badkamerrenovatie in Maldegem en omgeving (30km). Vraag een vrijblijvende offerte aan." />
        <meta name="keywords" content="contact tegelzetter,contact vloerder,offerte tegels,contact nieuwevloer,tegelplaatsing maldegem,vloeren eeklo,tegelzetter knokke" />
      </Helmet>
      
      <Navbar />
      <main className="flex-grow py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <PageHeader 
            title="Neem contact met ons op"
            description="Heeft u vragen over onze diensten of wilt u een offerte aanvragen? 
                        Neem gerust contact met ons op via onderstaand formulier of gebruik onze contactgegevens."
          />
          
          <div className="grid gap-8 md:grid-cols-2">
            <ContactForm onSubmitSuccess={handleFormSuccess} />
            <ContactInfo />
          </div>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Contact;
