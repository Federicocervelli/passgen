import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PasswordAnalysis, getTimeToCrackString } from "@/services/passanalyzer";
import { Shield, Clock, AlertCircle } from "lucide-react";
import { getStrengthColor } from "@/lib/strength-colors";

interface PasswordAnalysisCardProps {
  analysis: PasswordAnalysis | null;
  isLoading: boolean;
}

export function PasswordAnalysisCard({ analysis, isLoading }: PasswordAnalysisCardProps) {


  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'very-strong':
      case 'strong':
        return <Shield className="h-4 w-4" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4" />;
      case 'weak':
      case 'very-weak':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="w-full">
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No password to analyze</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="space-y-6">
        {/* Strength Rating */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Strength Rating</span>
            {getStrengthIcon(analysis.strength)}
          </div>
          <Badge className={`${getStrengthColor(analysis.strength)} text-sm font-medium`}>
            {analysis.strength.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Time to Crack */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Time to Crack</span>
          </div>
          <p className="text-lg font-mono">
            {getTimeToCrackString(analysis.timeToCrack)}
          </p>
          <p className="text-xs text-muted-foreground">
            At {analysis.attemptsPerSecond.toLocaleString()} attempts/second
          </p>
        </div>

        
      </CardContent>
    </Card>
  );
}
