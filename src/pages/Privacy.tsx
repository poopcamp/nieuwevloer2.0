import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { CompanyInfo } from "@/utils/supabase/customTypes";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { getCompanyInfo } from "@/utils/companySettingsHelpers";

const defaultCompanyInfo: CompanyInfo = {
  id: "",
  created_at: "",
  updated_at: "",
  company_name: "Vloeren Vanderheyden",
  company_vat: "BE0123.456.789",
  company_address: "Vakekerkweg 111, 9990 Maldegem, België",
  company_email: "info@nieuwevloer.be",
  company_phone: "+32 472 00 00 00",
  privacy_policy_last_updated: new Date().toISOString(),
  terms_last_updated: new Date().toISOString(),
  showroom_visit_enabled: true,
  showroom_visit_text: "Showroom van Qtile bezoeken"
};

export default function Privacy() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(defaultCompanyInfo);
  const [lastUpdated, setLastUpdated] = useState<string>(
    format(new Date(), "d MMMM yyyy", { locale: nl })
  );

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const data = await getCompanyInfo();
        if (data) {
          console.log("Privacy page received company info:", data);
          setCompanyInfo(data);
          
          if (data.privacy_policy_last_updated) {
            const date = new Date(data.privacy_policy_last_updated);
            setLastUpdated(format(date, "d MMMM yyyy", { locale: nl }));
          }
        }
      } catch (error) {
        console.error("Error fetching company info:", error);
        // We'll keep using the default values if fetch fails
      }
    };

    fetchCompanyInfo();
  }, []);

  return (
    <div className="container max-w-3xl py-12">
      <Helmet>
        <title>Privacybeleid | NieuweVloer.be</title>
        <meta name="description" content="Ons privacybeleid legt uit hoe wij uw gegevens verzamelen, gebruiken en beschermen bij het gebruik van onze website en diensten." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-8">Privacybeleid</h1>
      
      <p className="text-sm text-gray-500 mb-6">
        Laatst bijgewerkt: {lastUpdated}
      </p>

      <div className="prose prose-slate max-w-none">
        <h2>1. Inleiding</h2>
        <p>
          {companyInfo.company_name} (hierna "wij", "ons" of "onze") respecteert uw privacy en zet zich in voor het beschermen van uw persoonsgegevens. 
          Dit privacybeleid informeert u over hoe wij omgaan met uw persoonlijke gegevens wanneer u onze website bezoekt en vertelt u over uw privacyrechten 
          volgens de Algemene Verordening Gegevensbescherming (AVG) en de Belgische privacywetgeving.
        </p>

        <h2>2. Verwerkingsverantwoordelijke</h2>
        <p>
          De verwerkingsverantwoordelijke voor uw gegevens is:
        </p>
        <p>
          <strong>{companyInfo.company_name}</strong><br />
          {companyInfo.company_address}<br />
          KBO/BTW: {companyInfo.company_vat}<br />
          E-mail: {companyInfo.company_email}<br />
          Telefoon: {companyInfo.company_phone}
        </p>

        <h2>3. Welke gegevens verzamelen wij</h2>
        <h3>3.1 Gegevens die u aan ons verstrekt</h3>
        <ul>
          <li>Contactgegevens (naam, e-mailadres, telefoonnummer, adres)</li>
          <li>Projectgegevens (type project, oppervlakte, voorkeuren)</li>
          <li>Berichten die u ons stuurt via contactformulieren</li>
          <li>Afspraakgegevens</li>
        </ul>

        <h3>3.2 Automatisch verzamelde gegevens</h3>
        <ul>
          <li>IP-adres en apparaatgegevens</li>
          <li>Browsertype en -versie</li>
          <li>Bezoekstatistieken en gebruikte functionaliteiten</li>
          <li>Cookies (zie ons Cookiebeleid)</li>
        </ul>

        <h2>4. Doeleinden van verwerking</h2>
        <p>Wij verwerken uw persoonsgegevens voor de volgende doeleinden:</p>
        <ul>
          <li>Het opstellen en verzenden van offertes voor tegelwerk of badkamerrenovatie</li>
          <li>Het plannen en uitvoeren van afspraken en plaatsbezoeken</li>
          <li>Het verstrekken van informatie over onze diensten en projecten</li>
          <li>Het verbeteren van onze website en dienstverlening</li>
          <li>Het voldoen aan wettelijke verplichtingen</li>
          <li>Het afhandelen van betalingen en facturatie</li>
        </ul>

        <h2>5. Rechtsgrond voor verwerking</h2>
        <p>Wij verwerken uw persoonsgegevens op basis van de volgende rechtsgronden:</p>
        <ul>
          <li><strong>Toestemming:</strong> wanneer u ons expliciet toestemming heeft gegeven</li>
          <li><strong>Uitvoering van een overeenkomst:</strong> wanneer verwerking nodig is voor de uitvoering van een contract met u</li>
          <li><strong>Wettelijke verplichting:</strong> wanneer we wettelijk verplicht zijn om gegevens te verwerken</li>
          <li><strong>Gerechtvaardigd belang:</strong> wanneer verwerking noodzakelijk is voor onze gerechtvaardigde belangen en uw belangen of grondrechten niet zwaarder wegen</li>
        </ul>

        <h2>6. Bewaartermijnen</h2>
        <p>
          Wij bewaren uw persoonsgegevens niet langer dan noodzakelijk voor de doeleinden waarvoor deze zijn verzameld, tenzij wij wettelijk verplicht zijn gegevens langer te bewaren.
        </p>
        <ul>
          <li>Offerteaanvragen en configuratorgegevens: maximaal 12 maanden</li>
          <li>Klantgegevens voor uitgevoerde projecten: 7 jaar (wettelijke boekhoudkundige verplichting)</li>
          <li>Contactformulierberichten: 2 jaar</li>
        </ul>

        <h2>7. Gegevensontvangers en -doorgifte</h2>
        <p>
          Uw gegevens worden alleen gedeeld met derde partijen wanneer dit noodzakelijk is voor de uitvoering van onze diensten of wanneer we hiertoe wettelijk verplicht zijn.
        </p>
        <p>Categorieën van ontvangers kunnen zijn:</p>
        <ul>
          <li>Onderaannemers die betrokken zijn bij uw project (bv. loodgieters, elektriciens)</li>
          <li>IT-dienstverleners die onze systemen onderhouden</li>
          <li>Betalingsdienstaanbieders</li>
          <li>Overheidsinstanties wanneer wettelijk vereist</li>
        </ul>
        <p>
          Wij sturen uw gegevens niet door naar landen buiten de Europese Economische Ruimte (EER) tenzij er passende waarborgen zijn getroffen 
          conform de GDPR-vereisten.
        </p>

        <h2>8. Uw rechten</h2>
        <p>Onder de AVG heeft u de volgende rechten met betrekking tot uw persoonsgegevens:</p>
        <ul>
          <li><strong>Inzage:</strong> u kunt opvragen welke gegevens wij van u hebben</li>
          <li><strong>Correctie:</strong> u kunt onjuiste gegevens laten corrigeren</li>
          <li><strong>Verwijdering:</strong> u kunt vragen om uw gegevens te wissen ('recht op vergetelheid')</li>
          <li><strong>Beperking:</strong> u kunt vragen de verwerking van uw gegevens te beperken</li>
          <li><strong>Bezwaar:</strong> u kunt bezwaar maken tegen bepaalde verwerkingen</li>
          <li><strong>Gegevensoverdraagbaarheid:</strong> u kunt vragen uw gegevens in een gestructureerde vorm te ontvangen</li>
          <li><strong>Intrekking toestemming:</strong> u kunt eerder gegeven toestemming altijd intrekken</li>
        </ul>
        <p>
          Om een van deze rechten uit te oefenen, kunt u contact met ons opnemen via {companyInfo.company_email} of gebruik maken van 
          ons <Link to="/gdpr-verzoek" className="text-primary">GDPR-verzoekformulier</Link>.
        </p>

        <h2>9. Cookies</h2>
        <p>
          Onze website maakt gebruik van cookies en vergelijkbare technologieën om uw ervaring te verbeteren, statistieken bij te houden en u relevante inhoud te tonen.
          U kunt uw cookievoorkeuren beheren via de cookie-instellingen op onze website.
        </p>

        <h2>10. Beveiliging</h2>
        <p>
          Wij nemen passende technische en organisatorische maatregelen om de beveiliging van uw persoonsgegevens te waarborgen en deze te beschermen tegen ongeoorloofde of 
          onrechtmatige verwerking en tegen onopzettelijk verlies, vernietiging of beschadiging.
        </p>

        <h2>11. Klachten</h2>
        <p>
          Als u een klacht heeft over de verwerking van uw persoonsgegevens, neem dan eerst contact met ons op via {companyInfo.company_email}.
          U heeft ook het recht om een klacht in te dienen bij de Gegevensbeschermingsautoriteit (GBA), de Belgische toezichthouder voor gegevensbescherming:
        </p>
        <p>
          Gegevensbeschermingsautoriteit<br />
          Drukpersstraat 35, 1000 Brussel<br />
          Tel: +32 2 274 48 00<br />
          Website: <a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noopener noreferrer" className="text-primary">www.gegevensbeschermingsautoriteit.be</a>
        </p>

        <h2>12. Wijzigingen in dit privacybeleid</h2>
        <p>
          Wij kunnen dit privacybeleid van tijd tot tijd bijwerken. De meest recente versie zal altijd beschikbaar zijn op onze website, 
          met de datum van laatste wijziging bovenaan vermeld.
        </p>

        <h2>13. Contact</h2>
        <p>
          Voor vragen of opmerkingen over dit privacybeleid of uw persoonsgegevens, kunt u contact met ons opnemen:
        </p>
        <p>
          {companyInfo.company_name}<br />
          {companyInfo.company_address}<br />
          E-mail: {companyInfo.company_email}<br />
          Telefoon: {companyInfo.company_phone}
        </p>
      </div>
    </div>
  );
}
