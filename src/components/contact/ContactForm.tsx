
import { useContactForm } from "./form/useContactForm";
import FormFields from "./form/FormFields";
import SuccessMessage from "./form/SuccessMessage";
import ErrorMessage from "./form/ErrorMessage";
import SubmitButton from "./form/SubmitButton";

interface ContactFormProps {
  onSubmitSuccess?: () => void;
}

const ContactForm = ({ onSubmitSuccess }: ContactFormProps) => {
  const {
    formData,
    isSubmitting,
    isSuccess,
    error,
    submitStatus,
    submitError,
    emailStatus,
    handleChange,
    handleCheckboxChange,
    handleSubmit
  } = useContactForm(onSubmitSuccess);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Stuur ons een bericht</h2>
      
      {submitStatus === "success" && (
        <SuccessMessage email={formData.email} emailStatus={emailStatus} />
      )}
      
      {submitStatus === "error" && (
        <ErrorMessage error={submitError} />
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormFields 
          formData={formData}
          handleChange={handleChange}
          handleCheckboxChange={handleCheckboxChange} // Pass handleCheckboxChange to FormFields
        />
        
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default ContactForm;
