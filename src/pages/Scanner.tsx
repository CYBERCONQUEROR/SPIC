import { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, type VerifyResult } from "@/services/api";
import {
  ScanLine,
  CheckCircle2,
  XCircle,
  Loader2,
  Camera,
  Keyboard,
} from "lucide-react";

type Mode = "camera" | "manual";

const ADMIN_PIN = "spic@2026";
const SCANNER_ELEMENT_ID = "qr-reader";

export default function Scanner() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<Mode>("camera");
  const [manualInput, setManualInput] = useState("");
  const [scanning, setScanning] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const verifyingRef = useRef(false);
  const mountedRef = useRef(true);

  // ─── Verify scanned data ───────────────────────────────────────
  const verify = async (data: string) => {
    if (verifyingRef.current) return;
    verifyingRef.current = true;
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const parsed = JSON.parse(data);
      if (!parsed.registrationId || !parsed.eventId || !parsed.verificationToken) {
        throw new Error("Invalid QR data format.");
      }
      const res = await api.verify(parsed);
      setResult(res);
    } catch (err: any) {
      setError(err.message ?? "Verification failed.");
    } finally {
      setLoading(false);
      verifyingRef.current = false;
    }
  };

  // ─── Camera start/stop ─────────────────────────────────────────
  const destroyScanner = async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    if (!scanner) return;
    try {
      if (scanner.isScanning) await scanner.stop();
      scanner.clear();
    } catch {
      // ignore cleanup errors
    }
    setScanning(false);
  };

  const launchCamera = async () => {
    // Always tear down any previous instance first
    await destroyScanner();

    if (!mountedRef.current) return;
    const el = document.getElementById(SCANNER_ELEMENT_ID);
    if (!el) return;

    // Clear leftover children from previous instance
    el.innerHTML = "";

    try {
      const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => verify(decodedText),
        () => {}
      );
      if (mountedRef.current) setScanning(true);
    } catch (err: any) {
      console.error("[scanner]", err);
      scannerRef.current = null;
      if (!mountedRef.current) return;
      setError(
        err?.message?.includes("NotAllowed") || err?.message?.includes("Permission")
          ? "Camera access denied. Allow camera permissions or use Manual Input mode."
          : "Could not start camera. Try Manual Input mode."
      );
    }
  };

  // Auto-start camera when conditions are right
  useEffect(() => {
    if (authenticated && mode === "camera" && !result) {
      const timer = setTimeout(() => launchCamera(), 350);
      return () => {
        clearTimeout(timer);
        destroyScanner();
      };
    }
    // If conditions not met, tear down
    destroyScanner();
  }, [authenticated, mode, result]);

  // Track mount state & cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      destroyScanner();
    };
  }, []);

  const handleManualVerify = () => {
    if (!manualInput.trim()) return;
    verify(manualInput.trim());
  };

  const handleReset = () => {
    setResult(null);
    setError("");
    setManualInput("");
    verifyingRef.current = false;
  };

  const handleStartCamera = () => {
    setError("");
    setMode("camera");
  };

  // ─── PIN Gate ──────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <main>
        <section className="section-padding text-center px-4">
          <div className="max-w-sm mx-auto">
            <h1 className="font-display text-2xl font-bold mb-2">Admin Scanner</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Enter the organizer PIN to access the ticket scanner.
            </p>
            <Input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (pin === ADMIN_PIN) {
                    setAuthenticated(true);
                    setError("");
                  } else {
                    setError("Incorrect PIN.");
                  }
                }
              }}
            />
            {error && (
              <p className="text-sm text-destructive mt-2">{error}</p>
            )}
            <Button
              className="w-full mt-3"
              onClick={() => {
                if (pin === ADMIN_PIN) {
                  setAuthenticated(true);
                  setError("");
                } else {
                  setError("Incorrect PIN.");
                }
              }}
            >
              Access Scanner
            </Button>
          </div>
        </section>
      </main>
    );
  }

  // ─── Scanner UI ────────────────────────────────────────────────
  return (
    <main>
      {/* Hero */}
      <section className="section-padding text-center px-4">
        <AnimatedSection className="max-w-2xl mx-auto">
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-gradient">Ticket</span> Scanner
          </h1>
          <p className="text-base text-muted-foreground">
            Scan participant QR tickets at the event entrance
          </p>
        </AnimatedSection>
      </section>

      <section className="section-padding-sm border-t border-border/40">
        <div className="container mx-auto px-4 max-w-lg">
          {/* Result display */}

          {/* Result display is now handled by the camera overlay */}

          {/* Mode toggle */}
          {!result && (
            <div className="flex gap-2 mb-6">
              <Button
                size="sm"
                variant={mode === "camera" ? "default" : "ghost"}
                onClick={handleStartCamera}
              >
                <Camera className="h-4 w-4 mr-1.5" />
                Camera Scan
              </Button>
              <Button
                size="sm"
                variant={mode === "manual" ? "default" : "ghost"}
                onClick={() => { destroyScanner(); setMode("manual"); setError(""); }}
              >
                <Keyboard className="h-4 w-4 mr-1.5" />
                Manual Input
              </Button>
            </div>
          )}

          {/* Camera scanner */}
          {!result && mode === "camera" && (
            <AnimatedSection>
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Camera className="h-5 w-5 text-primary" />
                    <h2 className="font-display font-semibold">
                      Point camera at QR code
                    </h2>
                  </div>

                  <div className="relative w-full rounded-md overflow-hidden bg-muted min-h-[300px]">
                    <div
                      id={SCANNER_ELEMENT_ID}
                      className="w-full"
                    />
                    
                    {/* Overlay for results */}
                    {(result || error) && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/60 backdrop-blur-sm z-10 animate-in fade-in duration-300">
                        {loading ? (
                          <div className="text-white flex flex-col items-center">
                            <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
                            <p className="text-lg font-medium">Verifying Ticket...</p>
                          </div>
                        ) : result ? (
                          <div className="text-center w-full px-4">
                            {result.valid ? (
                              <div className="animate-in zoom-in duration-300">
                                <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-white mb-2">ENTRY APPROVED</h3>
                                <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 inline-block">
                                  <p className="text-white font-semibold uppercase tracking-wider">{result.participantName}</p>
                                  <p className="text-white/70 text-xs">{result.eventName}</p>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-destructive p-8 rounded-2xl border-4 border-white shadow-[0_0_40px_rgba(239,68,68,0.5)] animate-in pulse duration-500">
                                <XCircle className="h-20 w-20 text-white mx-auto mb-4" />
                                <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">ALREADY USED</h3>
                                <p className="text-white font-medium text-lg leading-tight">
                                  {result.error}
                                </p>
                              </div>
                            )}
                            <Button 
                              size="lg" 
                              className={`mt-10 px-12 py-6 text-lg font-bold shadow-2xl transition-all active:scale-95 ${
                                result.valid 
                                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                                  : 'bg-white text-destructive hover:bg-white/90 border-none'
                              }`}
                              onClick={handleReset}
                            >
                              Scan Next
                            </Button>
                          </div>
                        ) : error ? (
                          <div className="bg-destructive/90 p-6 rounded-xl border-2 border-white/20 backdrop-blur-md w-full max-w-[90%] shadow-2xl text-center">
                            <XCircle className="h-16 w-16 text-white mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-white mb-2 uppercase">DENIED</h2>
                            <p className="text-white/90 text-sm font-medium mb-6 leading-tight">{error}</p>
                            <Button 
                              onClick={handleReset}
                              className="bg-white text-destructive hover:bg-white/90"
                            >
                              Try Again
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* Scanning indicator */}
                    {!result && !error && scanning && !loading && (
                      <div className="absolute inset-0 pointer-events-none border-2 border-primary/30 rounded-md">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary/60 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan" style={{ animation: 'scan 2s linear infinite' }} />
                      </div>
                    )}
                  </div>

                  <style>{`
                    @keyframes scan {
                      0%, 100% { top: 10%; }
                      50% { top: 90%; }
                    }
                  `}</style>

                  {!loading && !result && !error && (
                    <p className="text-xs text-muted-foreground text-center">
                      Position the QR ticket inside the scanner frame. It will be
                      verified automatically.
                    </p>
                  )}
                </CardContent>
              </Card>
            </AnimatedSection>
          )}

          {/* Manual input */}
          {!result && mode === "manual" && (
            <AnimatedSection>
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ScanLine className="h-5 w-5 text-primary" />
                    <h2 className="font-display font-semibold">
                      Paste QR Data
                    </h2>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Paste the QR code content (JSON) from the participant's
                    ticket.
                  </p>

                  <div className="space-y-1.5">
                    <Label htmlFor="qr-data">QR Content</Label>
                    <Input
                      id="qr-data"
                      placeholder='{"registrationId":"...","eventId":"...","verificationToken":"..."}'
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleManualVerify}
                    disabled={loading || !manualInput.trim()}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <ScanLine className="h-4 w-4 mr-2" />
                    )}
                    Verify Ticket
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>
          )}
        </div>
      </section>
    </main>
  );
}
