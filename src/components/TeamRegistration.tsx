import { useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { CheckCircle2, Loader2, UploadCloud, File, X, ChevronRight, ChevronLeft } from "lucide-react";
import type { Event } from "@/data/events";

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year"] as const;
const BRANCH_OPTIONS = [
  "CSE", "IT", "ECE", "EEE", "ME", "CE", "AI/ML", "DS", "IOT", "CS","Others",
] as const;

// Provide default values to field arrays up to 4 members
const memberSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  rollNumber: z.string().min(1, "Roll number required"),
  year: z.string().min(1, "Select year"),
  branch: z.string().min(1, "Select branch"),
  phone: z.string().regex(/^[0-9]{10}$/, "10-digit phone number required"),
});

const schema = z.object({
  teamName: z.string().min(2, "Team Name must be at least 2 characters"),
  members: z.array(memberSchema).length(4, "Exactly 4 members are required"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TeamRegistration({ event, open, onOpenChange }: Props) {
  const [step, setStep] = useState<"team" | "members" | "upload" | "success">("team");
  const [activeMember, setActiveMember] = useState(0);
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [registration, setRegistration] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ 
    resolver: zodResolver(schema),
    defaultValues: {
      teamName: "",
      members: [
        { name: "", email: "", rollNumber: "", year: "", branch: "", phone: "" },
        { name: "", email: "", rollNumber: "", year: "", branch: "", phone: "" },
        { name: "", email: "", rollNumber: "", year: "", branch: "", phone: "" },
        { name: "", email: "", rollNumber: "", year: "", branch: "", phone: "" },
      ]
    }
  });

  const { fields } = useFieldArray({
    control,
    name: "members"
  });

  const handleNext = async (currentStep: typeof step) => {
    setError("");
    let isValid = false;

    if (currentStep === "team") {
      isValid = await trigger("teamName");
      if (isValid) setStep("members");
    } else if (currentStep === "members") {
      // Validate only current active member first
      isValid = await trigger(`members.${activeMember}` as any);
      
      if (isValid) {
          if (activeMember < 3) {
              // Proceed to next member
              setActiveMember(p => p + 1);
          } else {
              // On the last member, move to upload step
              setStep("upload");
          }
      }
    }
  };

  const uploadFile = async (): Promise<string> => {
    if (!pptFile) throw new Error("PPT / PPTX file is required.");
    
    setUploadProgress(10);
    const formData = new FormData();
    formData.append("file", pptFile);

    // Simulate progress during upload
    const progressInterval = setInterval(() => {
      setUploadProgress(p => (p < 85 ? p + 5 : p));
    }, 500);

    try {
      const res = await fetch("/api/upload/ppt", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Upload failed: ${res.status}`);
      }

      const data = await res.json();
      setUploadProgress(100);
      return data.url as string;
    } catch (err) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      throw err;
    }
  };

  const onSubmit = async (values: FormValues) => {
    setError("");
    if (!pptFile) {
        setError("Please upload your PPT presentation.");
        return;
    }
    
    try {
      // Upload PPT
      const pptLink = await uploadFile();

      // Register Team
      const result = await api.registerTeam({
        eventId: event.id,
        eventName: event.name,
        eventDate: event.date,
        eventVenue: event.venue,
        teamName: values.teamName,
        members: values.members as any,
        pptLink
      });

      setRegistration(result);
      setStep("success");
    } catch (err: any) {
      setError(err.message ?? "Registration failed. Please try again.");
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("team");
        setActiveMember(0);
        setPptFile(null);
        setUploadProgress(0);
        setRegistration(null);
        setError("");
        reset();
      }, 200);
    }
    onOpenChange(isOpen);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = [
          "application/vnd.ms-powerpoint", 
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ];
      if (validTypes.includes(file.type) || file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
        setPptFile(file);
        setError("");
      } else {
        setError("Only .ppt and .pptx files are allowed.");
        setPptFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        {step !== "success" && (
            <DialogHeader>
            <DialogTitle className="font-display">
                Register for {event.name}
            </DialogTitle>
            <DialogDescription>
                Build your team of 4 and submit your idea.
            </DialogDescription>
            </DialogHeader>
        )}

        {/* Progress Indicator */}
        {step !== "success" && (
            <div className="flex items-center justify-between mb-6 px-2 mt-2">
                {["Team Info", "Members", "Upload"].map((label, i) => {
                    const stepNames = ["team", "members", "upload"];
                    const currentIdx = stepNames.indexOf(step);
                    const isActive = currentIdx === i;
                    const isPast = currentIdx > i;
                    
                    return (
                        <div key={label} className="flex flex-col items-center flex-1">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : 
                                isPast ? "bg-primary/20 text-primary border border-primary/50" : 
                                "bg-muted text-muted-foreground"
                            }`}>
                                {isPast ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                            </div>
                            <span className={`text-[10px] mt-1.5 font-medium uppercase tracking-wider ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
        )}

        {step === "success" ? (
          <div className="text-center py-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
            <h3 className="font-display text-2xl font-bold mb-2">
              Registration Successful!
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Team tickets have been emailed to all members of <strong>{registration?.teamName}</strong>.
            </p>

            {registration?.qrDataUrl && (
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-white rounded-xl shadow-lg">
                    <img
                    src={registration.qrDataUrl}
                    alt="QR Ticket"
                    className="w-48 h-48 rounded-md"
                    />
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground mb-6">
              Present this single QR code for your entire team's entry.
            </p>

            <div className="flex justify-center">
              <Button
                className="w-full sm:w-auto min-w-[150px]"
                onClick={() => handleClose(false)}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* STEP 1: TEAM INFO */}
            {step === "team" && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <div className="space-y-2">
                        <Label htmlFor="teamName" className="text-base">Team Name</Label>
                        <Input
                            id="teamName"
                            placeholder="e.g. Code Ninjas"
                            className="h-12 text-lg"
                            {...register("teamName")}
                        />
                        {errors.teamName && (
                            <p className="text-xs text-destructive">{errors.teamName.message}</p>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 2: MEMBERS */}
            {step === "members" && (
                <div className="animate-in slide-in-from-right-4 duration-300">
                    {/* Member Tabs */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                        {fields.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setActiveMember(index)}
                                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                                    activeMember === index 
                                    ? "bg-primary text-primary-foreground shadow-md" 
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                            >
                                Member {index + 1} {index === 0 ? "(Lead)" : ""}
                            </button>
                        ))}
                    </div>

                    {fields.map((field, index) => (
                        <div key={field.id} className={`space-y-4 ${activeMember === index ? "block" : "hidden"}`}>
                            <div className="space-y-1.5">
                                <Label>Full Name</Label>
                                <Input placeholder="Name" {...register(`members.${index}.name` as const)} />
                                {errors.members?.[index]?.name && (
                                    <p className="text-xs text-destructive">{errors.members[index]?.name?.message}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label>Email</Label>
                                <Input type="email" placeholder="Email" {...register(`members.${index}.email` as const)} />
                                {errors.members?.[index]?.email && (
                                    <p className="text-xs text-destructive">{errors.members[index]?.email?.message}</p>
                                )}
                            </div>
                            
                            <div className="space-y-1.5">
                                <Label>Phone Number (Mandatory)</Label>
                                <Input type="tel" placeholder="10-digit number" {...register(`members.${index}.phone` as const)} />
                                {errors.members?.[index]?.phone && (
                                    <p className="text-xs text-destructive">{errors.members[index]?.phone?.message}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label>Roll Number</Label>
                                <Input placeholder="e.g. 2024CSE001" {...register(`members.${index}.rollNumber` as const)} />
                                {errors.members?.[index]?.rollNumber && (
                                    <p className="text-xs text-destructive">{errors.members[index]?.rollNumber?.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label>Year</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        {...register(`members.${index}.year` as const)}
                                    >
                                        <option value="" disabled>Select</option>
                                        {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                    {errors.members?.[index]?.year && (
                                        <p className="text-xs text-destructive">{errors.members[index]?.year?.message}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Branch</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        {...register(`members.${index}.branch` as const)}
                                    >
                                        <option value="" disabled>Select</option>
                                        {BRANCH_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                    {errors.members?.[index]?.branch && (
                                        <p className="text-xs text-destructive">{errors.members[index]?.branch?.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* STEP 3: UPLOAD */}
            {step === "upload" && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-muted/30 border-2 border-dashed border-border rounded-xl p-8 text-center transition-colors hover:bg-muted/50 relative">
                        <input 
                            type="file" 
                            accept=".ppt,.pptx" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                        
                        {!pptFile ? (
                            <div className="flex flex-col items-center pointer-events-none">
                                <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                                    <UploadCloud className="h-8 w-8" />
                                </div>
                                <h4 className="font-semibold text-lg mb-1">Upload Presentation</h4>
                                <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
                                <p className="text-xs text-muted-foreground mt-2">Only .ppt or .pptx files allowed</p>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between bg-background border border-border p-4 rounded-lg z-20 relative shadow-sm">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="bg-orange-500/20 p-2 rounded text-orange-500 shrink-0">
                                        <File className="h-6 w-6" />
                                    </div>
                                    <div className="text-left overflow-hidden">
                                        <p className="text-sm font-medium truncate">{pptFile.name}</p>
                                        <p className="text-xs text-muted-foreground">{(pptFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="icon" 
                                    className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => {
                                        setPptFile(null);
                                        if (fileInputRef.current) fileInputRef.current.value = "";
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Preview / Instructions */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-700 dark:text-blue-400">
                        <p className="font-medium mb-1">Important:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Ensure your team name is mentioned on the first slide.</li>
                            <li>Maximum file size is usually limited by your browser, keep it under 50MB.</li>
                            <li>You cannot edit the file after submission.</li>
                        </ul>
                    </div>
                </div>
            )}

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2 mt-4">
                {error}
              </p>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-4 border-t border-border/50">
                {step === "team" ? (
                    <div /> // Placeholder for space-between
                ) : (
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                            setError("");
                            if (step === "members") {
                                if (activeMember > 0) {
                                    setActiveMember(m => m - 1);
                                } else {
                                    setStep("team");
                                }
                            } else if (step === "upload") {
                                setStep("members");
                            }
                        }}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                )}

                {step === "upload" ? (
                    <Button
                        type="submit"
                        disabled={isSubmitting || !pptFile}
                        className="min-w-[140px]"
                    >
                        {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {uploadProgress > 0 && uploadProgress < 100 
                                ? `Uploading... ${Math.round(uploadProgress)}%` 
                                : "Registering…"}
                        </>
                        ) : (
                            "Register & Get QR Ticket"
                        )}
                    </Button>
                ) : (
                    <Button 
                        type="button"
                        onClick={() => handleNext(step)}
                        className="min-w-[120px]"
                    >
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                )}
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
