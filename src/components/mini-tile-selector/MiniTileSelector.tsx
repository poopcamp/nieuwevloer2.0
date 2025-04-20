
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const questions = [
  {
    id: 'location',
    title: 'Waar wilt u nieuwe tegels?',
    options: [
      { id: 'floor', label: 'Vloer' },
      { id: 'wall', label: 'Wand' },
      { id: 'bathroom', label: 'Badkamer' },
    ],
  },
  {
    id: 'space',
    title: 'Hoe groot is de ruimte?',
    options: [
      { id: 'small', label: 'Klein (< 10m²)' },
      { id: 'medium', label: 'Gemiddeld (10-30m²)' },
      { id: 'large', label: 'Groot (> 30m²)' },
    ],
  },
  {
    id: 'timeframe',
    title: 'Wanneer wilt u starten?',
    options: [
      { id: 'asap', label: 'Zo snel mogelijk' },
      { id: 'month', label: 'Binnen 1-3 maanden' },
      { id: 'later', label: 'Later' },
    ],
  },
];

const MiniTileSelector = () => {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answer: string) => {
    const questionId = questions[currentQuestion].id;
    
    setAnswers({
      ...answers,
      [questionId]: answer,
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const getRecommendation = () => {
    // Simple recommendation logic based on answers
    const location = answers.location;
    const space = answers.space;
    
    if (location === 'bathroom') {
      return {
        title: 'Badkamer renovatie',
        description: 'Onze specialiteit! We zorgen voor een volledige transformatie van uw badkamer met hoogwaardige materialen en vakmanschap.',
        link: '/configurator?projectType=bathroom',
      };
    } else if (location === 'floor') {
      return {
        title: 'Vloertegels plaatsing',
        description: 'Een nieuwe vloer transformeert elke ruimte. Wij leveren vakkundige plaatsing met garantie op afwerking.',
        link: '/configurator?projectType=vloer',
      };
    } else {
      return {
        title: 'Wandtegels plaatsing',
        description: 'Geef uw keuken of badkamer een nieuwe look met vakkundig geplaatste wandtegels door ons professioneel team.',
        link: '/configurator?projectType=walls',
      };
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Vind de perfecte tegeloplossing</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Beantwoord drie simpele vragen en ontdek de ideale tegeloplossing voor uw project.
            Geen verplichtingen, gewoon eerlijk advies.
          </p>
        </div>

        <Card className="max-w-xl mx-auto">
          {!showResults ? (
            <>
              <CardHeader>
                <CardTitle>{currentQ.title}</CardTitle>
                <CardDescription>
                  Vraag {currentQuestion + 1} van {questions.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup className="space-y-3">
                  {currentQ.options.map((option) => (
                    <div 
                      key={option.id} 
                      className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => handleAnswer(option.id)}
                    >
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-grow cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handleRestart}
                  disabled={currentQuestion === 0 && Object.keys(answers).length === 0}
                >
                  Opnieuw
                </Button>
                <div className="flex space-x-2">
                  {currentQuestion > 0 && (
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentQuestion(currentQuestion - 1)}
                    >
                      Vorige
                    </Button>
                  )}
                </div>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle>Uw aanbeveling is klaar!</CardTitle>
                <CardDescription>
                  Op basis van uw antwoorden hebben we de perfecte oplossing voor u.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                  <h3 className="text-xl font-semibold mb-2">{getRecommendation().title}</h3>
                  <p className="text-gray-600 mb-4">{getRecommendation().description}</p>
                  
                  <Button asChild className="w-full">
                    <Link to={getRecommendation().link} className="flex items-center justify-center gap-2">
                      <span>Maak een gratis offerte</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Uw antwoorden</h4>
                  <ul className="space-y-2 text-sm">
                    {questions.map((q) => (
                      <li key={q.id} className="flex justify-between">
                        <span className="text-gray-600">{q.title}</span>
                        <span className="font-medium">
                          {q.options.find(o => o.id === answers[q.id])?.label || '-'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleRestart} 
                  variant="outline"
                  className="w-full"
                >
                  Start opnieuw
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </section>
  );
};

export default MiniTileSelector;
