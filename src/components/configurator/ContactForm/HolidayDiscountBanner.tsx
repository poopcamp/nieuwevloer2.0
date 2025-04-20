
import React from 'react';

const HolidayDiscountBanner = () => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-3 my-4">
      <p className="text-green-700 font-medium">
        🎉 Feestdag korting van toepassing!
      </p>
      <p className="text-sm text-green-600">
        U ontvangt een speciale korting omdat u vandaag een aanvraag doet.
      </p>
    </div>
  );
};

export default HolidayDiscountBanner;
