
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { sendTestEmail } from "@/utils/emailHelpers";
import { Mail } from "lucide-react";

interface TestEmailButtonProps {
  className?: string;
}

const TestEmailButton = ({ className }: TestEmailButtonProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTestEmail = async () => {
    if (!email) {
      toast({
        title: "E-mail vereist",
        description: "Vul een geldig e-mailadres in om de test e-mail te versturen.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await sendTestEmail(email);
      
      if (result.success) {
        toast({
          title: "Test e-mail verstuurd!",
          description: "De test e-mail is succesvol verstuurd.",
        });
      } else {
        throw new Error(result.error || "Er is een fout opgetreden bij het versturen van de test e-mail.");
      }
    } catch (error: any) {
      console.error("Error sending test email:", error);
      toast({
        title: "Fout bij versturen",
        description: error.message || "Er is een fout opgetreden bij het versturen van de test e-mail.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Input
        type="email"
        placeholder="test@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="max-w-xs"
      />
      <Button 
        onClick={handleTestEmail} 
        disabled={isLoading}
        variant="secondary"
        size="default"
      >
        <Mail className="mr-2 h-4 w-4" />
        {isLoading ? "Bezig..." : "Test E-mail"}
      </Button>
    </div>
  );
};

export default TestEmailButton;
