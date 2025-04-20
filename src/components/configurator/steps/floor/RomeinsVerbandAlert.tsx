
interface RomeinsVerbandAlertProps {
  isVisible: boolean;
}

const RomeinsVerbandAlert = ({ isVisible }: RomeinsVerbandAlertProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 animate-fadeIn mb-3">
      <p className="text-sm text-amber-800 font-medium">
        Let op: Romeins Verband kan alleen worden toegepast bij vloer- of badkamertegels.
      </p>
      <p className="text-sm text-amber-700 mt-2">
        Omdat er verschillende tegelformaten gebruikt worden, is dit verband niet geschikt voor wandtegels.
      </p>
      <p className="text-sm text-amber-700 mt-2">
        <strong>Ontkoppelingsmat is noodzakelijk</strong> bij het leggen van Romeins Verband om scheurvorming te voorkomen.
      </p>
    </div>
  );
};

export default RomeinsVerbandAlert;
