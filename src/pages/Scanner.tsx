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
          {result && (
            <AnimatedSection>
              <Card
                className={`mb-6 border-2 ${
                  result.valid
                    ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                    : "border-destructive bg-destructive/5"
                }`}
              >
                <CardContent className="p-6 text-center">
                  {result.valid ? (
                    <>
                      <CheckCircle2 className="h-14 w-14 text-green-600 mx-auto mb-3" />
                      <h3 className="font-display text-lg font-semibold text-green-700 dark:text-green-400 mb-1">
                        Entry Approved
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        <strong>{result.participantName}</strong>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {result.participantEmail} · {result.eventName}
                      </p>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-14 w-14 text-destructive mx-auto mb-3" />
                      <h3 className="font-display text-lg font-semibold text-destructive mb-1">
                        Entry Denied
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {result.error}
                      </p>
                    </>
                  )}
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={handleReset}
                  >
                    Scan Next
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>
          )}

          {error && !result && (
            <div className="mb-6 text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
              {error}
            </div>
          )}

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

                  <div
                    id={SCANNER_ELEMENT_ID}
                    className="w-full rounded-md overflow-hidden bg-muted min-h-[300px]"
                  />

                  {loading && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying…
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground text-center">
                    Position the QR ticket inside the scanner frame. It will be
                    verified automatically.
                  </p>
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
