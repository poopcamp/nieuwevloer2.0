
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ExtraOption, FormValues } from './types';

interface ExtraOptionFormProps {
  editingOption: ExtraOption | null;
  onSubmit: (values: FormValues) => Promise<boolean>;
  onClose: () => void;
}

const ExtraOptionForm = ({ 
  editingOption, 
  onSubmit, 
  onClose 
}: ExtraOptionFormProps) => {
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    price: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingOption) {
      setFormValues({
        name: editingOption.name,
        price: editingOption.price
      });
    } else {
      setFormValues({ name: '', price: 0 });
    }
  }, [editingOption]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formValues.name.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await onSubmit(formValues);
      if (success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Naam</Label>
          <Input
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            placeholder="Ontkoppelingsmat"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Prijs (€)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formValues.price}
            onChange={handleInputChange}
            placeholder="15.00"
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isSubmitting}>
            Annuleren
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSubmitting}>
          {editingOption ? 'Bijwerken' : 'Toevoegen'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ExtraOptionForm;
