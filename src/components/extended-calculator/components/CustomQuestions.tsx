
import { CalculatorQuestion } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CustomQuestionsProps {
  questions: CalculatorQuestion[];
  responses: Record<string, any>;
  onChange: (questionId: string, value: any) => void;
}

const CustomQuestions = ({ questions, responses, onChange }: CustomQuestionsProps) => {
  if (questions.length === 0) {
    return null;
  }

  // Render a question based on its field type
  const renderQuestion = (question: CalculatorQuestion) => {
    const value = responses[question.id] ?? question.default_value ?? '';
    
    switch (question.field_type) {
      case 'text':
        return (
          <Input
            id={`question-${question.id}`}
            value={value}
            onChange={(e) => onChange(question.id, e.target.value)}
            placeholder={question.help_text || ''}
            required={question.is_required}
          />
        );
        
      case 'textarea':
        return (
          <Textarea
            id={`question-${question.id}`}
            value={value}
            onChange={(e) => onChange(question.id, e.target.value)}
            placeholder={question.help_text || ''}
            required={question.is_required}
          />
        );
        
      case 'number':
        return (
          <Input
            id={`question-${question.id}`}
            type="number"
            value={value}
            onChange={(e) => onChange(question.id, Number(e.target.value))}
            placeholder={question.help_text || ''}
            required={question.is_required}
          />
        );
        
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(val) => onChange(question.id, val)}
          >
            <SelectTrigger id={`question-${question.id}`}>
              <SelectValue placeholder={question.help_text || 'Selecteer...'} />
            </SelectTrigger>
            <SelectContent>
              {question.options && Array.isArray(question.options) && question.options.map((option, index) => (
                <SelectItem key={index} value={option.value || option}>
                  {option.label || option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      case 'radio':
        return (
          <RadioGroup
            value={value}
            onValueChange={(val) => onChange(question.id, val)}
          >
            <div className="space-y-2">
              {question.options && Array.isArray(question.options) && question.options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <RadioGroupItem
                    value={option.value || option}
                    id={`question-${question.id}-option-${index}`}
                  />
                  <Label htmlFor={`question-${question.id}-option-${index}`} className="ml-2">
                    {option.label || option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );
        
      case 'checkbox':
        return (
          <Checkbox
            id={`question-${question.id}`}
            checked={value === true}
            onCheckedChange={(checked) => onChange(question.id, checked === true)}
          />
        );
        
      default:
        return (
          <Input
            id={`question-${question.id}`}
            value={value}
            onChange={(e) => onChange(question.id, e.target.value)}
            placeholder={question.help_text || ''}
            required={question.is_required}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-base font-medium">Project details</h3>
      
      {questions.map((question) => (
        <div key={question.id} className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor={`question-${question.id}`} className="text-sm font-medium">
              {question.question_text}
              {question.is_required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            
            {question.help_text && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{question.help_text}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          {renderQuestion(question)}
        </div>
      ))}
    </div>
  );
};

export default CustomQuestions;
