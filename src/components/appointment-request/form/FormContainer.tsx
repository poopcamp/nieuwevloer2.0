
import { ReactNode } from "react";

interface FormContainerProps {
  children: ReactNode;
}

const FormContainer = ({ children }: FormContainerProps) => {
  return (
    <div className="px-6 py-3">
      <div className="space-y-3.5">
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
