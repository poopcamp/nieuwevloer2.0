
import { CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

interface SuccessMessageProps {
  email: string;
  resetForm: () => void;
}

const SuccessMessage = ({ email, resetForm }: SuccessMessageProps) => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="bg-gradient-to-r from-green-500 to-green-400 text-white text-center py-8">
        <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Bedankt voor uw aanvraag!</h2>
      </CardHeader>
      <CardContent className="pt-6 px-6">
        <div className="space-y-4">
          <p className="text-center text-gray-700 text-lg">
            Uw tegelconfiguratie is succesvol verstuurd.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
            <Mail className="text-primary h-5 w-5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">
                We hebben een bevestiging gestuurd naar:
              </p>
              <p className="font-medium">{email}</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-blue-800 font-medium mb-2">Wat gebeurt er nu?</h3>
            <ul className="space-y-2 text-blue-700 text-sm">
              <li>Onze tegelspecialist neemt binnen 48 uur contact met u op.</li>
              <li>U ontvangt een gedetailleerde offerte op maat van uw project.</li>
              <li>We plannen indien gewenst een afspraak voor een vrijblijvend plaatsbezoek.</li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 pt-2 pb-6">
        <Button 
          onClick={resetForm}
          variant="outline"
          className="w-full"
        >
          Nieuwe configuratie maken
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SuccessMessage;
