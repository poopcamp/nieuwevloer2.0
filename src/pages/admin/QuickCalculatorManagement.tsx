
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeftCircle } from 'lucide-react';
import QuickCalculatorManager from '@/components/admin/tile-management/calculator/QuickCalculatorManager';

const QuickCalculatorManagement = () => {
  return (
    <>
      <Helmet>
        <title>Snelle Calculator Beheer | Admin</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Snelle Prijsindicatie Beheer</h1>
          <p className="text-gray-600 mt-1">
            Beheer de tegelopties en prijzen voor de eenvoudige calculator
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/admin">
            <ArrowLeftCircle className="mr-2 h-4 w-4" />
            Terug naar Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Snelle Calculator Instellingen</CardTitle>
        </CardHeader>
        <CardContent>
          <QuickCalculatorManager />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Help & Informatie</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-4">
          <p>
            <strong>Snelle Prijsindicatie:</strong> Deze calculator wordt gebruikt op de homepage
            om bezoekers snel een prijsindicatie te geven voor vloertegelplaatsing.
          </p>
          <p>
            <strong>Tegelformaten:</strong> Voeg verschillende tegelformaten toe, waarbij elke optie
            een eigen basisprijs per m² heeft.
          </p>
          <p>
            <strong>Snijverlies:</strong> Er wordt automatisch 10% snijverlies berekend bij het tonen
            van de totaalprijs.
          </p>
          <p>
            <strong>Tegelkosten:</strong> Als klanten hun eigen tegels willen kopen, kunnen ze de
            tegelprijs invullen en wordt dit meegenomen in de berekening.
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default QuickCalculatorManagement;
