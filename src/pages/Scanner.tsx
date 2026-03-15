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
    // Only launch if authenticated, in camera mode, and NO result/error is being shown
    if (authenticated && mode === "camera" && !result && !error) {
      const timer = setTimeout(() => launchCamera(), 350);
      return () => {
        clearTimeout(timer);
        destroyScanner();
      };
    } else {
      // If result or error exists, or not authenticated, tear down the scanner
      destroyScanner();
    }
  }, [authenticated, mode, result, error]);

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
    // The useEffect will automatically re-launch camera because !result and !error will be true
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
                              <div className="animate-in zoom-in duration-500">
                                <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                                <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">ENTRY APPROVED</h3>
                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 inline-block min-w-[200px]">
                                  <p className="text-white text-lg font-bold uppercase tracking-widest">{result.participantName}</p>
                                  <p className="text-white/60 text-xs font-medium uppercase mt-1">{result.eventName}</p>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-red-600 p-10 rounded-3xl border-4 border-white shadow-[0_0_50px_rgba(220,38,38,0.6)] animate-in zoom-in duration-300">
                                <XCircle className="h-20 w-20 text-white mx-auto mb-6" />
                                <h3 className="text-3xl font-black text-white mb-3 leading-none tracking-tighter">ALREADY USED</h3>
                                <p className="text-white/95 text-lg font-bold leading-tight px-2">
                                  {result.error || "This ticket has already been used."}
                                </p>
                              </div>
                            )}
                            <Button 
                              size="lg" 
                              className={`mt-12 px-14 py-7 text-xl font-black shadow-2xl transition-all active:scale-95 rounded-full ${
                                result.valid 
                                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                                  : 'bg-white text-red-600 hover:bg-neutral-100'
                              }`}
                              onClick={handleReset}
                            >
                              SCAN NEXT
                            </Button>
                          </div>
                        ) : error ? (
                          <div className="bg-red-600 p-10 rounded-3xl border-4 border-white shadow-[0_0_50px_rgba(220,38,38,0.6)] animate-in zoom-in duration-300 text-center w-full max-w-[90%]">
                            <XCircle className="h-20 w-20 text-white mx-auto mb-6" />
                            <h3 className="text-3xl font-black text-white mb-3 leading-none tracking-tighter uppercase">ACCESS DENIED</h3>
                            <p className="text-white/95 text-lg font-bold leading-tight px-2 mb-8">{error}</p>
                            <Button 
                              size="lg"
                              onClick={handleReset}
                              className="bg-white text-red-600 hover:bg-neutral-100 font-black px-12 rounded-full shadow-lg"
                            >
                              RETRY
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
