"use client";

import { useState, useEffect, useRef } from "react";
import { genPw } from "@/services/passgen";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, RefreshCw, Check } from "lucide-react";
import { PasswordAnalysisCard } from "@/components/password-analysis-card";
import { useDebouncedAnalysis } from "@/hooks/use-debounced-analysis";
import { getStrengthCSSVar } from "@/lib/strength-colors";
import { Navbar } from "@/components/navbar";

// Background component with strength-based circle color, Gaussian blur, and noise effects
const Background = ({ strength }: { strength: string | null }) => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
    {/* Blurred strength-based circle */}
    <div 
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[56rem] h-[40rem] rounded-full"
              style={{
          filter: 'blur(120px)',
          background: `radial-gradient(circle, color-mix(in srgb, var(--${strength ? getStrengthCSSVar(strength) : 'muted'}) 30%, transparent), color-mix(in srgb, var(--${strength ? getStrengthCSSVar(strength) : 'muted'}) 20%, transparent) 30%, color-mix(in srgb, var(--${strength ? getStrengthCSSVar(strength) : 'muted'}) 10%, transparent) 60%, transparent 100%)`,
          animation: 'pulse 4s ease-in-out infinite'
        }}
    />
    
    {/* Noise overlay - covers entire screen */}
    <div 
      className="absolute inset-0 w-full h-full"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: '150px 150px',
        mixBlendMode: 'multiply',
        opacity: 0.15
      }}
    />
  </div>
);

export default function Home() {
  const [length, setLength] = useState([16]);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Password analysis with debouncing
  const { analysis, isLoading } = useDebouncedAnalysis(password, 300);

  // Generate password whenever settings change
  useEffect(() => {
    const newPassword = genPw(length[0], useDigits, useSymbols, useUppercase, useLowercase);
    setPassword(newPassword);
  }, [length, useDigits, useSymbols, useUppercase, useLowercase]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setCopied(true);

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const regeneratePassword = () => {
    const newPassword = genPw(length[0], useDigits, useSymbols, useUppercase, useLowercase);
    setPassword(newPassword);
  };

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <Background strength={analysis?.strength || null} />
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-4xl">
          <div className="flex flex-col min-[800px]:flex-row gap-4 items-start justify-center">
            {/* Password Generator Card */}
            <div className="w-full max-w-sm flex-shrink-0">
              <Card className="transition-all duration-300 hover:shadow-lg bg-card">
                <CardContent className="space-y-6">
                  {/* Generated Password Display */}
                  <div className="space-y-2">
                    <Label htmlFor="password-output" className="text-lg font-semibold">Generated Password</Label>
                    <div className="relative">
                      <Input
                        id="password-output"
                        type="text"
                        value={password}
                        readOnly
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck="false"
                        data-form-type="other"
                        data-lpignore="true"
                        data-1p-ignore="true"
                        className="font-mono text-lg pr-20 transition-all duration-200 focus:scale-[1.02]"
                        placeholder="Your password will appear here..."
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={regeneratePassword}
                          className="h-8 w-8 p-0 transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-primary/10"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={copyToClipboard}
                          className="h-8 w-8 p-0 transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-primary/10"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-green-500 transition-all duration-200" />
                          ) : (
                            <Copy className="h-4 w-4 transition-all duration-200" />
                          )}
                        </Button>
                      </div>
                    </div>

                  </div>

                  {/* Length Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-lg font-semibold">Password Length</Label>
                      <span className="text-lg font-mono bg-muted px-3 py-1 rounded-md">
                        {length[0]}
                      </span>
                    </div>
                    <Slider
                      value={length}
                      onValueChange={setLength}
                      max={64}
                      min={4}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>4</span>
                      <span>64</span>
                    </div>
                  </div>

                  {/* Character Type Checkboxes */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Character Types</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="lowercase"
                          checked={useLowercase}
                          onCheckedChange={(checked) => setUseLowercase(checked === true)}
                        />
                        <Label htmlFor="lowercase" className="text-base cursor-pointer transition-all duration-200 hover:text-primary">
                          Lowercase (a-z)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="uppercase"
                          checked={useUppercase}
                          onCheckedChange={(checked) => setUseUppercase(checked === true)}
                        />
                        <Label htmlFor="uppercase" className="text-base cursor-pointer transition-all duration-200 hover:text-primary">
                          Uppercase (A-Z)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="digits"
                          checked={useDigits}
                          onCheckedChange={(checked) => setUseDigits(checked === true)}
                        />
                        <Label htmlFor="digits" className="text-base cursor-pointer transition-all duration-200 hover:text-primary">
                          Numbers (0-9)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="symbols"
                          checked={useSymbols}
                          onCheckedChange={(checked) => setUseSymbols(checked === true)}
                        />
                        <Label htmlFor="symbols" className="text-base cursor-pointer transition-all duration-200 hover:text-primary">
                          Symbols (!@#$...)
                        </Label>
                      </div>
                    </div>
                  </div>

                  
                </CardContent>
              </Card>
            </div>

            {/* Password Analysis Card */}
            <div className="w-full max-w-sm flex-shrink-0">
              <PasswordAnalysisCard analysis={analysis} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
