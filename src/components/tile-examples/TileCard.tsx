
import React, { useEffect } from 'react';
import { TileExample } from '@/types/homeContent';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface TileCardProps {
  example: TileExample;
}

const TileCard = ({ example }: TileCardProps) => {
  const [imageError, setImageError] = React.useState(false);

  // Check if image URL is valid (at least starts with http)
  const hasValidImageUrl = example.image && (example.image.startsWith('http://') || example.image.startsWith('https://'));

  // Log image URLs for debugging
  useEffect(() => {
    console.log(`TileCard - Example name: ${example.name}`);
    console.log(`TileCard - Image URL: ${example.image}`);
    console.log(`TileCard - Has valid URL: ${hasValidImageUrl}`);
    console.log(`TileCard - Image URL is empty: ${example.image === ""}`);
    console.log(`TileCard - Image URL is null: ${example.image === null}`);
  }, [example, hasValidImageUrl]);

  return (
    <Card className="group overflow-hidden">
      <div className="aspect-video relative overflow-hidden">
        {hasValidImageUrl && !imageError ? (
          <img
            src={example.image}
            alt={example.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              console.error("Fout bij laden afbeelding:", example.image);
              setImageError(true);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <div className="text-center">
              <p className="text-sm">Geen afbeelding beschikbaar</p>
              {example.image && <p className="text-xs mt-1">URL: {example.image}</p>}
            </div>
          </div>
        )}
      </div>
      
      <CardHeader>
        <CardTitle className="text-lg">{example.name}</CardTitle>
        <CardDescription className="flex items-center">
          <span className="text-sm font-medium">{example.size}</span>
          {example.finish && (
            <>
              <span className="mx-1.5 text-xs text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{example.finish}</span>
            </>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {example.description}
        </p>
      </CardContent>
      
      {example.suitable_for && example.suitable_for.length > 0 && (
        <CardFooter>
          <div className="flex flex-wrap gap-1.5">
            {example.suitable_for?.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="text-xs font-normal py-0.5"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default TileCard;
