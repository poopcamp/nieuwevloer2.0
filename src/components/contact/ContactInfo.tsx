
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";

const ContactInfo = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Onze contactgegevens</h2>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 flex items-start space-x-4">
            <Phone className="text-primary h-5 w-5 mt-0.5" />
            <div>
              <h3 className="font-medium">Telefoon</h3>
              <p className="text-gray-600">0479304986</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-start space-x-4">
            <Mail className="text-primary h-5 w-5 mt-0.5" />
            <div>
              <h3 className="font-medium">E-mail</h3>
              <p className="text-gray-600">info@nieuwevloer.be</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-start space-x-4">
            <MapPin className="text-primary h-5 w-5 mt-0.5" />
            <div>
              <h3 className="font-medium">Adres</h3>
              <p className="text-gray-600">Vakekerkweg 111 - Maldegem, België</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactInfo;
